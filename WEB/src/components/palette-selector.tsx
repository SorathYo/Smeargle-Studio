import { useEffect, useRef, useState, type MouseEvent } from "react";
import PaletteStrip from "./PaletteStrip";

export interface PaletteColor {
  hex: string;
  source: "dominant" | "eyedropper" | "picker";
}

interface PaletteSelectorProps {
  palette: PaletteColor[];
  onUpdate: (colors: PaletteColor[]) => void;
}

/* =========================================================
   UTILITÁRIOS
========================================================= */

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((value) => value.toString(16).padStart(2, "0"))
      .join("")
  );
}

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace("#", "");

  if (!/^[0-9a-f]{6}$/i.test(clean)) {
    return null;
  }

  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

// Converte a cor externa para a posição equivalente no seletor HSV.
function hexToHsv(hex: string): [number, number, number] | null {
  const rgb = hexToRgb(hex);

  if (!rgb) return null;

  const [red, green, blue] = rgb.map((channel) => channel / 255);
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  let hue = 0;

  if (delta !== 0) {
    if (max === red) {
      hue = 60 * (((green - blue) / delta) % 6);
    } else if (max === green) {
      hue = 60 * ((blue - red) / delta + 2);
    } else {
      hue = 60 * ((red - green) / delta + 4);
    }
  }

  if (hue < 0) hue += 360;

  return [
    hue,
    max === 0 ? 0 : delta / max,
    max,
  ];
}

/* =========================================================
   HSV → RGB
========================================================= */

function hsvToRgb(
  h: number,
  s: number,
  v: number
): [number, number, number] {
  const i = Math.floor(h / 60) % 6;

  const f = h / 60 - Math.floor(h / 60);

  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  const values: [number, number, number][] = [
    [v, t, p],
    [q, v, p],
    [p, v, t],
    [p, q, v],
    [t, p, v],
    [v, p, q],
  ];

  return values[i].map(
    (value) => Math.round(value * 255)
  ) as [number, number, number];
}

/* =========================================================
   HSV PICKER
========================================================= */

interface HSVPickerProps {
  hex: string;
  onChange: (hex: string) => void;
}

function HSVPicker({
  hex,
  onChange,
}: HSVPickerProps) {
  const squareRef = useRef<HTMLCanvasElement>(null);
  const hueRef = useRef<HTMLCanvasElement>(null);

  const [hue, setHue] = useState(0);
  const [sat, setSat] = useState(1);
  const [value, setValue] = useState(1);

  const [draggingSquare, setDraggingSquare] =
    useState(false);

  const [draggingHue, setDraggingHue] =
    useState(false);

  // Mantém os marcadores alinhados quando a cor muda por HEX ou pelo input nativo.
  useEffect(() => {
    const hsv = hexToHsv(hex);

    if (!hsv) return;

    setHue(hsv[0]);
    setSat(hsv[1]);
    setValue(hsv[2]);
  }, [hex]);

  /* -------------------------------------------------------
     Renderiza o quadrado S × V
  ------------------------------------------------------- */

  useEffect(() => {
    const canvas = squareRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const hueColor = `hsl(${hue}, 100%, 50%)`;

    /* branco → matiz */
    const horizontal = ctx.createLinearGradient(
      0,
      0,
      width,
      0
    );

    horizontal.addColorStop(0, "#ffffff");
    horizontal.addColorStop(1, hueColor);

    ctx.fillStyle = horizontal;
    ctx.fillRect(0, 0, width, height);

    /* transparente → preto */
    const vertical = ctx.createLinearGradient(
      0,
      0,
      0,
      height
    );

    vertical.addColorStop(
      0,
      "rgba(0,0,0,0)"
    );

    vertical.addColorStop(
      1,
      "rgba(0,0,0,1)"
    );

    ctx.fillStyle = vertical;
    ctx.fillRect(0, 0, width, height);
  }, [hue]);

  /* -------------------------------------------------------
     Renderiza faixa de Hue
  ------------------------------------------------------- */

  useEffect(() => {
    const canvas = hueRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const gradient = ctx.createLinearGradient(
      0,
      0,
      width,
      0
    );

    for (let i = 0; i <= 360; i += 60) {
      gradient.addColorStop(
        i / 360,
        `hsl(${i}, 100%, 50%)`
      );
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }, []);

  /* -------------------------------------------------------
     Atualiza cor
  ------------------------------------------------------- */

  function updateFromHSV(
    newSat: number,
    newValue: number
  ) {
    const [r, g, b] = hsvToRgb(
      hue,
      newSat,
      newValue
    );

    onChange(rgbToHex(r, g, b));
  }

  function updateSquareFromPointer(event: MouseEvent<HTMLCanvasElement>) {
    const canvas = squareRef.current;

    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    const newSat = Math.min(
      Math.max(
        (event.clientX - rect.left) /
        rect.width,
        0
      ),
      1
    );

    const newValue = Math.min(
      Math.max(
        1 -
        (event.clientY - rect.top) /
        rect.height,
        0
      ),
      1
    );

    setSat(newSat);
    setValue(newValue);

    updateFromHSV(newSat, newValue);
  }

  function handleSquareMove(event: MouseEvent<HTMLCanvasElement>) {
    if (draggingSquare) {
      updateSquareFromPointer(event);
    }
  }

  function updateHueFromPointer(event: MouseEvent<HTMLCanvasElement>) {
    const canvas = hueRef.current;

    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    const newHue = Math.min(
      Math.max(
        ((event.clientX - rect.left) /
          rect.width) *
        360,
        0
      ),
      360
    );

    setHue(newHue);

    const [r, g, b] = hsvToRgb(
      newHue,
      sat,
      value
    );

    onChange(rgbToHex(r, g, b));
  }

  function handleHueMove(event: MouseEvent<HTMLCanvasElement>) {
    if (draggingHue) {
      updateHueFromPointer(event);
    }
  }

  return (
    <div className="w-full">
      {/* S × V */}

      <div className="relative">
        <canvas
          ref={squareRef}
          width={400}
          height={260}
          className="
            h-65
            w-full
            cursor-crosshair
            rounded-xl
            shadow-sm
          "
          style={{ touchAction: "none" }}
          onMouseDown={(event) => {
            setDraggingSquare(true);
            updateSquareFromPointer(event);
          }}
          onMouseMove={handleSquareMove}
          onMouseUp={() =>
            setDraggingSquare(false)
          }
          onMouseLeave={() =>
            setDraggingSquare(false)
          }
        />

        {/* cursor */}
        <div
          className="
            pointer-events-none
            absolute
            h-4
            w-4
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            border-2
            border-white
            shadow-md
          "
          style={{
            left: `${sat * 100}%`,
            top: `${(1 - value) * 100}%`,
            backgroundColor: hex,
          }}
        />
      </div>

      {/* Hue */}

      <div className="relative mt-4">
        <canvas
          ref={hueRef}
          width={400}
          height={24}
          className="
            h-6
            w-full
            cursor-pointer
            rounded-full
            shadow-sm
          "
          style={{ touchAction: "none" }}
          onMouseDown={(event) => {
            setDraggingHue(true);
            updateHueFromPointer(event);
          }}
          onMouseMove={handleHueMove}
          onMouseUp={() =>
            setDraggingHue(false)
          }
          onMouseLeave={() =>
            setDraggingHue(false)
          }
        />

        <div
          className="
            pointer-events-none
            absolute
            top-1/2
            h-8
            w-3
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            border-2
            border-white
            shadow-md
          "
          style={{
            left: `${(hue / 360) * 100}%`,
            backgroundColor: `hsl(${hue}, 100%, 50%)`,
          }}
        />
      </div>
    </div>
  );
}

/* =========================================================
   PALETTE SELECTOR
========================================================= */

export default function PaletteSelector({
  palette,
  onUpdate,
}: PaletteSelectorProps) {
  const [hex, setHex] =
    useState("#8b5e3c");

  const [hexInput, setHexInput] =
    useState("8b5e3c");

  const [hexError, setHexError] =
    useState("");

  /* -------------------------------------------------------
     Sincronização dos três métodos
  ------------------------------------------------------- */

  function handleHexChange(newHex: string) {
    setHex(newHex);
    setHexInput(newHex.replace("#", ""));
    setHexError("");
  }

  /* -------------------------------------------------------
     Input nativo
  ------------------------------------------------------- */

  function handleNativeColorChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    handleHexChange(event.target.value);
  }

  /* -------------------------------------------------------
     Input HEX
  ------------------------------------------------------- */

  function handleHexInputChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const value = event.target.value
      .replace("#", "")
      .slice(0, 6);

    setHexInput(value);

    const candidate = `#${value}`;

    if (
      /^#?[0-9a-f]{6}$/i.test(candidate)
    ) {
      setHex(candidate.toLowerCase());
      setHexError("");
    } else {
      setHexError("Digite uma cor HEX válida.");
    }
  }

  /* -------------------------------------------------------
     Adicionar à paleta
  ------------------------------------------------------- */

  function addToPalette() {
    const newColor: PaletteColor = {
      hex,
      source: "picker",
    };

    onUpdate([
      newColor,
      ...palette.slice(0, 2),
    ]);
  }

  return (
    <div className="relative overflow-hidden py-6">
      {/* ===================================================
          CONTEÚDO
      ================================================== */}

      <div className="relative z-10 mx-auto max-w-2xl">

        {/* PREVIEW */}

        <div
          className="
    relative
    mb-5
    h-28
    overflow-hidden
    rounded-2xl
    shadow-sm
  "
          style={{ backgroundColor: hex }}
        >
          {/* risco de pincel */}
          <svg
            className="absolute inset-0 h-full w-full pointer-events-none"
            viewBox="0 0 400 100"
            preserveAspectRatio="none"
          >
            <path
              d="M-10 72 C70 35, 130 35, 205 52 S330 70, 410 35"
              fill="none"
              stroke="rgba(255,255,255,0.28)"
              strokeWidth="10"
              strokeLinecap="round"
            />
          </svg>

          {/* etiqueta HEX */}
          <div
            className="
      absolute
      bottom-3
      left-3
      rounded-lg
      bg-[#754b2f]
      px-3
      py-1
      font-mono
      text-xs
      font-bold
      text-[#f5ede0]
      shadow-sm
    "
          >
            #{hex.replace("#", "").toUpperCase()}
          </div>
        </div>

      {/* CONTROLES */}

      <p className="mb-2 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9b7954]">
        Seletor de cores
      </p>

      <div className="grid gap-3 md:grid-cols-[48px_1fr]">

        {/* seletor nativo */}

        <div>
          <p className="mb-2 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9b7954]">
            Cor
          </p>

          <label
            className="
                relative
                block
                h-12
                w-12
                cursor-pointer
                overflow-hidden
                rounded-xl
                border
                border-[#CDBB9F]
                shadow-sm
              "
            style={{
              backgroundColor: hex,
            }}
          >
            <input
              type="color"
              value={hex}
              onChange={handleNativeColorChange}
              className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  cursor-pointer
                  opacity-0
                  outline-none
                "
            />
          </label>
        </div>

        {/* HEX */}

        <div>
          <label
            htmlFor="hex-input"
            className="
                mb-2
                block
                text-left
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-[#9b7954]
                pl-6
              "
          >
            HEX
          </label>

          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-[#9b7954]">
              #
            </span>

            <input
              id="hex-input"
              type="text"
              value={hexInput}
              onChange={handleHexInputChange}
              maxLength={6}
              spellCheck={false}
              className="
                  w-full
                  rounded-xl
                  border
                  border-[#CDBB9F]
                  bg-white
                  pl-7
                  pr-3
                  py-2
                  font-mono
                  text-sm
                  uppercase
                  outline-none
                  transition
                  focus:border-[#8b5e3c]
                  focus:ring-2
                  focus:ring-[#8b5e3c]/10
                "
              placeholder="8b5e3c"
            />
          </div>

          {hexError && (
            <p className="mt-1 text-left text-xs text-[#a34f35]">
              {hexError}
            </p>
          )}
        </div>
      </div>

      {/* HSV */}

      <div className="mt-6">
        <p className="mb-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9b7954]">
          Ajuste fino
        </p>

        <HSVPicker
          hex={hex}
          onChange={handleHexChange}
        />
      </div>

      {/* BOTÃO */}

      <button
        type="button"
        onClick={addToPalette}
        className="
            mt-6
            w-full
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#8b5e3c]
            px-4
            py-2.5
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition
            hover:bg-[#754b2f]
            active:scale-[0.99]
          "
      >
        <span className="text-lg leading-none">+</span>
        <span>Adicionar à paleta</span>
      </button>

      {/* PALETA */}

      <PaletteStrip palette={palette} />
    </div>
    </div>
  );
}
import { useRef, useState } from "react";
import ContentSplatters from "./ContentSplatters";

type Color = {
  hex: string;
  source: "dominante" | "conta-gotas";
};

export default function ImageColorPicker() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<string | null>(null);

  const [zoom, setZoom] = useState(1);

  const [dominantColors, setDominantColors] = useState<Color[]>([]);

  const [selectedColors, setSelectedColors] = useState<Color[]>([]);

  const [isEyedropperActive, setIsEyedropperActive] =
    useState(false);

  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  function zoomIn() {
    setZoom((previous) =>
      Math.min(previous + 0.25, 3)
    );
    setOffsetX(0);
    setOffsetY(0);
  }

  function zoomOut() {
    setZoom((previous) =>
      Math.max(previous - 0.25, 0.5)
    );
    setOffsetX(0);
    setOffsetY(0);
  }

  function resetZoom() {
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
  }

  /*
   * =========================================================
   * UPLOAD
   * =========================================================
   */

  function handleUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setImage(imageUrl);

    setSelectedColors([]);

    setIsEyedropperActive(false);

    setOffsetX(0);
    setOffsetY(0);

    setZoom(1);

    extractDominantColors(imageUrl);
  }

  /*
   * =========================================================
   * ABRIR SELETOR DE ARQUIVO
   * =========================================================
   */

  function openFilePicker() {
    inputRef.current?.click();
  }

  /*
   * =========================================================
   * DRAG/PAN DA IMAGEM
   * =========================================================
   */

  function handleImageMouseDown(
    event: React.MouseEvent<HTMLImageElement>
  ) {
    if (zoom <= 1 || isEyedropperActive) {
      return;
    }

    setIsDragging(true);
    setDragStart({ x: event.clientX - offsetX, y: event.clientY - offsetY });
  }

  function handleImageMouseMove(
    event: React.MouseEvent<HTMLImageElement>
  ) {
    if (!isDragging || zoom <= 1) {
      return;
    }

    const newOffsetX = event.clientX - dragStart.x;
    const newOffsetY = event.clientY - dragStart.y;

    setOffsetX(newOffsetX);
    setOffsetY(newOffsetY);
  }

  function handleImageMouseUp() {
    setIsDragging(false);
  }

  /*
   * =========================================================
   * EXTRAIR CORES DOMINANTES
   * =========================================================
   */

  function extractDominantColors(imageUrl: string) {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");

      const context = canvas.getContext("2d");

      if (!context) return;

      const size = 100;

      canvas.width = size;
      canvas.height = size;

      context.drawImage(img, 0, 0, size, size);

      const imageData = context.getImageData(
        0,
        0,
        size,
        size
      );

      const pixels = imageData.data;

      const colorMap = new Map<string, number>();

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const alpha = pixels[i + 3];

        if (alpha < 128) continue;

        const factor = 16;

        const qr = Math.floor(r / factor) * factor;
        const qg = Math.floor(g / factor) * factor;
        const qb = Math.floor(b / factor) * factor;

        const key = `${qr},${qg},${qb}`;

        colorMap.set(
          key,
          (colorMap.get(key) || 0) + 1
        );
      }

      const sortedColors = [...colorMap.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      const colors: Color[] = sortedColors.map(
        ([rgb]) => {
          const [r, g, b] = rgb
            .split(",")
            .map(Number);

          return {
            hex: rgbToHex(r, g, b),
            source: "dominante",
          };
        }
      );

      setDominantColors(colors);
    };

    img.src = imageUrl;
  }

  /*
   * =========================================================
   * CONTA-GOTAS
   * =========================================================
   */

  function handleImageClick(
    event: React.MouseEvent<HTMLImageElement>
  ) {
    if (!isEyedropperActive) {
      return;
    }

    const img = event.currentTarget;

    const rect = img.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;

    const imageX = Math.floor(x * scaleX);
    const imageY = Math.floor(y * scaleY);

    const canvas = document.createElement("canvas");

    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    context.drawImage(img, 0, 0);

    const pixel = context.getImageData(
      imageX,
      imageY,
      1,
      1
    ).data;

    const hex = rgbToHex(
      pixel[0],
      pixel[1],
      pixel[2]
    );

    setSelectedColors((previous) => [
      ...previous,
      {
        hex,
        source: "conta-gotas",
      },
    ]);

    setIsEyedropperActive(false);
  }

  /*
   * =========================================================
   * RGB -> HEX
   * =========================================================
   */

  function rgbToHex(
    r: number,
    g: number,
    b: number
  ) {
    return (
      "#" +
      [r, g, b]
        .map((value) =>
          value
            .toString(16)
            .padStart(2, "0")
        )
        .join("")
        .toUpperCase()
    );
  }

  return (
    <div className="w-full p-3 text-sm text-smeargle-dark sm:p-6">

      {/* =====================================================
          INPUT INVISÍVEL
      ====================================================== */}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />

      {/* =====================================================
          SEM IMAGEM
      ====================================================== */}

      {!image && (
        <button
          type="button"
          onClick={openFilePicker}
          className="
            relative
            flex
            h-52
            w-full
            items-center
            justify-center
            overflow-hidden
            rounded-2xl
            border-2
            border-dashed
            border-[#CDBB9F]
            bg-[#F7F5ED]
            text-[#A27C4B]
            transition

            hover:bg-[#F0F1DF]
            hover:border-[#A99068]

            active:scale-[0.995]

            sm:h-64
          "
        >
          <div className="pointer-events-none text-center">

            <div className="mb-3">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto"
              >
                {/* moldura */}
                <rect
                  x="4"
                  y="10"
                  width="40"
                  height="30"
                  rx="5"
                  fill="#e8dcc8"
                  stroke="#c4a882"
                  strokeWidth="1.5"
                />

                {/* sol / círculo */}
                <circle
                  cx="15"
                  cy="20"
                  r="4"
                  fill="#8b5e3c"
                  opacity="0.4"
                />

                {/* montanhas */}
                <path
                  d="M6 36 L18 24 L28 32 L36 22 L44 34"
                  stroke="#6aab5a"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* ponta do pincel */}
                <ellipse
                  cx="40"
                  cy="8"
                  rx="4"
                  ry="6"
                  fill="#6aab5a"
                  transform="rotate(-25 40 8)"
                />
              </svg>
            </div>

            <p className="text-base font-medium">
              Clique para carregar uma imagem
            </p>

            <p className="mt-1 text-xs opacity-70">
              PNG, JPG ou WEBP
            </p>

          </div>
        </button>
      )}

      {/* =====================================================
          COM IMAGEM
      ====================================================== */}

      {image && (
        <>
          {/* BOTÕES */}

          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">

            {/* CARREGAR OUTRA IMAGEM */}

            <button
              type="button"
              onClick={openFilePicker}
              className="
                flex
                items-center
                gap-2
                rounded-xl
                bg-[#754522]
                px-4
                py-2
                text-sm
                font-medium
                text-white
                shadow-sm
                transition

                hover:bg-[#63391D]

                active:scale-[0.98]
                sm:w-auto
              "
            >
              <span>↥</span>

              Carregar imagem
            </button>

            {/* CONTA-GOTAS */}

            <button
              type="button"
              onClick={() =>
                setIsEyedropperActive(
                  (previous) => !previous
                )
              }
              className={`
  w-full
  flex
  items-center
  gap-2
  rounded-xl
  border
  px-4
  py-2
  text-sm
  font-medium
  shadow-sm
  transition-all
  duration-200
  sm:w-auto

  ${isEyedropperActive
                  ? "border-[#569345] bg-[#569345] text-white"
                  : "border-[#D3C5B4] bg-white text-[#513B2A] hover:bg-[#F4EFE7]"
                }
`}
            >
              <span>⌕</span>

              {isEyedropperActive
                ? "Clique na imagem"
                : "Conta-gotas"}
            </button>

          </div>

          {/* =================================================
              IMAGEM
          ================================================== */}

          <div
            className="
    relative
    flex
    h-[42vh]
    min-h-[220px]
    w-full
    items-center
    justify-center
    overflow-hidden
    rounded-2xl
    border
    border-[#D5C8B6]
    bg-[#F7F5ED]
    shadow-sm

    sm:h-[55vh]
    sm:min-h-[300px]
  "
          >
            <ContentSplatters />

            {/* =====================================================
      CONTROLES DE ZOOM
  ====================================================== */}

            <div
              className="
      absolute
      right-3
      top-3
      z-20
      flex
      items-center
      gap-1
      rounded-xl
      border
      border-[#D5C8B6]
      bg-[#F7F3E9]/95
      p-1
      shadow-sm
      backdrop-blur-sm
    "
            >
              {/* diminuir */}
              <button
                type="button"
                onClick={zoomOut}
                disabled={zoom <= 0.5}
                className="
        flex
        h-8
        w-8
        items-center
        justify-center
        rounded-lg
        text-lg
        font-medium
        text-[#754522]
        transition

        hover:bg-[#E8DCC8]

        disabled:cursor-not-allowed
        disabled:opacity-30
      "
                title="Diminuir zoom"
              >
                −
              </button>

              {/* porcentagem */}
              <button
                type="button"
                onClick={resetZoom}
                className="
        min-w-[52px]
        rounded-lg
        px-2
        py-1.5
        text-xs
        font-semibold
        text-[#754522]
        transition
        hover:bg-[#E8DCC8]
      "
                title="Restaurar zoom"
              >
                {Math.round(zoom * 100)}%
              </button>

              {/* aumentar */}
              <button
                type="button"
                onClick={zoomIn}
                disabled={zoom >= 3}
                className="
        flex
        h-8
        w-8
        items-center
        justify-center
        rounded-lg
        text-lg
        font-medium
        text-[#754522]
        transition

        hover:bg-[#E8DCC8]

        disabled:cursor-not-allowed
        disabled:opacity-30
      "
                title="Aumentar zoom"
              >
                +
              </button>
            </div>

            {/* =====================================================
      IMAGEM
  ====================================================== */}

            <img
              src={image}
              alt="Imagem carregada"
              onClick={handleImageClick}
              onMouseDown={handleImageMouseDown}
              onMouseMove={handleImageMouseMove}
              onMouseUp={handleImageMouseUp}
              onMouseLeave={handleImageMouseUp}
              className={`
      relative
      z-10
      block
      max-h-full
      max-w-full
      select-none
      object-contain
      transition-transform
      duration-200
      ease-out

      ${isEyedropperActive
                  ? "cursor-crosshair"
                  : zoom > 1
                    ? isDragging
                      ? "cursor-grabbing"
                      : "cursor-grab"
                    : "cursor-default"
                }
    `}
              style={{
                transform: `scale(${zoom}) translate(${offsetX}px, ${offsetY}px)`,
                transformOrigin: "center center",
              }}
              draggable={false}
            />
          </div>

          {/* =================================================
              PALETA
          ================================================== */}

      <div className="mt-5">

        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#927654]">
          Paleta
        </p>

        {/* CORES DOMINANTES */}

        <div className="space-y-2">

          {dominantColors.map(
            (color, index) => (
              <ColorRow
                key={`${color.hex}-${index}`}
                color={color.hex}
                label="dominante"
              />
            )
          )}

        </div>

        {/* CORES DO CONTA-GOTAS */}

        {selectedColors.length > 0 && (
          <div className="mt-5">

            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#927654]">
              Cores selecionadas
            </p>

            <div className="space-y-2">

              {selectedColors.map(
                (color, index) => (
                  <ColorRow
                    key={`${color.hex}-${index}`}
                    color={color.hex}
                    label="conta-gotas"
                  />
                )
              )}

            </div>

          </div>
        )}

      </div>
    </>
      )}
    </div>
  );
}


/*
 * =========================================================
 * LINHA DE COR
 * =========================================================
 */

function ColorRow({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-3
        rounded-xl
        border
        border-[#DED3C3]
        bg-[#F8F7F0]
        p-2
      "
    >

      <div
        className="
          h-10
          w-10
          shrink-0
          rounded-lg
          border
          border-black/5
        "
        style={{
          backgroundColor: color,
        }}
      />

      <span className="flex-1 font-mono text-xs">
        {color}
      </span>

      <span
        className="
          flex
          items-center
          gap-1
          text-[10px]
          text-[#927654]
        "
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#463B50]" />

        {label}
      </span>

    </div>
  );
}
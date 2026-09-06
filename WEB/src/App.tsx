import { useState } from "react";
import PaletteSelector from "./components/palette-selector";
import type { PaletteColor } from "./components/palette-selector";
import PaletteStrip from "./components/PaletteStrip";
import ImageColorPicker from "./components/image-color-picker";
import ContentSplatters from "./components/ContentSplatters";

import SmeargleIcon from "./assets/Smeargle_Icon.png";
import ManchasIcon from "./assets/Manchas_De_Tinta.png";

const CURRENT_PALETTE_KEY = "smeargle-current-palette";
const PALETTE_HISTORY_KEY = "smeargle-palette-history";

function readStoredValue<T>(key: string, fallback: T): T {
  try {
    const storedValue = localStorage.getItem(key);

    return storedValue ? JSON.parse(storedValue) as T : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [tab, setTab] = useState("Imagem");
  const [hoverTab, setHoverTab] = useState<string | null>(null);

  const [palette, setPalette] = useState<PaletteColor[]>(() =>
    readStoredValue<PaletteColor[]>(CURRENT_PALETTE_KEY, [])
  );

  const [paletteHistory, setPaletteHistory] = useState<PaletteColor[][]>(() =>
    readStoredValue<PaletteColor[][]>(PALETTE_HISTORY_KEY, [])
  );

  function updatePalette(nextPalette: PaletteColor[]) {
    setPalette(nextPalette);
    localStorage.setItem(
      CURRENT_PALETTE_KEY,
      JSON.stringify(nextPalette)
    );

    if (nextPalette.length === 0) return;

    setPaletteHistory((previousHistory) => {
      const nextHistory = [
        nextPalette,
        ...previousHistory.filter(
          (previousPalette) =>
            JSON.stringify(previousPalette) !== JSON.stringify(nextPalette)
        ),
      ].slice(0, 12);

      localStorage.setItem(
        PALETTE_HISTORY_KEY,
        JSON.stringify(nextHistory)
      );

      return nextHistory;
    });
  }

  function removePaletteHistory(indexToRemove: number) {
    setPaletteHistory((previousHistory) => {
      const nextHistory = previousHistory.filter(
        (_, index) => index !== indexToRemove
      );

      localStorage.setItem(
        PALETTE_HISTORY_KEY,
        JSON.stringify(nextHistory)
      );

      return nextHistory;
    });
  }

  return (
    <div className="h-screen w-screen overflow-hidden p-2 sm:p-4">
      <div
        className="
          mx-auto
          flex
          h-full
          max-h-full
          w-full
          max-w-[1000px]
          flex-col
          overflow-hidden
          rounded-xl sm:rounded-2xl
          shadow-lg
        "
      >
        {/* =====================================================
            TOPO
        ====================================================== */}

        <div className="relative shrink-0 bg-smeargle-brown p-3 text-left sm:p-4">
          <div className="flex items-center justify-start gap-2">
            <img
              src={SmeargleIcon}
              alt="Ícone Smeargle"
              className="h-12 w-12 sm:h-20 sm:w-20"
            />

            <div>
              <h1 className="titulo text-xl font-bold text-white sm:text-4xl">
                Smeargle Studio
              </h1>

              <p className="font-sans text-[9px] text-[#D4A058] sm:text-base">
                Seletor de cores do artista
              </p>

              <img
                src={ManchasIcon}
                alt="Manchas de tinta"
                className="mt-1 h-3 w-auto rounded sm:mt-2 sm:h-5"
              />
            </div>
          </div>

          {/* Barra inferior com blocos de cor */}
          <div className="absolute bottom-0 left-0 flex h-2 w-full">
            <div className="flex-1 bg-[#C9B39B]" />
            <div className="flex-1 bg-[#885B39]" />
            <div className="flex-1 bg-[#6E8E4C]" />
            <div className="flex-1 bg-[#988B77]" />
            <div className="flex-1 bg-[#AA6949]" />
          </div>
        </div>

        {/* =====================================================
            BARRA DE NAVEGAÇÃO
        ====================================================== */}

        <div
          className="
    flex
    shrink-0
    border-b
    bg-smeargle-cream
    text-[10px]
    font-semibold
    text-smeargle-dark
    sm:text-sm
  "
          style={{ borderColor: "#E1D4C2" }}
        >

          <button
            type="button"
            onClick={() => setTab("Imagem")}
            onMouseEnter={() => setHoverTab("Imagem")}
            onMouseLeave={() => setHoverTab(null)}
            className="
      relative
      flex-1
      py-2
      text-center
      text-[#754522]
      sm:py-3
    "
          >
            Imagem

            <span
              className={`
        absolute
        bottom-0
        left-1/2
        h-[3px]
        -translate-x-1/2
        rounded-t-full

        bg-gradient-to-r
        from-[#754522]
        via-[#8C613E]
        to-[#6E9F4F]

        transition-all
        duration-300
        ease-out

        ${(
                  hoverTab === "Imagem" ||
                  (hoverTab === null && tab === "Imagem")
                )
                  ? "w-[70%]"
                  : "w-0"
                }
      `}
            />
          </button>

          <button
            type="button"
            onClick={() => setTab("Paleta")}
            onMouseEnter={() => setHoverTab("Paleta")}
            onMouseLeave={() => setHoverTab(null)}
            className="
      relative
      flex-1
      py-3
      text-center
      text-[#754522]
    "
          >
            Paleta

            <span
              className={`
        absolute
        bottom-0
        left-1/2
        h-[3px]
        -translate-x-1/2
        rounded-t-full

        bg-gradient-to-r
        from-[#754522]
        via-[#8C613E]
        to-[#6E9F4F]

        transition-all
        duration-300
        ease-out

        ${(
                  hoverTab === "Paleta" ||
                  (hoverTab === null && tab === "Paleta")
                )
                  ? "w-[70%]"
                  : "w-0"
                }
      `}
            />
          </button>

          <button
            type="button"
            onClick={() => setTab("Histórico")}
            onMouseEnter={() => setHoverTab("Histórico")}
            onMouseLeave={() => setHoverTab(null)}
            className="
      relative
      flex-1
      py-2
      text-center
      text-[#754522]
      sm:py-3
    "
          >
            Histórico

            <span
              className={`
        absolute
        bottom-0
        left-1/2
        h-[3px]
        -translate-x-1/2
        rounded-t-full
        bg-gradient-to-r
        from-[#754522]
        via-[#8C613E]
        to-[#6E9F4F]
        transition-all
        duration-300
        ease-out
        ${(
                  hoverTab === "Histórico" ||
                  (hoverTab === null && tab === "Histórico")
                )
                  ? "w-[70%]"
                  : "w-0"
                }
      `}
            />
          </button>
        </div>
        {/* =====================================================
            CONTEÚDO
        ====================================================== */}

        <div
          className="
    relative
    min-h-0
    flex-1
    overflow-y-auto
    bg-smeargle-cream
  "
        >
          <ContentSplatters />

          <div className="relative z-10">
            {tab === "Imagem" && <ImageColorPicker />}

            {tab === "Paleta" && (
              <PaletteSelector
                palette={palette}
                onUpdate={updatePalette}
              />
            )}

            {tab === "Histórico" && (
              <div className="px-3 py-4 sm:px-6 sm:py-6">
                {paletteHistory.length > 0 ? (
                  paletteHistory.map((previousPalette, index) => (
                    <div
                      key={`${index}-${previousPalette.map((color) => color.hex).join("-")}`}
                      className="flex items-start gap-2"
                    >
                      <button
                        type="button"
                        onClick={() => removePaletteHistory(index)}
                        aria-label={`Excluir paleta anterior ${index + 1}`}
                        title="Excluir paleta"
                        className="mt-7 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-[#9b7954] transition hover:bg-[#eadcc9] hover:text-[#754b2f]"
                      >
                        &times;
                      </button>

                      <div className="min-w-0 flex-1">
                        <PaletteStrip
                          palette={previousPalette}
                          title={`Paleta anterior ${index + 1}`}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="py-8 text-center text-sm text-[#9b7954]">
                    Nenhuma paleta salva anteriormente.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>      </div>
    </div>
  );
}
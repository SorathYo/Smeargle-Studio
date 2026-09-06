import { useState } from "react";
import PaletteSelector from "./components/palette-selector";
import type { PaletteColor } from "./components/palette-selector";
import ImageColorPicker from "./components/image-color-picker";
import ContentSplatters from "./components/ContentSplatters";

import SmeargleIcon from "./assets/Smeargle_Icon.png";
import ManchasIcon from "./assets/Manchas_De_Tinta.png";

export default function App() {
  const [tab, setTab] = useState("Imagem");
  const [hoverTab, setHoverTab] = useState<string | null>(null);

  // A paleta pertence à aplicação para sobreviver à troca entre as abas.
  const [palette, setPalette] = useState<PaletteColor[]>([]);

  return (
    <div className="h-screen w-screen overflow-hidden p-4">
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
          rounded-2xl
          shadow-lg
        "
      >
        {/* =====================================================
            TOPO
        ====================================================== */}

        <div className="relative shrink-0 bg-smeargle-brown p-4 text-left">
          <div className="flex items-center justify-start gap-2">
            <img
              src={SmeargleIcon}
              alt="Ícone Smeargle"
              className="h-20 w-20"
            />

            <div>
              <h1 className="titulo text-4xl font-bold text-white">
                Smeargle Color
              </h1>

              <p className="font-sans text-base text-[#D4A058]">
                Seletor de cores do artista
              </p>

              <img
                src={ManchasIcon}
                alt="Manchas de tinta"
                className="mt-2 h-5 w-auto rounded"
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
    text-sm
    font-semibold
    text-smeargle-dark
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
      py-3
      text-center
      text-[#754522]
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
                onUpdate={setPalette}
              />
            )}
          </div>
        </div>      </div>
    </div>
  );
}
import { useState } from "react";
import PaletteSelector from "./components/palette-selector";
import ImageColorPicker from "./components/image-color-picker";

import SmeargleIcon from "./assets/Smeargle_Icon.png";
import ManchasIcon from "./assets/Manchas_De_Tinta.png";

export default function App() {
  const [tab, setTab] = useState("Imagem");

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
            onClick={() => setTab("Imagem")}
            className={`
              flex-1
              py-2
              text-center
              transition
              ${tab === "Imagem"
                ? "bg-smeargle-brown text-white"
                : "hover:bg-smeargle-brown hover:text-white"
              }
            `}
          >
            Imagem
          </button>

          <button
            onClick={() => setTab("Personalização")}
            className={`
              flex-1
              py-2
              text-center
              transition
              ${tab === "Personalização"
                ? "bg-smeargle-brown text-white"
                : "hover:bg-smeargle-brown hover:text-white"
              }
            `}
          >
            Personalização
          </button>
        </div>

        {/* =====================================================
            CONTEÚDO
        ====================================================== */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            bg-smeargle-cream
          "
        >
          {tab === "Imagem" && <ImageColorPicker />}

          {tab === "Personalização" && <PaletteSelector />}
        </div>
      </div>
    </div>
  );
}
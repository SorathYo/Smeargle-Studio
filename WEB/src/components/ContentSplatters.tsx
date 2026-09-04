export default function ContentSplatters() {
  return (
    <svg
      className="absolute inset-0 z-0 h-full w-full pointer-events-none"
      viewBox="0 0 400 300"
      preserveAspectRatio="none"
    >
      {/* =====================================================
          CÍRCULOS GRANDES / MANCHAS SUAVES
      ====================================================== */}

      {/* canto superior esquerdo */}
      <circle
        cx="-4"
        cy="48"
        r="28"
        fill="#6aab5a"
        opacity="0.10"
      />

      {/* canto superior direito */}
      <circle
        cx="414"
        cy="42"
        r="27"
        fill="#c47a5a"
        opacity="0.10"
      />

      {/* lateral esquerda */}
      <circle
        cx="2"
        cy="145"
        r="17"
        fill="#6aab5a"
        opacity="0.12"
      />

      {/* lateral direita */}
      <circle
        cx="405"
        cy="145"
        r="21"
        fill="#c47a5a"
        opacity="0.08"
      />

      {/* canto inferior esquerdo */}
      <circle
        cx="80"
        cy="305"
        r="17"
        fill="#8b5e3c"
        opacity="0.09"
      />

      {/* canto inferior direito */}
      <circle
        cx="375"
        cy="280"
        r="19"
        fill="#6aab5a"
        opacity="0.10"
      />

      {/* =====================================================
          CÍRCULOS COM EFEITO DE ANEL
      ====================================================== */}

      <circle
        cx="390"
        cy="95"
        r="22"
        fill="transparent"
        stroke="#8b5e3c"
        strokeWidth="1.5"
        opacity="0.08"
      />

      <circle
        cx="25"
        cy="225"
        r="13"
        fill="transparent"
        stroke="#c47a5a"
        strokeWidth="1.5"
        opacity="0.08"
      />

      {/* =====================================================
          RISCOS / PINCELADAS CURVAS
      ====================================================== */}

      {/* risco vertical esquerdo */}
      <path
        d="M34 -10 Q29 35 35 72 Q41 105 32 140"
        stroke="#8b5e3c"
        strokeWidth="4"
        fill="none"
        opacity="0.10"
        strokeLinecap="round"
      />

      {/* continuação do risco esquerdo */}
      <path
        d="M32 140 Q27 164 34 188"
        stroke="#8b5e3c"
        strokeWidth="2"
        fill="none"
        opacity="0.07"
        strokeLinecap="round"
      />

      {/* risco inferior */}
      <path
        d="M20 285 Q65 268 110 280 Q145 290 185 278"
        stroke="#8b5e3c"
        strokeWidth="3"
        fill="none"
        opacity="0.10"
        strokeLinecap="round"
      />

      {/* risco superior */}
      <path
        d="M110 8 Q150 17 185 8"
        stroke="#6aab5a"
        strokeWidth="2.5"
        fill="none"
        opacity="0.07"
        strokeLinecap="round"
      />

      {/* risco direito */}
      <path
        d="M392 205 Q378 225 385 250 Q390 270 378 300"
        stroke="#c47a5a"
        strokeWidth="3"
        fill="none"
        opacity="0.07"
        strokeLinecap="round"
      />

      {/* =====================================================
          PEQUENOS PONTOS DE TINTA
      ====================================================== */}

      {/* cluster superior esquerdo */}
      <circle
        cx="55"
        cy="22"
        r="2.5"
        fill="#8b5e3c"
        opacity="0.15"
      />

      <circle
        cx="63"
        cy="17"
        r="1.7"
        fill="#8b5e3c"
        opacity="0.13"
      />

      <circle
        cx="69"
        cy="25"
        r="2"
        fill="#8b5e3c"
        opacity="0.12"
      />

      {/* cluster inferior direito */}
      <circle
        cx="348"
        cy="270"
        r="2.5"
        fill="#6aab5a"
        opacity="0.16"
      />

      <circle
        cx="357"
        cy="265"
        r="1.7"
        fill="#6aab5a"
        opacity="0.13"
      />

      <circle
        cx="363"
        cy="273"
        r="2"
        fill="#6aab5a"
        opacity="0.14"
      />

      {/* cluster lateral */}
      <circle
        cx="16"
        cy="175"
        r="2"
        fill="#c47a5a"
        opacity="0.15"
      />

      <circle
        cx="23"
        cy="181"
        r="1.5"
        fill="#c47a5a"
        opacity="0.13"
      />

      <circle
        cx="11"
        cy="186"
        r="2.5"
        fill="#c47a5a"
        opacity="0.12"
      />
    </svg>
  );
}
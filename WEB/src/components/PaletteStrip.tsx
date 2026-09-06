import type { PaletteColor } from "./palette-selector";

interface PaletteStripProps {
  palette: PaletteColor[];
}

/** Exibe as cores salvas como uma faixa de amostras, sem duplicar a lógica do seletor. */
export default function PaletteStrip({ palette }: PaletteStripProps) {
  if (palette.length === 0) return null;

  return (
    <section className="mt-7">
      <p className="mb-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9b7954]">
        Paleta atual
      </p>

      <div className="relative overflow-hidden rounded-2xl border border-[#d5c8b6] bg-[#eadcc9] p-3 shadow-sm">
        <div className="pointer-events-none absolute left-0 right-0 top-5 h-3 -rotate-2 bg-white/20 blur-[1px]" />
        <div className="grid grid-cols-3 gap-2">
          {palette.map((color, index) => (
            <div key={`${color.hex}-${index}`} className="min-w-0">
              <div
                className="relative h-16 overflow-hidden rounded-xl shadow-sm"
                style={{ backgroundColor: color.hex }}
              >
                <span className="pointer-events-none absolute inset-x-1 top-4 h-2 -rotate-3 rounded-full bg-white/20" />
              </div>
              <p className="mt-2 truncate text-center font-mono text-[10px] font-semibold uppercase text-[#6d4b2f]">
                {color.hex}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

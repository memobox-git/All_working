import { Pixel } from "@/components/icons";

// Nested squares that pulse outward from a center glyph (Sigil's closing visual, in monochrome).
export function Concentric() {
  const rings = [0, 1, 2, 3, 4, 5];
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[380px]" aria-hidden="true">
      <style>{`
        .ring { animation: ring 4.8s ease-in-out infinite; }
        @keyframes ring { 0%, 100% { opacity: .35 } 50% { opacity: 1 } }
        .tick { animation: tick 2.4s steps(1) infinite; }
        @keyframes tick { 50% { opacity: 0 } }
      `}</style>
      {rings.map((r) => {
        const inset = r * 8.2;
        return (
          <div
            key={r}
            className={`ring absolute border ${r % 2 ? "border-dashed border-night-line" : "border-[#3a3a36]"}`}
            style={{ inset: `${inset}%`, animationDelay: `${(5 - r) * 0.35}s` }}
          >
            {r % 2 === 0 && (
              <>
                <span className="tick absolute -top-px left-[18%] h-[2px] w-[14%] bg-paper" style={{ animationDelay: `${r * 0.3}s` }} />
                <span className="tick absolute -right-px top-[30%] h-[16%] w-[2px] bg-paper" style={{ animationDelay: `${r * 0.3 + 0.8}s` }} />
              </>
            )}
          </div>
        );
      })}
      <div className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center border border-paper bg-night text-paper">
        <Pixel name="logo" size={22} />
      </div>
    </div>
  );
}

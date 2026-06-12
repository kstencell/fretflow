import type { Mode, ProgressionTemplate } from "../theory/types";
import { PROGRESSION_TEMPLATES } from "../theory/progressions";

// Templates whose first numeral is uppercase belong to major keys; lowercase to minor.
function isApplicable(t: ProgressionTemplate, mode: Mode): boolean {
  const first = t.numerals[0];
  return mode === "major"
    ? first !== first.toLowerCase()
    : first === first.toLowerCase();
}

interface Props {
  value: ProgressionTemplate;
  onChange: (template: ProgressionTemplate) => void;
  mode: Mode;
}

export function ProgressionSelector({ value, onChange, mode }: Props) {
  const templates = PROGRESSION_TEMPLATES.filter(t => isApplicable(t, mode));

  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">
        Progression
      </span>

      <div className="grid grid-cols-2 gap-2">
        {templates.map(t => {
          const active = t.id === value.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t)}
              className={`
                text-left rounded-2xl px-4 py-3 border transition-all duration-150
                ${active
                  ? "bg-blue-50 border-blue-400 shadow-sm shadow-blue-100"
                  : "bg-white border-slate-200 hover:border-blue-200 hover:bg-blue-50/40"
                }
              `}
            >
              <div className={`text-sm font-semibold mb-1 ${active ? "text-blue-700" : "text-slate-700"}`}>
                {t.label}
              </div>
              <div className={`font-mono text-xs tracking-wide ${active ? "text-blue-500" : "text-slate-400"}`}>
                {t.numerals.join(" · ")}
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {t.genres.map(g => (
                  <span
                    key={g}
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${
                      active ? "bg-blue-100 text-blue-500" : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {g}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

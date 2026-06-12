import type { Mode, ProgressionTemplate } from "../theory/types";
import { PROGRESSION_TEMPLATES } from "../theory/progressions";

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
      <span
        className="font-medium uppercase tracking-widest"
        style={{ color: '#9a7a58', fontFamily: "'Lora', serif", fontSize: '0.875rem' }}
      >
        Progression
      </span>

      <div className="grid grid-cols-2 gap-2.5">
        {templates.map(t => {
          const active = t.id === value.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t)}
              className="text-left transition-all duration-200"
              style={{
                padding: '14px 16px',
                borderRadius: 14,
                background: active ? '#fdf5e6' : '#faf6ee',
                borderLeft: active ? '4px solid #c4882a' : '1px solid #d9cbb0',
                borderRight: '1px solid #d9cbb0',
                borderTop: '1px solid #d9cbb0',
                borderBottom: active ? '1px solid #e8cfa0' : '1px solid #d9cbb0',
                boxShadow: active
                  ? '2px 4px 20px rgba(196,136,42,0.14), inset 0 1px 0 rgba(255,255,255,0.8)'
                  : '0 1px 4px rgba(45,26,14,0.06), inset 0 1px 0 rgba(255,255,255,0.6)',
                cursor: 'pointer',
              }}
            >
              {/* Numeral pattern — the musical hero of the card */}
              <div
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  color: active ? '#c4882a' : '#b89070',
                  marginBottom: 5,
                  lineHeight: 1.2,
                }}
              >
                {t.numerals.join(' · ')}
              </div>

              {/* Progression name */}
              <div
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: active ? '#7a4820' : '#4a2e1a',
                  fontFamily: "'Lora', serif",
                  marginBottom: 8,
                }}
              >
                {t.label}
              </div>

              {/* Genre tags */}
              <div className="flex flex-wrap gap-1">
                {t.genres.map(g => (
                  <span
                    key={g}
                    style={{
                      fontSize: 11,
                      padding: '2px 7px',
                      borderRadius: 20,
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase' as const,
                      background: active ? '#f5e6c8' : '#ede5d0',
                      color: active ? '#a8731f' : '#9a7a58',
                      fontFamily: "'Lora', serif",
                    }}
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

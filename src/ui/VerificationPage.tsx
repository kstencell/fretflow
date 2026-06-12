import { CAGED_SHAPES } from '../theory/shapes';
import { placeShape } from '../theory/placement';
import { FretboardDiagram } from './FretboardDiagram';
import type { Chord, Note } from '../theory/types';

function note(pitchClass: number, name: string): Note {
  return { pitchClass, name };
}

const MAJOR_CHORDS: Chord[] = [
  { root: note(4,  'E'),  quality: 'major' },
  { root: note(5,  'F'),  quality: 'major' },
  { root: note(7,  'G'),  quality: 'major' },
  { root: note(9,  'A'),  quality: 'major' },
  { root: note(10, 'Bb'), quality: 'major' },
  { root: note(11, 'B'),  quality: 'major' },
  { root: note(0,  'C'),  quality: 'major' },
  { root: note(2,  'D'),  quality: 'major' },
];

const MINOR_CHORDS: Chord[] = [
  { root: note(4,  'E'),  quality: 'minor' },
  { root: note(5,  'F'),  quality: 'minor' },
  { root: note(7,  'G'),  quality: 'minor' },
  { root: note(9,  'A'),  quality: 'minor' },
  { root: note(10, 'Bb'), quality: 'minor' },
  { root: note(11, 'B'),  quality: 'minor' },
  { root: note(0,  'C'),  quality: 'minor' },
  { root: note(2,  'D'),  quality: 'minor' },
];

const SHAPE_ORDER = ['E', 'A', 'G', 'D', 'C'] as const;

function ChordRow({ chord }: { chord: Chord }) {
  const matchingShapes = CAGED_SHAPES
    .filter(s => s.quality === chord.quality)
    .sort((a, b) => SHAPE_ORDER.indexOf(a.name) - SHAPE_ORDER.indexOf(b.name));

  return (
    <div className="mb-8">
      <h3 className="text-zinc-400 text-xs font-mono uppercase tracking-widest mb-3 pl-1">
        {chord.root.name} {chord.quality}
      </h3>
      <div className="flex flex-wrap gap-5">
        {matchingShapes.map(shape => {
          const placed = placeShape(chord, shape);
          if (!placed) {
            return (
              <div
                key={shape.name}
                className="flex flex-col items-center justify-center w-[160px] h-[130px] rounded-lg border border-dashed border-zinc-800 text-zinc-700 text-xs font-mono"
              >
                {shape.name} shape
                <span className="text-zinc-800 mt-1">no placement</span>
              </div>
            );
          }
          return (
            <div
              key={shape.name}
              className="bg-zinc-900 rounded-lg px-3 py-3 border border-zinc-800"
            >
              <FretboardDiagram placedShape={placed} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function VerificationPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white px-8 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-1">Shape Verification</h1>
        <p className="text-zinc-500 text-sm mb-6">
          All 5 CAGED shapes for each chord. Check fret positions and note roles against a real guitar.
        </p>

        {/* Legend */}
        <div className="flex gap-5 mb-10 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full bg-amber-400" />
            Root
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full bg-indigo-400" />
            Third
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full bg-slate-700 border border-slate-600" />
            Fifth
          </div>
        </div>

        <h2 className="text-base font-semibold text-zinc-300 mb-5 border-b border-zinc-800 pb-2">
          Major
        </h2>
        {MAJOR_CHORDS.map(chord => (
          <ChordRow key={`${chord.root.name}-${chord.quality}`} chord={chord} />
        ))}

        <h2 className="text-base font-semibold text-zinc-300 mt-10 mb-5 border-b border-zinc-800 pb-2">
          Minor
        </h2>
        {MINOR_CHORDS.map(chord => (
          <ChordRow key={`${chord.root.name}-${chord.quality}`} chord={chord} />
        ))}
      </div>
    </div>
  );
}

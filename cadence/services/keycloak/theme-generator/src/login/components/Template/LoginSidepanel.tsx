import { CalendarDays, MapPin, Plane, Target } from "lucide-react";

// Cadence mark: an open ring (the loop you keep closing) around three beat bars.
// Same drawing as assets/img/cadence-mark.svg, single-colour so it can be tinted.
const MARK_SVG = [
  '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="18">',
  '<path d="M190 78 A80 80 0 1 0 190 178"/>',
  '<path d="M104 116 V140"/>',
  '<path d="M128 98 V158"/>',
  '<path d="M152 116 V140"/>',
  "</g>",
  '<circle cx="206" cy="128" r="12" fill="currentColor"/>',
].join("");

// Illustrative "what's left today" bars: how much of each daily target is already used.
const MACROS = [
  { label: "Calories", left: "680 kcal", used: 68 },
  { label: "Protein", left: "52g", used: 63 },
  { label: "Carbs", left: "60g", used: 74 },
  { label: "Fat", left: "22g", used: 70 },
];

/**
 * Right-hand panel on desktop, laid out as tiles:
 *
 *   ┌───────────────┬───────────────┐
 *   │               │  text tile    │  top-right quarter
 *   │ violet tile   │               │
 *   │  (full height)├───────┬───────┤
 *   │               │ tile  │       │
 *   │               │       │ tile  │  two small tiles on the diagonal
 *   └───────────────┴───────┴───────┘
 *
 * Hidden below `lg`; the login form takes the whole screen on phones.
 */
const LoginSidepanel = () => {
  return (
    <aside className="sticky top-0 hidden h-dvh bg-background p-4 lg:block xl:p-6">
      <div className="grid h-full grid-cols-2 grid-rows-2 gap-4 xl:gap-5">
        {/* Violet tile: left half, full height */}
        <section className="relative row-span-2 flex flex-col overflow-hidden rounded-[2rem] bg-brand p-8 text-white xl:p-10">
          <svg
            viewBox="0 0 256 256"
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -bottom-12 w-80 text-white opacity-10"
            dangerouslySetInnerHTML={{ __html: MARK_SVG }}
          />
          <p className="relative inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-white/70 uppercase">
            <Plane className="size-3.5" aria-hidden="true" /> Cadence
          </p>
          <h2 className="font-display relative mt-6 text-4xl leading-[0.95] font-extrabold tracking-tight xl:text-5xl 2xl:text-6xl">
            Eat out.
            <br />
            Stay on track.
            <br />
            <span className="text-ink">Anywhere.</span>
          </h2>
          <p className="relative mt-6 max-w-xs text-base leading-relaxed text-white/85">
            Find meals near you that fit what&apos;s left of your macros.
          </p>

          <div className="relative mt-auto rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span>Left today</span>
              <span className="rounded-full bg-white px-2 py-0.5 text-brand">1,420 / 2,100 kcal</span>
            </div>
            <ul className="mt-3 space-y-2">
              {MACROS.map(m => (
                <li key={m.label}>
                  <div className="flex justify-between text-[11px] text-white/80">
                    <span>{m.label}</span>
                    <span>{m.left} left</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-white/20">
                    <div className="h-full rounded-full bg-white" style={{ width: `${m.used}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Top-right quarter: text tile */}
        <section className="flex flex-col rounded-[2rem] border border-border bg-ink p-8 text-white">
          <span className="grid size-10 place-items-center rounded-full bg-brand">
            <MapPin className="size-5" aria-hidden="true" />
          </span>
          <h3 className="font-display mt-auto text-3xl leading-tight font-bold tracking-tight">
            Find food nearby.
          </h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
            Restaurants are hard to track. Cadence shows meals around you and what each one does to
            your calories, protein, carbs and fat.
          </p>
        </section>

        {/* Bottom-right: 2x2 checkerboard, tiles on the diagonal, the other two cells left empty */}
        <div className="grid grid-cols-2 grid-rows-2 gap-4 xl:gap-5">
          <section className="flex flex-col justify-between rounded-[1.5rem] border border-border bg-card p-5">
            <Target className="size-5 text-brand-light" aria-hidden="true" />
            <div>
              <p className="font-display text-lg leading-tight font-bold">Fits your day</p>
              <p className="mt-1 text-xs leading-snug text-muted-foreground">Pick the meal that lands you in range.</p>
            </div>
          </section>
          <div aria-hidden="true" />
          <div aria-hidden="true" />
          <section className="flex flex-col justify-between rounded-[1.5rem] border border-brand/30 bg-brand-soft p-5">
            <CalendarDays className="size-5 text-brand-light" aria-hidden="true" />
            <div>
              <p className="font-display text-lg leading-tight font-bold">Plan the trip</p>
              <p className="mt-1 text-xs leading-snug text-muted-foreground">Line up meals before you leave.</p>
            </div>
          </section>
        </div>
      </div>
    </aside>
  );
};

export default LoginSidepanel;

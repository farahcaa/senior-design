import { Navigate } from "react-router";
import { ArrowRight, CalendarDays, Check, MapPin, Plane, Target, X } from "lucide-react";
import useEasyAuth from "@/hooks/use-easy-auth";
import Loading from "@/pages/loading/Loading";

// Illustrative numbers for the "fits your day" card. Generic meal names on purpose: real restaurant
// data comes from the nearby-food feature, not hard-coded marketing copy.
// Photos: Unsplash License, see public/images/CREDITS.md.
const DAY = { target: 2100, eaten: 1420 };
const LEFT = { kcal: DAY.target - DAY.eaten, protein: 52, carbs: 60, fat: 22 };
const MEALS = [
  {
    place: "Burger joint · 0.3 mi",
    name: "Single cheeseburger + side salad",
    image: "/images/burger.jpg",
    kcal: 560, protein: 32, carbs: 38, fat: 21,
  },
  {
    place: "Chicken spot · 0.5 mi",
    name: "4 chicken tenders + fries",
    image: "/images/chicken-tenders.jpg",
    kcal: 1080, protein: 58, carbs: 92, fat: 52,
  },
];
// Going over on protein is fine; calories, carbs and fat are the limits.
const fits = (m: (typeof MEALS)[number]) => m.kcal <= LEFT.kcal && m.carbs <= LEFT.carbs && m.fat <= LEFT.fat;

const FEATURES = [
  {
    icon: MapPin,
    title: "Find food nearby",
    body: "See restaurant meals around you, ranked by how well they fit the macros you have left.",
  },
  {
    icon: Target,
    title: "Know before you order",
    body: "Every option shows what it does to your calories, protein, carbs and fat for the day.",
  },
  {
    icon: CalendarDays,
    title: "Plan the trip",
    body: "Line up meals for the days you're away, so you're never guessing at the counter.",
  },
];

const STEPS = [
  { n: "1", title: "Set your targets", body: "Calories and macros for a normal day. Cadence tracks what's left as you log." },
  { n: "2", title: "Search where you are", body: "Hotel, airport, office or road trip: pull up what's nearby." },
  { n: "3", title: "Pick what fits", body: "Choose the meal that lands your day in range, and log it in a tap." },
];

/**
 * Public landing page at "/". Signed-in users skip straight to the /app dashboard; everyone else gets
 * the pitch plus sign-in / sign-up buttons that hand off to the Cadence Keycloak theme.
 *
 * Note the OIDC callback also lands here (redirect_uri is the site origin), so while
 * react-oidc-context is still processing ?code=... we show the loader rather than the page.
 */
const Landing = () => {
  const { isAuthenticated, isLoading, activeNavigator, authContext } = useEasyAuth();

  if (isLoading || activeNavigator) return <Loading text="Loading..." />;
  if (isAuthenticated) return <Navigate to="/app" replace />;

  const signIn = () => void authContext.signinRedirect();
  // `prompt=create` opens Keycloak's registration page directly.
  const signUp = () => void authContext.signinRedirect({ prompt: "create" });

  return (
    <div className="min-h-[100dvh] bg-[#16131d] text-[#ece8f3]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <img src="/cadence-mark.svg" alt="" className="size-9 rounded-xl" />
          <span className="font-display text-xl font-bold tracking-tight">
            Cadence<span className="text-[#b9a6f5]">.</span>
          </span>
        </div>
        <button
          type="button"
          onClick={signIn}
          className="rounded-full border border-[#342c42] bg-[#1f1a29] px-4 py-2 text-sm font-medium text-[#ece8f3] transition-colors hover:bg-[#2b2342]"
        >
          Sign in
        </button>
      </header>

      {/* Hero */}
      <main className="mx-auto grid max-w-6xl gap-10 px-6 pt-10 pb-16 lg:grid-cols-2 lg:items-center lg:pt-16">
        <section>
          <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-[#a49db4] uppercase">
            <Plane size={14} aria-hidden="true" /> Macro tracking for life on the go
          </p>
          <h1 className="font-display mt-5 text-5xl leading-[0.95] font-extrabold tracking-tight sm:text-6xl">
            Eat out.
            <br />
            Stay on track.
            <br />
            <span className="text-[#b9a6f5]">Anywhere.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-[#a49db4]">
            Restaurants are hard to track, and on a trip it&apos;s even harder to find something you can
            actually eat. Cadence finds meals near you that fit what&apos;s left of your macros, so one
            dinner out doesn&apos;t knock your whole week off course.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={signUp}
              className="inline-flex items-center gap-2 rounded-full bg-[#7357d6] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#5a3fb8]"
            >
              Get started <ArrowRight size={16} />
            </button>
            <button
              type="button"
              onClick={signIn}
              className="rounded-full border border-[#342c42] px-6 py-3 text-sm font-semibold text-[#ece8f3] transition-colors hover:bg-[#1f1a29]"
            >
              I have an account
            </button>
          </div>
        </section>

        {/* "Fits your day" example */}
        <section className="rounded-[2rem] bg-[#6d50cf] p-6 text-white sm:p-8" aria-label="Example: meals nearby compared with your remaining macros">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span>Left today</span>
            <span className="rounded-full bg-white px-2 py-0.5 text-[#6d50cf]">
              {DAY.eaten.toLocaleString()} / {DAY.target.toLocaleString()} kcal
            </span>
          </div>
          <dl className="mt-3 grid grid-cols-4 gap-2 text-center">
            {[
              ["kcal", LEFT.kcal],
              ["protein", `${LEFT.protein}g`],
              ["carbs", `${LEFT.carbs}g`],
              ["fat", `${LEFT.fat}g`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-white/15 px-2 py-2.5">
                <dd className="text-lg font-bold">{value}</dd>
                <dt className="text-[11px] text-white/75">{label}</dt>
              </div>
            ))}
          </dl>

          <p className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-white/80">
            <MapPin size={13} aria-hidden="true" /> Nearby
          </p>
          <ul className="mt-2 space-y-2">
            {MEALS.map(m => {
              const ok = fits(m);
              const badge = (visibility: string) => (
                <span
                  className={`${visibility} shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    ok ? "bg-[#6d50cf] text-white" : "bg-white/15 text-white"
                  }`}
                >
                  {ok ? <Check size={12} aria-hidden="true" /> : <X size={12} aria-hidden="true" />}
                  {ok ? "Fits your day" : `${m.kcal - LEFT.kcal} kcal over`}
                </span>
              );
              return (
                <li key={m.name} className={`rounded-xl p-3.5 ${ok ? "bg-white text-[#16131d]" : "bg-white/10 text-white"}`}>
                  <div className="flex items-start gap-3">
                    <img
                      src={m.image}
                      alt=""
                      loading="lazy"
                      className={`size-14 shrink-0 rounded-lg object-cover ${ok ? "" : "opacity-80"}`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className={`text-[11px] ${ok ? "text-[#6b6480]" : "text-white/70"}`}>{m.place}</p>
                      <p className="text-sm font-semibold">{m.name}</p>
                      <p className={`mt-1 text-xs ${ok ? "text-[#4a4458]" : "text-white/75"}`}>
                        {m.kcal} kcal · P {m.protein}g · C {m.carbs}g · F {m.fat}g
                      </p>
                      <div className="mt-2 sm:hidden">{badge("inline-flex")}</div>
                    </div>
                    {/* Badge sits top-right from sm up; on phones it drops under the macros (below). */}
                    {badge("hidden sm:inline-flex")}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </main>

      {/* Features */}
      <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-16 sm:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-[1.5rem] border border-[#342c42] bg-[#1f1a29] p-5">
            <Icon size={20} className="text-[#b9a6f5]" aria-hidden="true" />
            <p className="font-display mt-6 text-lg font-bold">{title}</p>
            <p className="mt-1 text-sm text-[#a49db4]">{body}</p>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="font-display text-2xl font-bold tracking-tight">How it works</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-3">
          {STEPS.map(s => (
            <li key={s.n} className="flex gap-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#2b2342] text-sm font-bold text-[#b9a6f5]">
                {s.n}
              </span>
              <div>
                <p className="font-semibold">{s.title}</p>
                <p className="mt-1 text-sm text-[#a49db4]">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <footer className="border-t border-[#342c42]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-sm text-[#a49db4]">
          <span>© Cadence</span>
          <span>Hit your macros, wherever you eat.</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

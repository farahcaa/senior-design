import { CalendarDays, MapPin, Target, UtensilsCrossed } from "lucide-react";
import useEasyAuth from "@/hooks/use-easy-auth";

/** Morning / afternoon / evening greeting from the browser's local time. */
function greeting(now = new Date()) {
  const h = now.getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

const MACROS = ["Calories", "Protein", "Carbs", "Fat"];

// Feature entry points. None are built yet, so they render as "coming soon" cards rather than
// links to pages that don't exist.
const FEATURES = [
  { icon: MapPin, title: "Find food nearby", body: "Restaurant meals around you that fit what's left today." },
  { icon: UtensilsCrossed, title: "Log a meal", body: "Add what you ate and watch your remaining macros update." },
  { icon: CalendarDays, title: "Plan a trip", body: "Line up meals for the days you're away." },
];

/**
 * Signed-in landing page at /app. Name comes from the OIDC ID token, so the page renders
 * instantly without waiting on the API.
 */
const Dashboard = () => {
  const { user } = useEasyAuth();
  // Sign-up stores a single "fullName" attribute (custom claim); fall back to the standard claims.
  const fullName = (user?.profile.fullName as string | undefined) ?? user?.profile.name;
  const firstName = user?.profile.given_name ?? fullName?.trim().split(/\s+/)[0];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold tracking-tight text-gray-900">
          {greeting()}
          {firstName ? `, ${firstName}` : ""}
        </h1>
        <p className="mt-1 text-sm text-gray-500">Here&apos;s where your day stands.</p>
      </header>

      {/* Today */}
      <section className="rounded-2xl border border-black/[0.07] bg-white p-5">
        <div className="flex items-center gap-2">
          <Target size={16} className="text-[#7357d6]" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-gray-900">Left today</h2>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {MACROS.map(label => (
            <div key={label} className="rounded-xl bg-gray-50 px-3 py-3">
              <dd className="text-xl font-bold text-gray-300">—</dd>
              <dt className="text-xs text-gray-500">{label}</dt>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm text-gray-500">
          No daily targets yet. Once you set your calories and macros, Cadence shows what&apos;s left here.
        </p>
      </section>

      {/* Features */}
      <section className="grid gap-4 sm:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex flex-col rounded-2xl border border-black/[0.07] bg-white p-5">
            <div className="flex items-start justify-between gap-2">
              <span className="grid size-9 place-items-center rounded-xl bg-[#7357d6]/10">
                <Icon size={18} className="text-[#7357d6]" aria-hidden="true" />
              </span>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
                Coming soon
              </span>
            </div>
            <p className="mt-4 font-semibold text-gray-900">{title}</p>
            <p className="mt-1 text-sm text-gray-500">{body}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Dashboard;

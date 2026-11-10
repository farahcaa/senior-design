/**
 * Minimal loader: a violet spinner and one line of text.
 *
 * Modes (same props as before, so existing callers keep working):
 * - default:   full-viewport, dark Cadence background (auth boot, before the app layout mounts)
 * - fitParent: fills the visible area inside the app layout, transparent
 * - inline:    flex-1 inside an already-sized flex parent, transparent
 * - overlay:   fixed on top of the page with a translucent scrim
 */
export default function Loading({
  text = "Loading...",
  overlay = false,
  fitParent = false,
  inline = false,
}: {
  text?: string;
  overlay?: boolean;
  fitParent?: boolean;
  inline?: boolean;
}) {
  const container = overlay
    ? "fixed inset-0 z-50 bg-[#16131d]/70 backdrop-blur-sm text-[#a49db4]"
    : inline
      ? "flex-1 text-gray-500"
      : fitParent
        ? "min-h-[calc(100dvh-9.5rem)] md:min-h-[calc(100dvh-6rem)] text-gray-500"
        : "min-h-[100dvh] bg-[#16131d] text-[#a49db4]";

  return (
    <div role="status" aria-live="polite" className={`flex flex-col items-center justify-center gap-3 px-6 ${container}`}>
      <span className="size-8 animate-spin rounded-full border-[3px] border-[#7357d6]/25 border-t-[#7357d6]" aria-hidden="true" />
      <p className="text-sm">{text}</p>
    </div>
  );
}

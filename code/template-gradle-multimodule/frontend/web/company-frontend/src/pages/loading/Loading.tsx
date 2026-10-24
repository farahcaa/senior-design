export default function Loading({
  text = "Loading...",
  overlay = false,
  fitParent = false,
  inline = false,
}: {
  text?: string;
  overlay?: boolean;
  // Fill the visible area inside the app layout's <main> (viewport minus topbar/bottom-nav) with a
  // transparent background so it sits flush on the page. min-h-full would collapse to 0 inside
  // unsized containers and min-h-screen overflows by the chrome height, so this uses the same
  // dvh-minus-chrome calc as other full-height in-layout screens. Leave false for standalone
  // full-page loaders (e.g. ProtectedRoute, before the layout mounts), which paint the app
  // background themselves and need the full viewport height.
  fitParent?: boolean;
  // Fill a flex PARENT that already supplies the height. Uses flex-1 with NO min-height of its own,
  // so it doesn't stack a second full-viewport block on top of the parent's height and force the
  // page to scroll. This is the right mode for any loader rendered as a child of an already-sized
  // flex-col container.
  inline?: boolean;
}) {
  return (
    <div
      className={
        overlay
          ? "fixed inset-0 z-50 flex items-center justify-center bg-[#F7FAF8]/88 px-6 backdrop-blur-sm"
          : inline
            ? "flex flex-1 items-center justify-center px-6"
            : fitParent
              ? "min-h-[calc(100dvh-9.5rem)] md:min-h-[calc(100dvh-6rem)] flex items-center justify-center px-6"
              : "min-h-[100dvh] bg-[#F7FAF8] flex items-center justify-center px-6"
      }
    >
      <div className="flex flex-col items-center">
        <div className="scene mb-5">
          <div className="card-loader">
            <div className="card-face card-front">
              <div className="w-full flex justify-center mb-3">
                <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-700">
                  Loading
                </span>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-3">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="w-8 h-8 object-contain"
                />
              </div>

              <p className="text-lg font-bold text-gray-900 mb-1 text-center">
                Welcome
              </p>

              <p className="text-xs text-gray-500 text-center">
                Getting everything ready
              </p>
            </div>

            <div className="card-face card-back">
              <div className="w-full flex justify-center mb-3">
                <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-blue-200 text-blue-700">
                  Loading
                </span>
              </div>

              <p className="text-lg font-bold text-gray-900 mb-1 text-center">
                Almost there
              </p>

              <p className="text-xs text-gray-500 text-center">Just a moment</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500 text-center">{text}</p>

        <style>{`
          .scene {
            perspective: 1200px;
          }

          .card-loader {
            position: relative;
            width: 240px;
            height: 160px;
            transform-style: preserve-3d;
            animation: cardFlip 2.8s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
          }

          .card-face {
            position: absolute;
            inset: 0;
            border-radius: 1rem;
            padding: 1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
          }

          .card-front {
            background: rgb(209 250 229);
          }

          .card-back {
            background: rgb(219 234 254);
            transform: rotateY(180deg);
          }

          @keyframes cardFlip {
            0% {
              transform: rotateY(0deg) scale(1);
            }
            12% {
              transform: rotateY(18deg) scale(1.01);
            }
            28% {
              transform: rotateY(92deg) scale(1.025);
            }
            50% {
              transform: rotateY(180deg) scale(1);
            }
            62% {
              transform: rotateY(198deg) scale(1.01);
            }
            78% {
              transform: rotateY(272deg) scale(1.025);
            }
            100% {
              transform: rotateY(360deg) scale(1);
            }
          }
        `}</style>
      </div>
    </div>
  );
}

import { useSearchParams, useNavigate } from "react-router";
import { CheckCircle, XCircle } from "lucide-react";

export default function CheckoutReturn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return (
      <div className="max-w-sm mx-auto">
        <div className="bg-white rounded-2xl border border-red-100 p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <XCircle className="text-red-500" size={28} />
          </div>
          <h2 className="text-base font-semibold text-gray-900 mb-1">
            Something went wrong
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            No checkout session was found. Please try again.
          </p>
          <button
            onClick={() => navigate("/account/upgrade")}
            className="w-full py-2.5 rounded-xl border border-black/[0.08] text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto">
      <div className="bg-white rounded-2xl border border-black/[0.07] p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle className="text-emerald-500" size={28} />
        </div>
        <h2 className="text-base font-semibold text-gray-900 mb-1">
          Thanks - we're confirming your subscription
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          We've received your payment and are activating your subscription. This
          can take a moment to reflect in your account.
        </p>
        <button
          onClick={() => navigate("/account")}
          className="w-full py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors"
        >
          Back to account
        </button>
      </div>
    </div>
  );
}

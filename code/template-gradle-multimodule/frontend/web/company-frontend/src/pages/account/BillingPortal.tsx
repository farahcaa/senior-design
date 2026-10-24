import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import useAuthenticatedClientConfig from "@/hooks/use-authenticated-client-config";
import { manageBilling } from "@/gen";

export default function BillingPortal() {
  const { client } = useAuthenticatedClientConfig();
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  useEffect(() => {
    manageBilling({ headers: client.headers })
      .then((res) => {
        const url = res.data?.url;
        if (!url) throw new Error("missing url");
        window.location.href = url;
      })
      .catch(() => setError(true));
  }, [client.headers]);

  return (
    <div className="max-w-lg mx-auto">
      <button
        onClick={() => navigate("/account")}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to account
      </button>

      {error ? (
        <div className="bg-white rounded-2xl border border-red-100 p-5 flex items-center gap-3">
          <AlertCircle size={18} className="text-red-500 shrink-0" />
          <p className="text-sm text-red-600">
            Could not open billing portal. Please try again later.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-black/[0.07] p-10 flex flex-col items-center gap-3 text-center">
          <Loader2 size={22} className="animate-spin text-violet-500" />
          <p className="text-sm font-medium text-gray-700">Opening billing portal…</p>
          <p className="text-xs text-gray-400">You'll be redirected to Stripe in a moment.</p>
        </div>
      )}
    </div>
  );
}

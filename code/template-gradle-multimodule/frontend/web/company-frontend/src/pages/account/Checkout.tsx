import { useCallback, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router";
import { AlertCircle, ArrowLeft } from "lucide-react";
import useAuthenticatedClientConfig from "@/hooks/use-authenticated-client-config";
import { createCheckoutSession } from "@/gen";

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const isStripeConfigured =
  Boolean(publishableKey) &&
  !publishableKey.includes("your-publishable-key") &&
  !publishableKey.includes("placeholder");
const stripePromise = isStripeConfigured ? loadStripe(publishableKey) : null;

export default function Checkout() {
  const [error, setError] = useState(false);
  const { client } = useAuthenticatedClientConfig();
  const navigate = useNavigate();

  const fetchClientSecret = useCallback(async (): Promise<string> => {
    try {
      const returnUrl = `${window.location.origin}/account/upgrade/return?session_id={CHECKOUT_SESSION_ID}`;
      const res = await createCheckoutSession({ returnUrl }, { headers: client.headers });
      const secret = res.data?.clientSecret;
      if (!secret) throw new Error("missing clientSecret");
      return secret;
    } catch {
      setError(true);
      throw new Error("checkout init failed");
    }
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

      {error || !isStripeConfigured ? (
        <div className="bg-white rounded-2xl border border-red-100 p-5 flex items-center gap-3">
          <AlertCircle size={18} className="text-red-500 shrink-0" />
          <p className="text-sm text-red-600">
            Could not start checkout. Please try again later.
          </p>
        </div>
      ) : (
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ fetchClientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      )}
    </div>
  );
}

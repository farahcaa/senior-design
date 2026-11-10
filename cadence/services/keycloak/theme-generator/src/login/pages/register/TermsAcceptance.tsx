/**
 * This file has been claimed for ownership from @oussemasahbeni/keycloakify-login-shadcn version 250004.0.15.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path "login/pages/register/TermsAcceptance.tsx" --revert
 */

import { FieldError } from "@/components/ui/field";
import type { KcContext } from "@/login/KcContext";
import { kcSanitize } from "@keycloakify/login-ui/kcSanitize";

// Cadence has no hosted Terms/Privacy pages yet. When it does, link them here (the realm's
// TERMS_AND_CONDITIONS required action is currently disabled, so this box is not shown).

/**
 * One checkbox under the sign-up fields: "I agree to the Terms and Privacy Policy" (links open in a
 * new tab). Shown because the realm's registration flow has its Terms and conditions step on, which
 * records the agreement at sign-up, so there's no separate Terms screen after.
 */
export function TermsAcceptance(props: {
    messagesPerField: Pick<KcContext["messagesPerField"], "existsError" | "get">;
    areTermsAccepted: boolean;
    onAreTermsAcceptedValueChange: (areTermsAccepted: boolean) => void;
}) {
    const { messagesPerField, areTermsAccepted, onAreTermsAcceptedValueChange } = props;

    return (
        <div className="space-y-1.5">
            <label htmlFor="termsAccepted" className="flex cursor-pointer items-start gap-2.5 text-sm">
                <input
                    type="checkbox"
                    id="termsAccepted"
                    name="termsAccepted"
                    checked={areTermsAccepted}
                    onChange={e => onAreTermsAcceptedValueChange(e.target.checked)}
                    aria-invalid={messagesPerField.existsError("termsAccepted")}
                    className="mt-0.5 size-4 shrink-0 cursor-pointer accent-[var(--primary)]"
                />
                <span>
                    I agree to the Cadence Terms and Privacy Policy
                </span>
            </label>

            {messagesPerField.existsError("termsAccepted") && (
                <FieldError id="input-error-terms-accepted">
                    <span
                        dangerouslySetInnerHTML={{
                            __html: kcSanitize(messagesPerField.get("termsAccepted"))
                        }}
                    />
                </FieldError>
            )}
        </div>
    );
}

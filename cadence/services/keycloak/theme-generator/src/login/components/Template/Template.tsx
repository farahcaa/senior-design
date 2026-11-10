/**
 * WARNING: Before modifying this file, run the following command:
 *
 * $ npx keycloakify own --path "login/components/Template/Template.tsx"
 *
 * This file is provided by @oussemasahbeni/keycloakify-login-shadcn version 250004.0.15.
 * It was copied into your repository by the postinstall script: `keycloakify sync-extensions`.
 */

/* eslint-disable */

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirectUrlOrigin } from "@/login/shared/redirectUrlOrigin";
import { kcSanitize } from "@keycloakify/login-ui/kcSanitize";
import { useKcClsx } from "@keycloakify/login-ui/useKcClsx";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { RotateCcw } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";

import { useI18n } from "../../i18n";
import { useKcContext } from "../../KcContext";
import companylogo from "./../../assets/img/cadence-mark.svg";
import { useInitializeTemplate } from "./useInitializeTemplate";
import { IoArrowBackOutline } from "react-icons/io5";
import LoginSidepanel from "./LoginSidepanel";


export function Template(props: {
  displayInfo?: boolean;
  displayMessage?: boolean;
  displayRequiredFields?: boolean;
  headerNode: ReactNode;
  socialProvidersNode?: ReactNode;
  infoNode?: ReactNode;
  documentTitle?: string;
  bodyClassName?: string;
  children: ReactNode;
}) {
  const {
    displayInfo = false,
    displayMessage = true,
    displayRequiredFields = false,
    headerNode,
    socialProvidersNode = null,
    infoNode = null,
    documentTitle,
    bodyClassName,
    children,
  } = props;

  const { kcContext } = useKcContext();

  const { auth, url, message, isAppInitiatedAction } = kcContext;

  const { msg, msgStr } = useI18n();

  const { kcClsx } = useKcClsx();

  useEffect(() => {
    document.title =
      documentTitle ??
      msgStr("loginTitle", kcContext.realm.displayName || kcContext.realm.name);
  }, []);

  useSetClassName({
    qualifiedName: "html",
    className: kcClsx("kcHtmlClass"),
  });

  useSetClassName({
    qualifiedName: "body",
    className: bodyClassName ?? kcClsx("kcBodyClass"),
  });

  const { isReadyToRender } = useInitializeTemplate();

  if (!isReadyToRender) {
    return null;
  }

  return (
    // At least one screen tall; the page scrolls only when the form is taller than the window (a
    // short phone like the iPhone SE, or registration on a small laptop).
    <div className="grid min-h-dvh bg-background lg:grid-cols-2">
      {/* Main content */}
      <div className="relative flex min-h-0 flex-col gap-4 px-0 pt-0 pb-8 text-foreground lg:p-6 lg:pt-10">
        {/*  navigation */}
        <div className="absolute top-4 left-4 lg:left-4  z-20 flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            asChild
            className="rounded-full border-border bg-card/90 text-muted-foreground shadow-sm hover:bg-brand-soft hover:text-brand-light"
          >
            <a href={kcContext.client.baseUrl ?? redirectUrlOrigin}>
              <IoArrowBackOutline />
            </a>
          </Button>

          {/* {enabledLanguages.length > 1 && <Languages />}

                    {kcContext.darkMode !== false && <ModeToggle />} */}
        </div>

        {/* Mobile header with logo */}
        <div className=" relative pt-8 px-6">
          {/* Logo and welcome message */}
          <div className="flex flex-col items-center justify-center gap-3 mt-4">
            <div className="mb-4 flex items-center gap-3">
              <img src={companylogo} alt="" className="size-12 rounded-xl" />
              <span className="font-display text-2xl font-bold tracking-tight">
                Cadence<span className="text-brand-light">.</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 items-start justify-center lg:mt-0">
          <div className="w-full max-w-xl ">
            <Card className="shadow-none bg-transparent lg:flex lg:min-h-[540px] lg:flex-col lg:bg-card lg:border-border border-0 lg:rounded-[2rem] lg:border lg:shadow-sm rounded-t-2xl">
              <CardHeader className="text-center">
                <CardTitle>
                  {(() => {
                    const node = !(
                      auth !== undefined &&
                      auth.showUsername &&
                      !auth.showResetCredentials
                    ) ? (
                      <h1 className="text-xl">{headerNode}</h1>
                    ) : (
                      <div
                        id="kc-username"
                        className="flex items-center justify-center gap-2"
                      >
                        <label
                          className="font-semibold text-lg"
                          id="kc-attempted-username"
                        >
                          {auth.attemptedUsername}
                        </label>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" size="icon" asChild>
                                <a
                                  id="reset-login"
                                  href={url.loginRestartFlowUrl}
                                  aria-label={msgStr("restartLoginTooltip")}
                                >
                                  <RotateCcw className="h-4 w-4" />
                                </a>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{msg("restartLoginTooltip")}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    );

                    if (displayRequiredFields) {
                      return (
                        <div className="flex items-center justify-between gap-2">
                          <div>{node}</div>
                          <div>
                            <span className="subtitle">
                              <span className="text-red-500">*</span>
                              {msg("requiredFields")}
                            </span>
                          </div>
                        </div>
                      );
                    }

                    return node;
                  })()}
                </CardTitle>
              </CardHeader>
              <CardContent className="lg:flex-1">
                <div id="kc-content">
                  <div id="kc-content-wrapper">
                    {displayMessage &&
                      message !== undefined &&
                      (message.type !== "warning" || !isAppInitiatedAction) && (
                        <Alert variant={message.type} className="my-3">
                          <AlertDescription>
                            <div>
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: kcSanitize(message.summary),
                                }}
                              />
                            </div>
                          </AlertDescription>
                        </Alert>
                      )}

                    <div className="children">{children}</div>
                    {socialProvidersNode}
                    {auth !== undefined && auth.showTryAnotherWayLink && (
                      <form
                        id="kc-select-try-another-way-form"
                        action={url.loginAction}
                        method="post"
                      >
                        <div className={kcClsx("kcFormGroupClass")}>
                          <input
                            type="hidden"
                            name="tryAnotherWay"
                            value="on"
                          />
                          <a
                            href="#"
                            id="try-another-way"
                            onClick={(event) => {
                              document.forms[
                                "kc-select-try-another-way-form" as never
                              ].submit();
                              event.preventDefault();
                              return false;
                            }}
                          >
                            {msg("doTryAnotherWay")}
                          </a>
                        </div>
                      </form>
                    )}
                    {displayInfo && (
                      <div className="text-center text-sm mt-4">{infoNode}</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <LoginSidepanel />
    </div>
  );
}

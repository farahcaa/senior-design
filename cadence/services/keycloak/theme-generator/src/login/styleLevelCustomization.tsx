/**
 * This file has been claimed for ownership from @oussemasahbeni/keycloakify-login-shadcn version 250004.0.15.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path "login/styleLevelCustomization.tsx" --revert
 */

import { ThemeProvider } from "@/components/theme-provider";
import type { ClassKey } from "@keycloakify/login-ui/useKcClsx";
import type { ReactNode } from "react";
import "./index.css";

type Classes = { [key in ClassKey]?: string };

type StyleLevelCustomization = {
    doUseDefaultCss: boolean;
    classes?: Classes;
    loadCustomStylesheet?: () => void;
    Provider?: (props: { children: ReactNode }) => ReactNode;
};

// eslint-disable-next-line react-refresh/only-export-components
function Provider(props: { children: ReactNode }) {
    const { children } = props;

    // Cadence login is always dark (purple-grey). Forcing it here means no OS preference or
    // stale localStorage["isDarkMode"] can flip it to a light palette.
    return <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>;
}

export function useStyleLevelCustomization(): StyleLevelCustomization {
    return {
        doUseDefaultCss: false,
        Provider
    };
}

import {
    ThemeProvider as MuiThemeProvider,
    Theme,
    createTheme,
    PaletteColorOptions,
} from "@material-ui/core/styles";
import React from "react";

type ThemeType = "dark" | "light";

const DEFAULT_THEME_TYPE: ThemeType = "dark";
const LIGHT_THEME: Theme = createTheme({
    palette: { mode: "light", danger: { main: "rgb(255,62,62)" } },
});
const DARK_THEME: Theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "rgb(114,137,218)",
        },
        background: {
            default: "rgb(35,39,42)",
            paper: "rgb(44,47,51)",
        },
        danger: {
            main: "rgb(255,62,62)",
        },
    },
});

export interface ThemeActions {
    toggleTheme(): void;
}

export interface ThemeProviderProps {
    readonly children: React.ReactNode;
}

const ThemeActionsCtx: React.Context<ThemeActions> = React.createContext<ThemeActions>({
    toggleTheme() {},
});

function nextType(type: ThemeType): ThemeType {
    if (type === "dark") {
        return "light";
    } else {
        return "dark";
    }
}

export function useThemeToggle(): () => void {
    return React.useContext(ThemeActionsCtx).toggleTheme;
}

export function ThemeProvider(props: ThemeProviderProps) {
    const [themeType, setThemeType] = React.useState<ThemeType>(DEFAULT_THEME_TYPE);

    const actions: ThemeActions = React.useMemo(
        () => ({
            toggleTheme() {
                setThemeType(nextType);
            },
        }),
        [],
    );

    const theme = themeType === "dark" ? DARK_THEME : LIGHT_THEME;
    console.log(themeType, theme);

    return (
        <ThemeActionsCtx.Provider value={actions}>
            <MuiThemeProvider theme={theme}>{props.children}</MuiThemeProvider>
        </ThemeActionsCtx.Provider>
    );
}

declare module "@material-ui/core/styles" {
    interface PaletteOptions {
        danger: PaletteColorOptions;
    }
    interface Pallete {
        danger: PaletteColorOptions;
    }
}
declare module "@material-ui/core/Button" {
    interface ButtonPropsColorOverrides {
        danger: true;
    }
}
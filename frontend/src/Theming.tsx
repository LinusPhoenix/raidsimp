import {
    ThemeProvider as MuiThemeProvider,
    Theme,
    createTheme,
    PaletteColorOptions,
} from "@mui/material/styles";
import React from "react";

type ThemeType = "dark" | "light";

const LIGHT_THEME: Theme = createTheme({
    palette: {
        mode: "light",
        danger: {
            main: "rgb(255,62,62)",
        },
    },
    components: {
        MuiFormControl: {
            defaultProps: {
                variant: "standard",
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: "standard",
            },
        },
    },
});
const DARK_THEME: Theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#64B5F6",
        },
        background: {
            default: "#15191a",
            paper: "#252729",
        },
        secondary: {
            main: "#F5C13C",
        },
        danger: {
            main: "rgb(255,62,62)",
            //contrastText: "#000"
        },
        warning: {
            main: "#ff5722",
        },
        error: {
            main: "#ef2813",
        },
        divider: "rgba(255,255,255,0.46)",
    },
    components: {
        MuiButton: {
            defaultProps: {
                size: "small",
            },
        },
        MuiButtonGroup: {
            defaultProps: {
                size: "small",
            },
        },
        MuiCheckbox: {
            defaultProps: {
                size: "small",
            },
        },
        MuiFab: {
            defaultProps: {
                size: "small",
            },
        },
        MuiFormControl: {
            defaultProps: {
                margin: "dense",
                size: "small",
            },
        },
        MuiFormHelperText: {
            defaultProps: {
                margin: "dense",
            },
        },
        MuiIconButton: {
            defaultProps: {
                size: "small",
            },
        },
        MuiInputBase: {
            defaultProps: {
                margin: "dense",
            },
        },
        MuiInputLabel: {
            defaultProps: {
                margin: "dense",
            },
        },
        MuiRadio: {
            defaultProps: {
                size: "small",
            },
        },
        MuiSwitch: {
            defaultProps: {
                size: "small",
            },
        },
        MuiTextField: {
            defaultProps: {
                margin: "dense",
                size: "small",
            },
        },
        MuiAppBar: {
            defaultProps: {
                color: "default",
            },
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
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    toggleTheme() {},
});

function asThemeType(t: unknown): ThemeType {
    switch (t) {
        case "light":
        case "dark":
            return t;
        default:
            return "dark";
    }
}

function nextType(t: ThemeType): ThemeType {
    if (t === "light") {
        return "dark";
    } else {
        return "light";
    }
}

export function useThemeToggle(): () => void {
    return React.useContext(ThemeActionsCtx).toggleTheme;
}

const LOCAL_STORAGE_KEY = "theme type";

function getLocalStorage(key: string): string | null {
    try {
        return localStorage.getItem(key);
    } catch (ex) {
        console.error("retrieving value for '" + key + "' from localStorage.");
        return null;
    }
}

const enableMultiTheme = process.env.NODE_ENV === "development";
export function ThemeProvider(props: ThemeProviderProps) {
    const [themeType, setThemeType] = React.useState<ThemeType>(() =>
        asThemeType(getLocalStorage(LOCAL_STORAGE_KEY)),
    );
    const actions: ThemeActions = React.useMemo(
        () => ({
            toggleTheme() {
                if (enableMultiTheme) {
                    const next = nextType(themeType);
                    setThemeType(next);
                    localStorage.setItem(LOCAL_STORAGE_KEY, next);
                }
            },
        }),
        [themeType, setThemeType],
    );

    const theme = themeType === "light" && enableMultiTheme ? LIGHT_THEME : DARK_THEME;

    return (
        <ThemeActionsCtx.Provider value={actions}>
            <MuiThemeProvider theme={theme}>{props.children}</MuiThemeProvider>
        </ThemeActionsCtx.Provider>
    );
}

declare module "@mui/material/styles" {
    interface PaletteOptions {
        danger: PaletteColorOptions;
    }
    interface Pallete {
        danger: PaletteColorOptions;
    }
}
declare module "@mui/material/Button" {
    interface ButtonPropsColorOverrides {
        danger: true;
    }
}

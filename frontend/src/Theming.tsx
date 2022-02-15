import {
    ThemeProvider as MuiThemeProvider,
    Theme,
    createTheme,
    PaletteColorOptions,
} from "@material-ui/core/styles";
import React from "react";

type ThemeType = "dark" | "light";

const LIGHT_THEME: Theme = createTheme({
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
            }
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

export interface ThemeActions {
    toggleTheme(): void;
}

export interface ThemeProviderProps {
    readonly children: React.ReactNode;
}

const ThemeActionsCtx: React.Context<ThemeActions> = React.createContext<ThemeActions>({
    toggleTheme() {},
});

function asThemeType(t: unknown): ThemeType {
    // defaults to dark
    if (t === "light") {
        return "light";
    } else {
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

const LOCAL_STORAGE_KEY: string = "theme type";

function getLocalStorage(key: string): string | null {
    try {
        return localStorage.getItem(key)
    } catch (ex) {
        console.error("retrieving value for '" + key + "' from localStorage.")
        return null
    }
}

export function ThemeProvider(props: ThemeProviderProps) {
    const [themeType, setThemeType] = React.useState<ThemeType>(
        () => asThemeType(getLocalStorage(LOCAL_STORAGE_KEY))
    );
    const actions: ThemeActions = React.useMemo(
        () => ({
            toggleTheme() {
                console.log("setting", LOCAL_STORAGE_KEY)
                const next = nextType(themeType);
                setThemeType(next);
                localStorage.setItem(LOCAL_STORAGE_KEY, next);
            },
        }),
        [themeType, setThemeType],
    );

    const theme = themeType === "light" ? LIGHT_THEME : DARK_THEME;

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

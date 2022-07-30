import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider } from "./Theming";
import { UserInfoProvider } from "./components/UserInfoContext";
import { PromiseProvider } from "./utility";
import { ErrorBoundary } from "./components/ErrorBoundary";

const container = document.getElementById("root");
// Using the non-null assertion here is a recommended practice by React.
// See https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(
    <React.StrictMode>
        <ThemeProvider>
            <PromiseProvider>
                <UserInfoProvider>
                    <ErrorBoundary>
                        <App />
                    </ErrorBoundary>
                </UserInfoProvider>
            </PromiseProvider>
        </ThemeProvider>
    </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals((x) => {
    console.debug("[performance]", x.name, Math.round(x.value), "ms");
});

declare global {
    export interface GlobalFetch {
        fetch(input: RequestInfo, init?: RequestInit): Promise<Response>;
    }
}

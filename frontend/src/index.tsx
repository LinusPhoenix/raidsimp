import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider } from "./Theming";
import { UserInfoProvider } from "./components/UserInfoContext";
import { PromiseProvider } from "./utility";

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider>
            <PromiseProvider>
                <UserInfoProvider>
                    <App />
                </UserInfoProvider>
            </PromiseProvider>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById("root"),
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

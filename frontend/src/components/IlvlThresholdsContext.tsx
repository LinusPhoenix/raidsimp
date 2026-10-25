import React from "react";
import { IlvlThresholdsApi } from "../server";
import { IlvlThreshold } from "../utility/color-helper";
import { serverRequestThrows } from "../utility";

// Empty until the thresholds are loaded, or if loading them fails. Item levels are then
// displayed in the normal text color.
const NO_THRESHOLDS: readonly IlvlThreshold[] = [];

const IlvlThresholdsContext = React.createContext<readonly IlvlThreshold[]>(NO_THRESHOLDS);

const ReloadIlvlThresholdsContext = React.createContext<() => void>(() => undefined);

export function IlvlThresholdsProvider(props: { children: React.ReactNode }) {
    const [thresholds, setThresholds] = React.useState<readonly IlvlThreshold[]>(NO_THRESHOLDS);

    const reload = React.useCallback(() => {
        serverRequestThrows((cfg) => new IlvlThresholdsApi(cfg).ilvlThresholdsControllerGetAll())
            .then((result) => {
                if (result.length > 0) {
                    setThresholds([...result].sort((a, b) => a.ilvl - b.ilvl));
                }
            })
            .catch((err) => console.error("Failed to load ilvl thresholds", err));
    }, []);

    React.useEffect(reload, [reload]);

    return (
        <ReloadIlvlThresholdsContext.Provider value={reload}>
            <IlvlThresholdsContext.Provider value={thresholds}>
                {props.children}
            </IlvlThresholdsContext.Provider>
        </ReloadIlvlThresholdsContext.Provider>
    );
}

export function useReloadIlvlThresholds(): () => void {
    return React.useContext(ReloadIlvlThresholdsContext);
}

export function useIlvlThresholds(): readonly IlvlThreshold[] {
    return React.useContext(IlvlThresholdsContext);
}

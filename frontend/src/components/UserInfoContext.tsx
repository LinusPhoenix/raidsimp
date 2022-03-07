import React from "react";
import { UsersApi } from "../server";
import { User } from "../server/models/User";
import { serverRequest, ServerResult } from "../utility";

function getCurrentUser(): Promise<ServerResult<User>> {
    return serverRequest((cfg) => new UsersApi(cfg).usersControllerGetUserInfo());
}

export type UserInfoState =
    | Readonly<{ type: "uninitialized" }>
    | Readonly<{ type: "loading"; promise: Promise<ServerResult<User>> }>
    | Readonly<{ type: "loaded"; data: User | null }>
    | Readonly<{ type: "failed"; status: number | null }>;

interface State {
    readonly generation: number;
    readonly userInfo: UserInfoState;
}

const DEFAULT_STATE: State = { generation: 1, userInfo: { type: "uninitialized" } };

type Action =
    | Readonly<{ type: "reload" }>
    | Readonly<{ type: "loading"; generation: number; promise: Promise<ServerResult<User>> }>
    | Readonly<{ type: "loaded"; generation: number; data: ServerResult<User> }>;

function update(state: State, action: Action): State {
    switch (action.type) {
        case "reload":
            return { generation: state.generation + 1, userInfo: DEFAULT_STATE.userInfo };
        case "loading":
            if (state.userInfo.type !== "uninitialized") {
                return state;
            } else {
                return {
                    generation: state.generation,
                    userInfo: { type: "loading", promise: action.promise },
                };
            }
        case "loaded":
            if (action.generation !== state.generation) {
                return state;
            } else if (action.data.isOk) {
                return {
                    generation: state.generation,
                    userInfo: { type: "loaded", data: action.data.body },
                };
            } else {
                return {
                    generation: state.generation,
                    userInfo: {
                        type: "failed",
                        status: action.data.status,
                    },
                };
            }
    }
}

const UserInfoContext = React.createContext<UserInfoState>(DEFAULT_STATE.userInfo);

export interface UserInfoActions {
    reload(): void;
}

const UserInfoActionsContext = React.createContext<UserInfoActions>({
    reload() {
        throw new Error("Context not initialized");
    },
});

export function UserInfoProvider(props: { children: React.ReactNode }) {
    const [state, dispatch] = React.useReducer(update, DEFAULT_STATE);

    React.useEffect(() => {
        const promise = getCurrentUser();
        dispatch({ type: "loading", generation: state.generation, promise });
        promise.then((data) => {
            dispatch({ type: "loaded", generation: state.generation, data });
        });
    }, [state.generation]);

    const actionsObj = React.useMemo<UserInfoActions>(
        () => ({
            reload() {
                dispatch({ type: "reload" });
            },
        }),
        [dispatch],
    );

    return (
        <UserInfoActionsContext.Provider value={actionsObj}>
            <UserInfoContext.Provider value={state.userInfo}>
                {props.children}
            </UserInfoContext.Provider>
        </UserInfoActionsContext.Provider>
    );
}

export function useUserInfo(): UserInfoState {
    return React.useContext(UserInfoContext);
}

export function useUserInfoActions(): UserInfoActions {
    return React.useContext(UserInfoActionsContext);
}

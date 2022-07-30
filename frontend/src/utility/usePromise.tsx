import { useCallback, useRef, createContext, useContext, ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useChangeEffect } from "./useChangeEffect";
import { useForceRender } from "./useForceRender";

enum ResourceVar {
    Uninitialized,
    Loading,
    Ok,
    Error,
}

type Resource<A> =
    | Readonly<{ variant: ResourceVar.Uninitialized }>
    | Readonly<{ variant: ResourceVar.Loading; promise: Promise<void> }>
    | Readonly<{ variant: ResourceVar.Ok; data: A }>
    | Readonly<{ variant: ResourceVar.Error; error: unknown }>;

const DEFAULT_DATA = { variant: ResourceVar.Uninitialized } as const;

export interface Data<A> {
    readonly data: A;
    readonly reload: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PromiseContext extends Record<string, Resource<any>> {}

const PromiseContext = createContext<PromiseContext>({});

export interface PromiseProviderProps {
    readonly children: ReactNode;
}

export function PromiseProvider({ children }: PromiseProviderProps) {
    return <PromiseContext.Provider value={{}}>{children}</PromiseContext.Provider>;
}

export function usePromise<A>(
    uniqueKey: string,
    f: () => Promise<A>,
    deps: readonly unknown[],
): Data<A> {
    const ctx = useContext(PromiseContext);
    const dataRef = useRef<Resource<A>>(ctx[uniqueKey] ?? DEFAULT_DATA);

    const force = useForceRender();
    const reload = useCallback(() => {
        dataRef.current = ctx[uniqueKey] = { variant: ResourceVar.Uninitialized };
        force();
    }, [dataRef, ctx, uniqueKey]);

    useChangeEffect(reload, deps);

    // The client app does not have enough information to perform longer-duration caching.
    // Data on a previously-loaded page might be mutated from the current page, so if we 
    // were to keep that previously-loaded page in the cache, it would display the wrong
    // data when we go back to it. The data could also be mutated by a different user, in 
    // which case we have absolutely no way to know that it needs to be reloaded.
    // 
    // Hence why we clear the cache every time we switch pages.
    const loc = useLocation();
    useEffect(() => {
        for (const key in ctx) {
            ctx[key] = { variant: ResourceVar.Uninitialized };
        }
    }, [loc.pathname]);

    switch (dataRef.current.variant) {
        case ResourceVar.Uninitialized:
            const promise = f()
                .then((data) => {
                    if (dataRef.current.variant === ResourceVar.Loading) {
                        dataRef.current = ctx[uniqueKey] = { variant: ResourceVar.Ok, data };
                    }
                })
                .catch((error) => {
                    if (dataRef.current.variant === ResourceVar.Loading) {
                        dataRef.current = ctx[uniqueKey] = { variant: ResourceVar.Error, error };
                    }
                });
            dataRef.current = ctx[uniqueKey] = { variant: ResourceVar.Loading, promise };
            throw dataRef.current.promise;
        case ResourceVar.Loading:
            throw dataRef.current.promise;
        case ResourceVar.Ok:
            return {
                data: dataRef.current.data,
                reload,
            };
        case ResourceVar.Error:
            throw dataRef.current.error;
    }
}

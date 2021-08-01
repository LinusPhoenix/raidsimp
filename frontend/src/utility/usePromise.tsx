import { useCallback, useLayoutEffect, useRef, createContext, useContext, ReactNode } from "react";
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
    const forceRender = useForceRender();
    const ctx = useContext(PromiseContext);
    const dataRef = useRef<Resource<A>>(ctx[uniqueKey] ?? DEFAULT_DATA);

    const reload = useCallback(() => {
        dataRef.current = ctx[uniqueKey] = { variant: ResourceVar.Uninitialized };
        forceRender();
    }, [dataRef, forceRender, ctx, uniqueKey]);

    useLayoutEffect(reload, deps); // eslint-disable-line react-hooks/exhaustive-deps

    switch (dataRef.current.variant) {
        case ResourceVar.Uninitialized:
            const promise = f().then((x) => {
                if (dataRef.current.variant === ResourceVar.Loading) {
                    dataRef.current = ctx[uniqueKey] = { variant: ResourceVar.Ok, data: x };
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

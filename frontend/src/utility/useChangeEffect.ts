import { DependencyList, EffectCallback, useEffect, useRef } from "react";

/**
 * Run the effect _only_ when the dependencies change.
 *
 * Similary to React's `useEffect`, except it doesn't run the effect on first render.
 */
export function useChangeEffect(effect: EffectCallback, deps: DependencyList): void {
    const isFirstRef = useRef(true);

    useEffect(() => {
        if (isFirstRef.current) {
            isFirstRef.current = false;
            return;
        }
        effect();
    }, deps);
}

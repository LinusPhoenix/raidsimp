import { useEffect, useRef } from "react";

// assuming that `deps` changes for every render:
//   ms      = 3 dashes
//   render  = -x--x-xxx-----x->
//   effects = -x---x---x----x->
 export function useThrottledPlus(
     ms: number,
     f: () => void,
     deps: readonly unknown[],
): void {
    const prevT = useRef(-ms);
    const timeout = useRef<NodeJS.Timeout | null>(null);

    function run() {
        const now = performance.now();
        if (timeout.current != null){
            clearTimeout(timeout.current);
        }
        const minNextT = prevT.current + ms;
        if (now >= minNextT) {
            prevT.current = now;
            f();
        } else {
            const delay = Math.min(minNextT - now);
            timeout.current = setTimeout(run, delay);
        }
    }

    useEffect(run, deps);
}

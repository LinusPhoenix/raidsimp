import { useState, useCallback } from "react";

export function useForceRender(): () => void {
    const update = useState(0)[1];
    return useCallback(() => {
        update((n) => n + 1);
    }, [update]);
}

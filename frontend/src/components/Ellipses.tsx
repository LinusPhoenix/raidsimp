import * as React from "react";

export const Ellipses = React.memo(function Ellipses() {
    const [n, incr] = React.useReducer((n: number) => n + 1, 0)
    
    React.useEffect(() => {
        const id = setInterval(incr, 300);
        return () => clearInterval(id);
    }, []);

    const dotCount = n % 3 + 1;
    const nbspCount = 3 - dotCount;
    const dots = ".".repeat(dotCount) + "&nbsp;".repeat(nbspCount);
    return <span dangerouslySetInnerHTML={{ __html: dots }} />
});

import { render, waitFor } from "@testing-library/react";
import { Suspense } from "react";
import { PromiseProvider, usePromise } from "./usePromise";

test("allows multiple promises, given they have different keys", async () => {
    function ImmediateResolve({ n }: { n: number }) {
        const x = usePromise("test " + n, () => Promise.resolve(n), [n]);
        return <div>n={x.data}</div>;
    }

    const { getByText } = render(
        <PromiseProvider>
            <Suspense fallback={"loading..."}>
                <ImmediateResolve n={3} />
                <ImmediateResolve n={2} />
            </Suspense>
        </PromiseProvider>,
    );

    const textElem1 = await waitFor(() => getByText("n=3"));
    expect(textElem1).toBeInTheDocument();

    const textElem2 = await waitFor(() => getByText("n=2"));
    expect(textElem2).toBeInTheDocument();
});

test("updates when dependencies change", async () => {
    function ImmediateResolve({ n }: { n: number }) {
        const x = usePromise("test", () => Promise.resolve(n), [n]);
        return <div>n={x.data}</div>;
    }

    function Test({ n }: { n: number }) {
        return (
            <PromiseProvider>
                <Suspense fallback={"loading..."}>
                    <ImmediateResolve n={n} />
                </Suspense>
            </PromiseProvider>
        );
    }

    const { getByText, rerender } = render(<Test n={3} />);

    const textElem1 = await waitFor(() => getByText("n=3"));
    expect(textElem1).toBeInTheDocument();

    rerender(<Test n={4} />);

    const textElem2 = await waitFor(() => getByText("n=4"));
    expect(textElem2).toBeInTheDocument();
});

import { Container, Typography, Stack, Button } from "@mui/material";
import { Refresh } from "@mui/icons-material";
import React, { ErrorInfo } from "react";
import { ServerRequestError } from "../utility";

interface Props {
    readonly children: React.ReactNode;
    readonly errorComponent?: (error: unknown) => React.ReactNode;
}

interface State {
    readonly error: [] | [unknown];
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { error: [] };
    }

    static getDerivedStateFromError(error: unknown): State {
        console.warn(error);
        return { error: [error] };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error(error, errorInfo);
    }

    render(): React.ReactNode {
        if (this.state.error.length === 0) {
            return this.props.children;
        }
        const [error] = this.state.error;
        if (this.props.errorComponent) {
            return this.props.errorComponent(error);
        }
        if (error instanceof ServerRequestError) {
            return <ServerRequestErrorView error={error} />;
        }
        return <GenericErrorView />;
    }
}

interface ServerRequestErrorViewProps {
    readonly error: ServerRequestError;
}

function ServerRequestErrorView({ error }: ServerRequestErrorViewProps) {
    const reload = () => location.reload();
    return (
        <Container maxWidth="xl">
            <Typography paragraph variant="h5">
                Failed to load data from the server
            </Typography>
            <Stack sx={{ mt: 4 }}>
                {error.genericErrors.map((x, i) => (
                    <Typography key={i} paragraph>
                        {x}
                    </Typography>
                ))}
                {error.fieldErrors.map((x, i) => (
                    <Typography key={"f" + i} paragraph>
                        {x.field}: {x.message}
                    </Typography>
                ))}
            </Stack>
            <Button
                sx={{ mt: 4 }}
                variant="outlined"
                color="secondary"
                size="large"
                onClick={reload}
            >
                <Refresh />
                &nbsp;Reload
            </Button>
        </Container>
    );
}

function GenericErrorView() {
    const reload = () => location.reload();
    return (
        <Container maxWidth="xl">
            <Typography paragraph variant="h5">
                Unexpected Error
            </Typography>
            <Typography paragraph sx={{ mt: 4 }}>
                If the normal reload function doesn't fix the problem, you can try force-reloading
                the page (<b>CTRL-R</b> or <b>CTRL-F5</b>).
            </Typography>
            <Button
                sx={{ mt: 4 }}
                variant="outlined"
                color="secondary"
                size="large"
                onClick={reload}
            >
                <Refresh />
                &nbsp;Reload
            </Button>
        </Container>
    );
}

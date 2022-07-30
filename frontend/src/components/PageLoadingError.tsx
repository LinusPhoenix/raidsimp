import React from "react";
import { ResultErr } from "../utility/server";
import { Box, Container, Typography, Stack, Button } from "@mui/material";

export interface PageLoadingErrorProps {
    readonly error: ResultErr;
    readonly reload: () => void;
}

export function PageLoadingError({ error, reload }: PageLoadingErrorProps) {
    return (
        <Container maxWidth="xl">
            <Typography variant="h5">Failed to load</Typography>
            <Box my={2} />
            <Stack>
                {error.genericErrors.map((x, i) => (
                    <Typography key={i}>{x}</Typography>
                ))}
                {error.fieldErrors.map((x, i) => (
                    <Typography key={"f" + i}>
                        {x.field}: {x.message}
                    </Typography>
                ))}
            </Stack>
            <Box my={3} />
            <Button variant="outlined" color="secondary" onClick={reload}>
                Try again
            </Button>
        </Container>
    );
}

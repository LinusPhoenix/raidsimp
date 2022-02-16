import React from "react";
import { Container, Typography } from "@material-ui/core";
import { Helmet } from "react-helmet";

export function NotFoundPage() {
    return (
        <Container maxWidth="lg">
            <Helmet>
                <title>Page Not Found - RaidSIMP</title>
            </Helmet>
            <Typography variant="h6">Page not found</Typography>
        </Container>
    );
}

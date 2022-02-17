import { Button, Container, Stack, Typography } from "@material-ui/core";
import { Helmet } from "react-helmet";
import * as Routes from "./routes";

export function NotFoundPage() {
    return (
        <Container maxWidth="xs">
            <Helmet>
                <title>Page Not Found - RaidSIMP</title>
            </Helmet>
            <Stack alignItems={"center"}>
                <Typography variant="h4" sx={{ mb: 2 }} align="center">
                    Page not found
                </Typography>
                <Button
                    size="medium"
                    style={{ width: "200px", height: "50px" }}
                    variant="contained"
                    href={Routes.home()}
                >
                    <Typography>Go to Home</Typography>
                </Button>
            </Stack>
        </Container>
    );
}

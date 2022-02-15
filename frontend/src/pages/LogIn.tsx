import { Button, Container, Typography, Stack } from "@material-ui/core";
import { Helmet } from "react-helmet";

export function LogInPage() {
    return (
        <>
            <Helmet>
                <title>Login - RaidSIMP</title>
            </Helmet>
            <Container maxWidth="xs">
                <Typography variant="h6" sx={{ mb: 2 }} align="center">
                    Log In
                </Typography>
                <Stack alignSelf={"center"}>
                    <Button
                        variant="contained"
                        href={`${process.env.REACT_APP_BASE_URL}/oauth/bnet`}
                    >
                        <img
                            alt="Battle.net Icon"
                            src="/battlenet_icon.png"
                            style={{
                                objectFit: "contain",
                                maxHeight: 64,
                            }}
                        />
                        <Typography>Battle.net</Typography>
                    </Button>
                </Stack>
            </Container>
        </>
    );
}

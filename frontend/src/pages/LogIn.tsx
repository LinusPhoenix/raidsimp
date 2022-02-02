import { Button, Container, Typography, Stack } from "@material-ui/core";

export function LogInPage() {
    return (
        <Container maxWidth="xs">
            <Typography variant="h6" sx={{ mb: 2 }} align="center">
                Log In
            </Typography>
            <Stack alignSelf={"center"}>
                <Button variant="contained" href={`${process.env.REACT_APP_BASE_URL}/oauth/bnet`}>
                    <img
                        alt="WoW Raid Manager Icon"
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
    );
}

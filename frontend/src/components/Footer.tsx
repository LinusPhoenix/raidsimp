import { Box, Container, Link, Paper, Tooltip, Typography } from "@material-ui/core";

export function Footer() {
    return (
        <Container maxWidth={false} disableGutters>
            <Paper elevation={12} square>
                <footer>
                    <Box
                        display="flex"
                        minHeight={70}
                        width="50%"
                        margin="auto"
                        justifyContent="space-evenly"
                        alignItems="center"
                    >
                        <Tooltip disableInteractive placement="top" title="Coming Soon!">
                            <Link href="#">
                                <Typography>Contact us</Typography>
                            </Link>
                        </Tooltip>
                        <Link href="https://twitter.com/LinusPhoenix">
                            <Typography>Tweet at us</Typography>
                        </Link>
                        <Tooltip disableInteractive placement="top" title="Coming Soon!">
                            <Link href="#">
                                <Typography>Join us on Discord</Typography>
                            </Link>
                        </Tooltip>
                        <Link href="https://github.com/LinusPhoenix/wow-raid-manager">
                            <Typography>View our code on GitHub</Typography>
                        </Link>
                        <Tooltip disableInteractive placement="top" title="Coming Soon!">
                            <Link href="#">
                                <Typography>Donate on Ko-fi</Typography>
                            </Link>
                        </Tooltip>
                        <Link href="/privacy">
                            <Typography>Privacy Policy</Typography>
                        </Link>
                    </Box>
                </footer>
            </Paper>
        </Container>
    );
}

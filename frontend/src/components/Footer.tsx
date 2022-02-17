import { Link, Paper, styled, Tooltip, Typography } from "@material-ui/core";

export const FOOTER_HEIGHT = "72px";

const FootiePaper = styled(Paper)(({ theme }) => ({
    height: FOOTER_HEIGHT,
    backgroundColor: theme.palette.background.default,
}));

const FootieLinkContainer = styled("div")(() => ({
    display: "flex",
    minHeight: 70,
    width: "50%",
    margin: "auto",
    justifyContent: "space-evenly",
    alignItems: "center",
}));

export function Footer() {
    return (
        <FootiePaper elevation={12} square>
            <FootieLinkContainer>
                <Link href="mailto:raidsimpapp@gmail.com" target="_blank" rel="noopener noreferrer">
                    <Typography>Contact us</Typography>
                </Link>
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
                        <Typography>Support us on Ko-fi</Typography>
                    </Link>
                </Tooltip>
                <Link href="/privacy">
                    <Typography>Privacy Policy</Typography>
                </Link>
            </FootieLinkContainer>
        </FootiePaper>
    );
}

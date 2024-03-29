import { Button, Container, Stack, Typography } from "@mui/material";
import { Helmet } from "react-helmet";
import * as Routes from "./routes";

interface DogeProps {
    readonly alt: string;
    readonly imgPath: string;
    readonly quote: string;
}

const doges: DogeProps[] = [
    {
        alt: "Angry Doge",
        imgPath: "/doges/angry.png",
        quote: "Listen pal, I don't know how you got here, but you need to leave, okay?",
    },
    {
        alt: "Confused Doge",
        imgPath: "/doges/confused.png",
        quote: "Hey, uh... How did you get here?",
    },
    {
        alt: "Happy Doge",
        imgPath: "/doges/happy.png",
        quote: "Finally, somebody visits me! I sure hope you won't immediately leave.",
    },
    {
        alt: "Sad Doge",
        imgPath: "/doges/sad.png",
        quote: "I'm sorry... There was a page here for you, but... But I lost it...",
    },
    {
        alt: "Doge Staring At You",
        imgPath: "/doges/stare.png",
        quote: "Look, what do you want me to do? There's just nothing here to see.",
    },
];

export function NotFoundPage() {
    const doge = doges[Math.floor(Math.random() * doges.length)];

    return (
        <Container maxWidth="sm">
            <Helmet>
                <title>Page Not Found - RaidSIMP</title>
            </Helmet>
            <Stack alignItems={"center"} spacing={2}>
                <Typography variant="h4" align="center">
                    Page not found
                </Typography>
                <img alt={doge.alt} src={doge.imgPath} height="400px" />
                <Typography variant="h5" align="center">
                    {doge.quote}
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

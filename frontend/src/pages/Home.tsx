import { Container, Grid, Stack, Typography, Button, Divider, styled } from "@mui/material";
import { Link } from "../components/Link";
import { useNavigate } from "react-router-dom";
import { useUserInfo } from "../components/UserInfoContext";
import { APP_HEADER_MAX_HEIGHT } from "../components/AppHeader";

export default function HomePage(): JSX.Element {
    const navigate = useNavigate();
    const userInfo = useUserInfo();

    if (userInfo.type === "loaded" && userInfo.data != null) {
        navigate("/raid-teams");
    }
    return <Landing />;
}

const Spacer = styled(Divider)(({ theme }) => ({
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(6),
}));

const BackgroundContainer = styled(Container)(() => ({
    minHeight: `calc(100vh - ${APP_HEADER_MAX_HEIGHT}px)`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
}));

const BackgroundImage = styled("img")(() => ({
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "auto",
    maxHeight: "100%",
    opacity: 0.5,
    zIndex: -1000,
}));

const MarginStack = styled(Stack)(({ theme }) => ({
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
}));

function Landing(): JSX.Element {
    return (
        <>
            <BackgroundContainer maxWidth={false}>
                <BackgroundImage
                    src="/landing/onyxia.webp"
                    alt="An undead rogue, troll mage, tauren druid, and orc shaman fight Onyxia the dragon, with more soldiers in the background."
                />
                <Stack alignItems="center" spacing={3}>
                    <Typography variant="h3">
                        Manage Your World of Warcraft Raiding Community
                    </Typography>
                    <Typography textAlign="center" variant="subtitle1">
                        With RaidSIMP, you can see all of the characters in your raid at a glance,
                        enhanced with real-time data from the Blizzard API.
                    </Typography>
                    <Link to="/login">
                        <Button variant="contained" color="primary" size="large">
                            Get started
                        </Button>
                    </Link>
                </Stack>
            </BackgroundContainer>

            <Container maxWidth="lg">
                <Spacer light />
                <Grid container spacing={8}>
                    <Feature
                        title="No registration required"
                        imgSrc="/landing/security.svg"
                        imgAlt="A man standing next to a mockup of a website with a padlock in front."
                        width={230}
                    >
                        All you need is a battle.net account.
                    </Feature>
                    <Feature
                        title="Multiple regions supported"
                        imgSrc="/landing/world.svg"
                        imgAlt="A woman standing next to a globe with multiple pins on it in different locations."
                        width={280}
                    >
                        Whether you raid on EU, US, KR, or TW servers, RaidSIMP is the tool for you.
                    </Feature>
                    <Feature
                        title="Share it with your raid"
                        imgSrc="/landing/collaborators.svg"
                        imgAlt="A man and a woman each holding a part of a website, connected by a plus symbol."
                        width={320}
                    >
                        Give access to others via their battletag. Grant additional permissions to
                        your officers to add and remove raiders.
                    </Feature>
                    <Feature
                        title="Free & open source"
                        imgSrc="/landing/programming.svg"
                        imgAlt="A programmer sitting at his desk coding a website."
                        width={230}
                    >
                        No ads, no pro subscription. You can even host it yourself!
                    </Feature>
                </Grid>
                <Spacer light />
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={6}>
                        <img
                            src="/landing/performance_overview.svg"
                            alt="A man looking at multiple progress bars, with one of them being complete."
                            width={560}
                            height={340}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Stack spacing={2}>
                            <Typography variant="h5">Track your raiders' progress</Typography>
                            <Typography>
                                Add characters to your team and select the role they fulfill (tank,
                                healer, melee DPS, ranged DPS). RaidSIMP connects to the Blizzard
                                API to retrieve up to date information, such as current spec and
                                covenant.
                            </Typography>
                            <Typography>
                                On top of that, RaidSIMP provides you with progression-relevant and
                                tier-specific information like average item level, renown, or how
                                many bosses a character has killed this week. Somebody sneaking off
                                to pug a heroic boss before your first raid of the week? Now you
                                will know.
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={6}>
                        <Stack spacing={2}>
                            <Typography variant="h5">Gain insight into your team</Typography>
                            <Typography>
                                How many demon hunters are on your roster? Do you need to recruit
                                more melee DPS? How well geared is your raid? RaidSIMP provides you
                                with detailed information about the composition of your raid, so you
                                can always plan ahead.
                            </Typography>
                            <Typography>
                                Afterwards, share your team with others by simly adding their
                                battletag. Control who can only view the raid and who is allowed to
                                add or remove raiders. Revoke access anytime.
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={6}>
                        <img
                            src="/landing/control_panel.svg"
                            alt="A man interacting with a control panel with graphs, texts, and checkmarks."
                            width={560}
                            height={340}
                        />
                    </Grid>
                </Grid>
                <Spacer light />
                <MarginStack alignItems="center" spacing={3}>
                    <Typography variant="h4">
                        What are you waiting for? Start using RaidSIMP today!
                    </Typography>
                    <Link to="/login">
                        <Button variant="contained" color="primary" size="large">
                            Get started
                        </Button>
                    </Link>
                </MarginStack>
            </Container>
        </>
    );
}

interface FeatureProps {
    readonly title: string;
    readonly children: string;
    readonly imgSrc: string;
    readonly imgAlt?: string;
    readonly width?: number;
}

function Feature(props: FeatureProps) {
    return (
        <Grid item xs={6}>
            <Stack alignItems="center" spacing={2}>
                <img
                    src={props.imgSrc}
                    alt={props.imgAlt}
                    height={200}
                    width={props.width ?? "100%"}
                />
                <Typography variant="h6">{props.title}</Typography>
                <Typography textAlign="center">{props.children}</Typography>
            </Stack>
        </Grid>
    );
}

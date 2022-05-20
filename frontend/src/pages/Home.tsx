import {
    Container,
    Grid,
    Stack,
    Typography,
    Button,
    Divider,
    styled,
    Card,
    CardContent,
    Avatar,
} from "@material-ui/core";
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

function Landing(): JSX.Element {
    return (
        <>
            <BackgroundContainer maxWidth={false}>
                <BackgroundImage src="/landing/onyxia.webp" />
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
                    <Feature title="No registration required" imgSrc="/landing/security.svg">
                        All you need is a battle.net account.
                    </Feature>
                    <Feature title="Multiple regions supported" imgSrc="/landing/world.svg">
                        Whether you raid on EU, US, KR, or TW servers, RaidSIMP is the tool for you.
                    </Feature>
                    <Feature title="Share it with your raid" imgSrc="/landing/collaborators.svg">
                        Give access to others via their battletag. Grant additional permissions to
                        your officers to add and remove raiders.
                    </Feature>
                    <Feature title="Free & open source" imgSrc="/landing/programming.svg">
                        No ads, no pro subscription. You can even host it yourself!
                    </Feature>
                </Grid>
                <Spacer light />
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={6}>
                        <img src="/landing/performance_overview.svg" width="100%" height={340} />
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
                                many bosses a character has killed so far. Somebody sneaking off to
                                pug a heroic boss before your first raid of the week? Now you will
                                know.
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
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat. Duis aute irure dolor in
                                reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                culpa qui officia deserunt mollit anim id est laborum.
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={6}>
                        <img src="/landing/control_panel.svg" width="100%" height={340} />
                    </Grid>
                </Grid>
                <Spacer light />
                <Stack spacing={6} direction="row">
                    <Quote name="The Rash" credibility="CEO, Iron Edge">
                        RaidSIMP has improved our raid productivity by an order of magnitude. Since
                        making the switch our raid has become a well-oiled collaboration machine.
                    </Quote>
                    <Quote name="Phoenix Flames" credibility="CTO, Iron Edge">
                        RaidSIMP has improved our raid productivity by an order of magnitude. Since
                        making the switch our raid has become a well-oiled collaboration machine.
                    </Quote>
                    <Quote name="Super Kåre" credibility="Code monkey, Iron Edge">
                        RaidSIMP has improved our raid productivity by an order of magnitude. Since
                        making the switch our raid has become a well-oiled collaboration machine.
                    </Quote>
                </Stack>
            </Container>
        </>
    );
}

interface FeatureProps {
    readonly title: string;
    readonly children: string;
    readonly imgSrc: string;
}

function Feature(props: FeatureProps) {
    return (
        <Grid item xs={6}>
            <Stack alignItems="center" spacing={2}>
                <img src={props.imgSrc} height={200} />
                <Typography variant="h6">{props.title}</Typography>
                <Typography textAlign="center">{props.children}</Typography>
            </Stack>
        </Grid>
    );
}

interface QuoteProps {
    readonly children: string;
    readonly name: string;
    readonly credibility: string;
}

function Quote(props: QuoteProps) {
    return (
        <Card sx={{ minHeight: 170 }}>
            <CardContent>
                <Stack spacing={2}>
                    <Typography variant="subtitle2">{props.children}</Typography>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar>{props.name.substring(0, 2)}</Avatar>
                        <Stack direction="column">
                            <Typography>{props.name}</Typography>
                            <Typography variant="subtitle2">{props.credibility}</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}

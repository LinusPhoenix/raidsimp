import {
    Container,
    Grid,
    Stack,
    Typography,
    Button,
    Skeleton,
    Divider,
    styled,
    Card,
    CardContent,
    Avatar,
} from "@material-ui/core";
import { Link } from "../components/Link";
import { useNavigate } from "react-router-dom";
import { useUserInfo } from "../components/UserInfoContext";

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

function Landing(): JSX.Element {
    return (
        <Container maxWidth="lg">
            <Stack alignItems="center" spacing={3}>
                <Skeleton variant="rectangular" width={720} height={534} />
                <Typography variant="h5">
                    All your raiders in one secure location, accessible anywhere.
                </Typography>
                <Typography textAlign="center">
                    RaidSIMP stores all your most important raiders in one secure location. Access them wherever you need, share and collaborate with friends, family, and co-leaders.
                </Typography>
                <Link to="/login">
                    <Button variant="outlined" color="primary" size="large">Get started</Button>
                </Link>
            </Stack>
            <Spacer light />
            <Grid container spacing={8}>
                <Feature title="Access your raiders, anywhere">
                    The ability to use a smartphone, tablet, or computer to access your account means your raiders follow you everywhere.
                </Feature>
                <Feature title="Security you can trust">
                    2-factor authentication and encryption are just a couple of the security features we allow to help secure your raiders.
                </Feature>
                <Feature title="Real-time collaboration">
                    Securely share raiders and teams with friends, family and co-leaders for live collaboration. No email attachments required.
                </Feature>
                <Feature title="Store any type of raider">
                    Whether you're raiding Sunwell Plateu or Sepulcher of the First Ones, RaidSIMP has you covered allowing for all raider types to be securely stored and shared.
                </Feature>
            </Grid>
            <Spacer light />
            <Grid container spacing={4} alignItems="center">
                <Grid item xs={6}>
                    <Skeleton variant="rectangular" width="100%" height={340} />
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={2}>
                        <Typography variant="h5">Store any type of raider</Typography>
                        <Typography>
                            Whether you're raiding Sunwell Plateu or Sepulcher of the First Ones, RaidSIMP has you covered allowing for all raider types to be securely stored and shared.
                        </Typography>
                        <Typography>
                            Whether you're raiding Sunwell Plateu or Sepulcher of the First Ones, RaidSIMP has you covered allowing for all raider types to be securely stored and shared.
                        </Typography>
                        <Link to="/privacy">How RaidSIMP works</Link>
                    </Stack>
                </Grid>
            </Grid>
            <Spacer light />
            <Stack spacing={6} direction="row">
                <Quote name="The Rash" credibility="CEO, Iron Edge">
                    RaidSIMP has improved our raid productivity by an order of magnitude. Since making the switch our raid has become a well-oiled collaboration machine.
                </Quote>
                <Quote name="Phoenix Flames" credibility="CTO, Iron Edge">
                    RaidSIMP has improved our raid productivity by an order of magnitude. Since making the switch our raid has become a well-oiled collaboration machine.
                </Quote>
                <Quote name="Super Kåre" credibility="Code monkey, Iron Edge">
                    RaidSIMP has improved our raid productivity by an order of magnitude. Since making the switch our raid has become a well-oiled collaboration machine.
                </Quote>
            </Stack>
        </Container>
    );
}

interface FeatureProps {
    readonly title: string;
    readonly children: string;
}

function Feature(props: FeatureProps) {
    return (
        <Grid item xs={6}>
            <Stack alignItems="center" spacing={2}>
                <Skeleton variant="rectangular" width={64} height={60} />
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
        <Card sx={{ minHeight: 170 }} >
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


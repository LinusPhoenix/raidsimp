import { Container, Typography } from "@material-ui/core";
import { Helmet } from "react-helmet";

export function PrivacyPage() {
    return (
        <>
            <Helmet>
                <title>Privacy Policy - RaidSIMP</title>
            </Helmet>
            <Container maxWidth="xl">
                <Typography variant="h3" marginBottom={3}>
                    Privacy Policy
                </Typography>
                <Typography paragraph>
                    We do not track any usage statistics and do not set any tracking cookies. We set
                    an HttpOnly cookie when you log into our website to authenticate you. As this
                    cookie is strictly necessary to make our website work, you cannot refuse it.
                </Typography>
                <Typography paragraph>We do not collect any personal information.</Typography>
                <Typography paragraph>
                    When you login using Battle.net, we create an account for you, storing the
                    battletag and user id returned to us by Battle.net. This data is necessary for
                    our website to work and is not considered personally identifiable information.
                </Typography>
                <Typography paragraph>
                    You can delete your account and all data associated with you at any time by
                    logging in, clicking on your battletag, and selecting "Delete Account". Note
                    that this also deletes all raid teams owned by you.
                </Typography>
                <Typography paragraph>
                    We collect server logs for debugging purposes. We do not log any personal
                    information. Server logs are deleted regularly.
                </Typography>
                <Typography paragraph>
                    We do not provide an imprint on our website as it is not a commercial website.
                </Typography>
            </Container>
        </>
    );
}

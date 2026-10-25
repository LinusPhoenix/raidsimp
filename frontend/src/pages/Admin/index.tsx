import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { Helmet } from "react-helmet";
import { AdminApi } from "../../server";
import { PageLoadingError } from "../../components/PageLoadingError";
import { useIsAdmin } from "../../components/useIsAdmin";
import { serverRequest, usePromise } from "../../utility";
import { NotFoundPage } from "../NotFound";
import { IlvlThresholdsEditor } from "./IlvlThresholdsEditor";

export default function AdminPage() {
    const isAdmin = useIsAdmin();
    if (isAdmin === null) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }
    if (!isAdmin) {
        return <NotFoundPage />;
    }
    return <AdminPanel />;
}

function AdminPanel() {
    const { data, reload } = usePromise(
        "Admin_getConfig",
        () => serverRequest((cfg) => new AdminApi(cfg).adminControllerGetConfig()),
        [],
    );
    if (!data.isOk) {
        return <PageLoadingError error={data} reload={reload} />;
    }

    return (
        <>
            <Helmet>
                <title>Admin - RaidSIMP</title>
            </Helmet>
            <Container maxWidth="lg">
                <Typography variant="h5">Admin panel</Typography>
                <Box marginY={2} />
                <IlvlThresholdsEditor initial={data.body.ilvlThresholds} />
            </Container>
        </>
    );
}

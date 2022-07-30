import { Button, Stack, Typography } from "@mui/material";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

export function UnderConstruction() {
    const navigate = useNavigate();

    return (
        <>
            <Helmet>
                <title>Under Construction - RaidSIMP</title>
            </Helmet>
            <Stack alignItems={"center"} spacing={2}>
                <Typography variant="h4" align="center">
                    Work in Progress
                </Typography>
                <img alt="Construction Doge" src="/doges/construction.png" height="400px" />
                <Typography variant="h5" align="center">
                    Sorry buddy, this page is still under construction.
                </Typography>
                <Button
                    size="medium"
                    style={{ width: "200px", height: "50px" }}
                    variant="contained"
                    onClick={() => navigate(-1)}
                >
                    <Typography>Go back</Typography>
                </Button>
            </Stack>
        </>
    );
}

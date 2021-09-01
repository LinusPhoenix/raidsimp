import {
    Box,
    Divider,
    Grid,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
} from "@material-ui/core";
import { ColorHelper } from "../../utility/color-helper";
import { ImageHelper } from "../../utility/image-helper";
import { Raider } from "./RaidersTable";
import { ArmorTypeChart } from "./ArmorTypeChart";

export interface TeamStatisticsProps {
    readonly raiders: readonly Raider[];
}

export function TeamStatistics({ raiders }: TeamStatisticsProps): JSX.Element {
    return (
        <Grid container spacing={3}>
            <Grid item xs={4}>
                <Paper style={{ padding: 10 }}>
                    <Typography variant="h6" align="center">
                        Armor Types by No. of Characters
                    </Typography>
                    <ArmorTypeChart raiders={raiders} />
                </Paper>
            </Grid>
            <Grid item xs={8}>
                <Grid container spacing={3} justifyContent="space-evenly">
                    <Grid item xs={12}>
                        <Paper style={{ padding: 10 }}>
                            <Box display="flex" flexDirection="row" justifyContent="space-evenly">
                                {ImageHelper.classes.map((_class) => {
                                    return (
                                        <Stack maxWidth={50}>
                                            <img
                                                width={"100%"}
                                                alt={_class + " Icon"}
                                                src={ImageHelper.getClassIconPath(_class)}
                                            />
                                            <Typography
                                                variant="subtitle1"
                                                align="center"
                                                fontWeight="fontWeightBold"
                                                color={ColorHelper.getClassColor(_class)}
                                            >
                                                {
                                                    raiders.filter(
                                                        (raider) =>
                                                            raider.overview?._class === _class,
                                                    ).length
                                                }
                                            </Typography>
                                        </Stack>
                                    );
                                })}
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item>
                        <Paper style={{ padding: 10 }}>
                            <Stack>
                                <Typography variant="h6" align="center">
                                    No. of Raiders
                                </Typography>
                                <Typography variant="h3" align="center">
                                    {raiders.length}
                                </Typography>
                            </Stack>
                        </Paper>
                    </Grid>
                    <Grid item>
                        <Paper style={{ padding: 10 }}>
                            <Stack>
                                <Typography variant="h6" align="center">
                                    No. of Raiders per Role
                                </Typography>
                                <Divider />
                                <Box marginY={1} />
                                <Grid container alignSelf="center" width="60%">
                                    <Grid item xs={6}>
                                        Tanks:
                                    </Grid>
                                    <Grid item xs={6} textAlign="right">
                                        {raiders.filter((raider) => raider.role === "tank").length}
                                    </Grid>
                                    <Grid item xs={6}>
                                        Healers:
                                    </Grid>
                                    <Grid item xs={6} textAlign="right">
                                        {
                                            raiders.filter((raider) => raider.role === "healer")
                                                .length
                                        }
                                    </Grid>
                                    <Grid item xs={6}>
                                        Melee DPS:
                                    </Grid>
                                    <Grid item xs={6} textAlign="right">
                                        {raiders.filter((raider) => raider.role === "melee").length}
                                    </Grid>
                                    <Grid item xs={6}>
                                        Ranged DPS:
                                    </Grid>
                                    <Grid item xs={6} textAlign="right">
                                        {
                                            raiders.filter((raider) => raider.role === "ranged")
                                                .length
                                        }
                                    </Grid>
                                </Grid>

                                {/*}
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Tanks:</TableCell>
                                            <TableCell>
                                                {
                                                    raiders.filter(
                                                        (raider) => raider.role === "tank",
                                                    ).length
                                                }
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Healers:</TableCell>
                                            <TableCell>
                                                {
                                                    raiders.filter(
                                                        (raider) => raider.role === "healer",
                                                    ).length
                                                }
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Melee DPS:</TableCell>
                                            <TableCell>
                                                {
                                                    raiders.filter(
                                                        (raider) => raider.role === "melee",
                                                    ).length
                                                }
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Ranged DPS:</TableCell>
                                            <TableCell>
                                                {
                                                    raiders.filter(
                                                        (raider) => raider.role === "ranged",
                                                    ).length
                                                }
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>*/}
                            </Stack>
                        </Paper>
                    </Grid>
                    <Grid item>
                        <Paper style={{ padding: 10 }}>
                            <Stack>
                                <Typography variant="h6" align="center">
                                    Average Item Level
                                </Typography>
                                <Typography
                                    variant="h3"
                                    align="center"
                                    color={ColorHelper.getIlvlColor(
                                        getRaidAverageItemLevel(raiders),
                                    )}
                                >
                                    {getRaidAverageItemLevel(raiders)}
                                </Typography>
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

function getRaidAverageItemLevel(raiders: readonly Raider[]): number {
    if (raiders.length === 0) {
        return 0;
    }
    const sum = raiders
        .map((raider) => raider.overview?.averageItemLevel ?? 0)
        .reduce((a, b) => a + b, 0);
    return Math.round((sum / raiders.length) * 100) / 100;
}

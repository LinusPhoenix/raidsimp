import {
    Box,
    Grid,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
} from "@material-ui/core";
import { Doughnut } from "react-chartjs-2";
import { ColorHelper } from "../../utility/color-helper";
import { ImageHelper } from "../../utility/image-helper";
import { Raider } from "./RaidersTable";

export interface TeamStatisticsProps {
    readonly raiders: Readonly<Raider[]>;
}

export function TeamStatistics({ raiders }: TeamStatisticsProps): JSX.Element {
    function getDoughnutChartData(raiders: Readonly<Raider[]>): number[] {
        const plateCount = raiders.filter((raider) =>
            ["Warrior", "Paladin", "Death Knight"].includes(raider.overview?._class || ""),
        ).length;
        const mailCount = raiders.filter((raider) =>
            ["Hunter", "Shaman"].includes(raider.overview?._class || ""),
        ).length;
        const leatherCount = raiders.filter((raider) =>
            ["Rogue", "Druid", "Monk", "Demon Hunter"].includes(raider.overview?._class || ""),
        ).length;
        const clothCount = raiders.filter((raider) =>
            ["Mage", "Priest", "Warlock"].includes(raider.overview?._class || ""),
        ).length;
        return [plateCount, mailCount, leatherCount, clothCount];
    }
    const doughnutData = {
        labels: ["Plate", "Mail", "Leather", "Cloth"],
        datasets: [
            {
                label: "No. of Characters",
                data: getDoughnutChartData(raiders),
                backgroundColor: ["#142850", "#27496d", "#0c7b93", "#FBFFFE"],
                borderWidth: 0,
            },
        ],
    };

    function getRaidAverageItemLevel(raiders: Readonly<Raider[]>): number {
        const sum = raiders
            .map((raider) => raider.overview?.averageItemLevel ?? 0)
            .reduce((a, b) => a + b, 0);
        return Math.round((sum / raiders.length) * 100) / 100;
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={4}>
                <Paper style={{ padding: 10 }}>
                    <Typography variant="h6" align="center">
                        Armor Types by No. of Characters
                    </Typography>
                    <div style={{ height: "35vh" }}>
                        <Doughnut
                            data={doughnutData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                            }}
                        />
                    </div>
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
                                </Table>
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

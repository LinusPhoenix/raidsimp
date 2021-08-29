import React from "react";
import { useTheme } from "@material-ui/core";
import { Doughnut } from "react-chartjs-2";
import { Raider } from "./RaidersTable";
import { ChartData, ChartOptions } from "chart.js";

export interface ArmorTypeChartChartProps {
    readonly raiders: readonly Raider[];
}

export const ArmorTypeChart = React.memo(function ArmorTypeChart({
    raiders,
}: ArmorTypeChartChartProps) {
    const theme = useTheme();

    const doughnutData: ChartData = {
        labels: ["Plate", "Mail", "Leather", "Cloth"],
        datasets: [
            {
                data: getDoughnutChartData(raiders),
                backgroundColor: ["rgba(198, 155, 109, 1)", "#0070DD", "#FF7C0A", "#FFFFFF"],
                borderWidth: 0,
                borderColor: "Black",
            },
        ],
    };

    const options: ChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: theme.palette.text.primary,
                },
            },
        },
    };
    return (
        <div style={{ height: "40vh" }}>
            <Doughnut data={doughnutData} options={options} />
        </div>
    );
});

function getDoughnutChartData(raiders: readonly Raider[]): number[] {
    let plate = 0;
    let mail = 0;
    let leather = 0;
    let cloth = 0;
    for (const raider of raiders) {
        switch (raider.overview?._class) {
            case "Warrior":
            case "Paladin":
            case "Death Knight":
                plate++;
                break;
            case "Hunter":
            case "Shaman":
                mail++;
                break;
            case "Rogue":
            case "Druid":
            case "Monk":
            case "Demon Hunter":
                leather++;
                break;
            case "Mage":
            case "Priest":
            case "Warlock":
                cloth++;
                break;
            default:
                break;
        }
    }
    return [plate, mail, leather, cloth];
}

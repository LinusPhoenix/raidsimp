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

    const doughnutData: ChartData<"doughnut", number[], unknown> = {
        labels: ["Plate", "Mail", "Leather", "Cloth"],
        datasets: [
            {
                data: getDoughnutChartData(raiders),
                backgroundColor: ["#142850", "#27496d", "#0c7b93", "#FBFFFE"],
                borderWidth: 0,
                animation: false,
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
        <div style={{ height: "35vh" }}>
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
        const className = raider.overview?._class;
        switch (className) {
            case undefined:
                break;
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
                throw new Error("Unexpected class name: " + className);
        }
    }
    return [plate, mail, leather, cloth];
}

import React from "react";
import { useTheme } from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import { Raider } from "./RaidersTable";
import { getClassColor } from "../../utility/color-helper";
import { Chart as ChartJS, ChartData, ChartOptions, ArcElement, Legend, Tooltip } from "chart.js";

ChartJS.register(ArcElement, Legend, Tooltip);

// Plate, Mail, Leather, Cloth: each uses the color of a representative class.
const ARMOR_TYPE_COLORS = ["Warrior", "Shaman", "Druid", "Priest"].map(getClassColor);

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
                backgroundColor: ARMOR_TYPE_COLORS,
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
            case "Evoker":
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

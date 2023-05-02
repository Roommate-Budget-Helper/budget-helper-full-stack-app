import { Chart as ChartJS, ArcElement, BarElement, Tooltip, Legend, Title, LinearScale, CategoryScale } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import { trpc } from "../../utils/trpc";
import { Charge } from "@prisma/client";
import React from "react";

ChartJS.register(
    ArcElement,
    BarElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend,
    Title
);

const getRandomColor = () => {
    const color = Math.floor(Math.random() * 16777216).toString(16);
    return "#000000".slice(0, -color.length) + color;
};

const DoughnutChart = ( props: {charges: Charge[]}) => {
    const categoryCount = new Map<string, number>();
    props.charges.forEach((charge) => {
        const current = categoryCount.get(charge.category);
        categoryCount.set(charge.category, current ? current + 1 : 1);
    });

    const colorMap = new Map<string, string>();
    categoryCount.forEach((_, key) => {
        colorMap.set(key, getRandomColor());
    });

    const chartOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: "Amount of Charges in each Category",
            },
        },
    };
    
    const chartData = {
        labels: Array.from(categoryCount.keys()),
        datasets: [
            {
                label: "Amount in Categories",
                data: Array.from(categoryCount.values()),
                backgroundColor: Array.from(categoryCount.keys()).map(
                    (key) => colorMap.get(key)
                ),
                borderColor: Array.from(categoryCount.keys()).map(
                    (key) => colorMap.get(key)
                ),
                borderWidth: 1,
            },
        ],
    };

    return <Doughnut data={chartData} options={chartOptions} />;
};

const VerticalBarChart = (props: {charges: Charge[]}) => {
    const chartOptions = {
        responsive: true,
        indexAxis: "y" as const,
        elements: {
            bar: {
                borderWidth: 2,
            },
        },
        plugins: {
            title: {
                display: true,
                text: "Amount Spent This Month",
            },
        },
    };

    const categorySum = new Map<string, number>();
    props.charges.forEach((charge) => {
        const current = categorySum.get(charge.category);
        categorySum.set(
            charge.category,
            current ? current + Number(charge.amount) : Number(charge.amount)
        );
    });

    const chartData = {
        labels: Array.from(categorySum.keys()),
        datasets: [
            {
                label: "Amount in Categories in Dollars",
                data: Array.from(categorySum.values()),
                backgroundColor: Array.from(categorySum.keys()).map(
                    () => getRandomColor()
                ),
            },
        ],
    };

    return (
        <Bar data={chartData} options={chartOptions} />
    )
}

export const ChartComponent = () => {
    const thisMonthsCharges = trpc.useQuery(["bill.getChargesThisMonth"]);
    console.log(thisMonthsCharges.data);
    return (
        <div>
            {thisMonthsCharges.isLoading && <div>Loading...</div>}
        {
            thisMonthsCharges.data && thisMonthsCharges.data?.length > 0 ? (
                <div>
                <VerticalBarChart charges={thisMonthsCharges?.data}/>
                <br></br>
                <hr className="py-5"></hr>
                <DoughnutChart charges={thisMonthsCharges?.data}/>
                <br></br>
                <hr className="py-5"></hr>
                </div>
            ) : (
                <div className="py-5">There are no charges so far this month! 💸</div>
            )
        }
        </div>
    );
};
import numeral from "numeral";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    callback: function (value, index, values) {
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    },
};

const Graph = ({casesType = "cases"}) => {
    const [data, setData] = useState({})

    const buildChartData = (data, casesType) => {
        const chartData = []
        let lastPoint;
        for (let date in data.cases) {
            if (lastPoint) {
                const newPoint = {
                    x: date,
                    y: data[casesType][date] - lastPoint
                }
                chartData.push(newPoint)
            }
            lastPoint = data[casesType][date]
        }
        return chartData
    }
    useEffect(() => {
        const fetchData = async () => {
            fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=200')
                .then(response => response.json()) 
                .then(data => {
                    const chartData = buildChartData(data, casesType)
                    setData(chartData)
                })
        }
    }, [casesType])

    return (
        <div>
            {data.length > 0 && (
                <Line options={options}
                data ={{
                    datasets: [{
                        backgroundColor: "rgba(204, 16, 52, .5)",
                        borderColor: "##CC1034",
                        data: data
                    }]
                }}
                />
            )}
        </div>
    )

} 

export default Graph
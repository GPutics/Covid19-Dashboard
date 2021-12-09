import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Line } from 'react-chartjs-2';
import numeral from 'numeral';

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
            // Include a dollar sign in the ticks
            callback: function (value, index, values) {
              return numeral(value).format("0a");
            },
          },
        },
      ],
    },
  };

const LineGraph = ({casesType}) => {
    const [data, setData] = useState({});

    const createChartData = (data, casesType) => {
        const chartData = [];
        let lastDataPoint;

        for (let date in data.cases) {
            if(lastDataPoint) {
                const newDataPoint = {
                    x: date,
                    y: data[casesType][date] - lastDataPoint
                }
                chartData.push(newDataPoint);
            }
            lastDataPoint = data[casesType][date];
        };
        return chartData;
    };

    useEffect(() => {
        const getData = async() => {
            const {data} = await axios.get("https://disease.sh/v3/covid-19/historical/all?lastdays=30");
            const chartData = createChartData(data, casesType);
            console.log("THIS IS THE CHART DATA:",chartData);
            setData(chartData);
        };
        getData();
    }, [casesType]);
    

    return (
        <div>
            {data?.length > 0 && (
                <Line 
                    options={options}
                    data={{
                        datasets: [{
                            data: data,
                            backgroundColor: "rgba(204, 16, 52, 0.5)",
                            borderColor: "#CC1034",
                        }],
                    }}
                />
            )}
        </div>
    )
}

export default LineGraph

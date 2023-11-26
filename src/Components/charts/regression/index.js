import { useEffect, useState } from "react";
import HighChartWrapper from "../../highchart";
import jStat from "jstat";

const TimeSeriesChart = () => {
  // Sample data for the time series chart
  const [fetchState, setFetchState] = useState({
    isLoading: true,
    error: null,
  });
  const [data, setData] = useState([]);

  let discipline = [
    {
      name: "Football",
      data: "football",
    },
  ];

  const regression = (arrWeight, arrHeight) => {
    console.log({ arrHeight, arrWeight });
    let r, sy, sx, b, a, meanX, meanY;
    r = jStat.corrcoeff(arrHeight, arrWeight);
    sy = jStat.stdev(arrWeight);
    sx = jStat.stdev(arrHeight);
    meanY = jStat(arrWeight).mean();
    meanX = jStat(arrHeight).mean();
    b = r * (sy / sx);
    a = meanY - meanX * b;
    //Set up a line
    let y1, y2, x1, x2;
    x1 = jStat.min(arrHeight);
    x2 = jStat.max(arrHeight);
    y1 = a + b * x1;
    y2 = a + b * x2;
    return {
      line: [
        [x1, y1],
        [x2, y2],
      ],
      r,
    };
  };

  const getDataSport = (sportName, dataToUse = []) => {
    let temp = [],
      tempWeight = [],
      tempHeight = [];

    dataToUse.forEach((elm) => {
      if (elm.sport == sportName && elm.weight > 0 && elm.height > 0) {
        temp.push([elm.height, elm.weight]);
        tempWeight.push(elm.weight);
        tempHeight.push(elm.height);
      }
    });
    let { line, r } = regression(tempWeight, tempHeight);
    console.log({ line, r });
    return [temp, line, r];
  };

  const fetchData = async () => {
    setFetchState({
      isLoading: true,
    });
    try {
      setFetchState({
        isLoading: true,
        error: null,
      });
      const response = await fetch(
        "https://raw.githubusercontent.com/mekhatria/demo_highcharts/master/olympic2012.json"
      );
      const result = await response.json();
      if (result?.length > 0) {
        let series = [],
          visible = false,
          activate = ["Football"];
        discipline.forEach((e) => {
          if (activate.indexOf(e.name) > -1) {
            visible = true;
          } else {
            visible = false;
          }
          let [scatterData, line, r] = getDataSport(e.data, result);
          series.push(
            {
              type: "scatter",
              visible: visible,
              name: e.name,
              data: scatterData,
            },
            {
              name: e.name,
              visible: visible,
              r: r,
              data: line,
            }
          );
        });
        setData(series);
      }
      setFetchState({
        isLoading: false,
        error: null,
      });
    } catch (e) {
      setFetchState({
        isLoading: false,
        error: "Error while fetching data",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const config = {
    chart: {
      type: "line",
      zoomType: "y",
    },

    title: {
      text: "Athletes' weight and height relationship Regression Analysis",
    },

    xAxis: {
      title: {
        text: "Height",
      },
      labels: {
        format: "{value} m",
      },
      min: 1.25,
    },

    yAxis: {
      opposite: false,
      title: {
        text: "Weight",
      },
      labels: {
        format: "{value} kg",
      },
    },

    legend: {
      enabled: true,
    },

    plotOptions: {
      scatter: {
        marker: {
          radius: 2.5,
          symbol: "circle",
          states: {
            hover: {
              enabled: true,
              lineColor: "rgb(100,100,100)",
            },
          },
        },
        states: {
          hover: {
            marker: {
              enabled: false,
            },
          },
        },
      },
      line: {
        lineWidth: 2.5,
      },
    },

    tooltip: {
      formatter: function () {
        if (this.series?.data?.length > 2) {
          return (
            this.series?.name +
            "<br/>Height: " +
            this.x +
            " m<br/>Weight: " +
            this.y +
            " kg"
          );
        } else {
          return (
            this.series?.name + "<br/>r: " + this.series?.userOptions?.r?.toFixed?.(2)
          );
        }
      },
    },
    series: data,
    credits: {
      enabled: false,
    },
    rangeSelector: {
      enabled: false,
    },
    navigator: {
      enabled: false,
    },
    scrollbar: {
      enabled: false,
    },
  };

  console.log({ config });

  return (
    <>
      {fetchState.isLoading && <>Loading...</>}
      {!fetchState.isLoading && fetchState.error && <>{fetchState.error}</>}
      {!fetchState.isLoading && !fetchState.error && (
        <HighChartWrapper options={config} />
      )}
    </>
  );
};

export default TimeSeriesChart;

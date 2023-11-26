import { useEffect, useState } from "react";
import HighChartWrapper from "../../highchart";

const TimeSeriesChart = () => {
  // Sample data for the time series chart
  const [fetchState, setFetchState] = useState({
    isLoading: true,
    error: null,
  });
  const [data, setData] = useState([]);

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
        "https://jsonblob.com/api/1178269453392928768"
      );
      const result = await response.json();
      if (result.length > 0) {
        const formatedData = (result || []).map((obj) => {
          return {
            x: obj.literacyRate,
            y: obj.employmentRate,
            z: obj.population,
            stateValue: obj.state,
          };
        });
        setData(formatedData);
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
      type: "bubble",
      zoomType: "xy",
      height: 550,
      events: {
        load: function () {
          var plotHeight = this.chartHeight;
          var plotWidth = this.chartWidth;

          var yAxisOffset = (plotWidth / 2) * -1;
          var xAxisOffset = (plotHeight / 2) * -1;
          // Set the offsets for the x-axes and y-axes
          this.xAxis[0].update(
            {
              offset: xAxisOffset + 30,
            },
            false,
          );
          this.yAxis[0].update(
            {
              offset: yAxisOffset + 50,
            },
            false,
          );
          this.redraw(); // Redraw the chart with updated offsets
        },
      },
    },
    title: {
      text: "State wise Literacy Rate / Employment Rate with population data Cluster Analysis",
    },
    xAxis: {
      type: "category",
      title: {
        text: "Literacy Rate",
      },
      gridLineWidth: 0,
      labels: {
        // autoRotationLimit: 40,
        style: {
          color: "#747474",
        },
        // y: 20,
        format: "{value}%",
      },
      lineColor: "#C3C3C3",
      minorTickLength: 0,
      tickLength: 0,
      lineWidth: 1,
    },
    yAxis: {
      opposite: true,
      title: {
        text: "Employment Rate",
      },
      labels: {
        format: "{value}%"
      },
      gridLineWidth: 0,
      startOnTick: false,
      lineWidth: 1,
      lineColor: "#C3C3C3",
      endOnTick: false,
      // maxPadding: 0.2,
    },
    tooltip: {
      formatter: function () {
        console.log({ p: this.point });
        return `
                <div style="color: blue;">State: <b>${this.point.stateValue}</b> </div><br/>
                <div style="color: blue;">Literacy Rate: <b>${this.point.x}</b> </div><br/>
                <div style="color: blue;">Employment Rate: <b>${this.point.y}</b> </div><br/>
                <div style="color: blue;">Population: <b>${this.point.z}</b> </div><br/>
                
                `
      }
    },
    series: [
      {
        name: "Population",
        data: data,
        colorByPoint: true,
      },
    ],
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

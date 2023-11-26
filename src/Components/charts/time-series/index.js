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
        "https://api.frankfurter.app/2020-01-01..2023-01-31?amount=1&from=EUR&to=USD"
      );
      const result = await response.json();
      if (result?.rates) {
        const formatedData = Object.keys(result?.rates || {}).map((date) => {
          return {
            x: new Date(date)?.valueOf(),
            y: result?.rates?.[date]?.USD,
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
    title: {
      text: "Euro to USD Conversion rate Time Series Analysis",
    },
    xAxis: {
      type: "datetime",
      title: {
        text: "Date",
      },
    },
    yAxis: {
      opposite: false,
      title: {
        text: "EURO To USD",
      },
    },
    series: [
      {
        name: "Value",
        data: data,
      },
    ],
    rangeSelector: {
      enabled: false,
    },
    navigator: {
      enabled: false,
    },
    scrollbar: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
  };

  return (
    <>
      {fetchState.isLoading && <>Loading...</>}
      {!fetchState.isLoading && fetchState.error && <>{fetchState.error}</>}
      {!fetchState.isLoading && !fetchState.error && <HighChartWrapper options={config} />}
    </>
  );
};

export default TimeSeriesChart;

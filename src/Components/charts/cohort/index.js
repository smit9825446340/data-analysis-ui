import { useEffect, useState } from "react";
import HighChartWrapper from "../../highchart";

const TimeSeriesChart = () => {
  // Sample data for the time series chart
  const [fetchState, setFetchState] = useState({
    isLoading: true,
    error: null,
  });
  const [data, setData] = useState([]);

  const categories = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY"
  ];

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
        "https://api.energidataservice.dk/dataset/ConsumptionIndustry?offset=0&start=2023-11-06T00:00&end=2023-11-13T00:00&filter=%7B%22Branche%22:[%22Privat%22],%22MunicipalityNo%22:[%22101%22]%7D&sort=HourDK%20ASC"
      );
      const result = await response.json();
      if (result?.records?.length > 0) {
        const formatedData = (result?.records || []).map((obj) => {
          return {
            y: new Date(obj.HourDK)?.getDay(),
            x: new Date(obj.HourDK)?.getHours(),
            value: obj.ConsumptionkWh,
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
    colorAxis: {
      color: "#4973a4",
      upColor: "#4973a4",
    },
    credits: {
      enabled: false,
    },
    chart: {
      type: "heatmap",
    },
    title: {
      text: "Electricity Consumption Hourly / Weekly Cohort Analysis",
    },
    xAxis: {
      title: {
        text: "Hour",
      },
      labels: {
        format: "{value}"
      },
    },
    yAxis: {
      opposite: false,
      categories,
      title: {
        text: "Weekly View",
      },
    },
    series: [
      {
        name: "Consumption in kWh",
        data,
        borderWidth: 0,
        pointPadding: 1,
        rowsize: 0.95,
        dataLabels: {
          // enabled: true,
          useHTML: true,
        },
      },
    ],
    tooltip: {
      formatter: function () {
        return `<span style="color: blue;">${this.point.value} kWh</span><br/>`
      }
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
      {!fetchState.isLoading && !fetchState.error && <HighChartWrapper options={config} />}
    </>
  );
};

export default TimeSeriesChart;

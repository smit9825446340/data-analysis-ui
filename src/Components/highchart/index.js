import React, { forwardRef, useEffect, useRef, useState } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import HighChartsMore from "highcharts/highcharts-more";
import Heatmap from "highcharts/modules/heatmap";


// import "./index.less";

HighChartsMore(Highcharts);
Heatmap(Highcharts);

const HighChartWrapper = ({ options = {}, ...rest }) => {
  const chartRef = useRef();

  return (
    <div className="highchart-blocks" style={{
      margin: 20,
      padding: 20,
      borderRadius: 20,
      boxShadow: "3px 3px 14px #c2c2c2"
    }}>
      <HighchartsReact
        ref={chartRef}
        highcharts={Highcharts}
        constructorType="stockChart"
        options={options}
        {...rest}
      />
    </div>
  );
};

export default HighChartWrapper;

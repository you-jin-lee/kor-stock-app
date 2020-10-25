import React, { useState, useEffect, useCallback } from "react";
import createPlotlyComponent from "react-plotly.js/factory";
import Plotly from "plotly.js/lib/index-finance";
import "./Chart.css";

const Plot = createPlotlyComponent(Plotly);

const fetchData = async (obj) => {
  let result = undefined;
  const { corp_code, corp_name } = obj;
  await fetch(`http://localhost:3002/chart`, {
    method: "post",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ corp_name: corp_name, corp_code: corp_code }),
  }).then(async (res) => {
    result = await res.json();
  });
  return result;
};

const strToNum = (elem, kind) => {
  if (kind === "date") {
    const elemList = elem.split(".");
    return elemList[0] + "-" + elemList[1] + "-" + elemList[2];
  } else {
    const elemList = elem.split(",");
    let newElem = "";
    for (let i = 0; i < elemList.length; i++) {
      newElem = newElem + elemList[i];
    }
    return Number(newElem);
  }
};

const Chart = (props) => {
  const { corpName, corpCode, chartClickCallback } = props;
  const [stockList, setStockList] = useState();
  const [chartList, setChartList] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      let exist = false;
      for (let i = 0; i < chartList.length; i++) {
        if (chartList[i]["corpName"] === corpName) {
          exist = true;
          setStockList(chartList[i]["stockList"]);
        }
      }
      if (exist === false) {
        let result = await fetchData({
          corp_code: corpCode,
          corp_name: corpName,
        });
        for (let i = 0; i < result.length; i++) {
          result[i]["type"] = "candlestick";
          result[i]["x"] = [strToNum(result[i]["Date"], "date")];
          result[i]["close"] = [strToNum(result[i]["Close"])];
          result[i]["open"] = [strToNum(result[i]["Open"])];
          result[i]["high"] = [strToNum(result[i]["High"])];
          result[i]["low"] = [strToNum(result[i]["Low"])];
          result[i]["volume"] = [strToNum(result[i]["Volume"])];
          result[i]["increasing"] = { line: { color: "#F8842A" } };
          result[i]["decreasing"] = { line: { color: "#BFBFBF" } };
        }
        setStockList(result);
        setChartList([
          ...chartList,
          {
            corpName: corpName,
            corpCode: corpCode,
            stockList: result,
          },
        ]);
      }
    };

    fetch();
  }, [chartList, corpCode, corpName, stockList]);

  const chartClickHandler = (e) => {
    chartClickCallback(e.points[0]["data"]["Date"]);
  };

  return (
    <div className="chart_container">
      <div className="chart">
        {stockList === undefined ? (
          <div className="loader"></div>
        ) : (
          <div>
            <Plot
              onClick={chartClickHandler}
              data={stockList}
              layout={{
                xaxis: {
                  autorange: true,
                  rangeselector: {
                    x: 0,
                    y: 1.2,
                    xanchor: "left",
                    font: { size: 10 },
                    buttons: [
                      {
                        step: "month",
                        stepmode: "backward",
                        count: 1,
                        label: "1 month",
                      },
                      {
                        step: "month",
                        stepmode: "backward",
                        count: 6,
                        label: "6 months",
                      },
                      {
                        step: "all",
                        label: "All dates",
                      },
                    ],
                  },
                },
                showlegend: false,
                autosize: true,
                width: 900,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chart;

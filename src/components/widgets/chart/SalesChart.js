import React, { useState, useEffect } from "react";
import "../../../styles/Widget.css";
import { useSelector } from "react-redux";
import { languages } from "../../../features/Language";
import { Chart, registerables } from "chart.js";
import { Line, Bar } from "react-chartjs-2";

Chart.register(...registerables);

const SalesChart = () => {
  const language = useSelector((state) => state.language);
  const selectedShop = useSelector((state) => state.selectedShop);

  const [chartType, setChartType] = useState("line");
  const [dataType, setDataType] = useState("revenue");
  const [timeRange, setTimeRange] = useState("today");
  const [chartData, setChartData] = useState(null);
  const [textColor, setTextColor] = useState("#ffffff");

  useEffect(() => {
    const getColorFromTheme = () => {
      return getComputedStyle(document.documentElement)
        .getPropertyValue("--text")
        .trim();
    };

    setTextColor(getColorFromTheme());

    const observer = new MutationObserver(() => {
      setTextColor(getColorFromTheme());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["theme"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (selectedShop) {
      fetchChartData(selectedShop);
    }
  }, [selectedShop, dataType, timeRange, language]);

  const fetchChartData = async (shopId) => {
    try {
      const response = await fetch("/database/shops.json");
      const allShops = await response.json();
      const shop = allShops.find((shop) => shop.id === parseInt(shopId, 10));

      if (shop) {
        generateChartData(shop);
      }
    } catch (error) {
      console.error("Błąd pobierania danych o sprzedaży:", error);
    }
  };

  const generateChartData = (shop) => {
    if (!shop.orders_list || !Array.isArray(shop.orders_list)) {
      console.error("Brak zamówień lub zły format danych!");
      return;
    }

    const now = new Date();
    const orders = shop.orders_list;
    const offers = shop.offers || [];
    let labels = [];
    let dataMap = new Map();
    const today = new Date();
    const locale = language === "en" ? "en-US" : "pl-PL";

    if (timeRange === "today") {
      labels = [...Array(24).keys()].map((h) => `${h}:00`);
      labels.forEach((label) => dataMap.set(label, 0));
    } else if (timeRange === "this_week") {
      let days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - i
        );
        days.push(d.toLocaleDateString(locale, { weekday: "short" }));
      }
      labels = days;
      labels.forEach((label) => dataMap.set(label, 0));
    } else if (timeRange === "last_week") {
      let months = [];
      for (let i = 3; i >= 0; i--) {
        let d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        months.push(d.toLocaleDateString(locale, { month: "long" }));
      }
      labels = months;
      labels.forEach((label) => dataMap.set(label, 0));
    }

    const getDateKey = (date, type) => {
      if (type === "today") return `${date.getHours()}:00`;
      if (type === "this_week")
        return date.toLocaleDateString(locale, { weekday: "short" });
      if (type === "last_week")
        return date.toLocaleDateString(locale, { month: "long" });
    };

    orders.forEach((order) => {
      if (!order.date || !order.offer_id) return;
      const orderDate = new Date(order.date);

      if (timeRange === "today") {
        if (
          orderDate.getFullYear() !== today.getFullYear() ||
          orderDate.getMonth() !== today.getMonth() ||
          orderDate.getDate() !== today.getDate()
        ) {
          return;
        }
      } else if (timeRange === "this_week") {
        const startDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - 6
        );
        if (orderDate < startDate || orderDate > today) {
          return;
        }
      } else if (timeRange === "last_week") {
        const lowerBound = new Date(
          today.getFullYear(),
          today.getMonth() - 3,
          1
        );
        if (orderDate < lowerBound || orderDate > today) {
          return;
        }
      }

      const labelKey = getDateKey(orderDate, timeRange);
      if (dataMap.has(labelKey)) {
        if (dataType === "revenue") {
          const offer = offers.find((o) => o.id === order.offer_id);
          if (offer) {
            dataMap.set(labelKey, dataMap.get(labelKey) + offer.price);
          }
        } else {
          dataMap.set(labelKey, dataMap.get(labelKey) + 1);
        }
      }
    });

    const data = labels.map((label) => dataMap.get(label));
    const backgroundColors = labels.map((_, i) =>
      i === labels.length - 1 ? "red" : "rgba(120, 212, 46, 0.6)"
    );

    setChartData({
      labels,
      datasets: [
        {
          label:
            dataType === "revenue"
              ? languages[language].revenue
              : languages[language].soldItems,
          data,
          backgroundColor:
            chartType === "bar" ? backgroundColors : "rgba(120, 212, 46, 0.6)",
          borderColor: "rgba(120, 212, 46, 1)",
          borderWidth: 2,
          pointBackgroundColor: labels.map((_, i) =>
            i === labels.length - 1 ? "red" : "rgba(120, 212, 46, 1)"
          ),
        },
      ],
    });
  };

  return (
    <div className="widget-content">
      <p className="widget-content-header">{languages[language].chartHeader}</p>
      <div className="sales-chart">
        <div className="chart-container">
          {chartData && (
            <>
              {chartType === "bar" ? (
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      title: {
                        display: true,
                        text: languages[language].chartTitle,
                        font: { size: 18 },
                        color: textColor,
                      },
                    },
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: languages[language].timeLabel,
                          font: { size: 14 },
                          color: textColor,
                        },
                        ticks: { color: textColor },
                        grid: { color: "#888888" },
                      },
                      y: {
                        title: {
                          display: true,
                          text:
                            dataType === "revenue"
                              ? languages[language].valueLabel
                              : languages[language].quantityLabel,
                          font: { size: 14 },
                          color: textColor,
                        },
                        ticks: { color: textColor },
                        grid: { color: "#888888" },
                      },
                    },
                  }}
                />
              ) : (
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      title: {
                        display: true,
                        text: languages[language].chartTitle,
                        font: { size: 18 },
                        color: textColor,
                      },
                    },
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: languages[language].timeLabel,
                          font: { size: 14 },
                          color: textColor,
                        },
                        ticks: { color: textColor },
                        grid: { color: "#888888" },
                      },
                      y: {
                        title: {
                          display: true,
                          text:
                            dataType === "revenue"
                              ? languages[language].valueLabel
                              : languages[language].quantityLabel,
                          font: { size: 14 },
                          color: textColor,
                        },
                        ticks: { color: textColor },
                        grid: { color: "#888888" },
                      },
                    },
                  }}
                />
              )}
            </>
          )}
        </div>

        <div className="chart-controls-container">
          <div className="chart-controls">
            <div className="chart-options">
              <p className="chart-options-header">
                {languages[language].dataType}
              </p>
              <label>
                <input
                  type="radio"
                  name="dataType"
                  checked={dataType === "revenue"}
                  onChange={() => setDataType("revenue")}
                />
                <span>{languages[language].revenue}</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="dataType"
                  checked={dataType === "soldItems"}
                  onChange={() => setDataType("soldItems")}
                />
                <span>{languages[language].sales}</span>
              </label>
            </div>

            <div className="chart-options">
              <p className="chart-options-header">
                {languages[language].chartType}
              </p>
              <label>
                <input
                  type="radio"
                  name="chartType"
                  checked={chartType === "line"}
                  onChange={() => setChartType("line")}
                />
                <span>{languages[language].lineChart}</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="chartType"
                  checked={chartType === "bar"}
                  onChange={() => setChartType("bar")}
                />
                <span>{languages[language].barChart}</span>
              </label>
            </div>

            <div className="chart-options">
              <p className="chart-options-header">
                {languages[language].timeRange}
              </p>
              <label>
                <input
                  type="radio"
                  name="timeRange"
                  checked={timeRange === "today"}
                  onChange={() => setTimeRange("today")}
                />
                <span>{languages[language].today}</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="timeRange"
                  checked={timeRange === "this_week"}
                  onChange={() => setTimeRange("this_week")}
                />
                <span>{languages[language].thisWeek}</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="timeRange"
                  checked={timeRange === "last_week"}
                  onChange={() => setTimeRange("last_week")}
                />
                <span>{languages[language].lastWeek}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;

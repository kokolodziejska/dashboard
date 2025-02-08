import React from "react";
import SalesChart from "./chart/SalesChart";
import Orders from "./orders/Orders";
import SalesQuality from "./quality/SalesQuality";
import CustomerReviews from "./opinions/CustomerReviews";
import Ranking from "./ranking/Ranking";
import "../../styles/WidgetsContainer.css";

const WidgetsContainer = () => {
  return (
    <div className="widgets-container">
      <div className="widget sales-chart">
        <SalesChart />
      </div>
      <div className="widget orders">
        <Orders />
      </div>
      <div className="widget sales-quality">
        <SalesQuality />
      </div>
      <div className="widget customer-reviews">
        <CustomerReviews />
      </div>
      <div className="widget ranking">
        <Ranking />
      </div>
    </div>
  );
};

export default WidgetsContainer;

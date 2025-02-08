import React, { useState, useEffect } from "react";
import "../../../styles/Widget.css";
import { MdArrowForwardIos } from "react-icons/md";
import { useSelector } from "react-redux";
import { languages } from "../../../features/Language";
import OrdersWindow from "./OrdersWindow";

const Orders = () => {
  const [orders, setOrders] = useState({ unpaid: 0, unshipped: 0, returns: 0 });
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const selectedShop = useSelector((state) => state.selectedShop);
  const language = useSelector((state) => state.language);

  const fetchOrders = async (shopId) => {
    try {
      console.log("Pobieranie zamówień dla sklepu o ID:", shopId);
      const response = await fetch("/database/shops.json");
      const allShops = await response.json();
      const shopIdNumber = parseInt(shopId, 10);
      const shop = allShops.find((shop) => shop.id === shopIdNumber);

      if (shop && shop.orders_list) {
        const unpaid = shop.orders_list.filter(
          (order) => order.category === "nieopłacone"
        ).length;
        const unshipped = shop.orders_list.filter(
          (order) => order.category === "niewysłane"
        ).length;
        const returns = shop.orders_list.filter(
          (order) => order.category === "zwroty"
        ).length;

        setOrders({ unpaid, unshipped, returns });
      } else {
        console.error("Nie znaleziono sklepu lub brak zamówień o ID:", shopId);
      }
    } catch (error) {
      console.error("Błąd pobierania danych o zamówieniach:", error);
    }
  };

  useEffect(() => {
    if (selectedShop) {
      fetchOrders(selectedShop);
    }
  }, [selectedShop]);

  const openPopup = (categoryName) => {
    setSelectedCategory(categoryName);
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
    setSelectedCategory("");
  };

  if (!orders) {
    return <div>{languages[language].loadingOrders}</div>;
  }

  if (orders.unpaid === 0 && orders.unshipped === 0 && orders.returns === 0) {
    return (
      <div className="widget-content">
        <p className="widget-content-header">
          {languages[language].ordersHeader}
        </p>
        <div className="widget-orders-container">
          <div className="nodata-info">{languages[language].noOrders}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="widget-content">
      <p className="widget-content-header">
        {languages[language].ordersHeader}
      </p>
      <div className="widget-orders-container">
        <div className="widget-orders-category">
          <div className="widget-orders-category-header">
            <p className="widget-orders-category-header-label">
              {languages[language].sendTitle}
            </p>
            <button
              className="widget-orders-category-header-goto"
              onClick={() => openPopup(languages[language].sendTitle)}
            >
              <MdArrowForwardIos />
            </button>
          </div>
          <p className="widget-orders-category-number">{orders.unshipped}</p>
        </div>
        <div className="widget-orders-category">
          <div className="widget-orders-category-header">
            <p className="widget-orders-category-header-label">
              {languages[language].payTitle}
            </p>
            <button
              className="widget-orders-category-header-goto"
              onClick={() => openPopup(languages[language].payTitle)}
            >
              <MdArrowForwardIos />
            </button>
          </div>
          <p className="widget-orders-category-number">{orders.unpaid}</p>
        </div>
        <div className="widget-orders-category">
          <div className="widget-orders-category-header">
            <p className="widget-orders-category-header-label">
              {languages[language].returnsTitle}
            </p>
            <button
              className="widget-orders-category-header-goto"
              onClick={() => openPopup(languages[language].returnsTitle)}
            >
              <MdArrowForwardIos />
            </button>
          </div>
          <p className="widget-orders-category-number">{orders.returns}</p>
        </div>
      </div>
      {popupVisible && (
        <OrdersWindow category={selectedCategory} onClose={closePopup} />
      )}
    </div>
  );
};

export default Orders;

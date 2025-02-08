import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { languages } from "../../../features/Language";
import { MdArrowForwardIos } from "react-icons/md";
import SalesQualityWindow from "./SalesQualityWindow";

const SalesQuality = () => {
  const [quality, setQuality] = useState(null);
  const [qualityThree, setQualityThree] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [category, setCategory] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);

  const language = useSelector((state) => state.language);
  const selectedShop = useSelector((state) => state.selectedShop);

  const assignSellerCategory = () => {
    if (averageRating >= 8.1) {
      setCategory(languages[language].categoryS);
    } else if (averageRating >= 6.1) {
      setCategory(languages[language].categoryA);
    } else if (averageRating >= 4.1) {
      setCategory(languages[language].categoryB);
    } else if (averageRating >= 2.1) {
      setCategory(languages[language].categoryC);
    } else {
      setCategory(languages[language].categoryD);
    }
  };

  const calculateAverageRating = () => {
    if (quality) {
      const ratings = Object.values(quality);
      const sum = ratings.reduce((acc, value) => acc + value, 0);
      setAverageRating((sum / ratings.length).toFixed(2));
    }
  };

  const selectThree = () => {
    if (quality) {
      const evaluationsArray = Object.entries(quality);
      evaluationsArray.sort((a, b) => a[1] - b[1]);
      setQualityThree(evaluationsArray.slice(0, 3));
    }
  };

  const fetchQuality = async (shopId) => {
    try {
      const shopsResponse = await fetch("/database/shops.json");
      const allShops = await shopsResponse.json();
      const shop = allShops.find((shop) => shop.id === parseInt(shopId, 10));

      if (shop) {
        setQuality(shop.evaluation);
      }
    } catch (error) {
      console.error("Błąd pobierania danych:", error);
    }
  };

  useEffect(() => {
    if (selectedShop) {
      fetchQuality(selectedShop);
    }
  }, [selectedShop]);

  useEffect(() => {
    if (quality) {
      selectThree();
      calculateAverageRating();
    }
  }, [quality]);

  useEffect(() => {
    if (averageRating !== null) {
      assignSellerCategory();
    }
  }, [averageRating, language]);

  const openPopup = () => {
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  if (!quality) {
    return <div>{languages[language].loadingQuality}</div>;
  }

  if (Object.values(quality).every((value) => value === 0)) {
    return (
      <div className="widget-content">
        <p className="widget-content-header">
          {languages[language].qualityHeader}
        </p>
        <div className="widget-orders-container">
          <div className="nodata-info">{languages[language].noQuality}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="widget-content">
      <div
        className="widget-content-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>{languages[language].qualityHeader}</span>
        <button
          className="widget-orders-category-header-goto-header"
          onClick={openPopup}
          style={{ marginRight: "0.5vw" }}
        >
          <MdArrowForwardIos />
        </button>
      </div>

      <div className="overall-rating">
        <span className="rating-text">{category}</span>
        <div className="rating-score">
          <p>{averageRating}</p>
          <p>/</p>
          <p>10</p>
        </div>
      </div>

      <div className="rating-table">
        <div className="rating-row-header">
          {qualityThree &&
            qualityThree.map((item, index) => (
              <div
                className={`rating-cell-top ${
                  index === 1 ? "rating-cell-mid" : ""
                }`}
                key={item[0]}
              >
                <p>{languages[language].categories[item[0]] || item[0]}</p>
              </div>
            ))}
        </div>

        {qualityThree && (
          <div className="rating-row">
            {qualityThree.map((item, index) => (
              <div
                className={`rating-cell ${
                  index === 1 ? "rating-cell-mid" : ""
                }`}
                key={item[0]}
              >
                <p>{item[1]}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      {popupVisible && <SalesQualityWindow onClose={closePopup} />}
    </div>
  );
};

export default SalesQuality;

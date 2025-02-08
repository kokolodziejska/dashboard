import React, { useState, useEffect } from "react";
import "../../../styles/Widget.css";
import { MdArrowForwardIos } from "react-icons/md";
import { useSelector } from "react-redux";
import { languages } from "../../../features/Language";
import CustomerReviewsWindow from "./CustomerReviewsWindow";

const CustomerReviews = () => {
  const [reviews, setReviews] = useState(null);
  const [reviewsToShow, setReviewsToShow] = useState([]);
  const [positive, setPositive] = useState(false);
  const [negative, setNegative] = useState(false);
  const [all, setAll] = useState(true);
  const [popupVisible, setPopupVisible] = useState(false);

  const language = useSelector((state) => state.language);
  const selectedShop = useSelector((state) => state.selectedShop);

  const fetchReviews = async (shopId) => {
    try {
      console.log("Pobieranie opinii dla sklepu o ID:", shopId);
      const shopsResponse = await fetch("/database/shops.json");
      const allShops = await shopsResponse.json();
      const shopIdNumber = parseInt(shopId, 10);
      const shop = allShops.find((shop) => shop.id === shopIdNumber);

      if (shop) {
        setReviews(shop.opinions);
      } else {
        console.error("Nie znaleziono sklepu o ID:", shopId);
      }
    } catch (error) {
      console.error("Błąd pobierania danych o opiniach:", error);
    }
  };

  useEffect(() => {
    if (selectedShop) {
      fetchReviews(selectedShop);
    }
  }, [selectedShop]);

  useEffect(() => {
    if (reviews) {
      filterReviews();
    }
  }, [reviews, all, positive, negative]);

  const handleFilterChange = (filterType) => {
    if (filterType === "wszystkie") {
      setAll(true);
      setPositive(false);
      setNegative(false);
    } else if (filterType === "pozytywne") {
      setPositive(true);
      setAll(false);
      setNegative(false);
    } else if (filterType === "negatywne") {
      setNegative(true);
      setAll(false);
      setPositive(false);
    }
  };

  const filterReviews = () => {
    let reviewsToDisplay = [];

    if (all) {
      reviewsToDisplay = reviews.slice(0, 5);
    } else if (positive) {
      reviewsToDisplay = reviews
        .filter((review) => review.rating >= 5)
        .slice(0, 5);
    } else if (negative) {
      reviewsToDisplay = reviews
        .filter((review) => review.rating <= 4)
        .slice(0, 5);
    }

    setReviewsToShow(reviewsToDisplay);
  };

  const openPopup = () => {
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  if (!reviews) {
    return <div>{languages[language].loadingOpinions}</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="widget-content">
        <p className="widget-content-header">
          {languages[language].opinionsHeader}
        </p>
        <div className="widget-orders-container">
          <div className="nodata-info">{languages[language].noOpinions}</div>
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
        <span>{languages[language].opinionsHeader}</span>
        <button
          className="widget-orders-category-header-goto-header"
          onClick={openPopup}
          style={{ marginRight: "0.5vw" }}
        >
          <MdArrowForwardIos />
        </button>
      </div>

      <div className="opinions-filters">
        <label>
          <input
            type="radio"
            name="opinion-filter"
            checked={all}
            onChange={() => handleFilterChange("wszystkie")}
          />
          <span>{languages[language].allToggle}</span>
        </label>
        <label>
          <input
            type="radio"
            name="opinion-filter"
            checked={positive}
            onChange={() => handleFilterChange("pozytywne")}
          />
          <span>{languages[language].positiveToggle}</span>
        </label>
        <label>
          <input
            type="radio"
            name="opinion-filter"
            checked={negative}
            onChange={() => handleFilterChange("negatywne")}
          />
          <span>{languages[language].negativeToggle}</span>
        </label>
      </div>

      <div className="opinions-table">
        <div className="opinions-row header">
          <div className="opinions-cell opinions-cell-right-header mark-cell ">
            {languages[language].ratingTitle}
          </div>
          <div className="opinions-cell opinions-cell-right-header">
            {languages[language].opinionTitle}
          </div>
        </div>

        {reviewsToShow.map((review, index) => (
          <div className="opinions-row" key={index}>
            <div className="opinions-cell opinions-cell-mark mark opinions-cell-right">
              {review.rating}
            </div>
            <div className="opinions-cell mark opinions-cell-right-left">
              {review.comment || ""}
            </div>
          </div>
        ))}
      </div>

      {popupVisible && <CustomerReviewsWindow onClose={closePopup} />}
    </div>
  );
};

export default CustomerReviews;

import React, { useState, useEffect } from "react";
import "../../../styles/Widget.css";
import { useSelector } from "react-redux";
import { languages } from "../../../features/Language";

const Ranking = () => {
  const selectedShop = useSelector((state) => state.selectedShop);
  const [offers, setOffers] = useState([]);
  const [rankingOption, setRankingOption] = useState("most");
  const language = useSelector((state) => state.language);

  useEffect(() => {
    if (selectedShop) {
      fetch("/database/shops.json")
        .then((res) => res.json())
        .then((data) => {
          const shop = data.find((s) => s.id === parseInt(selectedShop, 10));
          if (shop && shop.offers) {
            setOffers(shop.offers);
          }
        })
        .catch((error) =>
          console.error("Błąd pobierania danych sklepu:", error)
        );
    }
  }, [selectedShop]);

  if (!offers || offers.length === 0) {
    return (
      <div className="widget-content">
        <p className="widget-content-header">
          {languages[language].rankingHeader}
        </p>
        <div className="widget-orders-container">
          <div className="nodata-info">{languages[language].noRanking}</div>
        </div>
      </div>
    );
  }

  const sortedOffers =
    rankingOption === "most"
      ? [...offers].sort((a, b) => b.sold * b.price - a.sold * a.price)
      : [...offers].sort((a, b) => a.sold * 7 - b.sold * 7);

  const topOffers = sortedOffers.slice(0, 5);

  return (
    <div className="widget-content">
      <p className="widget-content-header">
        {languages[language].rankingHeader}
      </p>

      <div className="opinions-filters">
        <label>
          <input
            type="radio"
            name="ranking-filter"
            checked={rankingOption === "most"}
            onChange={() => setRankingOption("most")}
          />
          <span>{languages[language].oftenToggle}</span>
        </label>
        <label>
          <input
            type="radio"
            name="ranking-filter"
            checked={rankingOption === "least"}
            onChange={() => setRankingOption("least")}
          />
          <span>{languages[language].rarelyToggle}</span>
        </label>
      </div>

      <div className="opinions-table">
        <div className="opinions-row header">
          <div className="opinions-cell ">{languages[language].nameRank}</div>
          <div className="opinions-cell mark-cell">
            {languages[language].pictureRank}
          </div>
          <div className="opinions-cell ">{languages[language].amoutRank}</div>
          <div className="opinions-cell ">
            {rankingOption === "most"
              ? languages[language].revenueRank
              : languages[language].viewsRank}
          </div>
        </div>
        {topOffers.map((offer) => (
          <div className="opinions-row" key={offer.id}>
            <div className="opinions-cell opinions-cell-right">
              {offer.name.length > 10 ? offer.name.slice(0, 10) : offer.name}
            </div>
            <div className="opinions-cell opinions-cell-right">
              {offer.image === "image" ? (
                <img
                  src="./database/TempImage.jpg"
                  alt="temp"
                  width="20"
                  height="20"
                />
              ) : (
                "X"
              )}
            </div>
            <div className="opinions-cell opinions-cell-right">
              {offer.sold}
            </div>
            <div className="opinions-cell opinions-cell-right">
              {rankingOption === "most"
                ? offer.sold * offer.price
                : offer.sold * 7}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ranking;

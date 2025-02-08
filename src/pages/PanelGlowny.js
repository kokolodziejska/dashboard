import React, { useState, useEffect } from "react";
import Header from "../components/menu/header/Header";
import Footer from "../components/menu/footer/Footer";
import LeftMenu from "../components/menu/leftmenu/LeftMenu";
import WidgetsContainer from "../components/widgets/WidgetsContainer";
import "../styles/PanelGlowny.css";
import { useSelector } from "react-redux";
import { languages } from "../features/Language";

const PanelGlowny = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const language = useSelector((state) => state.language);

  const [quote, setQuote] = useState("");

  useEffect(() => {
    const quotes = [
      languages[language].quote1,
      languages[language].quote2,
      languages[language].quote3,
      languages[language].quote4,
      languages[language].quote5,
    ];
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, [language]);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <>
      <Header
        showMenuToggle={true}
        toggleMenu={toggleMenu}
        menuVisible={menuVisible}
      />
      <div className="main-container">
        <LeftMenu
          cytat={quote}
          isVisible={menuVisible}
          toggleMenu={toggleMenu}
        />
        <div className="panel-glowny">
          <WidgetsContainer />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PanelGlowny;

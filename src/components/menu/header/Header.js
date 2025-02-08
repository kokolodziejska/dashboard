import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../../../styles/Header.css";
import { getTheme, setTheme } from "../../../features/Theme";
import { setLanguage } from "../../../features/reducer";
import { languages } from "../../../features/Language";
import { FaMoon, FaSun } from "react-icons/fa";

const Header = (props) => {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.language);
  const [theme, setThemeState] = useState(getTheme());

  useEffect(() => {
    setTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  const toggleLanguage = () => {
    dispatch(setLanguage(language === "pl" ? "en" : "pl"));
  };

  return (
    <div className="header-container">
      <header className="header">
        <div className="header-left">
          {props.showMenuToggle && (
            <button className="menu-toggle" onClick={props.toggleMenu}>
              {props.menuVisible ? "▲" : "▼"}
            </button>
          )}
          <h1>{languages[language].shopName}</h1>
        </div>

        <div className="header-right">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "dark" ? <FaMoon /> : <FaSun />}
          </button>
          <button className="lang-toggle" onClick={toggleLanguage}>
            {languages[language].langToggle}
          </button>
        </div>
      </header>
    </div>
  );
};

export default Header;

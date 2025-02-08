import React, { useState } from "react";
import { useSelector } from "react-redux";
import Header from "../components/menu/header/Header";
import Footer from "../components/menu/footer/Footer";
import "../styles/PanelLogowania.css";
import { authenticate } from "../features/Auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { languages } from "../features/Language";

const PanelLogowania = () => {
  let [userName, setUserName] = useState("");
  let [password, setPassword] = useState("");
  let [error, setError] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const language = useSelector((state) => state.language);

  let onLogin = async (e) => {
    e.preventDefault();

    const success = await authenticate(userName, password, dispatch);

    if (success) {
      navigate("/panel");
    } else {
      setError(true);
    }
  };

  return (
    <div className="panel-logowania">
      <Header showMenuToggle={false} />
      <div className="content">
        <div className="login-container">
          <h1 className="login-text">{languages[language].login}</h1>
          <form className="login-form" onSubmit={onLogin}>
            <label className="login-label">
              {languages[language].username}
            </label>
            <input
              className="login-input"
              type="text"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
                setError(false);
              }}
            ></input>

            <label className="login-label">
              {languages[language].password}
            </label>
            <input
              className="login-input"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
            ></input>

            <div className="login-button-container">
              <button className="login-button" type="submit">
                {languages[language].loginButton}{" "}
              </button>
              {error && (
                <div className="error">{languages[language].errorLogin}</div>
              )}
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PanelLogowania;

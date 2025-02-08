import React, { useState, useEffect } from "react";
import "../../../styles/LeftMenu.css";
import { authenticatedUser, logout } from "../../../features/Auth";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedShop } from "../../../features/reducer";
import { languages } from "../../../features/Language";

const LeftMenu = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedShop = useSelector((state) => state.selectedShop);
  const [shops, setShops] = useState([]);
  const language = useSelector((state) => state.language);

  useEffect(() => {
    const fetchUserShops = async () => {
      const user = authenticatedUser();
      if (!user) return;

      try {
        const shopsResponse = await fetch("/database/shops.json");
        const allShops = await shopsResponse.json();

        const userShops = allShops.filter((shop) =>
          user.shop_ids.includes(shop.id)
        );

        setShops(userShops);
      } catch (error) {
        console.error("Błąd pobierania sklepów:", error);
      }
    };

    fetchUserShops();
  }, []);

  const Logout = (e) => {
    e.preventDefault();
    logout();
    navigate("/");
  };

  const handleShopChange = async (shopId) => {
    dispatch(setSelectedShop(shopId));
    navigate("/panel");
  };

  return (
    <aside className={`left-menu ${props.isVisible ? "visible" : ""}`}>
      <nav className="menu-content">
        <h2 className="left-menu-quote">{props.cytat}</h2>
        <div className="left-menu-shop-button-contaoner">
          {shops.map((shop) => (
            <button
              className={`left-menu-shop-button ${
                selectedShop === shop.id ? "active" : ""
              }`}
              key={shop.id}
              onClick={() => handleShopChange(shop.id)}
            >
              {shop.name}
            </button>
          ))}
        </div>

        <div>
          <h3 className="leftmenu-user">
            <FaUser className="user-icon" />
            <span>
              {authenticatedUser()
                ? authenticatedUser().username
                : languages[language].noLogin}
            </span>
          </h3>
        </div>

        <div className="left-menu-button-contaoner">
          <button className="left-menu-button" onClick={Logout}>
            {languages[language].logoutButton}
          </button>
          <button className="left-menu-button">
            {languages[language].settingsButton}
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default LeftMenu;

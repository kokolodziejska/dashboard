import React, { useRef } from "react";
import Draggable from "react-draggable";
import "../../../styles/Widget.css";
import { useSelector } from "react-redux";
import { languages } from "../../../features/Language";

const OrdersWindow = ({ category, onClose }) => {
  const nodeRef = useRef(null);
  const language = useSelector((state) => state.language);

  return (
    <div className="popup-overlay" onClick={onClose}>
      <Draggable nodeRef={nodeRef} handle=".popup-header">
        <div
          ref={nodeRef}
          className="popup-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="popup-header">
            <span>{languages[language].ordersHeader + ` - ${category}`}</span>
            <button className="popup-close-button" onClick={onClose}>
              X
            </button>
          </div>
          <div className="popup-body">{languages[language].popupInfo}</div>
        </div>
      </Draggable>
    </div>
  );
};

export default OrdersWindow;

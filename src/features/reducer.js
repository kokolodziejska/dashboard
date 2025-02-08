const initialState = {
  selectedShop: 1,
  language: localStorage.getItem("language") || "pl",
};

export function setSelectedShop(shopId) {
  return {
    type: "CHANGE_SHOP",
    payload: shopId,
  };
}

export function setLanguage(lang) {
  localStorage.setItem("language", lang);
  return {
    type: "CHANGE_LANGUAGE",
    payload: lang,
  };
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHANGE_SHOP":
      return {
        ...state,
        selectedShop: action.payload,
      };
    case "CHANGE_LANGUAGE":
      return {
        ...state,
        language: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;

export const getTheme = () => {
  return localStorage.getItem("theme") || "dark";
};

export const setTheme = (theme) => {
  document.documentElement.setAttribute("theme", theme);
  localStorage.setItem("theme", theme);
};

import { setSelectedShop } from "./reducer";

const usersFile = "/database/users.json";

const AppAuth = {
  authenticatedUser: null,
};

async function getUsers() {
  try {
    const response = await fetch(usersFile);

    if (!response.ok) {
      console.error("Błąd wczytywania pliku JSON:", response.status);
      return [];
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error("Błąd: Plik JSON nie zwrócił poprawnej tablicy!");
      return [];
    }

    return data;
  } catch (error) {
    console.error("Błąd pobierania użytkowników:", error);
    return [];
  }
}

export function isAuthenticated() {
  return AppAuth.authenticatedUser !== null;
}

export function authenticatedUser() {
  return AppAuth.authenticatedUser;
}

export async function authenticate(user, pass, dispatch) {
  const users = await getUsers();

  if (!users || users.length === 0) {
    console.error("Brak danych użytkowników!");
    return false;
  }

  const foundUser = users.find((u) => u.username === user);

  if (!foundUser) {
    console.warn("Nie znaleziono użytkownika w bazie:", user);
    return false;
  }

  if (foundUser.password_hash !== pass) {
    console.warn("Niepoprawne hasło dla użytkownika:", user);
    return false;
  }

  AppAuth.authenticatedUser = foundUser;
  console.log("Zalogowano:", foundUser.username);

  if (foundUser.shop_ids.length > 0) {
    dispatch(setSelectedShop(foundUser.shop_ids[0]));
    console.log("Ustawiono nowy sklep o ID:", foundUser.shop_ids[0]);
  }

  return true;
}

export function logout() {
  AppAuth.authenticatedUser = null;
}

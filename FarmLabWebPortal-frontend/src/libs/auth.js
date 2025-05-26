export const loadAuthUser = () => {
    const userFromStorage = localStorage.getItem("user");
    if (userFromStorage) {
        return JSON.parse(userFromStorage);
    }
    return {
        id: null,
        username: null,
        email: null,
    }
}
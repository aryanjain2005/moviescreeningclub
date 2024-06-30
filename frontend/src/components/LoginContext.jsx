import  { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const LoginContext = createContext();

export const useLogin = () => useContext(LoginContext);

export const LoginProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        localStorage.removeItem('token');
        setLoggedIn(false);
      } else {
        setLoggedIn(true);
        const expirationTime = decodedToken.exp - currentTime;
        const timer = setTimeout(() => {
          localStorage.removeItem('token');
          setLoggedIn(false);
        }, expirationTime * 1000);
        return () => clearTimeout(timer);
      }
    } else {
      setLoggedIn(false);
    }
  }, []);

  const login = () => setLoggedIn(true);
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUserEmail');
    localStorage.removeItem('signupEmail');
    localStorage.removeItem('userType');
    localStorage.removeItem('getotpEmail');
    setLoggedIn(false);
  };

  return (
    <LoginContext.Provider value={{ loggedIn, login, logout }}>
      {children}
    </LoginContext.Provider>
  );
};

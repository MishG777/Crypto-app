import React, { Fragment, useState, useEffect } from "react";
import {
  Switch,
  Route,
  Redirect,
  useHistory,
  useLocation,
} from "react-router-dom";
import CoinDetails from "./components/CoinDetails";
import Coins from "./components/Coins";
import MainHeader from "./components/Navbar/MainHeader";

import LogIn from "./components/UserLogging/LogIn";

function App() {
  const [logIn, setLogin] = useState(false);
  const location = useLocation();

  const OnLogInPage = location.pathname === "/log-in";
  const history = useHistory();

  useEffect(() => {
    const CryptoPage = localStorage.getItem("CryptoPage");

    if (CryptoPage === "2") {
      setLogin(true);
    }
    if (OnLogInPage) {
      setLogin(false);
    }
  }, [OnLogInPage]);

  const logOutHandler = () => {
    setLogin(false);
    localStorage.removeItem("CryptoPage");
  };

  const logInHandler = () => {
    localStorage.setItem("CryptoPage", "2");
    setLogin(true);

    history.push("/all-coins");
  };

  return (
    <Fragment>
      <header>
        <MainHeader logOutHandler={logOutHandler} logIn={logIn} />
      </header>
      <main>
        <Switch>
          <Route path="/" exact>
            <Redirect to="/log-in" />
          </Route>

          <Route path="/all-coins" exact>
            <Coins />
          </Route>

          <Route path="/all-coins/:coins">
            <CoinDetails />
          </Route>
          <Route path="/log-in">
            <LogIn logInHandler={logInHandler} />
          </Route>
        </Switch>
      </main>
    </Fragment>
  );
}

export default App;

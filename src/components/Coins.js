import React, { useState, useEffect, Fragment, useCallback } from "react";
import axios from "axios";
import CoinItems from "./CoinItems";
import classes from "./Coins.module.css";
import loader from "../components/img/loading.png";
import { CoinPages } from "./Footer/CoinPages";
import Button from "./UI/Button";
import { useHistory, useLocation } from "react-router-dom";

// const sortCoins = (coins, ascending) => {
//   return coins.sort((quoteA, quoteB) => {
//     if (ascending) {
//       return quoteA.id > quoteB.id ? 1 : -1;
//     } else {
//       return quoteA.id < quoteB.id ? 1 : -1;
//     }
//   });
// };

function Coins() {
  const [coins, setCoins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  const [fetchedCoinsAmount, setFetchedCoinsAmount] = useState(125);
  const [noMoreCoins, setNoMoreCoins] = useState(false);

  const [fetchNextPage, setFetchNextPage] = useState(1);
  const [secondPageFetched, setSecondPageFetched] = useState(false);

  const [currency, setCurrency] = useState("usd");

  const history = useHistory();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const mcSorting = queryParams.get("McSort") === "asc";
  const chosenCurrency = queryParams.get("currency");

  useEffect(() => {
    setCurrency(chosenCurrency);
  }, [chosenCurrency]);

  console.log(chosenCurrency);

  let URL = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_${
    mcSorting ? "asc" : "desc"
  }&per_page=${fetchedCoinsAmount}&page=${fetchNextPage}&sparkline=false`;

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    axios
      .get(URL)
      .then((res) => {
        const CoinsData = res.data;
        setCoins(CoinsData);
      })
      .catch((error) => setError(error.message));
    setIsLoading(false);
  }, [URL]);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );

  //===================FETCH MORE COINS

  const fetchMoreCoins = () => {
    setIsLoading(true);
    setFetchedCoinsAmount((moreCoins) => moreCoins + moreCoins * 2);
    if (fetchedCoinsAmount > 250) {
      setNoMoreCoins(true);
    }
    setIsLoading(false);
  };

  const showPagesNumHandler = (page) => {
    history.push(`/all-coins?page=${page}`);
  };

  //=================== FETCH NEXT PAGE

  const fetchSecondPageHandler = useCallback(() => {
    setIsLoading(true);
    setFetchNextPage((nextPage) => nextPage + 1);
    const nextPage = fetchNextPage + 1;
    history.push(`/all-coins?page=${nextPage}`);

    setSecondPageFetched(true);
    setIsLoading(false);
  }, [fetchNextPage, history]);

  //================= PREVIOUS PAGE

  const prevousPageHandler = useCallback(() => {
    setIsLoading(true);
    setFetchNextPage((nextPage) => nextPage - 1);
    const prevPage = fetchNextPage - 1;
    history.push(`/all-coins?page=${prevPage}`);
    setIsLoading(false);
  }, [fetchNextPage, history]);

  //=================== SORTING COINS

  // const changeSortingHandler = () => {
  //   history.push(`/all-coins?Namesort=${isSortingAscending ? "desc" : "asc"}`);
  // };

  //==================== SORT BY MARKET CAP

  const sortByMcHandler = () => {
    setIsLoading(true);
    history.push(`${location.pathname}?McSort=${mcSorting ? "desc" : "asc"}`);
    setIsLoading(false);
  };

  // const sortedCoinsByName = sortCoins(filteredCoins, isSortingAscending);

  return (
    <Fragment>
      <div className={classes.main}>
        <div className={classes["coin-search"]}>
          <h1 className={classes["coin-text"]}>Search a Currency</h1>
          <form>
            <input
              type="search"
              placeholder="Search for Crypto Currencies"
              className={classes["coin-input"]}
              onChange={handleChange}
            />
          </form>
        </div>
        <div>
          {/* <Button onClick={changeSortingHandler}>
            Sort {isSortingAscending ? "Ascending" : "Descending"}
          </Button> */}
          <Button onClick={sortByMcHandler}>
            Sort MC by {mcSorting ? "Ascending ⇧" : "Descending ⇩"}
          </Button>
        </div>

        {!isLoading && coins.length > 0 && (
          <div className={classes["all-coins"]}>
            {filteredCoins.map((coin) => {
              return <CoinItems currency={currency} key={coin.id} {...coin} />;
            })}
          </div>
        )}
        {!noMoreCoins && <Button onClick={fetchMoreCoins}>fetch more</Button>}

        {noMoreCoins && (
          <div>
            {!secondPageFetched && (
              <h4 className={classes.noMoreFetch}>No more coins to fetch!</h4>
            )}
            {secondPageFetched && fetchNextPage > 1 && (
              <Button onClick={prevousPageHandler}>previous page</Button>
            )}
            <Button onClick={fetchSecondPageHandler}>go to next page</Button>
          </div>
        )}

        {isLoading && (
          <img src={loader} alt="loading..." className={classes.loader} />
        )}
        <h2 className={classes.error}>{error}</h2>
      </div>
      <CoinPages
        showPagesNumHandler={showPagesNumHandler}
        setFetchNextPage={setFetchNextPage}
      />
    </Fragment>
  );
}

export default Coins;

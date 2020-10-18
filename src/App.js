import React, { useEffect, useState } from "react";
import firebase from "firebase";
import db from "./firebase.js";
import getStockInfo from "./getStockInfo.js";

function App() {
  //리액트 훅으로 함수형 컴포넌트 state설정
  const [keyword, setKeyword] = useState("");
  const [corpData, setCorpData] = useState({});
  const [stockList, setStockList] = useState({});
  const getStockData = (e) => {
    e.preventDefault();
    db.collection("corp_codes")
      .where("corp_name", "==", keyword)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setCorpData({
            corp_name: doc.data().corp_name,
            corp_code: doc.data().corp_code,
          });
          setKeyword("");
        });
      });
    setStockList(getStockInfo(corpData.corp_code));
  };

  return (
    <div className="App">
      <div className="container">
        <div className="sidebar">
          <form action="/" method="get">
            <input
              type="text"
              className="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button
              disabled={!keyword}
              className="search_btn"
              onClick={getStockData}
            >
              search
            </button>
          </form>
          <div className="corp_list">{corpData.corp_name}</div>
        </div>
        <div className="contents">
          <div className="chart">{stockList}</div>
          <div className="news_container"></div>
        </div>
      </div>
    </div>
  );
}

export default App;

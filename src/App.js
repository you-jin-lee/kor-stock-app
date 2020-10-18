import React, { useEffect, useState } from "react";
import firebase from "firebase";
import db from "./firebase.js";

function App() {
  //리액트 훅으로 함수형 컴포넌트 state설정
  const [keyword, setKeyword] = useState("");
  const [corpData, setCorpData] = useState({});
  const [stockList, setStockList] = useState({});

  useEffect(() => {
    const { corp_code } = corpData;
    fetch("http://localhost:3002/corp", {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ corp_code: corp_code }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.corp_code);
      });
  }, [corpData]);

  const getStockData = async (e) => {
    e.preventDefault();
    await db
      .collection("corp_codes")
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
  };

  return (
    <div className="App">
      <div className="container">
        <div className="sidebar">
          <form action="/corp" method="get">
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
          <div className="corp_list">
            {corpData.corp_name}
            {corpData.corp_code}
          </div>
        </div>
        <div className="contents">
          <div className="chart"></div>
          <div className="news_container"></div>
        </div>
      </div>
    </div>
  );
}

export default App;

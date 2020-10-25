import React, { useState } from "react";
import firebase from "firebase";
import db from "./firebase.js";
import Chart from "../components/Chart.js";
import Newslist from "../components/Newslist.js";
import "./Home.css";

const getStockData = async (keyword) => {
  if (keyword === undefined) {
    return 0;
  } else {
    let code = "";
    let name = "";
    await db
      .collection("corp_codes")
      .where("corp_name", "==", keyword)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          name = doc.data().corp_name;
          code = doc.data().corp_code;
        });
      });
    return { corp_code: code, corp_name: name };
  }
};

function Home() {
  const [keyword, setKeyword] = useState("");
  const [corpName, setCorpName] = useState();
  const [corpCode, setCorpCode] = useState();
  const [clickedDate, setClickedDate] = useState();
  const [wrongCorpName, setWrongCorpName] = useState(false);
  const [corpButton, setCorpButton] = useState([]);

  const chartClickCallback = (date) => {
    setClickedDate(date);
  };

  const fetch = async (keyword) => {
    const obj = await getStockData(keyword);
    if (obj["corp_code"] === "") {
      setWrongCorpName(true);
    } else {
      if (corpButton.includes(keyword) === false) {
        setCorpButton([...corpButton, keyword]);
      }
      setCorpCode(obj["corp_code"]);
    }
  };

  return (
    <div className="home_container">
      <div className="search">
        <div className="box_button">
          <input
            type="text"
            className="search_input"
            placeholder="기업 이름을 입력하세요"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onClick={(e) => setWrongCorpName(false)}
          />
          <button
            disabled={!keyword}
            className="search_btn"
            onClick={() => {
              setCorpName(keyword);
              setKeyword("");
              fetch(keyword);
            }}
          >
            <img src="./search_btn.png" alt="search button" />
          </button>
        </div>
        {wrongCorpName === false ? null : (
          <div className="wrong_corp_name">기업이 존재하지 않습니다.</div>
        )}
        <div className="corpButton">
          {corpButton.length === 0
            ? null
            : corpButton.map((curr, i) => {
                return (
                  <button
                    key={i}
                    className="btn"
                    onClick={() => {
                      setCorpName(curr);
                      fetch(curr);
                    }}
                  >
                    {curr}
                  </button>
                );
              })}
        </div>
      </div>
      <div className="contents">
        {corpCode === undefined ? null : (
          <Chart
            corpName={corpName}
            chartClickCallback={chartClickCallback}
            corpCode={corpCode}
          />
        )}
        {corpName === undefined ? null : (
          <div className="stock_info">
            {clickedDate === undefined ? (
              <div className="only_title">{corpName}</div>
            ) : (
              <>
                <div className="title">{corpName}</div>
                <div className="date">| {clickedDate}</div>
              </>
            )}
          </div>
        )}

        {clickedDate === undefined ? null : (
          <Newslist corpName={corpName} clickedDate={clickedDate} />
        )}
      </div>
      <button className="scroll_to_top" onClick={() => window.scrollTo(0, 0)}>
        ▲
      </button>
    </div>
  );
}

export default Home;

import React, { useState, useEffect } from "react";
import News from "./News.js";
import "./Newslist.css";

const fetchData = async (obj) => {
  let result = undefined;
  const { corpName, clickedDate } = obj;
  await fetch(`http://localhost:3002/news`, {
    method: "post",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ corpName: corpName, clickedDate: clickedDate }),
  }).then(async (res) => {
    result = await res.json();
  });
  return result;
};

const Newslist = ({ corpName, clickedDate }) => {
  const [result, setResult] = useState();

  useEffect(() => {
    const fetch = async () => {
      const result = await fetchData({
        corpName: corpName,
        clickedDate: clickedDate,
      });
      setResult(result["newslist"]);
    };

    fetch();
  }, [corpName, clickedDate]);

  return (
    <div className="newslist">
      {result === undefined || result === 0 ? (
        <div className="no_result">
          기사가 없습니다...<span role="img">😥</span>
        </div>
      ) : (
        result.map((curr, index) => {
          return (
            <News
              key={index}
              subject={curr["subject"]}
              summary={curr["summary"]}
              link={curr["link"]}
            />
          );
        })
      )}
    </div>
  );
};

export default Newslist;

function pad(n, width) {
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join("0") + n;
}

function getStockInfo(corpCode) {
  const axios = require("axios");
  const cheerio = require("cheerio");
  corpCode = pad(corpCode, 6);
  const getHtml = async () => {
    try {
      return await axios.get(
        "https://finance.naver.com/item/sise_day.nhn?code=" + corpCode
      );
    } catch (error) {
      console.error(error);
    }
  };
  let ulList = [];
  getHtml().then((html) => {
    const td_index = {
      0: "날짜",
      1: "종가",
      2: "전일비",
      3: "시가",
      4: "고가",
      5: "저가",
      6: "거래량",
    };

    const $ = cheerio.load(html.data);
    const $bodyList = $("tbody").children("tr");

    $bodyList.each(function (i, elem) {
      if ((i >= 2 && i <= 6) || (i >= 10 && i <= 14)) {
        const $trList = $bodyList.children("td");
        let tdList = {};
        $trList.each(function (j, el) {
          tdList[td_index[j]] = $(this.find("span").text());
        });
        ulList.append(tdList);
      }
    });
  });
  return ulList;
}
export default getStockInfo;

const cheerio = require("cheerio");
const page = 25;

const td_index = {
  0: "Date",
  1: "Close",
  2: "전일비",
  3: "Open",
  4: "High",
  5: "Low",
  6: "Volume",
};

const pad = (n, width) => {
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join("0") + n;
};

const getHtml = async (url) => {
  const axios = require("axios");
  try {
    return await axios.get(url);
  } catch (error) {
    console.error(error);
  }
};

const stockPage = (html) => {
  let stocklist = [];
  const $ = cheerio.load(html.data);
  const $bodyList = $("table.type2").children("tbody");
  $bodyList.each(function (i, elem) {
    if (i === 0) {
      const $trList = $(this).children("tr");
      $trList.each(function (j, elem2) {
        if ((j >= 2 && j <= 6) || (j >= 10 && j <= 14)) {
          const $tdList = $(this).children("td");
          const stockdata = {};
          $tdList.each(function (k, elem3) {
            stockdata[td_index[k]] = $(this).text().trim();
          });
          stocklist.push(stockdata);
        }
      });
    }
  });
  return stocklist;
};

const getStockInfo = async (corpCode) => {
  corpCode = pad(corpCode, 6);
  let stocklist = [];
  for (let i = 0; i < page; i++) {
    let url =
      "https://finance.naver.com/item/sise_day.nhn?code=" +
      corpCode +
      "&page=" +
      i;
    var html = await getHtml(url);
    var li = await stockPage(html);
    stocklist = stocklist.concat(li);
  }
  return stocklist;
};

const chart = async (req, res) => {
  var corp_code = req.body.corp_code;
  var result = 0;
  if (corp_code !== undefined) {
    result = await getStockInfo(corp_code);
  }
  return result;
};

module.exports = chart;

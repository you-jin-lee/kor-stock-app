const cheerio = require("cheerio");
const iconv = require("iconv-lite");
let originalLinkList = [];
const getHtml = async (url) => {
  const axios = require("axios");
  try {
    const { data } = await axios({
      url,
      method: "GET",
      responseType: "arraybuffer",
    });
    return data;
  } catch (error) {
    console.error(error);
  }
};
const articleLink = async (linkList, corpName, encodedCorpName) => {
  for (let i = 0; i < linkList.length; i++) {
    const index = linkList[i].indexOf(corpName);
    const url = linkList[i].slice(0, index) + encodedCorpName;
    const data = await getHtml(url);
    const html = iconv.decode(data, "EUC-KR").toString();
    const $ = cheerio.load(html, { decodeEntities: true });
    originalLinkList.push($("a.btn_artialoriginal").attr("href"));
  }
};

const newsList = async (data, corpName, encodedCorpName) => {
  const html = iconv.decode(data, "EUC-KR").toString();
  const $ = cheerio.load(html, { decodeEntities: true });
  const $subject = $("dl.newsList").children("dd.articleSubject");
  const $summary = $("dl.newsList").children("dd.articleSummary");
  const subjectList = [];
  const summaryList = [];
  const linkList = [];
  const newsList = [];

  $subject.each(function (i, elem) {
    let url = "http://finance.naver.com/" + $(this).find($("a")).attr("href");
    linkList.push(url);
    subjectList.push($(this).text().trim());
  });
  $summary.each(function (i, elem) {
    $(this).find("*").remove();
    summaryList.push($(this).text().trim());
  });

  await articleLink(linkList, corpName, encodedCorpName);

  for (let i = 0; i < subjectList.length; i++) {
    newsList.push({
      subject: subjectList[i],
      summary: summaryList[i],
      link: originalLinkList[i],
    });
  }
  originalLinkList.length = 0;

  return newsList;
};

const getNewsList = async (corpName, clickedDate) => {
  let encodedCorpName = escape(
    iconv.encode(corpName, "euc-kr").toString("binary")
  );
  const datelist = clickedDate.split(".");
  const newdate = datelist[0] + "-" + datelist[1] + "-" + datelist[2];
  let url =
    "https://finance.naver.com/news/news_search.nhn?rcdate=1&q=" +
    encodedCorpName +
    "&x=0&y=0&sm=title.basic&pd=4&stDateStart=" +
    newdate +
    "&stDateEnd=" +
    newdate;

  let data = await getHtml(url);
  let news = await newsList(data, corpName, encodedCorpName);

  return news;
};

const news = async (req, res) => {
  var corpName = req.body.corpName;
  var clickedDate = req.body.clickedDate;
  if (corpName !== undefined) {
    const newslist = await getNewsList(corpName, clickedDate);
    if (newslist.length !== 0) {
      return newslist;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
};

module.exports = news;

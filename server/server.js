const express = require("express");
const app = express();
const api = require("./routes/index.js");
const cors = require("cors");
const bodyParser = require("body-parser");
const port = 3002;
const chart = require("./routes/chart.js");
const news = require("./routes/news.js");

app.use(cors());

app.use(bodyParser.json());

app.use("/", api);

app.post("/chart", async function (req, res, next) {
  var result = await chart(req, res);
  res.json(result);
  next();
});

app.post("/news", async function (req, res, next) {
  var result = await news(req, res);
  res.json({ newslist: result });
  next();
});

app.listen(port, () => console.log(`Listening on port ${port}`));

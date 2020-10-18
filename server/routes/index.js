var express = require("express");
var router = express.Router();

router.get("/chart/:id", function (req, res) {
  res.send({ corp_name: `${req.params.id}` });
});

module.exports = router;

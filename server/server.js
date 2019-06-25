const express = require("express");
const controller = require("./controller/index");

const app = express();
const port = 3000;

app.use(express.urlencoded());
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.set("Content-Type", "application/json");
  next();
});

app.get("/", controller.fetchAll);
app.get("/getBankNames", controller.getBankNames);
app.get("/getBranchesNumbers", controller.getBranchesNumbers);
app.get("/getAllDataAboutBank", controller.getAllDataAboutBank);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

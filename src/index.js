const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");
const apiRouter = require("./routes");

const port = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api", apiRouter);

app.get("/", (req, res) => {
  res.send("Hello world");
});

db.authenticate()
  .then(() => {
    console.log("Connected to postgresql");
    return db.sync();
  })
  .then(() => {
    console.log("DB synchronized, starting the server");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

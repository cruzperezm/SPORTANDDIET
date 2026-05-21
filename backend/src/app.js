var express = require("express");
var cors = require("cors");
var authRoutes = require("./routes/auth.routes");
var searchRoutes = require("./routes/search.routes");
var dietRoutes = require("./routes/diet.routes");
var exercisePlanRoutes = require("./routes/sport.routes");
var dashboardRoutes = require("./routes/dashboard.routes");

var app = express();
const PORT = 3000;

app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, " +
        "and App is listening on port " +
        PORT,
    );
  else console.log("Error occurred, server can't start", error);
});

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`[Frontend llama a]: ${req.method} ${req.url}`);
  next();
})
app.use("/api/auth", authRoutes);
app.use("/search", searchRoutes);
app.use("/diets", dietRoutes);
app.use("/exercisePlans", exercisePlanRoutes);
app.use("/api/dashboard", dashboardRoutes);

module.exports = app;

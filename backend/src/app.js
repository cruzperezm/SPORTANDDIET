var express = require("express");
var cors = require("cors");
var authRoutes = require("./routes/auth.routes");
var searchRoutes = require("./routes/search.routes");
var dietRoutes = require("./routes/diet.routes");
var exercisePlanRoutes = require("./routes/sport.routes");
var dashboardRoutes = require("./routes/dashboard.routes");
var profileRoutes = require("./routes/profile.routes");

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
// NUEVO
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use("/api/auth", authRoutes);
app.use("/search", searchRoutes);
app.use("/diets", dietRoutes);
app.use("/exercisePlans", exercisePlanRoutes);
app.use("/dashboard", dashboardRoutes);
app.use('/api', profileRoutes);

app.use(function (err, req, res, next) {
  console.error("Backend Error:", err.message);

  res.status(err.status || 500).json({
    message: err.message,
    error: req.app.get("env") === "development" ? err : {},
  });
});

module.exports = app;

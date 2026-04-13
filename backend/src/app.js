var express = require('express');
var cors = require("cors")
var authRoutes = require("./routes/auth.routes")

var app = express();
const PORT = 3000;

app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, "
            + "and App is listening on port "+ PORT)
    else 
        console.log("Error occurred, server can't start", error);
    }
);

app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes);


app.use(function(err, req, res, next) {
  // Log the error to your terminal so you can see it
  console.error("Backend Error:", err.message);

  res.status(err.status || 500).json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});


module.exports = app;

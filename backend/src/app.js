require('dotenv').config(); // <-- Añadir esto al principio
require('./config/passport'); // <-- Inicializar nuestra estrategia de Google

var createError = require('http-errors');
var express = require('express');
var cors = require("cors")
var authRoutes = require("./routes/auth.routes")

var app = express();
/*const PORT = 3000;

app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, "
            + "and App is listening on port "+ PORT)
    else 
        console.log("Error occurred, server can't start", error);
    }
);
*/
app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.error(err); // Imprimimos el error real en la consola de WebStorm

  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err // Devuelve el error a Angular/Navegador en formato JSON
  });
});

module.exports = app;

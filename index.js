
// init project
var express = require("express");
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

/**
 * Endpoint Principal de la API: /api/:date?
 * Maneja la lógica de conversión de fechas.
 */
app.get("/api/:date?", (req, res) => {
  let dateString = req.params.date;
  let date;

  // --- Caso 1: Parámetro Vacío (Devuelve la hora actual) ---
  if (!dateString) {
    date = new Date();
  }

  // --- Caso 2: Parámetro con Contenido ---
  else {
    // 1. Verificar si la cadena es una marca de tiempo Unix (solo dígitos)
    const isUnixTimestamp = /^\d+$/.test(dateString.trim());

    if (isUnixTimestamp) {
      // Convertir a número (importante para evitar límites de string/int)
      let timestamp = Number(dateString);

      // Si la cadena es un timestamp de 10 dígitos (segundos), la convertimos a milisegundos.
      if (dateString.length === 10) {
        timestamp = timestamp * 1000;
      }

      date = new Date(timestamp);
    } else {
      // Si es una cadena de fecha (ej: "2015-12-25", "March 15, 2020", etc.)
      date = new Date(dateString);
    }
  }

  // --- Verificación de Validez (Prueba 6: Invalid Date) ---

  // Si new Date() no pudo analizar la fecha, getTime() devuelve NaN.
  if (isNaN(date.getTime())) {
    return res.json({ error: "Invalid Date" });
  }

  // --- Respuesta Exitosa (Pruebas 2, 3, 4, 7, 8) ---

  return res.json({
    // Marca de tiempo Unix en milisegundos (como tipo Número)
    unix: date.getTime(),
    // Cadena UTC en el formato requerido (Thu, 01 Jan 1970 00:00:00 GMT)
    utc: date.toUTCString(),
  });
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

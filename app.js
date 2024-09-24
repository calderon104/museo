const express = require("express");
const app = express();
const traducir = require("node-google-translate-skidz");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());

app.use(express.static("public"));

app.get("/traducir", (req, res) => {
  const { titulo, cultura, dinastia, idioma } = req.query;

  const idiomaDestino = idioma || "es"; 

  const promises = [];

  promises.push(
    new Promise((resolve, reject) => {
      traducir(
        {
          text: titulo,
          source: "en",
          target: idiomaDestino,
        },
        (result) => {
          resolve({ tituloTraducido: result.translation });
        }
      );
    })
  );

  promises.push(
    new Promise((resolve, reject) => {
      traducir(
        {
          text: cultura,
          source: "en",
          target: idiomaDestino,
        },
        (result) => {
          resolve({ culturaTraducida: result.translation });
        }
      );
    })
  );

  promises.push(
    new Promise((resolve, reject) => {
      traducir(
        {
          text: dinastia,
          source: "en",
          target: idiomaDestino,
        },
        (result) => {
          resolve({ dinastiaTraducida: result.translation });
        }
      );
    })
  );
  //promise all para devolver todas la traducciones
  Promise.all(promises)
    .then((results) => {
      const traducciones = results.reduce(
        (acc, item) => ({ ...acc, ...item }),
        {}
      );
      res.json(traducciones);
    })
    .catch((error) => {
      res.status(500).send("Error al traducir: " + error.message);
    });
});


//maneja los endpoints no viables
app.use((req, res, next) => {
  res.status(404).send("No se encontro su pagina :( ");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

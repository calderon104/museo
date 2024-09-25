const express = require("express");
const app = express();
const translate = require("node-google-translate-skidz");
const bodyParser = require("body-parser");
var path = require('path');

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
 res.render('index');
});

// app.get("/traducir", (req, res) => {
//   const { titulo, cultura, dinastia, idioma } = req.query;

//   const idiomaDestino = idioma || "es";

//   const promises = [];

//   promises.push(
//     new Promise((resolve, reject) => {
//       traducir(
//         {
//           text: titulo,
//           source: "en",
//           target: idiomaDestino,
//         },
//         (result) => {
//           resolve({ tituloTraducido: result.translation });
//         }
//       );
//     })
//   );

//   promises.push(
//     new Promise((resolve, reject) => {
//       traducir(
//         {
//           text: cultura,
//           source: "en",
//           target: idiomaDestino,
//         },
//         (result) => {
//           resolve({ culturaTraducida: result.translation });
//         }
//       );
//     })
//   );

//   promises.push(
//     new Promise((resolve, reject) => {
//       traducir(
//         {
//           text: dinastia,
//           source: "en",
//           target: idiomaDestino,
//         },
//         (result) => {
//           resolve({ dinastiaTraducida: result.translation });
//         }
//       );
//     })
//   );
//   //promise all para devolver todas la traducciones
//   Promise.all(promises)
//     .then((results) => {
//       const traducciones = results.reduce(
//         (acc, item) => ({ ...acc, ...item }),
//         {}
//       );
//       res.json(traducciones);
//     })
//     .catch((error) => {
//       res.status(500).send("Error al traducir: " + error.message);
//     });
// });



//maneja los endpoints no viables


app.post('/translate', (req, res) => {
  const { text, targetLang } = req.body;

  translate({
      text: text,
      source: 'en', // Idioma de origen (Inglés)
      target: targetLang, // Idioma de destino
  }, (result) => {
      if (result && result.translation) {
          res.json({ translatedText: result.translation });
      } else {
          res.status(500).json({ error: 'Error al traducir el texto' });
      }
  });
});
app.use((req, res, next) => {
  res.status(404).send("No se encontro su pagina :( ");
});

app.listen(3000, () => {
  console.log("server runing on port 3000");
});

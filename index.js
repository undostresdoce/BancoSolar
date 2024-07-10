const http = require("http");
const fs = require("fs");
const usuariosRoutes = require("./routes/usuarios");
const transferenciasRoutes = require("./routes/transferencias");

http
  .createServer(async (req, res) => {
    if (req.url == "/" && req.method == "GET") {
      fs.readFile("index.html", (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end();
        } else {
          res.setHeader("Content-type", "text/html");
          res.end(data);
        }
      });
    } else if (req.url.startsWith("/usuario") || req.url == "/usuarios") {
      await usuariosRoutes(req, res);
    } else if (
      req.url.startsWith("/transferencia") ||
      req.url == "/transferencias"
    ) {
      await transferenciasRoutes(req, res);
    }
  })
  .listen(3000, console.log("SERVER ON"));

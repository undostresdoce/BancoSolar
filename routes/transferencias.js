const {
  registrarTransferencia,
  getTransferencias,
} = require("../db/consultas");

const transferenciasRoutes = async (req, res) => {
  if (req.url == "/transferencia" && req.method == "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      try {
        const transferencia = JSON.parse(body);
        const result = await registrarTransferencia(transferencia);
        res.statusCode = 201;
        res.end(JSON.stringify(result));
      } catch (e) {
        res.statusCode = 500;
        res.end("Ocurrió un problema en el servidor..." + e);
      }
    });
  } else if (req.url == "/transferencias" && req.method == "GET") {
    try {
      const historial = await getTransferencias();
      res.end(JSON.stringify(historial));
    } catch (e) {
      res.statusCode = 500;
      res.end("Ocurrió un problema en el servidor..." + e);
    }
  }
};

module.exports = transferenciasRoutes;

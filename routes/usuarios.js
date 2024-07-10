const {
  guardarUsuario,
  getUsuarios,
  editUsuario,
  eliminarUsuario,
} = require("../db/consultas");
const url = require("url");

const usuariosRoutes = async (req, res) => {
  if (req.url == "/usuario" && req.method == "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body = chunk.toString();
    });
    req.on("end", async () => {
      const usuario = JSON.parse(body);
      try {
        const result = await guardarUsuario(usuario);
        res.statusCode = 201;
        res.end(JSON.stringify(result));
      } catch (e) {
        res.statusCode = 500;
        res.end("Ocurrió un problema en el servidor... " + e);
      }
    });
  } else if (req.url == "/usuarios" && req.method == "GET") {
    try {
      const usuarios = await getUsuarios();
      res.end(JSON.stringify(usuarios));
    } catch (e) {
      res.statusCode = 500;
      res.end("Ocurrió un problema en el servidor... " + e);
    }
  } else if (req.url.startsWith("/usuario") && req.method == "PUT") {
    let body = "";
    let { id } = url.parse(req.url, true).query;
    req.on("data", (chunk) => {
      body = chunk.toString();
    });
    req.on("end", async () => {
      const usuario = JSON.parse(body);
      try {
        const result = await editUsuario(usuario, id);
        res.statusCode = 200;
        res.end(JSON.stringify(result));
      } catch (e) {
        res.statusCode = 500;
        res.end("Ocurrió un problema en el servidor... " + e);
      }
    });
  } else if (req.url.startsWith("/usuario?id") && req.method == "DELETE") {
    try {
      let { id } = url.parse(req.url, true).query;
      await eliminarUsuario(id);
      res.end("Usuario eliminado");
    } catch (e) {
      res.statusCode = 500;
      res.end("Ocurrió un problema en el servidor... " + e);
    }
  }
};

module.exports = usuariosRoutes;

const pool = require("../config/db");

const guardarUsuario = async (usuario) => {
  const values = Object.values(usuario);
  const consulta = {
    text: "INSERT INTO usuarios (nombre, balance) values ($1, $2)",
    values,
  };
  const result = await pool.query(consulta);
  return result;
};

const getUsuarios = async () => {
  const result = await pool.query("SELECT * FROM usuarios");
  return result.rows;
};

const editUsuario = async (usuario, id) => {
  const values = Object.values(usuario).concat([id]);
  const consulta = {
    text: "UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = $3 RETURNING *",
    values,
  };
  const result = await pool.query(consulta);
  return result;
};

const eliminarUsuario = async (id) => {
  const result = await pool.query(`DELETE FROM usuarios WHERE id = ${id}`);
  return result.rows;
};

const registrarTransferencia = async ({ emisor, receptor, monto }) => {
  const { id: emisorId } = (
    await pool.query(`SELECT * FROM usuarios WHERE nombre = '${emisor}'`)
  ).rows[0];
  const { id: receptorId } = (
    await pool.query(`SELECT * FROM usuarios WHERE nombre = '${receptor}'`)
  ).rows[0];

  const registrarTransferenciaQuery = {
    text: "INSERT INTO transferencias (emisor, receptor, monto, fecha) values ($1, $2, $3, NOW())",
    values: [emisorId, receptorId, monto],
  };

  const actualizarBalanceEmisor = {
    text: "UPDATE usuarios SET balance = balance - $1 WHERE nombre = $2",
    values: [monto, emisor],
  };

  const actualizarBalanceReceptor = {
    text: "UPDATE usuarios SET balance = balance + $1 WHERE nombre = $2",
    values: [monto, receptor],
  };

  try {
    await pool.query("BEGIN");
    await pool.query(registrarTransferenciaQuery);
    await pool.query(actualizarBalanceEmisor);
    await pool.query(actualizarBalanceReceptor);
    await pool.query("COMMIT");
    return true;
  } catch (e) {
    console.log(e);
    await pool.query("ROLLBACK");
    throw e;
  }
};

const getTransferencias = async () => {
  const consulta = {
    text: "SELECT * FROM transferencias",
    rowMode: "array",
  };
  const result = await pool.query(consulta);
  return result.rows;
};

module.exports = {
  guardarUsuario,
  getUsuarios,
  editUsuario,
  eliminarUsuario,
  registrarTransferencia,
  getTransferencias,
};

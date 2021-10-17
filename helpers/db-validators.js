const Role = require("../models/role");
const Usuario = require("../models/usuario");

const esRoleValido = async (role = "") => {
  const existeRol = await Role.findOne({ role });
  if (!existeRol) {
    throw new Error(`Role ${role} no existe en la DB`);
  }
};

const emailExiste = async (email = "") => {
  // Verificar si el correo existe
  const existeEmail = await Usuario.findOne({ email });
  if (existeEmail) {
    throw new Error(`Email: ${email}, ya está siendo usado`);
  }
};

const existeUsuarioPorId = async (id) => {
  // Verificar si el usuario existe
  const existeUsuario = await Usuario.findById(id);
  if (!existeUsuario) {
    throw new Error(`El id no existe ${id}`);
  }
};

module.exports = {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId,
};

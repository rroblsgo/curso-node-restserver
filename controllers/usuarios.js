const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");

const usuariosGet = async (req = request, res = response) => {
  // const { q, nombre = "No name", apikey, page = 1, limit } = req.query;
  // const { name, age, role } = req.body;
  const query = { status: true };
  const { limite = 5, desde = 0 } = req.query;

  // const usuarios = await Usuario.find(query)
  //   .limit(Number(limite))
  //   .skip(Number(desde));

  // const total = await Usuario.countDocuments(query);

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).limit(Number(limite)).skip(Number(desde)),
  ]);

  res.json({
    total,
    usuarios,
  });
};

const usuariosPost = async (req, res = response) => {
  const { nombre, email, password, role } = req.body;
  const usuario = new Usuario({ nombre, email, password, role });

  // verificar si el email existe
  const existeEmail = await Usuario.findOne({ email });
  if (existeEmail) {
    return res.status(400).json({
      msg: "Este email ya existe",
    });
  }
  // encriptar el password
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  await usuario.save();
  res.json({
    msg: "post API - usuariosPost",
    usuario,
  });
};

const usuariosPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, email, ...resto } = req.body;

  if (password) {
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }
  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  res.json(usuario);
};

const usuariosPatch = (req, res = response) => {
  res.json({
    msg: "patch API - usuariosPatch",
  });
};

const usuariosDelete = async (req, res = response) => {
  const { id } = req.params;

  // fisicamente lo borramos
  // const usuario = await Usuario.findByIdAndDelete(id);

  // borrando lógicamente
  const usuario = await Usuario.findByIdAndUpdate(id, { status: false });

  res.json({
    msg: "Usuario eliminado",
    usuario,
  });
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete,
};

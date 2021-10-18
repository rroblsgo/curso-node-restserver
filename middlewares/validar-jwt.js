const jwt = require("jsonwebtoken");
const { request, response } = require("express");

const Usuario = require("../models/usuario.js");

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "Falta el token",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    // leer el usuario que corresponde al uid
    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(401).json({
        msg: "token no válido - usuario no existe en DB",
      });
    }

    // verificar si status true
    if (!usuario.status) {
      return res.status(401).json({
        msg: "token no válido - usuario status false",
      });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "token no válido",
    });
  }
};

module.exports = {
  validarJWT,
};

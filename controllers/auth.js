const { response } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verifiy");

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // verificar email existe
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - email",
      });
    }

    // verificar usuario activo
    if (!usuario.status) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - status: false",
      });
    }

    // verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - password",
      });
    }

    // generar JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el Administrador",
    });
  }
};

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { nombre, email, img } = await googleVerify(id_token);

    let usuario = await Usuario.findOne({ email });

    if (!usuario) {
      // Hay que crearlo
      const data = {
        nombre,
        email,
        password: ":P",
        img,
        google: true,
      };
      usuario = new Usuario(data);
      //console.log(usuario);
      await usuario.save();
    }
    // si el usuario en BD y status false
    if (!usuario.status) {
      return res.status(401).json({
        msg: "Hable con el Administrador. Usuario bloqueado",
      });
    }

    // generar JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: "El token no se pudo verificar",
    });
  }
};

module.exports = {
  login,
  googleSignIn,
};

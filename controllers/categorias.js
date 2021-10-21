const { request, response } = require("express");
const { Categoria } = require("../models");

// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async (req = request, res = response) => {
  const query = { status: true };
  const { limite = 5, desde = 0 } = req.query;
  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query)
      .populate("usuario", "nombre")
      .limit(Number(limite))
      .skip(Number(desde)),
  ]);
  res.json({
    total,
    categorias,
  });
};

// obtenerCategoria
const obtenerCategoria = async (req, res = response) => {
  const { id } = req.params;
  const { _id, ...resto } = req.body;

  const categoria = await Categoria.findById(id).populate("usuario", "nombre");

  res.json(categoria);
};

// crearCategoria
const crearCategoria = async (req, res = response) => {
  const nombre = req.body.nombre.toUpperCase();
  const categoriaDB = await Categoria.findOne({ nombre });
  if (categoriaDB) {
    return res.status(400).json({
      msg: `La categoria ${categoriaDB.nombre} ya existe`,
    });
  }
  // generar la data a guardar
  const data = {
    nombre,
    usuario: req.usuario._id,
  };
  const categoria = await new Categoria(data);

  // guardar DB
  await categoria.save();

  res.status(201).json(categoria);
};

// actualizarCategoria
const actualizarCategoria = async (req, res = response) => {
  const { id } = req.params;
  const { status, usuario, ...data } = req.body;
  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuario._id;

  const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

  res.json(categoria);
};

// borrarCategoria
const borrarCategoria = async (req, res = response) => {
  const { id } = req.params;

  const categoriaBorrada = await Categoria.findByIdAndUpdate(
    id,
    { status: false },
    { new: true }
  );

  res.json(categoriaBorrada);
};

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  borrarCategoria,
};

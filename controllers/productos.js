const { request, response } = require("express");
const { Producto } = require("../models");

// obtenerProductos - paginado - total - populate
const obtenerProductos = async (req = request, res = response) => {
  const query = { status: true };
  const { limite = 5, desde = 0 } = req.query;
  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .populate("usuario", "nombre")
      .populate("categoria", "nombre")
      .limit(Number(limite))
      .skip(Number(desde)),
  ]);
  res.json({
    total,
    productos,
  });
};

// obtenerProducto
const obtenerProducto = async (req, res = response) => {
  const { id } = req.params;
  const { _id, ...resto } = req.body;

  const producto = await Producto.findById(id)
    .populate("usuario", "nombre")
    .populate("categoria", "nombre");

  res.json(producto);
};

// crearProducto
const crearProducto = async (req, res = response) => {
  const { status, usuario, ...body } = req.body;
  const productoDB = await Producto.findOne({ nombre: body.nombre });
  if (productoDB) {
    return res.status(400).json({
      msg: `El producto ${productoDB.nombre} ya existe`,
    });
  }
  // generar la data a guardar
  const data = {
    ...body,
    nombre: body.nombre.toUpperCase(),
    usuario: req.usuario._id,
  };
  const producto = await new Producto(data);

  // guardar DB
  await producto.save();

  res.status(201).json(producto);
};

// actualizarProducto
const actualizarProducto = async (req, res = response) => {
  const { id } = req.params;
  const { status, usuario, ...data } = req.body;
  if (data.nombre) {
    data.nombre = data.nombre.toUpperCase();
  }
  data.usuario = req.usuario._id;

  const producto = await Producto.findByIdAndUpdate(id, data, { new: true })
    .populate("usuario", "nombre")
    .populate("categoria", "nombre");

  res.json(producto);
};

// borrarProducto
const borrarProducto = async (req, res = response) => {
  const { id } = req.params;

  const productoBorrado = await Producto.findByIdAndUpdate(
    id,
    { status: false },
    { new: true }
  );

  res.json(productoBorrado);
};

module.exports = {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  borrarProducto,
};

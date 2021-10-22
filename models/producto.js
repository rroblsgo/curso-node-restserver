const { Schema, model } = require("mongoose");

const ProductoSchema = Schema({
  nombre: {
    type: String,
    unique: true,
    required: [true, "Nombre es obligatorio"],
  },
  status: {
    type: Boolean,
    default: true,
    required: [true, "Status es obligatorio"],
  },
  usuario: {
    type: Schema.Types.ObjectID,
    ref: "Usuario",
    required: [true, "Usuario es obligatorio"],
  },
  precio: {
    type: Number,
    default: 0,
  },
  categoria: {
    type: Schema.Types.ObjectId,
    ref: "Categoria",
    required: true,
  },
  descripcion: {
    type: String,
  },
  disponible: {
    type: Boolean,
    default: true,
  },
  img: {
    type: String,
  },
});

ProductoSchema.methods.toJSON = function () {
  const { __v, status, ...data } = this.toObject();
  return data;
};

module.exports = model("Producto", ProductoSchema);

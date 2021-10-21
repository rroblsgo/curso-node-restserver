const { Schema, model } = require("mongoose");

const CategoriaSchema = Schema({
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
});

CategoriaSchema.methods.toJSON = function () {
  const { __v, status, ...categoria } = this.toObject();
  // categoria.uid = _id;
  return categoria;
};

module.exports = model("Categoria", CategoriaSchema);

const { Router } = require("express");
const { check } = require("express-validator");

const { validarJWT, validarCampos, esAdminRole } = require("../middlewares");

const {
  existeCategoriaPorId,
  existeProductoPorId,
} = require("../helpers/db-validators");

const {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  borrarProducto,
} = require("../controllers/productos");
const router = Router();

// Obtener todas los productos
router.get("/", obtenerProductos);

// obtener una categoría - privado - con token
router.get(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  obtenerProducto
);

// crear categoría - privado - con token
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "Nombre es obligatiorio").not().isEmpty(),
    check("categoria", "Categoria es obligatioria").not().isEmpty(),
    // check("id").custom(existeCategoriaPorId),
    validarCampos,
  ],
  crearProducto
);

// actualizar una categoría - privado - con token
router.put(
  "/:id",
  [
    validarJWT,
    check("categoria", "No es un ID válido").isMongoId(),
    check("categoria").custom(existeCategoriaPorId),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  actualizarProducto
);

// Borrar una categoría - Admin
router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  borrarProducto
);

module.exports = router;

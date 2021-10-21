const { Router } = require("express");
const { check } = require("express-validator");

const { validarJWT, validarCampos, esAdminRole } = require("../middlewares");

const { existeCategoriaPorId } = require("../helpers/db-validators");

const {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  borrarCategoria,
} = require("../controllers/categorias");
const router = Router();

// Obtener todas las categorías
router.get("/", obtenerCategorias);

// obtener una categoría - privado - con token
router.get(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    validarCampos,
  ],
  obtenerCategoria
);

// crear categoría - privado - con token
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "Nombre es obligatiorio").not().isEmpty(),
    validarCampos,
  ],
  crearCategoria
);

// actualizar una categoría - privado - con token
router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    check("nombre", "Nombre es obligatiorio").not().isEmpty(),
    validarCampos,
  ],
  actualizarCategoria
);

// Borrar una categoría - Admin
router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    validarCampos,
  ],
  borrarCategoria
);

module.exports = router;

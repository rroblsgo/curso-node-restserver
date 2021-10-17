const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId,
} = require("../helpers/db-validators");

const {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
  usuariosPatch,
} = require("../controllers/usuarios");

const router = Router();

router.get("/", usuariosGet);

router.put(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    check("role").custom(esRoleValido),
    validarCampos,
  ],
  usuariosPut
);

router.post(
  "/",
  [
    check("email", "Email no es válido").isEmail(),
    check("nombre", "Nombre es obligatorio").not().isEmpty(),
    check("password", "Password más de 6 letras").isLength({
      min: 6,
    }),
    check("email").custom(emailExiste),
    // check("role", "Role no es válido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    check("role").custom(esRoleValido),
    validarCampos,
  ],
  usuariosPost
);

router.delete(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  usuariosDelete
);

router.patch("/", usuariosPatch);

module.exports = router;

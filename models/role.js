const { Schema, model } = require("mongoose");

const RoleSchema = Schema({
  role: {
    type: String,
    required: [true, "Role es obligatorio"],
  },
});

module.exports = model("Role", RoleSchema);

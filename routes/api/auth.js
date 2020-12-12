const router = require("express").Router();
const authController = require("../../controllers/authController")

router.get("/", authController.listar);

router.post("/signin", authController.signin);

router.put("/actualizar", authController.actualizar);

router.post("/register", authController.register);

module.exports = router;
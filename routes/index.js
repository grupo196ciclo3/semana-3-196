const router = require("express").Router();
const authRouter = require("./api/auth.js");

router.use("/auth", authRouter)

module.exports = router
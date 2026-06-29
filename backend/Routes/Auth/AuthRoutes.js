const router = require("express").Router();
const auth = require("../../Controller/Auth/Auth");

router.post("/login", auth.login);

module.exports = router;

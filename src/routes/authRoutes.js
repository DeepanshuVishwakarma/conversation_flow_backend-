const router = require("express").Router();
const { signup, login } = require("../controllers/authController");
const { route } = require("../utils/statics/statics");

router.post(route.auth.signup, signup);
router.post(route.auth.login, login);

module.exports = router;
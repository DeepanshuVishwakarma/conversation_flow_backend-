const router = require("express").Router();
const auth = require("../middleware/auth");
const { route } = require("../utils/statics/statics");
const {
  getQuestion,
  nextQuestion,
  previousQuestion,
} = require("../controllers");


router.get(route.questions.previous, auth, previousQuestion);
router.get(`${route.modules.root}:moduleId`, auth, getQuestion);
router.post(route.questions.next, auth, nextQuestion);

module.exports = router;

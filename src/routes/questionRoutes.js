const router = require("express").Router();
const auth = require("../middleware/auth");
const { route } = require("../utils/statics/statics");
const {
  getQuestion,
  getQuestionByDeepLink,
  nextQuestion,
  previousQuestion,
} = require("../controllers");


router.get(route.questions.previous, auth, previousQuestion);
router.get(route.questions.deepLink, auth, getQuestionByDeepLink);
router.get(`${route.modules.root}:moduleId`, auth, getQuestion);
router.post(route.questions.next, auth, nextQuestion);

module.exports = router;

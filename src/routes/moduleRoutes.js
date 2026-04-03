const router = require("express").Router();
const auth = require("../middleware/auth");
const { route } = require("../utils/statics/statics");
const {
  switchModule,
  getAllModules,
  getModuleHistory
} = require("../controllers/moduleController");

router.get(`${route.modules.history}/:moduleId`, auth, getModuleHistory);
router.post(route.modules.switch, auth, switchModule);
router.get(route.modules.root, auth, getAllModules);

module.exports = router;

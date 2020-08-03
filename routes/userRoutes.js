const express = require("express");
const router = express.Router();
const { signup, activateAccount, login } = require(
  "../controllers/userControllers",
);

router.post("/signup", signup);
router.get("/activate/:token", activateAccount);
router.post("/login", login);

module.exports = router;

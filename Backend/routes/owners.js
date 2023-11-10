const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();


const isAuthenticated = require('../middlwares/isAuthenticated')
const isOwnerAuthorized = require('../middlwares/isOwnerAuthorized')

const {
  getOwners,
  createOwner,
  signin,
  verifyEmail,
  removeNotification,
  checkNotification,
} = require("../controller/owners");


router
  .route("/")
  .get(getOwners)
  .post(
    upload.fields([
      { name: "personalId", maxCount: 1 },
      { name: "taxDeclaration", maxCount: 1 },
    ]),
    createOwner
  );




router.route("/home")
  .get(isAuthenticated, getOwners)
router.route('/notification')
  .get(isAuthenticated, isOwnerAuthorized, checkNotification)
  .put(isAuthenticated, isOwnerAuthorized, removeNotification)
router.route("/signin").post(signin);

router.route("/verify/:token").post(verifyEmail);

module.exports = router;

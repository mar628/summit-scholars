const express = require("express");
const {
  connectToGoogleController,
  googleAuthCallbackController,
  getGoogleProfileDetailsController,
  disConnectToGoogleController,
} = require("../../Controllers/integrations/google.controller");
const {
  Authentication,
  Authorization,
  setHeaderDevelopment,
} = require("../../Middlewares/Auth.middleware");
const { ADMIN } = require("../../Constants/roles.constants");

const GoogleAuthRoutes = express.Router();

// ADMIN only — only admin connects Google to create meetings
GoogleAuthRoutes.route("/").get(
  Authentication,
  Authorization(ADMIN),
  connectToGoogleController
);

GoogleAuthRoutes.route("/callback").get(googleAuthCallbackController);

GoogleAuthRoutes.route("/disconnect").get(
  Authentication,
  Authorization(ADMIN),
  disConnectToGoogleController
);

GoogleAuthRoutes.route("/my-profile").get(
  Authentication,
  Authorization(ADMIN),
  getGoogleProfileDetailsController
);

module.exports = GoogleAuthRoutes;

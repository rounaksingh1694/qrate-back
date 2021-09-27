var express = require('express')
var router = express.Router()
const { check } = require('express-validator');
const { getUserById, getUser, updateUser , userPurchaseList} = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const{getResourcesOfTheUser,  getResCollectionById, createResourceCollection, addALinktoResCollection} = require("../controllers/rescollection")

router.param("userId", getUserById);
router.param("collectionId", getResCollectionById);

router.post(
	"/create/:userId",
	[
		check("rescollection", "rescollection is required").not().isEmpty(),
	],
	isSignedIn,
	isAuthenticated,
	createResourceCollection
);

router.post("/update/:collectionId/:userId", isSignedIn, isAuthenticated, addALinktoResCollection);

router.get("/resourcecollections/:userId", isSignedIn, isAuthenticated, getResourcesOfTheUser )

module.exports = router;

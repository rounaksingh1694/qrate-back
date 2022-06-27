var express = require("express");
var router = express.Router();
const { check } = require("express-validator");
const {
	getUserById,
	updateUser,
	userPurchaseList,
} = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const {
	isHisOwnOrPublic,
	getResourcesOfTheUser,
	getResCollectionById,
	getNameAndIdOfCollection,
	createResourceCollection,
	addALinktoResCollection,
	deleteResCollection,
	deleteALinkFromResCollection,
	changeVisibilityOfResCollection,
	changeCategoryOfResCollection,
	changeTagsOfResCollection,
	searchResCollections,
	getCategories,
	getResCollection,
	star,
	unstar,
	extractMetadata,
	deleteNull,
	getTopPicks,
	changeDescriptionOfResCollection,
	getUser,
	getResCollectionByCategory,
} = require("../controllers/rescollection");

router.param("userId", getUserById);
router.param("collectionId", getResCollectionById);

router.post(
	"/create/:userId",
	[check("rescollection", "rescollection is required").not().isEmpty()],
	isSignedIn,
	isAuthenticated,
	extractMetadata,
	createResourceCollection
);

router.get(
	"/:userId/:collectionId",
	isSignedIn,
	isHisOwnOrPublic,
	getResCollection
);

router.post(
	"/update/:collectionId/:userId",
	isSignedIn,
	isAuthenticated,
	extractMetadata,
	addALinktoResCollection
);

router.post(
	"/delete/link/:collectionId/:userId",
	isSignedIn,
	isAuthenticated,
	deleteALinkFromResCollection
);

router.post(
	"/change/visibility/:collectionId/:userId",
	isSignedIn,
	isAuthenticated,
	changeVisibilityOfResCollection
);

router.post(
	"/change/category/:collectionId/:userId",
	isSignedIn,
	isAuthenticated,
	changeCategoryOfResCollection
);

router.post(
	"/change/tags/:collectionId/:userId",
	isSignedIn,
	isAuthenticated,
	changeTagsOfResCollection
);

router.post(
	"/change/description/:collectionId/:userId",
	isSignedIn,
	isAuthenticated,
	changeDescriptionOfResCollection
);

router.get("/search", searchResCollections);

router.get(
	"/user/all/:userId",
	isSignedIn,
	isAuthenticated,
	getResourcesOfTheUser
);

router.get(
	"/name/id/:userId",
	isSignedIn,
	isAuthenticated,
	getNameAndIdOfCollection
);

router.delete(
	"/delete/:collectionId/:userId",
	isSignedIn,
	isAuthenticated,
	deleteResCollection
);

router.delete("/deletenull/:userId", isSignedIn, isAuthenticated, deleteNull);

router.get("/:userId/star/:collectionId", isSignedIn, isAuthenticated, star);

router.get(
	"/:userId/unstar/:collectionId/",
	isSignedIn,
	isAuthenticated,
	unstar
);

router.get("/top/picks/:userId", isSignedIn, isAuthenticated, getTopPicks);

router.get("/getuser/:userId", isSignedIn, isAuthenticated, getUser);

router.post(
	"/by/category/:userId",
	isSignedIn,
	isAuthenticated,
	getResCollectionByCategory
);

router.get("/categories", getCategories);

module.exports = router;

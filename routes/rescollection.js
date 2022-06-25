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
	"/:userId/collection/:collectionId",
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
	"/deletelink/:collectionId/:userId",
	isSignedIn,
	isAuthenticated,
	deleteALinkFromResCollection
);

router.post(
	"/changevisibility/:collectionId/:userId",
	isSignedIn,
	isAuthenticated,
	changeVisibilityOfResCollection
);

router.post(
	"/changecategory/:collectionId/:userId",
	isSignedIn,
	isAuthenticated,
	changeCategoryOfResCollection
);

router.post(
	"/changetags/:collectionId/:userId",
	isSignedIn,
	isAuthenticated,
	changeTagsOfResCollection
);

router.post(
	"/changedescription/:collectionId/:userId",
	isSignedIn,
	isAuthenticated,
	changeDescriptionOfResCollection
);

router.get("/search", searchResCollections);

router.get(
	"/resourcecollections/:userId",
	isSignedIn,
	isAuthenticated,
	getResourcesOfTheUser
);

router.get(
	"/getnameandidofcollection/:userId",
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

router.get("/toppicks/:userId", isSignedIn, isAuthenticated, getTopPicks);

router.get("/getuser/:userId", isSignedIn, isAuthenticated, getUser);

router.get("/categories", getCategories);

module.exports = router;

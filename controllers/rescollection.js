const User = require("../models/user")
const {ResCollection} = require("../models/rescollection")

const {
	check,
	expressValidator,
	validationResult,
} = require("express-validator");

const USER_FIELDS_TO_POPULATE = "_id username name"

exports.getResCollectionById = (req, res, next, rescollectionId) => {
	ResCollection.findById(rescollectionId).exec((error, rescollection) => {
		if (error || !rescollection) {
			return this.getErrorMesaageInJson(res, 400, "Cannot get rescollectionById");
		}
		rescollection
			.populate("user", USER_FIELDS_TO_POPULATE)
			.execPopulate()
			.then(() => {
				console.log("ResCollection BY ID", rescollection);
				req.rescollection = rescollection;
				next();
			});
	});
};


exports.getResourcesOfTheUser = (req, res) => {
	const user = req.profile
	User.findById(user._id).exec((error, user) => {
		if (error || !user) {
			return this.getErrorMesaageInJson(res, 400, "Cannot get rescollectionById");
		}
		user
			.populate("rescollection", "_id name links")
			.execPopulate()
			.then(() => {
			
					res.status(200).json(user.rescollection)
				
			});
	});
};

exports.getErrorMesaageInJson = (res, statusCode, errorMessage) => {
	return res.status(statusCode).json({ error: errorMessage });
};

exports.createResourceCollection = (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log("ERRORSSS", errors);
		return res.status(401).json({
			error: errors.array()[0].msg,
			parameter: errors.array()[0].param,
		});
	}
	const body = req.body;

	console.log("Links # "+body.links)

	const rescollection = {
		name: body.rescollection.name,
		user: req.profile._id,
		links: body.rescollection.links,
	};

	

	ResCollection.create(rescollection, (error, newResCollection) => {
		if (error || !newResCollection) {
			return getErrorMesaageInJson(res, 400, "Failed to create post");
		}

		User.findOneAndUpdate(
			{ _id: req.profile._id },
			{ $push: { rescollection: newResCollection._id } },
			{ new: true },
			(err, user) => {
				if (err || !user) {
					return getErrorMesaageInJson(res, 400, "Failed to create post");
				}
				newResCollection
					.populate("user", USER_FIELDS_TO_POPULATE)
					.execPopulate()
					.then(() => res.status(200).json(newResCollection));
			}
		);
	});
};


exports.addALinktoResCollection = (req, res) => {
	const rescollection = req.rescollection;
	const link = req.body.link;
	console.log("req "+req.body.link)
	ResCollection.findOneAndUpdate(
		{ _id: rescollection._id },
		{ $push: { links: link } },
		{ new: true },
		(error, newResCollection) => {
			if (error || !newResCollection) {
				console.error("ERROR IN LIKE", error);
				return getErrorMesaageInJson(res, 400, "Failed to add a link");
			}
			res.status(200).json(newResCollection)
		}
	);
};

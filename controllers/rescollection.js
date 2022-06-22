const express = require("express");
const router = express.Router();
const axios = require("axios");
var { JSDOM } = require("jsdom");
const fetch = (...args) =>
	import("node-fetch").then(({ default: fetch }) => fetch(...args));
const User = require("../models/user");
const { ResCollection, categories } = require("../models/rescollection");

const {
	check,
	expressValidator,
	validationResult,
} = require("express-validator");

const USER_FIELDS_TO_POPULATE = "_id username name";

exports.getResCollectionById = (req, res, next, rescollectionId) => {
	ResCollection.findById(rescollectionId).exec((error, rescollection) => {
		if (error || !rescollection) {
			return this.getErrorMesaageInJson(
				res,
				400,
				"Cannot get rescollectionById"
			);
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

exports.isHisOwnOrPublic = (req, res, next) => {
	console.log("RES COL", req.rescollection);
	console.log("prof", req.profile);
	let isAuthenticated =
		req.profile && req.auth && req.profile._id == req.auth._id;
	if (isAuthenticated) {
		if (req.rescollection.visibility == "PRIVATE") {
			console.log(
				String(req.rescollection.user._id) === String(req.profile._id)
			);
			if (String(req.rescollection.user._id) === String(req.profile._id)) {
				next();
			} else {
				return res.status(401).json({
					error: "Access denied privte others",
				});
			}
		} else next();
	} else {
		return res.status(401).json({
			error: "Unauthorized",
		});
	}
};

exports.getResCollection = (req, res) => {
	res.status(200).json(req.rescollection);
};

exports.getNameAndIdOfCollection = (req, res) => {
	const user = req.profile;
	User.findById(user._id).exec((error, user) => {
		if (error || !user) {
			return this.getErrorMesaageInJson(
				res,
				400,
				"Cannot get rescollectionById"
			);
		}
		user
			.populate("rescollection", "_id name")
			.execPopulate()
			.then(() => {
				res.status(200).json(user.rescollection);
			});
	});
};

exports.getResourcesOfTheUser = (req, res) => {
	const user = req.profile;
	User.findById(user._id).exec((error, user) => {
		if (error || !user) {
			return this.getErrorMesaageInJson(
				res,
				400,
				"Cannot get rescollectionById"
			);
		}
		user
			.populate("rescollection", "_id name links")
			.execPopulate()
			.then(() => {
				res.status(200).json(user.rescollection);
			});
	});
};

exports.getErrorMesaageInJson = (res, statusCode, errorMessage) => {
	return res.status(statusCode).json({ error: errorMessage });
};

exports.extractMetadata = (req, res, next) => {
	console.log("HEYYYYYYYYYYYYYYYYYYYYY GALLLLLLLLLL");
	async function extractMetadataInner(link) {
		console.log("LINK", link);
		var publisher,
			ogType = "",
			ogSiteName = "",
			ogImage = "",
			ogTitle = "",
			ogDescription = "",
			customtype = "",
			author = "",
			date = "",
			_url = "",
			extra = "",
			twitterData1 = "";
			favicon = ""

		_url = link;

		const response = await fetch(link);
		const body = await response.text();
		try {
			const { body: html, url } = await got(link);
			
			const metadata = await metascraper({ html, url });
			author = metadata.author;
			date = metadata.date;
		} catch (err) {
			author = "";
			date = "";
		}

		var doc = new JSDOM(body, {
			url: link,
		});

		var regex = "^(.*:)//([A-Za-z0-9-.]+)(:[0-9]+)?(.*)$";
		let newRegEx = new RegExp(regex, "g");

		var matches = link.match(newRegEx);

		if (matches.length > 0) {
			publisher = link.replace(newRegEx, "$2");
		}
		//console.log(body.mat)
		var titles = doc.window.document.getElementsByTagName("title");
		if (titles.length > 0) {
			//console.log("Title :- "+titles[0].text)
			ogTitle = titles[0].text;
		}
		var ic  = doc.window.document.querySelector("link[rel*='icon']")
		if(ic){
			favicon = ic.href
		}
		var metas = doc.window.document.querySelectorAll("meta");
		for (var i = 0; i < metas.length; i++) {
			var content = metas[i].getAttribute("content"); /* here's the content */
			//console.log('heyyyyy')
			if (metas[i].getAttribute("name") === "author") author = content;

			if (metas[i].getAttribute("property") === "og:type") ogType = content;
			if (metas[i].getAttribute("property") === "og:image") ogImage = content;
			if (metas[i].getAttribute("property") === "og:description")
				ogDescription = content;
			if (metas[i].getAttribute("property") === "og:title") ogTitle = content;
			if (metas[i].getAttribute("property") === "og:site_name")
				ogSiteName = content;
			if (metas[i].getAttribute("name") === "twitter:data1")
				twitterData1 = content;
		}

		if (ogSiteName.toLowerCase() == "medium" && ogType == "article") {
			customtype = "Medium";
			extra = twitterData1;

			var reso = {
				author: author,
				date: date,
				image: ogImage,
				type: customtype,
				extraData: extra,
				publisher: publisher,
				description: ogDescription,
				title: ogTitle,
				ogType: ogType,
				url: _url, favicon: favicon
			};

			console.log("RESO", reso);

			req.metadata = reso;
			next();

			//console.log(reso)
		} else if (ogSiteName.toLowerCase() == "youtube") {
			customtype = "Youtube";
			console.log("link : "+link)
			if (link.toLowerCase().includes("playlist")) {
				customtype = "YT Playlist";
			}

			let options = {
				headers: {
					"User-Agent": "UA",
				},
			};

			axios
				.get("https://www.youtube.com/oembed?url=" + link, options)
				.then((response) => {
					author = response.data.author_name;
					ogTitle = response.data.title;
					var reso = {
						author: author,
						date: date,
						image: ogImage,
						type: customtype,
						extraData: extra,
						publisher: publisher,
						description: ogDescription,
						title: ogTitle,
						ogType: ogType,
						url: _url,favicon: favicon
					};

					console.log("RESO", reso);
					req.metadata = reso;
					next();
					//console.log(reso)
				})
				.catch((error) => {
					//console.log(error);
				});
		} else if (ogSiteName.toLowerCase() == "twitter") {
			customtype = "Twitter";
			console.log("aya h biro")
			var reso = {
				author: author,
				date: date,
				image: ogImage,
				type: customtype,
				extraData: extra,
				publisher: publisher,
				description: ogDescription,
				title: ogTitle,
				ogType: ogType,
				url: _url,favicon: favicon
			};

			console.log("RESO", reso);
			if(link.includes("/status/")){
			axios
				.get("https://publish.twitter.com/oembed?url=" + link)
				.then((response) => {
					// fs.writeFileSync('yehu3.html', response.data.html)
					var document = new JSDOM(response.data.html, {
						url: link,
					}).window.document;
					var root = document.getElementsByClassName("twitter-tweet");
					if (root.length > 0) {
						author = response.data.author_name;
						var firstChild =
							document.getElementsByClassName("twitter-tweet")[0].firstChild;
						var tweet = firstChild.innerHTML;
						ogTitle = tweet.substring(0, tweet.indexOf("<"));
						ogType = "article";
					}

					var reso = {
						author: author,
						date: date,
						image: ogImage,
						type: customtype,
						extraData: extra,
						publisher: publisher,
						description: ogDescription,
						title: ogTitle,
						ogType: ogType,
						url: _url,favicon: favicon
					};

					console.log("RESO", reso);

					req.metadata = reso;
					next();

					//console.log(reso)
				})
				.catch((error) => {
					//console.log(error);
				});}else{
					req.metadata = reso;
			next();
				}
		} else {
			//console.log("aya hai bhai4")
			customtype = ogType;
			var reso = {
				author: author,
				date: date,
				image: ogImage,
				type: customtype,
				extraData: extra,
				publisher: publisher,
				description: ogDescription,
				title: ogTitle,
				ogType: ogType,
				url: _url, favicon: favicon
			};

			console.log("RESO", reso);

			req.metadata = reso;
			next();
			//console.log(reso)
		}
	}
	console.log("LINK OUTER", req.body.rescollection.link);
	extractMetadataInner(req.body.rescollection.link);
};

exports.createResourceCollection = (req, res) => {
	console.log("REQQ", req.body);
	console.log("LINK RES COL", req.body.rescollection.link);
	console.log("META DATA", req.metadata);
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log("ERRORSSS", errors);
		return res.status(401).json({
			error: errors.array()[0].msg,
			parameter: errors.array()[0].param,
		});
	}
	const body = req.body;

	console.log("Links # " + body.links);

	const rescollection = {
		name: body.rescollection.name,
		user: req.profile._id,
		links: [req.metadata],
	};

	ResCollection.create(rescollection, (error, newResCollection) => {
		if (error || !newResCollection) {
			return getErrorMesaageInJson(res, 400, "Failed to create rescollection");
		}

		User.findOneAndUpdate(
			{ _id: req.profile._id },
			{ $push: { rescollection: newResCollection._id } },
			{ new: true },
			(err, user) => {
				if (err || !user) {
					return getErrorMesaageInJson(
						res,
						400,
						"Failed to create rescollection"
					);
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
	const link = req.metadata;

	rescollection.links.push(link);
	return rescollection.save().then((newRescollection, err) => {
		if (err) {
			return res.status(400).json({
				error: "Failed to add link into this Collection",
			});
		}
		res.json({
			message: "Addition was a success",
			newRescollection,
		});
	});
};

exports.deleteALinkFromResCollection = (req, res) => {
	const rescollection = req.rescollection;
	const linkId = req.body.link_id;
	console.log("req " + req.body.link_id);

	rescollection.links.pull(linkId);
	return rescollection.save().then((deletedCollection, err) => {
		if (err) {
			return res.status(400).json({
				error: "Failed to delete link from this Collection",
			});
		}
		res.json({
			message: "Deletion was a success",
			deletedCollection,
		});
	});
};

exports.deleteNull = (req, res) => {
	ResCollection.remove(
		{ links: [null] },
		{
			justOne: false,
		}
	).exec((err, dels) => {
		if (err) console.log("ERROR", err);
		else
			res.json({
				message: "Deletion was a success",
			});
	});
};

exports.deleteResCollection = (req, res) => {
	const rescollection = req.rescollection;
	rescollection.remove((err, deletedCollection) => {
		if (err) {
			return res.status(400).json({
				error: "Failed to delete this Collection",
			});
		}
		res.json({
			message: "Deletion was a success",
			deletedCollection,
		});
	});
};

exports.changeVisibilityOfResCollection = (req, res) => {
	const rescollection = req.rescollection;
	const visibility = req.body.visibility;

	rescollection.visibility = visibility;
	return rescollection.save().then((newRescollection, err) => {
		if (err) {
			return res.status(400).json({
				error: "Failed to change visibility of this Collection",
			});
		}
		res.json({
			message: "Collection's Visiblity Changed",
			newRescollection,
		});
	});
};

exports.changeCategoryOfResCollection = (req, res) => {
	const rescollection = req.rescollection;
	const category = req.body.category;

	rescollection.category = category;
	return rescollection.save().then((newRescollection, err) => {
		if (err) {
			return res.status(400).json({
				error: "Failed to change category of this Collection",
			});
		}
		res.json({
			message: "Collection's category Changed",
			newRescollection,
		});
	});
};

exports.changeTagsOfResCollection = (req, res) => {
	const rescollection = req.rescollection;
	const tags = req.body.tags;
	console.log("TAAGGGS " + tags);
	rescollection.tags = tags;
	return rescollection.save().then((newRescollection, err) => {
		if (err) {
			return res.status(400).json({
				error: "Failed to change tags of this Collection",
			});
		}
		res.json({
			message: "Collection's tags Changed",
			newRescollection,
		});
	});
};

exports.searchResCollections = (req, res, searchQuery) => {
	var searchQuery = req.query.q;
	console.log("Search Query :" + searchQuery);

	ResCollection.find({
		$and: [{ $text: { $search: searchQuery } }, { visibility: "PUBLIC" }],
	})

		.limit(10)
		.exec((error, rescollection) => {
			if (error || !rescollection) {
				return this.getErrorMesaageInJson(
					res,
					400,
					"Cannot get rescollectionById"
				);
			}
			res.status(200).json({ resCollection: rescollection });
		});
};

exports.getCategories = (req, res) => {
	res.status(200).json({ categories: categories });
};

exports.star = (req, res) => {
	const collectionId = req.rescollection._id;
	const userId = req.profile._id;
	User.findOneAndUpdate(
		{ _id: userId },
		{ $addToSet: { starred: collectionId } },
		{ new: true },
		(error, user) => {
			if (error) {
				console.error("ERROR IN ADDING STARRED IN USER", error);
				return getErrorMesaageInJson(
					res,
					400,
					"Error in adding starred in user info"
				);
			}
			if (!user)
				return getErrorMesaageInJson(res, 400, "Cannot update the user");

			ResCollection.findOneAndUpdate(
				{ _id: collectionId },
				{ $addToSet: { stars: userId } },
				{ new: true },
				(error, rescol) => {
					if (error) {
						console.error("ERROR IN ADDING STARS IN RES COL", error);
						return getErrorMesaageInJson(
							res,
							400,
							"Error in adding stars in res col info"
						);
					}
					if (!rescol)
						return getErrorMesaageInJson(res, 400, "Cannot update the res col");

					res.status(200).json({ updateStatus: true });
				}
			);
		}
	);
};

exports.unstar = (req, res) => {
	const collectionId = req.rescollection._id;
	const userId = req.profile._id;
	User.findOneAndUpdate(
		{ _id: userId },
		{ $pullAll: { starred: [collectionId] } },
		{ new: true },
		(error, user) => {
			if (error) {
				console.error("ERROR IN REMOVING STARRED IN USER", error);
				return getErrorMesaageInJson(
					res,
					400,
					"Error in removing starred in user info"
				);
			}
			if (!user)
				return getErrorMesaageInJson(res, 400, "Cannot update the user");

			ResCollection.findOneAndUpdate(
				{ _id: collectionId },
				{ $pullAll: { stars: [userId] } },
				{ new: true },
				(error, rescol) => {
					if (error) {
						console.error("ERROR IN REMOVING STARS IN RES COL", error);
						return getErrorMesaageInJson(
							res,
							400,
							"Error in removing stars in res col info"
						);
					}
					if (!rescol)
						return getErrorMesaageInJson(res, 400, "Cannot update the res col");

					res.status(200).json({ updateStatus: true });
				}
			);
		}
	);
};

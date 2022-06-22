const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const categories = [
	"DESIGN",
	"CODING",
	"ACADEMICS",
	"SCIENCE",
	"FINANCE",
	"PSYCHOLOGY",
	"NEUROSCIENCE",
	"DOPAMINE BOOSTER",
	"MATHEMATICS",
	"NONE",
];

const LinkSchema = new mongoose.Schema({
	url: String,
	author: String,
	image: String,
	title: String,
	publisher: String,
	description: String,
	extraData: String,
	type: String,
	ogType: String,
	favicon:String
});

const Link = mongoose.model("Link", LinkSchema);

const ResCollectionSchema = new mongoose.Schema({
	name: String,
	links: [LinkSchema],
	user: {
		type: ObjectId,
		ref: "User",
	},
	visibility: {
		type: String,
		enum: ["PRIVATE", "PUBLIC"],
		default: "PRIVATE",
	},
	category: {
		type: String,
		enum: categories,
		default: "NONE",
	},
	tags: {
		type: String,
		default: "",
	},
	stars: [
		{
			type: ObjectId,
			ref: "User",
		},
	],
});

ResCollectionSchema.index({ tags: "text", name: "text" });

const ResCollection = mongoose.model("ResCollection", ResCollectionSchema);
module.exports = { Link, ResCollection, categories };

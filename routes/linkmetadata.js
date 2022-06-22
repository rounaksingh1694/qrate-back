const express = require("express");
const router = express.Router();
const axios = require("axios");
var { JSDOM } = require("jsdom");
const fetch = (...args) =>
	import("node-fetch").then(({ default: fetch }) => fetch(...args));

const metascraper = require("metascraper")([
	require("metascraper-author")(),
	require("metascraper-date")(),
	// require('metascraper-image')(),
]);

const got = require("got");
const {
	createResourceCollection,
	extractMetadata,
} = require("../controllers/rescollection");

router.post("/metadata", extractMetadata, createResourceCollection);

/*
{
  "title": "Javascript course",
  "author_name": "Hitesh Choudhary",
  "author_url": "/c/HiteshChoudharydotcom",
  "type": "video",
  "height": 113,
  "width": 200,
  "version": "1.0",
  "provider_name": "YouTube",
  "provider_url": "https://www.youtube.com/",
  "thumbnail_height": 360,
  "thumbnail_width": 480,
  "thumbnail_url": "https://i.ytimg.com/vi/2md4HQNRqJA/hqdefault.jpg",
  "html": "<iframe width=\"200\" height=\"113\" src=\"https://www.youtube.com/embed/videoseries?list=PLRAV69dS1uWSxUIk5o3vQY2-_VKsOpXLD\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>"
}
*/

/*
author:Hitesh Choudhary
date: 
descr: res.description
img: thumbnail_url
publisher: Youtube
title: Javascript Course
url: 
type: Video
extra: 
*/

module.exports = router;

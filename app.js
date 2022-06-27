require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const rescollectionRoutes = require("./routes/rescollection");
const metadataRoutes = require("./routes/linkmetadata");
const ytRoutes = require("./routes/ytplaylistRoutes");
const articleDataRoutes = require("./routes/articledata");

mongoose
	.connect(process.env.LINODE_DATABASE_HOST, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() => {
		console.log("DB CONNECTED");
	})
	.catch((e) => {
		console.log(e);
		console.log("DB NOT CONNECTED");
	});

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//My Routes
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/collection/", rescollectionRoutes);
app.use("/api", metadataRoutes);
app.use("/api", ytRoutes);
app.use("/api", articleDataRoutes);

//dot env see docs for more explaination
const port = process.env.PORT || 8000;

app.listen(port, () => {
	console.log(`app is running at ${port}`);
});

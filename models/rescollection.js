const mongoose  = require("mongoose")
const {ObjectId} = mongoose.Schema

const LinkSchema  =new mongoose.Schema({
    url: String,
    image :String,
    title: String,
    publisher: String,
    description: String,
    extraData: String,
    type: String
})

const Link = mongoose.model("Link", LinkSchema)


const ResCollectionSchema = new mongoose.Schema({
    name: String,
    links: [LinkSchema],
    user: {
      type: ObjectId,
      ref: 'User'
    },
    
  })


const ResCollection = mongoose.model("ResCollection", ResCollectionSchema)
module.exports = {Link, ResCollection}
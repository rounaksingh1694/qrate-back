const express = require("express");
const router = express.Router();
const metascraper = require('metascraper')([
    require('metascraper-author')(),
    require('metascraper-date')(),
    require('metascraper-description')(),
    require('metascraper-image')(),
    require('metascraper-logo')(),
    require('metascraper-clearbit')(),
    require('metascraper-publisher')(),
    require('metascraper-title')(),
    require('metascraper-url')()
  ])
  
  const got = require('got')
  


router.post("/metadata", async (req, res) => {
        const link = req.body.link    
        const { body: html, url } = await got(link)
        const metadata = await metascraper({ html, url })
        res.send(200, metadata)
   
});

module.exports = router;
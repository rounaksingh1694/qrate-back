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
  const extract = require('meta-extractor');


router.post("/metadata", async (req, res) => {
        const link = req.body.link  
        var type = ""
        var extra = ""


        const { body: html, url } = await got(link)
        
        extract({ uri: link }, (err, res) =>{
              if(res.ogSiteName.toLowerCase() == "medium" && res.ogType == 'article'){
                type = "Medium"
                extra = {
                  "reading_time": res.twitterData1
                }
              }else if(res.ogSiteName.toLowerCase() == "youtube") {
                type = "youtube.com"
                if(res.pathname.toLowerCase().includes('playlist')){
                  type = "YT Playlist"
                }
              }else if(res.ogSiteName.toLowerCase() == "twitter") {
                type  ="Twitter"
              }
              else {
                type =""    
              }
            });


        const metadata = await metascraper({ html, url })
        metadata.type = type
        metadata.extra = extra
        res.send(200, metadata)
});




module.exports = router;
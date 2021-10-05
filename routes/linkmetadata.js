const axios = require("axios")
const express = require("express");
const router = express.Router();

const metascraper = require('metascraper')([
    require('metascraper-author')(),
    require('metascraper-date')(),
    // require('metascraper-image')(),
  ])
  
  const got = require('got')
  const extract = require('meta-extractor');

  

router.post("/metadata", async (req, resp) => {
        const link = req.body.link  
        const UA = req.headers['user-agent']
        var type;
        var extra ;
        var author = ""
        var ogType = ""
        var _url = link

        const { body: html, url } = await got(link)
        const metadata = await metascraper({ html, url })
        author = metadata.author
        
        extract({ uri: link }, (err, res) =>{
              console.log(res.ogSiteName.toLowerCase() + " " + res.ogType)
              ogType = res.ogType
              if(res.ogSiteName.toLowerCase() == 'medium' && res.ogType == 'article'){
                
                type = "Medium "
                extra = {
                  "reading_time": res.twitterData1
                }

                sendResp(res, resp, metadata, type, extra, author,  _url)
               
              }else if(res.ogSiteName.toLowerCase() == "youtube") {
                
                type = "Youtube"
                if(res.pathname.toLowerCase().includes('playlist')){
                  type = "YT Playlist"
                }
                if(res.ogType == "video.other"){
                  _url = res.twitterPlayer
                }
                var author_name;  
                let options = {
                  headers: {
                    'User-Agent': UA
                  }
                }
                
                axios.get('https://www.youtube.com/oembed?url='+link, options)
                .then(response => {
                  author = response.data.author_name
                  sendResp(res, resp, metadata, type, extra, author, _url)
                        })
                      .catch(error => {
                        console.log(error);
                        });

               

              }else if(res.ogSiteName.toLowerCase() == "twitter") {
                
                type  ="Twitter"
                
                axios.get('https://publish.twitter.com/oembed?url='+link)
                .then(response => {
                  console.log(response); 
                  author = response.data.author_name
                  sendResp(res, resp, metadata, type, extra, author,  _url)
                        })
                      .catch(error => {
                        console.log(error);
                        });

               
                
              }
              else {
                console.log("aya hai bhai4")
                type =""    
                sendResp(res, resp, metadata, type, extra, author,  _url)
              }
              
            });
             
         

        
});

function sendResp(res, resp, metadata, type, extra, author,  url){
            var publisher = res.host
           var  title = res.title
            var description = res.ogDescription   
            var reso = {
              "author": author ,
              "date": metadata.date,
              "image": res.ogImage,
              "type": type,
              "extra": extra,
              "publisher": publisher,
              "description": description,
              "title": title,
              "ogType": res.ogType,
              "url": url
            }
            resp.status(200).send(reso)
            
            
            console.log(type + " "+ extra);
}

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
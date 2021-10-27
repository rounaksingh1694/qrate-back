const {
    extract
  } = require('article-parser');
  var { Readability } = require('@mozilla/readability');
var { JSDOM } = require('jsdom');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const got = require('got')
const extract = require('meta-extractor');


const express = require("express");
const router = express.Router();

var TurndownService = require('turndown')

var turndownService = new TurndownService()

router.post("/articledata", (req, res) => {
	console.log(req.body.link);
    const url = req.body.link
    extract({ uri: url }, (err, res) =>{
      if(res.ogSiteName.toLowerCase() == 'medium' && res.ogType == 'article'){
        async function fetchData(){
          const response = await fetch("https://ddnews.gov.in/national/india-remains-committed-strengthening-respect-shared-values-pm-modi-16th-east-asia-summit");
          const body = await response.text();
          //console.log(body);
          var doc = new JSDOM(body, {
            url: "https://ddnews.gov.in/national/india-remains-committed-strengthening-respect-shared-values-pm-modi-16th-east-asia-summit"
          });
          let reader = new Readability(doc.window.document);
          let article = reader.parse();
          var content = article.content
          const markdown = turndownService.turndown(content)
          article.content = markdown
          res.status(200).send(article);
        }
        fetchData()
      }else{
        extract(url).then((article) => {
      
          var markdown = ""
          console.log(article)
          if(article.source == "Medium"){
             article = clearContent(article)
          }else{
            
          }
          
          var content = article.content
        
          markdown = turndownService.turndown(content)
  
          article.content = markdown
  
          res.status(200).send(article);
        }).catch((err) => {
          console.log(err);
        });
      }
    });
    
    

	
    
});


function clearContent(article){
    var content = article.content
    var author = article.author
    var title = article.title
    article.readingTime = content.match(/( · |) [1-60] (hour|min) read/g)
    var regex = "(<img(?!.*?alt=\""+author+"\".*?\2)[^>]*)(>)"
    let newRegEx = new RegExp(regex, 'g');
    var links = content.match(newRegEx);
    var link = links[0]
    link = article.content.substr(article.content.indexOf("<img alt=\""+author+"\""), article.content.indexOf("\" />"))
    link = link.replace("<img alt=\""+author+"\" src=\"" ,"").replace("\" />", "") 
    const fromIndex = article.content.indexOf("<img alt=\""+author+"\"")
    const toIndex = article.content.indexOf(article.readingTime+"</div>")
    console.log("14456 fromIndex "+fromIndex)
    console.log("14456 toIndex "+toIndex)
    var removableContent = article.content.substring(fromIndex, toIndex)

    article.content = content.replace(removableContent, "").replace("[ \n", "[")

    article.authorProfilePhoto = link
    return article
  }


  module.exports = router;

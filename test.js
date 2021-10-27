var { Readability } = require('@mozilla/readability');
var { JSDOM } = require('jsdom');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require("fs")

var TurndownService = require('turndown')

var turndownService = new TurndownService()

async function extract(){
  const response = await fetch("https://uxdesign.cc/the-start-of-a-new-era-for-responsive-web-design-6658a6bbeb9b");
  console.log(response)
  const body = await response.text();
  //console.log(body);
  var doc = new JSDOM(body, {
    url: "https://ddnews.gov.in/national/india-remains-committed-strengthening-respect-shared-values-pm-modi-16th-east-asia-summit"
  });
  let reader = new Readability(doc.window.document);
  let article = reader.parse();
  var content = article.content
  const markdown = turndownService.turndown(content)
  fs.writeFileSync("./sample.md", markdown)
  //console.log(markdown)
}
extract()




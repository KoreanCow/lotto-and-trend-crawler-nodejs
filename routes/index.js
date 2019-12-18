const express = require('express');
const router = express.Router();

const cheerio = require('cheerio');
const request = require('request');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/naver', (req, res, next) => {
  request('https://www.naver.com/', (error, response, body) => {
    // console.log(response)// 객체로 저장 
    // console.log(body) html 문서

    const $ = cheerio.load(body);
    let SilGum = [];

    
    // #PM_ID_ct > div.header > div.section_navbar > div.area_hotkeyword.PM_CL_realtimeKeyword_base > div.ah_list.PM_CL_realtimeKeyword_list_base > ul:nth-child(1) > li:nth-child(1) > a > span.ah_k
    // div.ah_list > ul.ah_l > li.ah_item > span.ah_k
    let ulList = [];
    let strarr = $("div.ah_list ul.ah_l").children("li.ah_item");

    strarr.each(function (index, item) {
      SilGum[index] = {
        num: index+1,
        title: $(this).find('span.ah_k').text()
      }; 
  });
  res.json(SilGum);
  });
})

router.post('/rotto', (req, res, next) => {
  request('')
})
module.exports = router;

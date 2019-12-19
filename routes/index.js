const express = require('express');
const router = express.Router();

const cheerio = require('cheerio');
const request = require('request');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/naver', (req, res, next) => {
  request('https://www.naver.com/', (error, response, body) => {
    const $ = cheerio.load(body);
    let SilGum = [];

    let strarr = $("div.ah_list ul.ah_l").children("li.ah_item");
    strarr.each(function (index, item) {
      SilGum[index] = {
        num: index,
        title: $(this).find('span.ah_k').text()
      }; 
      
    });
    console.log(SilGum);
    res.render('naver', {title: SilGum} );
    // res.render('naver', {title: SilGum[1].title} );
    
  });
})
router.post('/lotto', (req, res, next) => {
  // let week;
  request('https://www.dhlottery.co.kr/common.do?method=main', (req, res, body) => {
    const $ = cheerio.load(body);

    let week = $("#lottoDrwNo").text();
    week = Number(week);
    console.log(week);
    
    // for(let i = 0; i <= 5; i++){
      // let i = 5;
      // week = week;
      request(`https://www.dhlottery.co.kr/gameResult.do?method=byWin&drwNo=${week}`, (req, res, body) => {
      let $ = cheerio.load(body);

      let Choiced_Number = [];
      let intarr = $("div.num.win").children("p");
      intarr.each( function (index, item) {
        Choiced_Number[index] = {
          week:  week,
          number : Number($(this).find('span').text())
        }
        console.log(Choiced_Number[0].number);
      })
      });
  })
  
})


module.exports = router;

  // #lottoDrwNo
  // https://www.dhlottery.co.kr/gameResult.do?method=byWin&drwNo=825 825회 로또 페이지
  // drwNo= "int" 사용
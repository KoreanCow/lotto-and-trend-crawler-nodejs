const express = require('express');
const router = express.Router();

const cheerio = require('cheerio');
const request = require('request');

router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.get('/naver', (req, res, next) => {
  request('https://www.naver.com/', (error, response, body) => {
    const $ = cheerio.load(body);
    let SilGum = [];

    const strarr = $("div.ah_list ul.ah_l").children("li.ah_item");
    strarr.each(function(index, item) {
      SilGum[index] = {
        title: $(this).find('span.ah_k').text()
      };

    });
    res.render('naver', {
      title: SilGum
    });
  });
})

router.get('/lotto', (req, res, next) => {
  request('https://www.dhlottery.co.kr/common.do?method=main&mainMode=default', (error, response, body) => {
    const $ = cheerio.load(body);
    let week = Number($("#lottoDrwNo").text());

    let week_arr = [];
    let allNum_arr = []; // 최근 ~ 50회차전 까지의 모든 수 
    let Choiced_Number = []; // 최근 ~ 5회전까지 당첨 숫자
    let test = []; 

    // #PM_ID_ct > div.header > div.section_navbar > div.area_hotkeyword.PM_CL_realtimeKeyword_base > div.ah_list.PM_CL_realtimeKeyword_list_base > ul:nth-child(5) > li:nth-child(1) > a > span.ah_k
    // #article > div:nth-child(2) > div > div.win_result > div > div.num.win > p > span.ball_645.lrg.ball1

    for (let i = 0; i < 5; i++) { // 숫자 통계
      request(`https://www.dhlottery.co.kr/gameResult.do?method=byWin&drwNo=${week-i}`, (error, response, body) => {
        let $ = cheerio.load(body);

        week_arr.push(Number(week - i));
        week_arr.sort();
        week_arr.reverse();

        let allNum = $("div.num.win p").children("span.ball_645");

        allNum.each(function(index, item) { // 
          allNum_arr.push(Number($(this).text()));
          if (i < 5) {
            test.push(Number($(this).text()));
          }
        })
        Choiced_Number[i] = test
        test = [];
      });
    }
    setTimeout(() => {

      let checkNum = [];
      for(let i = 0; i<=45; i++){
        checkNum[i] = 0;
      }

      // console.log(allNum_arr[0]);
      
      for( let i = 0; i <= 45; i ++){
        // console.log(i);
        for(let l = 0; l < allNum_arr.length; l++){
          if(i+1 == allNum_arr[l]){
            checkNum[i]++;
          }
        }
      }

      res.render('lotto', {
        week_arr,
        allNum_arr,
        Choiced_Number,
        checkNum
      });
      // console.log(week_arr);
      // console.log(Choiced_Number);
      // console.log(allNum_arr.length);

    }, 1000);

  })
})


module.exports = router;

let axios = require("axios");
let md5js = require("md5js");
// create an axios instance
const service = axios.create({
  baseURL: "http://api.fanyi.baidu.com/api/trans/vip", // api 的 base_url
  timeout: 5000, // request timeout
});

// async function loadZhValue(object) {
//   let res = await tr(Object.keys(object));
//   let count = 0;
//   for (const key in object) {
//     object[key] = res[count];
//     count++;
//   }
//   console.log(res);
//   console.log("结果", object);
//   return object;
// }

async function loadZhValue(object) {
  let wordList = Object.keys(object);
  let word = wordList.join("\n");
  let fromLang = "en";
  let toLang = "zh";
  let appid = "20190819000327773";
  let salt = "123456";
  let token = "6QYq7knpguhdcBqpNjOA";
  let sign = md5js.md5(appid + word + salt + token, 32);
  let res = await service.get(
    `/translate?q=${word}&from=${fromLang}&to=${toLang}&appid=${appid}&salt=${salt}&sign=${sign}`,
  );
  console.log(res.data);
  for (const value of res.data.trans_result) {
    object[value.src] = value.dst;
  }
  console.log("百度翻译不允许频繁调用，间隔1秒……");
  await delay(1000);
  return object;
}

function delay(timeout) {
  return new Promise((r, e) => {
    setTimeout(() => {
      r();
    }, timeout);
  });
}

module.exports = {
  loadZhValue,
};

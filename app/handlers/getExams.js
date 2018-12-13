const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (params, ctx) => {
  const { cookie } = params;

  // TODO 优雅的处理学期
  const semester = '2018-2019-1';
  const examRes = await axios({
    url: 'http://jwcnew.nefu.edu.cn/dblydx_jsxsd/xsks/xsksap_list',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookie,
      'Host': 'jwcnew.nefu.edu.cn',
      'Origin': 'http://jwcnew.nefu.edu.cn',
      'Referer': 'http://jwcnew.nefu.edu.cn/dblydx_jsxsd/kscj/cjcx_list',
    },
    data: `xqlbmc=&xnxqid=${semester}&xqlb=3`
  });

  const html = examRes.data;
  const $ = cheerio.load(html, { decodeEntities: false });

  const exams = [];
  $("#dataList").find("tr").each((index, element) => {
    const tdEle = $(element).find("td");
    const changci = $(tdEle.get(1)).text(); // 场次
    if (!changci) return;
    const kch = $(tdEle.get(2)).text();
    const name = $(tdEle.get(3)).text();
    const time = $(tdEle.get(4)).text();
    const location = $(tdEle.get(5)).text();
    const seat = $(tdEle.get(6)).text();
    const zkzh = $(tdEle.get(7)).text(); // 准考证号
    exams.push({ changci, kch, name, time, location, seat, zkzh });
  });

  return exams;
};

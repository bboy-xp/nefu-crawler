const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (params, ctx) => {
  const { cookie } = params;

  const scores = [];
  async function getScore(pageIndex) {
    const scoreRes = await axios({
      url: 'http://jwcnew.nefu.edu.cn/dblydx_jsxsd/kscj/cjcx_list',
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': cookie,
        'Host': 'jwcnew.nefu.edu.cn',
        'Origin': 'http://jwcnew.nefu.edu.cn',
        'Referer': 'http://jwcnew.nefu.edu.cn/dblydx_jsxsd/kscj/cjcx_list',
      },
      data: `pageIndex=${pageIndex}&kksjstr=&kcmc=&kcxz=&xsfs=&isfx=`
    });

    const html = scoreRes.data;
    // TODO check html
    const totalPage = parseInt(html.match(/共(\d*)页/)[1], 10);

    const $ = cheerio.load(html, { decodeEntities: false });
    //获取专业课与成绩
    $("#dataList").find("tr").each((index, element) => {
      const tdEle = $(element).find("td");
      const semester = $(tdEle.get(1)).text();
      if (!semester) return;
      const kch = $(tdEle.get(2)).text();
      const name = $(tdEle.get(3)).text();
      const score = $(tdEle.get(4)).text();
      const credit = $(tdEle.get(5)).text();
      scores.push({ semester, kch, name, score, credit });
    });

    if (pageIndex < totalPage) {
      await getScore(pageIndex + 1);
    }
  }

  await getScore(1);

  return scores;
};

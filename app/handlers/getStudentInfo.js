const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (params, ctx) => {
  const { cookie } = params;
  const studentRes = await axios({
    url: 'http://jwcnew.nefu.edu.cn/dblydx_jsxsd/grxx/xsxx',
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookie,
      'Host': 'jwcnew.nefu.edu.cn',
      'Origin': 'http://jwcnew.nefu.edu.cn',
      'Referer': 'http://jwcnew.nefu.edu.cn/dblydx_jsxsd/kscj/cjcx_query?Ves632DSdyV=NEW_XSD_XJCJ',
    },
    data: 'kcxz=&kcmc=&xsfs=max&isfx=0'
  });
  const html = studentRes.data;

  if (!html.includes('退出')) {
    return { error: 1, message: '获取个人信息失败' };
  }

  const $ = cheerio.load(html, { decodeEntities: false });
  const msg = {
    '院系': '',
    '专业': '',
    '学制': '',
    '学号': '',
    '姓名': '',
    '性别': '',
    '姓名拼音': '',
    '出生日期': '',
    '本人电话': '',
    '政治面貌': '',
    '籍贯': '',
    '民族': '',
    '家庭电话': '',
    '入学日期': '',
    '入学考号': '',
    '身份证编号': '',
  }
  $("tbody").find("td").each((index, element) => {
    if(index === 10) {
      msg["院系"] = $(element).text().split("：")[1];
    }else if(index === 11){
      msg["专业"] = $(element).text().split("：")[1];
    }else if(index === 12){
      msg["学制"] = $(element).text().split("：")[1];
    }else if(index === 14){
      msg["学号"] = $(element).text().split("：")[1];
    }else if(index === 16){
      msg["姓名"] = $(element).text();
    }else if(index === 18){
      msg["性别"] = $(element).text();
    }else if(index === 20){
      msg["姓名拼音"] = $(element).text();
    }else if(index === 23){
      msg["出生日期"] = $(element).text();
    }else if(index === 27){
      msg["本人电话"] = $(element).text();
    }else if(index === 31){
      msg["政治面貌"] = $(element).text();
    }else if(index === 33){
      msg["籍贯"] = $(element).text();
    }else if(index === 37){
      msg["民族"] = $(element).text();
    }else if(index === 51){
      msg["家庭电话"] = $(element).text();
    }else if(index === 190){
      msg["入学日期"] = $(element).text();
    }else if(index === 194){
      msg["入学考号"] = $(element).text();
    }else if(index === 196){
      msg["身份证编号"] = $(element).text();
    }
  });

  return msg;
};

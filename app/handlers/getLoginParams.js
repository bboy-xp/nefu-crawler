const axios = require('axios');

module.exports = async (params, ctx) => {
  const cookieRes = await axios.get('http://jwcnew.nefu.edu.cn/dblydx_jsxsd/');
  const cookie1 = cookieRes.headers['set-cookie'][0].split(';')[0];
  const cookie2 = cookieRes.headers['set-cookie'][1].split(';')[0];
  const cookie = cookie1 + ';' + cookie2;
  return {
    cookie,
    fields: [
      {
        type: 'input',
        title: '学号',
        name: 'USERNAME',
      },
      {
        type: 'input',
        title: '密码',
        name: 'PASSWORD'
      }
    ]
  };
};

const axios = require('axios');

module.exports = async (params, ctx) => {
  const { cookie, loginData } = params;
  const { USERNAME, PASSWORD } = loginData;
  const loginRes = await axios({
    url: 'http://jwcnew.nefu.edu.cn/dblydx_jsxsd/xk/LoginToXk',
    method: 'POST',
    data: `USERNAME=${USERNAME}&PASSWORD=${PASSWORD}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookie,
      'Host': 'jwcnew.nefu.edu.cn',
      'Origin': 'http://jwcnew.nefu.edu.cn',
      'Referer': 'http://jwcnew.nefu.edu.cn/dblydx_jsxsd/',
    },
  });

  if (loginRes.data.includes('退出')) {
    return { success: true, stuId: USERNAME, password: PASSWORD };
  }

  return { error: 1, message: '登录失败' };
};

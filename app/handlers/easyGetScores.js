const getLoginParams = require('./getLoginParams');
const login = require('./login');
const getScores = require('./getScores');

// 能够直接使用账号密码登录的系统，都有easy方法
module.exports = async (params, ctx) => {
  const { stuId, password } = params;

  const { cookie } = await getLoginParams();

  const loginRes = await login({ cookie, loginData: {
    USERNAME: stuId, PASSWORD: password
  }});

  if (loginRes.error) {
    return loginRes;
  }

  const scores = await getScores({ cookie });

  return scores;
};

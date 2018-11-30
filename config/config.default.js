'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1542599466394_974';

  // add your config here
  config.middleware = [];

  exports.security = {
    xframe: {
      enable: false,
      ignoreJSON: true
    },
    domainWhiteList: [ 'http://localhost:8080' ],
  };

  exports.mongoose = {
    url: 'mongodb://127.0.0.1/nefu-crawler',
    options: {}
  };

  return config;
};

'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  router.get('/check/test', controller.check.index);
  router.get('/saveCourse', controller.check.saveCourse);
  router.get('/getCheckData', controller.check.getCheckData);
  router.post('/postCheckData', controller.check.postCheckData);
  router.get('/getCheckDateData', controller.check.getCheckDateData);
  router.post('/postCheckDateData', controller.check.postCheckDateData);
  
  router.get('/login', controller.crawler.login);
};

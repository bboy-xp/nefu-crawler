'use strict';

const Controller = require('egg').Controller;
const axios = require('axios');
const moment = require('moment');

const getLoginParams = require('../handlers/getLoginParams');
const login = require('../handlers/login');
const getCourses = require('../handlers/getCourses');

class CheckController extends Controller {
  async index() {
    // const loginData = {
    //   USERNAME: '2017211503',
    //   PASSWORD: '799..com',
    // };
    // //获取登录参数
    // const loginParams = await getLoginParams();
    // // console.log(loginParams);
    // // 初始化参数变量
    // const params = {
    //   loginData: {}
    // };
    // loginParams.fields.forEach(field => {
    //   if (loginData[field.name]) {
    //     params.loginData[field.name] = loginData[field.name];
    //   }
    // });
    // params.cookie = loginParams.cookie;
    // // 登录
    // const loginRes = await login(params);

    // const courses = await getCourses({ cookie: loginParams.cookie, isNeedHtml: true });
    // // if (loginRes.error) {
    // //   message.error(loginRes.message);
    // //   return;
    // // }
    // console.log(courses.html);

    // this.ctx.body = 'hi, egg';

    const ctx = this.ctx;
    const courseUnit = {
      "smartWeeks": [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ],
      "timeStart": "5",
      "count": "2",
      "dayOfWeek": "星期四",
    }


    const reqData = this.formatDate({
      startDate: '2018-8-7',
      courseUnit: courseUnit
    });
    ctx.body = reqData;
  }
  formatTimeStart(params) {
    if (params === '星期一') {
      return (1);
    } else if (params === '星期二') {
      return (2);
    } else if (params === '星期三') {
      return (3);
    } else if (params === '星期四') {
      return (4);
    } else if (params === '星期五') {
      return (5);
    } else if (params === '星期六') {
      return (6);
    } else if (params === '星期日') {
      return (7);
    }
  }
  formatDate(params) {
    // 获取参数
    const { startDate, courseUnit } = params;
    // 初始化日期数组
    // 格式化参数开始时间
    const date = moment(startDate, "YYYY-MM-DD")

    const timeStartNum = this.formatTimeStart(courseUnit.dayOfWeek);
    // console.log(typeof(date.date()));
    function findStartDate() {
      // console.log(timeStartNum);
      // console.log(date.day());
      if (timeStartNum !== date.day()) {
        // console.log('日期加1');
        date.add(1, "days");
        return (findStartDate())
      } else {
        // console.log(courseUnit.dayOfWeek);
        // console.log(date.format("YYYY[-]MM[-]DD"));
      }
    };
    findStartDate();
    // console.log(date);
    const intervalDate = 7;
    const formatDateArr = [];
    courseUnit.smartWeeks.map((item, index) => {
      // 一定要加上不知道为什么删掉就会出bug
      let formatAddDateStr = date.format("YYYY[-]MM[-]DD");
      let isHaveNationalDay = false;
      // 判断是否是国庆节
      if (date.month() === 9 && date.date() >= 1 && date.date() <= 7) {
        isHaveNationalDay = true;
      } else {
        isHaveNationalDay = false;
      }
      // 手动添加其他时间
      if (!isHaveNationalDay) {
        if (courseUnit.timeStart === '1') {
          const dateStr = formatAddDateStr + ' 8:00 - 9:40';
          if (item === 1) {
            formatDateArr.push(dateStr);
          }
        } else if (courseUnit.timeStart === '3') {
          const dateStr = formatAddDateStr + ' 10:00 - 11:40';
          if (item === 1) {
            formatDateArr.push(dateStr);
          }
        } else if (courseUnit.timeStart === '5') {
          const dateStr = formatAddDateStr + ' 13:30 - 15:10';
          if (item === 1) {
            formatDateArr.push(dateStr);
          }
        } else if (courseUnit.timeStart === '7') {
          const dateStr = formatAddDateStr + ' 15:30 - 17:10';
          if (item === 1) {
            formatDateArr.push(dateStr);
          }
        } else if (courseUnit.timeStart === '9') {
          const dateStr = formatAddDateStr + ' 18:00 - 19:40';
          if (item === 1) {
            formatDateArr.push(dateStr);
          }
        } else if (courseUnit.timeStart === '11') {
          const dateStr = formatAddDateStr + ' 20:00 - 21:00';
          if (item === 1) {
            formatDateArr.push(dateStr);
          }
        }
      } else {
        formatAddDateStr = date.add(intervalDate, "days").format("YYYY[-]MM[-]DD");
        // console.log('国庆节');
        if (courseUnit.timeStart === '1') {
          const dateStr = formatAddDateStr + ' 8:00 - 9:40';
          if (item === 1) {
            formatDateArr.push(dateStr);
          }
        } else if (courseUnit.timeStart === '3') {
          const dateStr = formatAddDateStr + ' 10:00 - 11:40';
          if (item === 1) {
            formatDateArr.push(dateStr);
          }
        } else if (courseUnit.timeStart === '5') {
          const dateStr = formatAddDateStr + ' 13:30 - 15:10';
          if (item === 1) {
            formatDateArr.push(dateStr);
          }
        } else if (courseUnit.timeStart === '7') {
          const dateStr = formatAddDateStr + ' 15:30 - 17:10';
          if (item === 1) {
            formatDateArr.push(dateStr);
          }
        } else if (courseUnit.timeStart === '9') {
          const dateStr = formatAddDateStr + ' 18:00 - 19:40';
          if (item === 1) {
            formatDateArr.push(dateStr);
          }
        } else if (courseUnit.timeStart === '11') {
          const dateStr = formatAddDateStr + ' 20:00 - 21:00';
          if (item === 1) {
            formatDateArr.push(dateStr);
          }
        }
      }
      date.add(intervalDate, "days");
    })
    return (formatDateArr);
  }
  async saveCourse() {
    const ctx = this.ctx;
    const Course = ctx.model.Course;
    const CourseDate = ctx.model.CourseDate;
    const loginData = {
      USERNAME: '2017211503',
      PASSWORD: '799..com',
    };
    //获取登录参数
    const loginParams = await getLoginParams();
    // 初始化参数变量
    const params = {
      loginData: {}
    };
    loginParams.fields.forEach(field => {
      if (loginData[field.name]) {
        params.loginData[field.name] = loginData[field.name];
      }
    });
    params.cookie = loginParams.cookie;
    // 登录
    const loginRes = await login(params);
    const courses = await getCourses({ cookie: loginParams.cookie });
    // 初始化date数组
    courses.map(async (course, index) => {
      const courseSchema = new Course({
        schoolId: course.schoolId,
        stuId: course.stuId,
        semesterId: course.semesterId,
        teacher: course.teacher,
        name: course.name,
        injectByUser: course.injectByUser,
        courseUnits: course.courseUnits,
        checked: false,
        isPassCheck: true,
        checkMsg: ''
      });
      await courseSchema.save();
      const courseItem = {
        stuId: course.stuId,
        courseUnits: []
      };
      course.courseUnits.map((courseUnit, index) => {
        const dateObj = {
          smartWeeks: courseUnit.smartWeeks,
          timeStart: courseUnit.timeStart,
          dayOfWeek: courseUnit.dayOfWeek,
          dateArr: []
        };
        dateObj['dateArr'] = this.formatDate({
          startDate: '2018-9-1',
          courseUnit: courseUnit
        });
        courseItem.courseUnits.push(dateObj);
      });
      const courseDateSchema = new CourseDate({
        stuId: courseItem.stuId,
        courseUnits: courseItem.courseUnits,
        checked: false,
        isPassCheck: true,
        checkMsg: ''
      });
      await courseDateSchema.save();
    })
    ctx.body = 'success';
  }
  async getCheckData() {
    const ctx = this.ctx;
    const Course = ctx.model.Course;
    
    const loginData = {
      USERNAME: '2017211503',
      PASSWORD: '799..com',
    };
    //获取登录参数
    const loginParams = await getLoginParams();
    // 初始化参数变量
    const params = {
      loginData: {}
    };
    loginParams.fields.forEach(field => {
      if (loginData[field.name]) {
        params.loginData[field.name] = loginData[field.name];
      }
    });
    params.cookie = loginParams.cookie;
    // 登录
    const loginRes = await login(params);
    const courses = await getCourses({ cookie: loginParams.cookie, isNeedHtml: true });
    const getTargetCourses = await Course.find({ stuId: loginData.USERNAME });
    ctx.body = {
      html: courses.html,
      courseArr: getTargetCourses
    };
  }
  async postCheckData() {
    const ctx = this.ctx;
    const Course = ctx.model.Course;
    const reqData = ctx.request.body;
    const checkForm = reqData.checkForm;
    //  开始循环update
    checkForm.map(async (item, index) => {
      await Course.update({ '_id': item.id }, {
        checked: true,
        isPassCheck: item.isCorrect,
        checkMsg: item.errorMessage
      })
    })
    ctx.body = "ok";
  }
  async getCheckDateData() {
    const ctx = this.ctx;
    const CourseDate = ctx.model.CourseDate;
    const loginData = {
      USERNAME: '2017211503',
      PASSWORD: '799..com',
    };
    const resData = await CourseDate.find({ stuId: loginData.USERNAME })
    console.log(resData);
    ctx.body = resData;
  }
  async postCheckDateData() {
    const ctx = this.ctx;
    const CourseDate = ctx.model.CourseDate;
    const reqData = ctx.request.body;
    const checkForm = reqData.checkForm;
    //  开始循环update
    checkForm.map(async (item, index) => {
      await CourseDate.update({ '_id': item.id }, {
        checked: true,
        isPassCheck: item.isCorrect,
        checkMsg: item.errorMessage
      })
    })
    ctx.body = 'ok';
  }
}

module.exports = CheckController;

'use strict';

const Controller = require('egg').Controller;
const axios = require('axios');
const moment = require('moment');

const getLoginParams = require('../handlers/getLoginParams');
const login = require('../handlers/login');
const getCourses = require('../handlers/getCourses');
const formatDate = require('../handlers/formatDate');

class CheckController extends Controller {
  async index() {
    const ctx = this.ctx;

    ctx.body = reqData;
  }

  async saveCourse() {
    const ctx = this.ctx;
    const Course = ctx.model.Course;
    const CourseDate = ctx.model.CourseDate;
    const CheckCourse = ctx.model.CheckCourse;
    // 这个用户名和密码应该前端传入
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
    // console.log(courses.newCourseArr.length);
    // 这个stuId需要改
    const checkCourseSchema = new CheckCourse({
      stuId: loginData.USERNAME,
      courseHTML: courses.html,
      courseUnitsArr: courses.newCourseArr,
      checked: false, //是否被审核
      isPassCheck: true,
    });
    await checkCourseSchema.save();

    const checkDateArr = [];
    // 初始化date数组
    courses.newCourseArr.map(async (course, index) => {
      course.courseUnits.map((courseUnit, index) => {
        // 重构了格式化日期的函数formatDate()
        const dateObj = formatDate({
          startDate: '2018-9-1',
          courseUnit: courseUnit
        });
        checkDateArr.push(dateObj);
      });
    })
    console.log(checkDateArr);
    const courseDateSchema = new CourseDate({
      stuId: loginData.USERNAME,
      courseUnits: checkDateArr,
      checked: false,
      isPassCheck: true,
    })
    await courseDateSchema.save();
    courses.newCourseArr.map(async (course, index) => {
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

      // const courseDate = {
      //   stuId: courseItem.stuId,
      //   courseUnits: courseItem.courseUnits,
      //   checked: false,
      //   isPassCheck: true,
      //   checkMsg: ''
      // }
      // console.log(courseDate);
      // const courseDateSchema = new CourseDate({
      //   stuId: courseItem.stuId,
      //   courseUnits: courseItem.courseUnits,
      //   checked: false,
      //   isPassCheck: true,
      //   checkMsg: ''
      // });
      // await courseDateSchema.save();
    })
    // console.log(checkDateArr);
    ctx.body = 'success';
    
  }
  async getCheckData() {
    const ctx = this.ctx;
    const CheckCourse = ctx.model.CheckCourse;

    const getTargetCourses = await CheckCourse.findOne({ 'checked': false });
    let isEmpty;
    console.log(!!getTargetCourses);
    if (!!getTargetCourses) {
      isEmpty = false;
    } else {
      isEmpty = true;
    }
    ctx.body = {
      checkCourseData: getTargetCourses,
      isEmpty: isEmpty
    };
  }
  async postCheckData() {
    const ctx = this.ctx;
    const CheckCourse = ctx.model.CheckCourse;
    const reqData = ctx.request.body;
    console.log(reqData);
    const checkForm = reqData.checkForm;
    const _id = reqData._id;
    const isPassCheck = reqData.isPassCheck;
    // console.log(checkForm);
    await CheckCourse.updateOne({ '_id': _id }, {
      'checked': true,
      'isPassCheck': isPassCheck,
      'courseUnitsArr': checkForm
    })
    ctx.body = "ok";
  }
  async getCheckDateData() {
    const ctx = this.ctx;
    const CourseDate = ctx.model.CourseDate;

    const getTargetCourses = await CourseDate.findOne({ 'checked': false });
    let isEmpty;
    console.log(!!getTargetCourses);
    if (!!getTargetCourses) {
      isEmpty = false;
    } else {
      isEmpty = true;
    }
    ctx.body = {
      checkCourseData: getTargetCourses,
      isEmpty: isEmpty
    };

  }
  async postCheckDateData() {
    const ctx = this.ctx;
    const CourseDate = ctx.model.CourseDate;
    const reqData = ctx.request.body;
    console.log(reqData.checkForm);
    const checkForm = reqData.checkForm;
    const isPassCheck = reqData.isPassCheck;
    const _id = reqData._id;
    await CourseDate.updateOne({'_id': _id}, { 
      'checked': true,
      'isPassCheck': isPassCheck,
      'courseUnits': checkForm
    })
    //  开始循环update
    // checkForm.map(async (item, index) => {
    //   await CourseDate.update({ '_id': item.id }, {
    //     checked: true,
    //     isPassCheck: item.isCorrect,
    //     checkMsg: item.errorMessage
    //   })
    // })
    ctx.body = 'ok';
  }
}

module.exports = CheckController;

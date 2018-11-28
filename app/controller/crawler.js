'use strict';

const Controller = require('egg').Controller;
const axios = require('axios');
const qs = require('qs');
const cheerio = require('cheerio');

class CrawlerController extends Controller {
  async getCookie() {
    //请求url获取cookie
    const getCookie = await axios.get('http://jwcnew.nefu.edu.cn/dblydx_jsxsd/');
    const cookie1 = getCookie.headers['set-cookie'][0].split(';')[0];
    const cookie2 = getCookie.headers['set-cookie'][1].split(';')[0];
    console.log(cookie2);
    const cookie = cookie1 + ';' + cookie2;
    return cookie;
  }

  async login() {
    const ctx = this.ctx;
    const Course = ctx.model.Course;
    // let USERNAME;
    // let PASSWORD;
    //临时赋值
    let USERNAME = '2017211503';
    let PASSWORD = '799..com';
    const data = {
      "USERNAME": USERNAME,
      "PASSWORD": PASSWORD
    }
    //获取cookie
    const cookie = await this.getCookie();
    console.log(cookie);
    //模拟登录
    //发送账号和密码
    const login = await axios({
      url: 'http://jwcnew.nefu.edu.cn/dblydx_jsxsd/xk/LoginToXk',
      method: 'POST',
      data: qs.stringify(data),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': cookie,
        'Host': 'jwcnew.nefu.edu.cn',
        'Origin': 'http://jwcnew.nefu.edu.cn',
        'Referer': 'http://jwcnew.nefu.edu.cn/dblydx_jsxsd/',
      },
    })
    const getLesson = await axios({
      url: 'http://jwcnew.nefu.edu.cn/dblydx_jsxsd/xskb/xskb_list.do?Ves632DSdyV=NEW_XSD_PYGL',
      method: 'get',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': cookie,
        'Host': 'jwcnew.nefu.edu.cn',
        'Origin': 'http://jwcnew.nefu.edu.cn',
        'Referer': 'http://jwcnew.nefu.edu.cn/dblydx_jsxsd/framework/xsMain.jsp',
      },
    });

    const getScore = await axios({
      url: 'http://jwcnew.nefu.edu.cn/dblydx_jsxsd/kscj/cjcx_list',
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
    async function getLessonArr(getScore) {
      const html = getLesson.data;
      // const html = getScore.data;

      //load()中的第二个参数防止中文转码
      const $ = cheerio.load(html, { decodeEntities: false });

      // 获取stuId
      const stuId = $('#Top1_divLoginName').text().substring(3, 13);
      // 获取学期id
      const semesterId = $('#xnxq01id').val();
      // console.log(semesterId);
      // console.log(stuId);
      // for (let index1 = 0; index1 < $(".kbcontent").length; index1++) {


      // }
      // console.log($(".kbcontent"));
      let courseArr = [];
      $(".kbcontent").map(async (index1, element1) => {
        // console.log(index1);

        const lessonName = $(element1).contents().filter(function () {
          return this.nodeType == 3;
        }).text();
        // console.log(lessonName);
        const lessonNameArr = lessonName.split("---------------------");
        for (let index2 = 0; index2 < lessonNameArr.length; index2++) {

          const element2 = lessonNameArr[index2];

          // console.log(element2);
          if (element2.length <= 2) {
            // 没课
            // console.log('没课');
          } else {
            let course = {
              schoolId: 'nefu',
              stuId: '',
              semesterId: '',
              teacher: '',
              name: '',
              injectByUser: false,
              // courseUnits: [{
              //   weeks: String,
              //   dayOfWeek: String,
              //   timeStart: String, // 节次
              //   count: String, // 节数
              //   building: String,
              //   room: String,
              //   smartWeeks: Array,
              // }],
              courseUnits: []
            };

            // 存stuId
            // console.log($('#Top1_divLoginName').text());
            course['stuId'] = stuId;
            // 存学期id
            course['semesterId'] = semesterId;
            // 存课程名
            course['name'] = element2;
            // console.log(element2);
            // 存老师和教室
            $(element1).find('font[title="老师"]').each((index3, element3) => {
              if (index3 === index2) {
                // console.log($(element3).text());
                course['teacher'] = $(element3).text();
              }
            });
            let courseUnitsItem = {
              weeks: '',
              dayOfWeek: '',
              timeStart: '', // 节次
              count: '2', // 节数
              building: '',
              room: '',
              smartWeeks: [],
            }
            $(element1).find('font[title="周次(节次)"]').each(async (index3, element3) => {
              if (index3 === index2) {
                // console.log($(element3).text());
                const weeks = $(element3).text();
                // console.log(weeks);
                courseUnitsItem['weeks'] = weeks;

                //处理智能周
                let smartWeeks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                const weekStr = weeks.slice(0, -3);
                // console.log(weekStr);
                // console.log(weekStr.indexOf(','));
                if (weekStr.indexOf(',') === -1) {
                  //周数中没有','的字符串
                  // console.log(weekStr);
                  const weekArr = weekStr.split('-');
                  // console.log(weekArr);
                  if (weekArr.length === 1) {
                    //只有一个数字的周数
                    const smartWeeksIndex = Number(weekArr[0]) - 1;
                    smartWeeks[smartWeeksIndex] = 1;
                  } else {
                    //有范围的周数
                    const smartWeeksStartIndex = Number(weekArr[0]) - 1;
                    const smartWeeksEndIndex = Number(weekArr[1]) - 1;
                    for (let i = smartWeeksStartIndex; i <= smartWeeksEndIndex; i++) {
                      smartWeeks[i] = 1;
                    }
                  }
                } else {
                  // 周数中有','的字符串
                  // console.log(weekStr.split(','));
                  const weekArr = weekStr.split(',');
                  weekArr.map((e, i) => {
                    const smartWeeksIndex = Number(e) - 1;
                    smartWeeks[smartWeeksIndex] = 1;
                  })
                }
                courseUnitsItem['smartWeeks'] = smartWeeks;
                // console.log(smartWeeks);
              }
            });
            $(element1).find('font[title="教室"]').each((index3, element3) => {
              if (index3 === index2) {
                // console.log($(element3).text());
                const place = $(element3).text();
                const building = place.slice(0, -3);
                const room = place.slice(-3);
                courseUnitsItem['building'] = building;
                courseUnitsItem['room'] = room;
                // console.log(building, room);
              }
            });
            let timeStart;
            // console.log(index1);
            if (index1 <= 6) {
              // console.log('第一二节');
              timeStart = '1';
            } else if (index1 <= 13 && index1 > 6) {
              // console.log('第三四节');
              timeStart = '3';
            } else if (index1 <= 20 && index1 > 13) {
              // console.log('第五六节');
              timeStart = '5';
            } else if (index1 <= 27 && index1 > 20) {
              // console.log('第七八节');
              timeStart = '7';
            } else if (index1 <= 34 && index1 > 27) {
              // console.log('第九十节');
              timeStart = '9';
            } else if (index1 <= 41 && index1 > 34) {
              // console.log('第十一十二节');
              timeStart = '11';
            };
            // console.log(timeStart);
            courseUnitsItem['timeStart'] = timeStart;
            // console.log(courseUnitsItem);
            let dayOfWeek;
            switch (index1) {
              case 0:
              case 7:
              case 14:
              case 21:
              case 28:
              case 35:
                // console.log('星期一');
                dayOfWeek = '星期一';
                break;
              case 1:
              case 8:
              case 15:
              case 22:
              case 29:
              case 36:
                // console.log('星期二');
                dayOfWeek = '星期二';
                break;
              case 2:
              case 9:
              case 16:
              case 23:
              case 30:
              case 37:
                // console.log('星期三');
                dayOfWeek = '星期三';
                break;
              case 3:
              case 10:
              case 17:
              case 24:
              case 31:
              case 38:
                // console.log('星期四');
                dayOfWeek = '星期四';
                break;
              case 4:
              case 11:
              case 18:
              case 25:
              case 32:
              case 39:
                // console.log('星期五');
                dayOfWeek = '星期五';
                break;
              case 5:
              case 12:
              case 19:
              case 26:
              case 33:
              case 40:
                // console.log('星期六');
                dayOfWeek = '星期六';
                break;
              case 6:
              case 13:
              case 20:
              case 27:
              case 34:
              case 41:
                // console.log('星期日');
                dayOfWeek = '星期日';
                break;
            }
            courseUnitsItem['dayOfWeek'] = dayOfWeek;

            course.courseUnits.push(courseUnitsItem);
            // 将整理好的数据push到courseArr数组中
            courseArr.push(course);
          }
        }
      })

      return (courseArr);
    }


    async function formatCourseArr() {
      const courseArr = await getLessonArr(getScore);
      let newCourseArr = [];

      for (let i = 0; i < courseArr.length; i++) {
        let e1 = courseArr[i];
        let flag = true;
        let courseArrIndex;
        for (let j = 0; j < newCourseArr.length; j++) {
          const e2 = newCourseArr[j];
          if(e1.schoolId === e2.schoolId && e1.stuId === e2.stuId && e1.semesterId === e2.semesterId && e1.teacher === e2.teacher && e1.name === e2.name) {
            flag = false;
            courseArrIndex = j;
            let oldCourseUnits1 = e1.courseUnits;
            let oldCourseUnits2 = e2.courseUnits;
            e1.courseUnits = [...oldCourseUnits1, ...oldCourseUnits2];
          };
        }
        if(flag) {
          newCourseArr.push(e1);
        }else {
          newCourseArr[courseArrIndex] = e1;
        }
      }
      // console.log(newCourseArr);
      return (newCourseArr);
    }
    
    const newCourseArr = await formatCourseArr();
    async function saveCourse() {
      const newCourseArr = await formatCourseArr();
      newCourseArr.map(async (e, i) => {
        // console.log(i);
        const courseSchema = new Course({
          schoolId: e.schoolId,
          stuId: e.stuId,
          semesterId: e.semesterId,
          teacher: e.teacher,
          name: e.name,
          injectByUser: e.injectByUser,
          courseUnits: e.courseUnits
        });
        await courseSchema.save();
      })
    }
    await saveCourse();

    // console.log(courseArr.length);
    // const courseSchema = new Course({
    //   schoolId: course.schoolId,
    //   stuId: course.stuId,
    //   semesterId: course.semesterId,
    //   teacher: course.teacher,
    //   name: course.name,
    //   injectByUser: course.injectByUser,
    //   courseUnits: course.courseUnits
    // });
    // await courseSchema.save();
    // const arr = await Course.find();
    // const courseArr = await Course.find({
    //   schoolId: course.schoolId,
    //   stuId: course.stuId,
    //   semesterId: course.semesterId,
    //   teacher: course.teacher,
    //   name: course.name,
    // });
    // console.log(courseArr.length);
    // if (courseArr.length === 0) {
    //   // 没有课程， 直接储存
    //   // console.log('新课');
    //   await Course.create({
    //     schoolId: course.schoolId,
    //     stuId: course.stuId,
    //     semesterId: course.semesterId,
    //     teacher: course.teacher,
    //     name: course.name,
    //     injectByUser: course.injectByUser,
    //     courseUnits: course.courseUnits
    //   });
    // } else {
    //   // 有课程，先获取oldCourseUnits，再把新的courseUnits push 到里面，最后update
    //   // console.log('老课');
    //   let newCourseUnits = course.courseUnits;
    //   //更新Course在courseUnits里添加一项
    //   await Course.updateOne({
    //     schoolId: course.schoolId,
    //     stuId: course.stuId,
    //     semesterId: course.semesterId,
    //     teacher: course.teacher,
    //     name: course.name,
    //   }, {
    //       $push: {
    //         courseUnits: newCourseUnits
    //       }
    //     })
    // }

    //获取专业课与成绩
    // $("#dataList").find("tr").each((index, element) => {
    //   $(element).find("td").each((index2, element2) => {
    //     if(index2 === 3 || index2 === 4) {
    //       console.log($(element2).text());
    //     }
    //   })
    // })

    ctx.body = {message: newCourseArr};
  }
}

module.exports = CrawlerController;

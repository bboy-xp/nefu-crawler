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

  //爬取成绩的函数
  async crawlerScore() {
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
    const html = getScore.data;
    const $ = cheerio.load(html, { decodeEntities: false });
    //获取专业课与成绩
    $("#dataList").find("tr").each((index, element) => {
      $(element).find("td").each((index2, element2) => {
        if(index2 === 3 || index2 === 4) {
          console.log($(element2).text());
        }
      })
    })
  }
  //爬取个人信息的函数
  async crawlerMessage() {
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

    const getMsg = await axios({
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
    const html = getMsg.data;
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
    // console.log(msg);
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

      //load()中的第二个参数防止中文转码
      const $ = cheerio.load(html, { decodeEntities: false });

      // 获取stuId
      const stuId = $('#Top1_divLoginName').text().substring(3, 13);
      // 获取学期id
      const semesterId = $('#xnxq01id').val();
      let courseArr = [];
      $(".kbcontent").map(async (index1, element1) => {

        const lessonName = $(element1).contents().filter(function () {
          return this.nodeType == 3;
        }).text();
        const lessonNameArr = lessonName.split("---------------------");
        for (let index2 = 0; index2 < lessonNameArr.length; index2++) {

          const element2 = lessonNameArr[index2];

          if (element2.length <= 2) {
            // 没课
          } else {
            let course = {
              schoolId: 'nefu',
              stuId: '',
              semesterId: '',
              teacher: '',
              name: '',
              injectByUser: false,
              courseUnits: []
            };

            // 存stuId
            course['stuId'] = stuId;
            // 存学期id
            course['semesterId'] = semesterId;
            // 存课程名
            course['name'] = element2;
            // 存老师和教室
            $(element1).find('font[title="老师"]').each((index3, element3) => {
              if (index3 === index2) {
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
                const weeks = $(element3).text();
                courseUnitsItem['weeks'] = weeks;

                //处理智能周
                let smartWeeks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                // const weekStr = weeks.slice(0, -3);
                // 临时发现的bug 有的（）里面写的是单周  所以切割后三个字符串会出现bug
                const weekStr = weeks.split('(')[0];
                if (weekStr.indexOf(',') === -1) {
                  //周数中没有','的字符串
                  const weekArr = weekStr.split('-');
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
                  const weekArr = weekStr.split(',');
                  weekArr.map((e, i) => {
                    const smartWeeksIndex = Number(e) - 1;
                    smartWeeks[smartWeeksIndex] = 1;
                  })
                }
                courseUnitsItem['smartWeeks'] = smartWeeks;
              }
            });
            $(element1).find('font[title="教室"]').each((index3, element3) => {
              if (index3 === index2) {
                const place = $(element3).text();
                const building = place.slice(0, -3);
                const room = place.slice(-3);
                courseUnitsItem['building'] = building;
                courseUnitsItem['room'] = room;
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
            courseUnitsItem['timeStart'] = timeStart;
            let dayOfWeek;
            switch (index1) {
              case 0:
              case 7:
              case 14:
              case 21:
              case 28:
              case 35:
                dayOfWeek = '星期一';
                break;
              case 1:
              case 8:
              case 15:
              case 22:
              case 29:
              case 36:
                dayOfWeek = '星期二';
                break;
              case 2:
              case 9:
              case 16:
              case 23:
              case 30:
              case 37:
                dayOfWeek = '星期三';
                break;
              case 3:
              case 10:
              case 17:
              case 24:
              case 31:
              case 38:
                dayOfWeek = '星期四';
                break;
              case 4:
              case 11:
              case 18:
              case 25:
              case 32:
              case 39:
                dayOfWeek = '星期五';
                break;
              case 5:
              case 12:
              case 19:
              case 26:
              case 33:
              case 40:
                dayOfWeek = '星期六';
                break;
              case 6:
              case 13:
              case 20:
              case 27:
              case 34:
              case 41:
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

      return ({
        courseArr: courseArr,
        html: $(".Nsb_layout_r").html()
      });
    }

    let html = await getLessonArr(getScore);
    html = html.html;

    async function formatCourseArr() {
      let courseArr = await getLessonArr(getScore);
      courseArr = courseArr.courseArr;
      let newCourseArr = [];

      for (let i = 0; i < courseArr.length; i++) {
        let e1 = courseArr[i];
        let flag = true;
        let courseArrIndex;
        for (let j = 0; j < newCourseArr.length; j++) {
          const e2 = newCourseArr[j];
          if (e1.schoolId === e2.schoolId && e1.stuId === e2.stuId && e1.semesterId === e2.semesterId && e1.teacher === e2.teacher && e1.name === e2.name) {
            flag = false;
            courseArrIndex = j;
            let oldCourseUnits1 = e1.courseUnits;
            let oldCourseUnits2 = e2.courseUnits;
            e1.courseUnits = [...oldCourseUnits1, ...oldCourseUnits2];
          };
        }
        if (flag) {
          newCourseArr.push(e1);
        } else {
          newCourseArr[courseArrIndex] = e1;
        }
      }
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

    // await saveCourse();
    // await this.crawlerScore();
    // await this.crawlerMessage();
    const reqData = {
      message: "ok",
      newCourseArr: newCourseArr,
      html: html
    }

    ctx.body = reqData;
  }
}

module.exports = CrawlerController;

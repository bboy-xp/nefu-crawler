const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (params, ctx) => {
  const { cookie, isNeedHtml } = params;
  const courseRes = await axios({
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

  let { courseArr, html } = getLessonArr(courseRes.data);
  let newCourseArr = [];

  for (let i = 0; i < courseArr.length; i++) {
    let e1 = courseArr[i];
    let flag = true;
    let courseArrIndex;
    for (let j = 0; j < newCourseArr.length; j++) {
      const e2 = newCourseArr[j];
      if (e1.semesterId === e2.semesterId && e1.teacher === e2.teacher && e1.name === e2.name) {
        flag = false;
        courseArrIndex = j;
        let oldCourseUnits1 = e1.courseUnits;
        let oldCourseUnits2 = e2.courseUnits;
        e1.courseUnits = [...oldCourseUnits1, ...oldCourseUnits2];
      }
    }
    if (flag) {
      newCourseArr.push(e1);
    } else {
      newCourseArr[courseArrIndex] = e1;
    }
  }
  if(isNeedHtml) {
    return({
      newCourseArr: newCourseArr,
      html: html
    })
  }
  return newCourseArr;
};

function getLessonArr(html) {
  //load()中的第二个参数防止中文转码
  const $ = cheerio.load(html, { decodeEntities: false });

  // 获取stuId
  const stuId = $('#Top1_divLoginName').text().substring(3, 13);
  // 获取学期id
  const semesterId = $('#xnxq01id').val();
  let courseArr = [];
  $(".kbcontent").map(async (index1, element1) => {

    const lessonName = $(element1).contents().filter(function () {
      return this.nodeType === 3;
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
          default:
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

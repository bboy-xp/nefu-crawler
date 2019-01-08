const moment = require('moment');
module.exports = (params, ctx) => {
  const { courseUnit, startDate } = params;

  function formatTimeStart(params) {
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

  function formatDate(params) {
    // 获取参数
    const { startDate, courseUnit } = params;
    // 初始化日期数组
    // 格式化参数开始时间
    const date = moment(startDate, "YYYY-MM-DD")

    const timeStartNum = formatTimeStart(courseUnit.dayOfWeek);
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

  const dateObj = {
    smartWeeks: courseUnit.smartWeeks,
    timeStart: courseUnit.timeStart,
    dayOfWeek: courseUnit.dayOfWeek,
    dateArr: [],
    checked: false,
    isPassCheck: true,
    checkMsg: '',
  };
  dateObj['dateArr'] = formatDate({
    startDate: startDate,
    courseUnit: courseUnit
  });
  return dateObj;
};
//日期格式化  (时间戳转换为正常的时间)
/**
 *
 * @param value
 * @param type 0 年-月-日  1 年-月-日 时:分:秒 2 年月日 3 年月日 时:分:秒 4 时:分:秒 ...
 * @returns {string}
 */
export function formatTime(value, type = 0) {
  const time = new Date(value);
  let year = time.getFullYear();
  let month = time.getMonth() + 1;
  let date = time.getDate();
  let hour = time.getHours();
  let minute = time.getMinutes();
  let second = time.getSeconds();
  month = month < 10 ? "0" + month : month;
  date = date < 10 ? "0" + date : date;
  hour = hour < 10 ? "0" + hour : hour;
  minute = minute < 10 ? "0" + minute : minute;
  second = second < 10 ? "0" + second : second;
  const arr = [
    year + "-" + month + "-" + date, //默认传0得到的是年-月-日
    year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second, //传1得到的是年月日时分秒(2022-12-31 19:30:25)
    year + "年" + month + "月" + date, //传2得到 (2022年12月31日)
    year +
      "年" +
      month +
      "月" +
      date +
      " " +
      hour +
      ":" +
      minute +
      ":" +
      second, //传3得到(2022年12月31 19:30:25)
    hour + ":" + minute + ":" + second, //传4得到 (19:30:25)
    month + "-" + date, //传5得到（12-31）
    minute + ":" + second, //传6得到（30:25）
    year + "/" + month + "/" + date + " " + hour + ":" + minute, //传7得到2022/12/31 19:30
    second, //传8只拿到秒
    //等等根据情况随便补充
  ];
  return arr[type];
}

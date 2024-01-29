import { Message } from '@arco-design/web-vue';
import { Notification } from '@arco-design/web-vue';


let messageDom = null

/**
 * 消息提示
 * @param msg 提示信息
 * @param type 消息类型
 */
const message = (msg, type) => {
  if (messageDom) messageDom.close() // 判断弹窗是否已存在,若存在则关闭
  messageDom = ElMessage({
    showClose: true,
    message: msg,
    type: type,
  });
};
/**
 * 成功提示
 * @param msg 提示信息
 */
const SUCCESS = (msg) => {
  Message.success(msg);
};
/**
 * 消息提示
 * @param msg 提示信息
 */
const INFO = (msg) => {
  Message.info(msg);
};
/**
 * 错误提示
 * @param msg 提示信息
 */
const ERROR = (msg) => {
  Message.error(msg);
};

/**
 * 警告提示
 * @param msg 提示信息
 */
const WARNING = (msg) => {
    Message.warning(msg);
};

/**
 * 成功通知提示
 * @param title
 * @param msg
 * @constructor
 */
const NOTIFICATION_SUCCESS = (title,msg) => {
    Notification.success({
        title: title,
        content: msg,
    });
}

/**
 * 失败通知提示
 * @param title
 * @param msg
 * @constructor
 */
const NOTIFICATION_ERROR = (title,msg) => {
    Notification.error({
        title: title,
      content: msg,
    });
}

/**
 * 警告通知提示
 * @param title
 * @param msg
 * @constructor
 */
const NOTIFICATION_WARNING = (title,msg) => {
    Notification.warning({
        title: title,

      content: msg,
    });
}


export { SUCCESS, INFO, ERROR, WARNING, NOTIFICATION_SUCCESS, NOTIFICATION_ERROR, NOTIFICATION_WARNING};

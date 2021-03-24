import Vue from 'vue'

//导入提示组件
import { Toast } from 'vant'

//注册提示组件
Vue.use(Toast)

//表单验证模块
class ValidForm {

  constructor() {}

  //验证表单方法
  valid(obj) {
    //obj: 表单验证数据， object
    // 
    // 

    for (let key in obj) {
      if (!obj[key].reg.test(obj[key].value)) {
        

        //提示错误信息
        Toast(obj[key].errMsg);
        //表单验证不通过
        return false;
      }
    }

    //表单验证通过
    return true;
  }

}

//导出表单验证模块实例
export const validForm = new ValidForm();
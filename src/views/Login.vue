<template>
  <div class="login">
    <van-nav-bar left-text="返回" left-arrow @click-left="goState('Home')" />
    <div class="nav-left">
      <div class="logo"></div>
      <div class="logo-text">leisure time</div>
    </div>

    <div class="user-box">
      <div class="user-title">
        <div class="welcome">Welcome to login</div>
      </div>

      <van-form>
        <van-field
          v-model="userInfo.phone"
          name="手机号"
          label="手机号"
          placeholder="请输入手机号"
          autocomplete="off"
          ref="phone"
        />

        <van-field
          v-model="userInfo.password"
          :type="isLoginPass ? 'password' : 'text'"
          name="密码"
          label="密码"
          ref="password"
          placeholder="请输入密码"
          :right-icon="isLoginPass ? 'closed-eye' : 'eye-o'"
          autocomplete="off"
          @click-right-icon="toggleLoginPass"
        />

        <div class="forgot clearfix">
          <span class="ipt-sp fl">
            <input type="checkbox" v-model="isCheck" @click="checkbox" :disabled="disabled" />
            记住密码
          </span>
          <span class="forgot-sp fr" @click="goState('Forgot')">忘记密码?</span>
        </div>

        <div class="commit-btn">
          <van-button round block @click="login"> 登录 </van-button>
        </div>

        <div class="commit-btn">
          <van-button round block type="default" @click="toggleRe">
            注册
          </van-button>
        </div>
      </van-form>
    </div>

    <!-- 注册 -->
    <van-popup
      class="register-box"
      v-model="isShow"
      position="center"
      round
      closeable
      close-icon="close"
    >
      <div class="register-title">注册</div>
      <van-form>
        <van-field
          v-model="userRegInfo.phone"
          name="手机号"
          label="手机号"
          placeholder="请输入手机号"
          autocomplete="off"
        />

        <van-field
          v-model="userRegInfo.password"
          :type="isRegPassword ? 'password' : 'text'"
          name="密码"
          label="密码"
          placeholder="请输入密码"
          :right-icon="isRegPassword ? 'closed-eye' : 'eye-o'"
          autocomplete="off"
          @click-right-icon="toggleRePass"
        />

        <van-field
          v-model="userRegInfo.nickName"
          name="昵称"
          label="昵称"
          placeholder="请输入昵称"
          autocomplete="off"
        />
        <div class="commit-btn register-btn">
          <van-button round block @click="register"> 注册 </van-button>
        </div>
      </van-form>
    </van-popup>
  </div>
</template>

<script>
// 引入样式
import "../assets/less/login.less";

//导入表单验证模块
import { validForm } from "../assets/js/validForm";
export default {
  name: "Login",

  data() {
    return {
      // 登录信息
      userInfo: {
        phone: "",
        password: "",
      },
      // 注册
      userRegInfo: {
        phone: "",
        password: "",
        nickName: "",
      },

      // 是否展示注册框
      isShow: false,
      // 切换注册密码框小图标
      isRegPassword: true,
      // 切换登录页密码框小图标
      isLoginPass: true,
      // 复选框选中状态
      isCheck: false,

      disabled:true
    };
  },
  created() {
      this.userInfo.phone = localStorage.getItem("key") ? localStorage.getItem("key") : "";
      this.userInfo.password = localStorage.getItem("password") ? localStorage.getItem("password") : "";
      if (this.userInfo.phone != "" || this.userInfo.password != "") {
        this.isCheck = true;
      }
  },

  // 监听输入框值的变化化
  watch:{
    "userInfo.phone"(val){
      if (val.length > 0) {
        this.disabled = false;
      }else{
        this.disabled = true;
        this.isCheck = false;
        localStorage.removeItem("key");
        localStorage.removeItem("password");
      }
    },
    "userInfo.password"(val){
      if (val.length > 0) {
        this.disabled = false;
      }else{
        this.disabled = true;
        this.isCheck = false;
        localStorage.removeItem("key");
        localStorage.removeItem("password");
      }
    }
  },
  methods: {
    //切换注册框
    toggleRe() {
      this.isShow = true;
    },
    // 切换注册密码框类型
    toggleRePass() {
      this.isRegPassword = !this.isRegPassword;
    },
    // 切换登录密码框类型
    toggleLoginPass() {
      this.isLoginPass = !this.isLoginPass;
    },
 
    // 记住密码
    checkbox() {
       if (this.userInfo.phone == "" || this.userInfo.password == "") {
        // this.isCheck = false;
        this.$toast("账号或密码不能为空!")
        this.disabled = "disabled";
        console.log("this.isCheck=======>");
        return;
      }
      console.log("1111111");
      this.isCheck = !this.isCheck;
      
      console.log("checkbox this.isCheck=====>",this.isCheck);
      // 
      if (this.userInfo.phone != "" && this.userInfo.password != "") {
        
         console.log("145487");
        if (this.isCheck ) {
          //  记住账号
          localStorage.setItem("key", this.userInfo.phone);
          //  记住密码
          localStorage.setItem("password", this.userInfo.password);

        } else {
          // 不用记住账号,密码
          localStorage.removeItem("key");
          localStorage.removeItem("password");
          this.isCheck = false;
      
        }
      }else{
        
        console.log("else this.isCheck====>",this.isCheck);
      }
    },

    //注册
    register() {
      //构造表单验证信息
      let obj = {
        // 手机号格式
        phone: {
          value: this.userRegInfo.phone,
          errMsg: "手机号格式有误",
          reg: /^1[3-9]\d{9}$/,
        },
        // 限制密码格式
        password: {
          value: this.userRegInfo.password,
          errMsg: "密码格式有误",
          reg: /^[A-Za-z]\w{5,15}$/,
        },
        // 昵称格式
        nickName: {
          value: this.userRegInfo.nickName,
          errMsg: "昵称格式有误",
          reg: /^[\w\u4e00-\u9fa5]{1,10}$/,
        },
      };

      // 接收传过来的对象
      let isPass = validForm.valid(obj);

      if (isPass) {
        // 复制用户注册信息  Object.assign()方法将所有可数的自身属性从一个或多个源对象复制到目标对象, 返回目标对象
        let userInfo = Object.assign({}, this.userRegInfo);
        // 
        // 给 appkey 赋值
        userInfo.appkey = this.appkey;
        // 提示
        this.$toast.loading({
          // 文本提示
          message: "加载中...",
          // 禁止穿透点击(禁用背景点击)
          forbidClick: true,
          // 提示时间  0:无时间限制
          duration: 0, // 持续展示 toast
        });

        //发起注册请求
        this.axios({
          //请求类型
          method: "POST",
          //请求路径
          url: "/register",

          //POST请求参数, object
          data: userInfo,
        })
          .then((result) => {
            
            // 清除提示
            this.$toast.clear();

            // code 的值为100 则注册成功 102 已注册过
            if (result.data.code == 100) {
              // 关闭注册页面
              // this.$toast(result.data.msg);
              this.isShow = false;
            } else {
              // 若手机被注册过了(注册失败) 则返回提示信息
              this.$toast(result.data.msg);
            }
          })
          .catch((err) => {
            // 清除提示
            this.$toast.clear();
            
          });
      }
    },

    //登录
    login() {
      //构造表单验证信息
      let obj = {
        // 手机号格式
        phone: {
          value: this.userInfo.phone,
          errMsg: "手机号格式有误",
          reg: /^1[3-9]\d{9}$/,
        },
        // 限制密码格式
        password: {
          value: this.userInfo.password,
          errMsg: "密码格式有误",
          reg: /^[A-Za-z]\w{5,15}$/,
        },
      };

      // 接收传过来的对象
      let isPass = validForm.valid(obj);

      if (isPass) {
        // 复制用户注册信息  Object.assign()方法将所有可数的自身属性从一个或多个源对象复制到目标对象, 返回目标对象
        let userInfo = Object.assign({}, this.userInfo);
        // 
        // 给 appkey 赋值
        userInfo.appkey = this.appkey;

        this.$toast.loading({
          // 文本提示
          message: "加载中...",
          // 禁止穿透点击(禁用背景点击)
          forbidClick: true,
          // 提示时间  0:无时间限制
          duration: 0, // 持续展示 toast
        });

        //发起注册请求
        this.axios({
          //请求类型
          method: "POST",
          //请求路径
          url: "/login",

          //POST请求参数, object
          data: userInfo,
        })
          .then((result) => {
            
            // 清除提示
            this.$toast.clear();

            // code 的值为100 则登录成功
            if (result.data.code == 200) {
              this.$toast(result.data.msg);
              localStorage.setItem("__tk", result.data.token);

              //其他操作
              this.$router.push({ name: "Home" });
            } else {
              // 登录失败 则返回提示信息
              this.$toast(result.data.msg);
            }
          })
          .catch((err) => {
            // 清除提示
            this.$toast.clear();
            
          });
      }
    },

    // 跳转到首页
    goState(name) {
      this.$router.push({ name });
    },
  },
};
</script>

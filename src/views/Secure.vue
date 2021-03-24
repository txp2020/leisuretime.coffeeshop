++<template>
  <div class="secure">
    <van-nav-bar
      title="安全中心"
      left-text="返回"
      fixed
      left-arrow
      @click-left="goBack"
    />

    <PubliceBg>
      <div class="my-info-bot">
        <van-cell title="修改密码" is-link :center="true" @click="changePassword"/>
        <van-cell title="注销账号" is-link :center="true" @click="cancel"/>
      </div>
    </PubliceBg>
    <div class="bot-box">
      <van-button round color="linear-gradient(to right,#c5986c,#a9643d)" block
        @click="logOut">退出登录</van-button
      >
    </div>

    <van-popup class="register-box" v-model = "isShow" position="center" round closeable close-icon="close">
            <div class="register-title">修改密码</div>
            <van-form >

                <van-field
                    v-model="password.oldPassword"
                    label="旧密码"
                    name="旧密码"
                    placeholder="请输入旧密码"
                    autocomplete="off"
                />
                

                <van-field 
                    v-model="password.newPassword"
                    label="新密码"
                    name = "新密码"
                    placeholder="请输入新密码"
                    autocomplete="off"
                />
                <div class="commit-btn register-btn">
                    <van-button round block @click="commit">
                        提交
                    </van-button>
                </div>
            </van-form >
    </van-popup>
  </div>
</template>

<script>

import PubliceBg from "../components/PubliceBg.vue";
//导入表单验证模块
import {validForm} from '../assets/js/validForm'
import '../assets/less/secure.less'
export default {
  name: "Secure",

  components: {
    PubliceBg,
  },
  data() {
    return {
        isShow:false,
        password:{
            oldPassword:'',
            newPassword:'',
        }

    };
  },

  methods: {
    goBack() {
      this.$router.go(-1);
    },

    // 显示弹出框
    changePassword(){
        this.isShow = true;
    },
    // 注销账号
    cancel(){
         this.$dialog
        .confirm({
          title: "确认注销账号",
          message: "是否确认注销账号?",
          confirmButtonColor: "#a9643d",
        })
        .then(() => {
          //执行注销操作
          let tokenString = localStorage.getItem("__tk");

      if (!tokenString) {
        //跳回登录页面
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "POST",
        url: "/destroyAccount",
        data: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 'G001') {
              
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });

        })
        .catch((err) => {
          
        });
    },

    // 退出登录
    logOut(){
        this.$dialog
        .confirm({
          title: "确认退出登录",
          message: "是否确认退出登录?",
          confirmButtonColor: "#a9643d",
        })
        .then(() => {
          //执行退出登录
            this.$toast.loading({
                message: "加载中...",
                forbidClick: true,
                duration: 0,
            });
            setTimeout(() => {
                this.$toast.clear();
                localStorage.removeItem('__tk');
                this.$router.push({name:'Login'})
            },800)
        })
        .catch((err) => {
          
        });
    },

    // 提交修改密码
    commit(){
        let obj = {
            oldPassword: {
                value: this.password.oldPassword,
                errMsg: '旧密码格式有误',
                reg: /^[A-Za-z]\w{5,15}$/
            },
            // 限制密码格式
            passnewPasswordword: {
                value: this.password.newPassword,
                errMsg: '新密码格式有误',
                reg: /^[A-Za-z]\w{5,15}$/
            },
        };
        let isPass = validForm.valid(obj);

        // 判断表单是否通过
        if (isPass) {
            
            // 判断新 ,旧密码是否一致
            if (this.password.newPassword == this.password.oldPassword) {
                this.$toast("新旧密码不能一致");
                return;
            }
            let tokenString = localStorage.getItem("__tk");

      if (!tokenString) {
        //跳回登录页面
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "POST",
        url: "/updatePassword",
        data: {
          appkey: this.appkey,
          tokenString,
          password:this.password.newPassword,
          oldPassword:this.password.oldPassword,
        },
      })
        .then((result) => {
          this.$toast.clear();
          
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 'E001') {
              setTimeout(() => {
                    localStorage.removeItem('__tk');
                    this.$router.push({name:'Login'})
              },800)
          }
            this.$toast(result.data.msg);
          
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
        }
    }
  },
};
</script>

<style lang="less" scoped>

</style>
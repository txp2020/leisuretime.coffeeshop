<template>
  <div class="history">
    <van-nav-bar title="历史订单" left-text="返回" fixed left-arrow @click-left="goBack" />

    <div class="cell-list" v-if="orderData.length > 0">
      <div class="cell-item-box"  v-for="(item, index) in orderData" :key="index">
        <div class="pro-info-box">
          <div class="fl pro-img">
            <img class="auto-img" :src="item.smallImg" />
          </div>
          <div class="fl pro-info">
            <div class="pro-desc-top">
              <div class="name">
                <div class="fl pro-title">{{ item.name }}</div>
                <div class="fl pro-rule">{{ item.rule }}</div>
              </div>
              <div class="pro-enname">{{ item.enname }}</div>
            </div>
            <div class="pro-desc-bot clearfix">
              <div class="pro-price fl">￥{{ item.price }}</div>
              <div class="pro-num fr">x{{ item.count }}</div>
            </div>
          </div>
          <div class="delete-box fr">
            <van-icon name="close" @click="removeOrder(item.oid, index)"/>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <van-empty description="没有订单数据" />
    </div>
  </div>
</template>

<script>
import "../assets/less/history.less";
export default {
  name: "History",

  data() {
    return {
      orderData: [],
    };
  },

  created() {
    // 根据订单状态获取订单数据
    this.getOrderData();
  },

  methods: {
    goBack() {
      this.$router.go(-1);
    },

    getOrderData() {
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
        method: "GET",
        url: "/findOrder",
        params: {
          appkey: this.appkey,
          tokenString,
          status,
        },
      })
        .then((result) => {
          this.$toast.clear();
          //
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 70000) {
            this.orderData = result.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    // 删除历史订单
    removeOrder(oid, index) {
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
        url: "/removeOrder",
        data: {
          appkey: this.appkey,
          tokenString,
          oid
        },
      })
        .then((result) => {
          this.$toast.clear();
          // 
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 90000) {
            this.orderData.splice(index, 1);
          }
          this.$toast(result.data.msg)
          
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
  },
};
</script>

<style lang="less" scoped>
</style>
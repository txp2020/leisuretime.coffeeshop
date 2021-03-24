<template>
  <div class="order">
    <van-nav-bar
      title="我的订单"
      left-text="返回"
      right-text="历史订单"
      fixed
      left-arrow
      @click-left="goBack"
      @click-right="goHistory"
    />

    <PubliceBg>
      <div v-if="isHas">
        <van-tabs 
        v-model="tabIndex" 
        line-height="2" 
        color="#a9643d" 
        @change="changeTab"
        >
          <van-tab
            :title="item.title"
            v-for="(item, index) in tabTitleData"
            :key="index"
            
          >
            <div v-if="orderData.length > 0">
              <div class="order-box" v-for="(v, k) in orderData" :key="k">
                <PublicList
                  :info-title-left="v.oid"
                  :date="v.date | formatDate('yyyy-MM-dd hh:mm:ss')"
                  :count="v.count"
                  :total="v.total | decimal"
                  :is-right="true"
                  @confirm-receive="confirmReceipt(v, k)"
                  @remove="removeOrder(v.oid, k)"
                  :is-receive="v.status == 2"
                >
                  <PublicItem
                    v-for="(value, idx) in v.data"
                    :item="value"
                    :key="idx"
                  ></PublicItem>
                </PublicList>
              </div>
            </div>
            <div v-else>
              <van-empty description="没有订单数据" />
            </div>
          </van-tab>
        </van-tabs>
      </div>
      <div v-else>
        <van-empty description="没有订单数据" />
      </div>
    </PubliceBg>
  </div>
</template>

<script>
import "../assets/less/order.less";
import PubliceBg from "../components/PubliceBg.vue";
import PublicList from "../components/PublicList.vue";
import PublicItem from "../components/PublicItem.vue";
export default {
  name: "Order",

  components: {
    PubliceBg,
    PublicList,
    PublicItem,
  },

  data() {
    return {
      // 激活的下标
      tabIndex: 0,

      tabTitleData: [
        { title: "全部" },
        { title: "进行中" },
        { title: "已完成" },
      ],

      orderData: [],

      // 无订单数据
      isHas: true,
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

    goHistory(){
      this.$router.push({ name:"History" });
    },


    //切换订单状态 0: 全部, 1: 进行中, 2: 已完成
    changeTab(name, title) {
      // 
      // 
      //根据订单状态获取订单数据
      this.getOrderData();
    },

    // 根据订单状态获取订单数据
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
          status: this.tabIndex,
        },
      })
        .then((result) => {
          this.$toast.clear();
          // 
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 70000) {
            // 如全无订单, 移除tab
            if (this.tabIndex == 0 && result.data.result.length == 0) {
              this.isHas = false;
              return;
            }

            // 按订单号 oid 进行分类
            let orderDatas = [];
            result.data.result.map((v) => {
              // 查找订单数据 ,找到则将该数据放到当前订单内并计算商品数及总价
              for (let i = 0; i < orderDatas.length; i++) {
                if (orderDatas[i].oid == v.oid) {
                  orderDatas[i].data.push(v);
                  orderDatas[i].count += v.count;
                  orderDatas[i].total += v.count * v.price;
                  return;
                }
              }

              // 若找不到, 初始化当前订单数据
              let obj = {};
              obj.oid = v.oid;
              obj.count = v.count;
              obj.total = v.count * v.price;
              obj.status = v.status;
              obj.date = v.createdAt;
              obj.data = [v];
              orderDatas.push(obj);
            });
            this.orderData = orderDatas;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    // 确认收货
    confirmReceipt(item, index) {
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
        url: "/receive",
        data: {
          appkey: this.appkey,
          tokenString,
          oid: item.oid,
        },
      })
        .then((result) => {
          this.$toast.clear();
          // 
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 80000) {
            if (this.tabIndex == 1) {
              // 截取
              this.orderData.splice(index, 1);
            }
            item.status = 2;
          }
          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
          // 
        });
    },

    // 删除订单
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
.order {
  padding-top: 46px;

  /deep/ .van-nav-bar .van-icon {
    color: #a9643d;
  }

  /deep/ .van-nav-bar__text {
    color: #a9643d;
  }

  .order-box {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .bg-content {
    background-color: transparent !important;
    padding: 0 !important;
  }
}
</style>
<template>
  <div class="pay">
    <van-nav-bar
      title="确认订单"
      left-text="返回"
      left-arrow
      fixed
      @click-left="goBack"
    />

    <div class="pay-box">
      <div class="choice-address">
        <div class="select" @click="showSelectAddressList">选择收货地址 ></div>
        <div class="user-info">
          <div class="user-name">{{ currentAddress.name }}</div>
          <div class="user-phone">{{ currentAddress.tel }}</div>
          <div class="default-address" v-if="currentAddress.isDefault">
            默认
          </div>
        </div>
        <div class="detail-address">{{ currentAddress.address }}</div>
      </div>

      <div class="pro-box">
        <div class="order-info">
            <PublicList info-title-left="订单详情" :count="productInfo.count" :total="productInfo.total">
                <PublicItem v-for="(item, index) in products" :key="index" :item="item"></PublicItem>
            </PublicList>
        </div>
      </div>
    </div>
    <div class="buttom-box">
      <van-button
        type="primary"
        color="linear-gradient(to right,#cb9966,#a9643d)"
        round
        block
        @click="payBox"
        >立即结算</van-button
      >
    </div>

    <van-popup
      v-model="isOpen"
      position="bottom"
      round
      closeable
      close-icon="close"
    >
      <div class="adress">选择收货地址</div>
      <van-address-list
        v-model="chosenAddressId"
        :list="list"
        default-tag-text="默认"
        @add="newAddress"
        @select="selectAddress"
      />
    </van-popup>
  </div>
</template>

<script>
import "../assets/less/pay.less";
import PublicList from '../components/PublicList.vue'
import PublicItem from '../components/PublicItem.vue'
export default {
  name: "Pay",

  components:{
        PublicList,
        PublicItem
  },

  data() {
    return {
      isOpen: false,
      chosenAddressId: "",
      // 储存地址列表
      list: [],

      //选择当前地址
      currentAddress: {},

      //购物车的sid
      sids: [],

      // 要购买的商品数据
      products: [],
      // 储存商品数量和总价
      productInfo: {
        count: 0,
        total: 0,
      },
    };
  },
  created() {
    //截取查询参数(要分割,否则获取不到)
    this.sids = this.$route.query.sids.split("-");
    // 根据地址sids查询购物车数据
    this.getShopcatBySids(),
      // 获取地址列表数据
      this.getAddressData();
  },

  methods: {
    goBack() {
      this.$router.go(-1);
    },

    //新增地址
    newAddress() {
      this.$router.push({ name: "Addaddress" });
    },

    //选择地址
    selectAddress(item, index) {
      //   
      //   

      this.isOpen = false;

      this.currentAddress = item;
    },
    //展示选择地址列表
    showSelectAddressList() {
      this.isOpen = true;
    },

    //根据sids获取购物车数据
    getShopcatBySids() {
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
        url: "/commitShopcart",
        params: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(this.sids),
        },
      })
        .then((result) => {
          this.$toast.clear();
          //   
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 50000) {
            if (result.data.result.length == 0) {
              //如果没有商品可购买，则跳转到购物袋页面
              return this.$router.push({ name: "Home" });
            }
            result.data.result.map((v) => {
              this.productInfo.count += v.count;
              this.productInfo.total += v.count * v.price;
            });
            this.products = result.data.result;
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    // 获取地址数据
    getAddressData() {
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
        url: "/findAddress",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          // 
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 20000) {
            result.data.result.map((v) => {
              v.isDefault = Boolean(v.isDefault);
              v.id = v.aid;
              v.address = `${v.province}${v.city}${v.county}${v.addressDetail}`;

              // 默认地址
              if (v.isDefault) {
                this.chosenAddressId = v.aid;

                this.currentAddress = v;
              }
            });

            this.list = result.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    // 结算订单
    pay() {
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
        url: "/pay",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(this.sids),
          phone: this.currentAddress.tel,
          address: this.currentAddress.address,
          receiver: this.currentAddress.name,
        },
      })
        .then((result) => {
          this.$toast.clear();
          //   
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else {
            this.$toast(result.data.msg);
            // 跳转到订单页面
            this.$router.push({ name: "Order" });
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    // 结算提示
    payBox() {
      //判断是否选择地址
      if (!this.chosenAddressId) {
        this.$toast('请选择收货地址');
        return;
      }
      this.$dialog
        .confirm({
          title: "确认订单",
          message: "是否确认提交订单?",
          confirmButtonColor: "#a9643d",
        })
        .then(() => {
          //提交订单
          this.pay();
        })
        .catch((err) => {
          
        });
    },
  },
};
</script>

<style lang="less" scoped>
</style>
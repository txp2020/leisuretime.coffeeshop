<template>
  <div class="addresslist">
    <van-nav-bar
      title="收货地址"
      left-text="返回"
      left-arrow
      fixed
      @click-left="goBack"
    />

    <PubliceBg>
      <div v-if="list.length > 0">
        <van-address-list
          :switchable="false"
          :list="list"
          default-tag-text="默认"
          @add="onAdd"
          @edit="onEdit"
        />
      </div>
        <div v-else>
            <van-empty description="地址列表暂无数据,快去添加吧" />
        </div>
    </PubliceBg>
  </div>
</template>

<script>
import PubliceBg from "../components/PubliceBg.vue";
export default {
  name: "AddressList",

  data() {
    return {
      chosenAddressId: "",
      list: [],
    };
  },

  components: {
    PubliceBg,
  },

  created() {
    //   获取列表数据
    this.getAddressData();
  },

  methods: {
    //返回上一级
    goBack() {
      this.$router.go(-1);
    },

    // 获取列表数据
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
            });

            this.list = result.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    // 添加地址
    onAdd() {
      //  
      this.$router.push({ name: "Addaddress" });
    },

    // 编辑
    onEdit(item) {
      // 
      //item.aid: 地址aid
      this.$router.push({ name: "Addaddress", query: { aid: item.aid } });
    },
  },
};
</script>

<style lang="less" scoped>
.addresslist {
  padding-top: 46px;

  /deep/ .van-nav-bar .van-icon {
    color: #a9643d;
  }

  /deep/ .van-nav-bar__text {
    color: #a9643d;
  }

  /deep/ .van-tag--danger {
    background-color: #a9643d;
  }

  /deep/ .van-address-item .van-radio__icon--checked .van-icon {
    background-color: #a9643d;
    border-color: #a9643d;
  }

  /deep/ .van-address-list {
    padding: 0;
  }

  /deep/ .van-address-item {
    padding: 0 0 10px 0;
    border-bottom: 1px solid #e8e8e8;
    &:last-child {
      border-bottom: none;
    }
  }

  /deep/ .van-button--danger {
    background-color: #a9643d;
    border-color: #a9643d;
  }
  /deep/ .van-address-item__value {
    margin-top: 10px;
    margin-left: 8px;
  }
}
</style>
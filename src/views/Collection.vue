<template>
  <div class="collection">
    <van-nav-bar
      title="我的收藏"
      left-text="返回"
      fixed
      left-arrow
      @click-left="goBack"
    />
    <PubliceBg>
      <div class="coll-box" v-if="collectionData.length > 0">
        <div
          class="coll-box-item"
          v-for="(item, index) in collectionData"
          :key="index"
          @click="goDetail(item.pid)">
          <div class="coll-img">
            <img class="auto-img" :src="item.smallImg" />
          </div>
          <div class="coll-content">
            <div class="coll-content-text">
              <div class="coll-name">{{ item.name }}</div>
              <div class="coll-enname">{{ item.enname }}</div>
            </div>
            <div class="coll-price-del clearfix">
              <div class="coll-price fl">￥{{ item.price }}</div>
              <div
                class="coll-del fr"
                @click.stop="removeCollectionData(item.pid, index)"
              >
                <van-icon name="delete" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
          <van-empty description="暂无收藏数据" />
      </div>
    </PubliceBg>
  </div>
</template>

<script>
import PubliceBg from "../components/PubliceBg.vue";
import "../assets/less/collection.less";
export default {
  name: "Collection",

  // 注册组件
  components: {
    PubliceBg,
  },

  data() {
    return {
      collectionData: [],
    };
  },

  created() {
    // 获取收藏商品的数据
    this.getCollectionData();
  },

  methods: {
    goBack() {
      this.$router.go(-1);
    },

    // 获取收藏商品的数据
    getCollectionData() {
      //获取token
      let tokenString = localStorage.getItem("__tk");
      // 
      if (!tokenString) {
        return;
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      //发起查询收藏商品请求
      this.axios({
        method: "GET",
        url: "/findAllLike",
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
          } else if (result.data.code == 2000) {
            this.collectionData = result.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //查看商品详情
    goDetail(pid) {
      this.$router.push({ name: "Detail", params: { pid } });
    },

    //删除收藏商品
    removeCollectionData(pid, index) {
      //获取token
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

      //发起收藏商品请求
      this.axios({
        method: "POST",
        url: "/notlike",
        data: {
          appkey: this.appkey,
          pid,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
        //   
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 900) {
            this.$toast("删除成功");
            this.collectionData.splice(index, 1);
          } else {
            this.$toast("删除失败");
          }
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
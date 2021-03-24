<template>
  <div class="search">
    <van-nav-bar left-text="返回" left-arrow fixed @click-left="goBack">
      <template #right>
        <div class="home-search">
          <van-search
            v-model="name"
            ref="search"
            placeholder="请输入搜索关键词"
            shape="round"
            @search="search"
          />
        </div>
      </template>
    </van-nav-bar>
    <PubliceBg>
        <div class="search-box clearfix" v-if="products.length > 0">
            <div class="search-item fl" v-for="(item, index) in products" :key="index" @click="goDetail(item.pid)">
            <div class="search-img">
                <img :src="item.smallImg" class="auto-img">
            </div>
            <div class="pro-name">{{item.name}}</div>
            <div class="pro-enname">{{item.enname}}</div>
            <div class="pro-price fr">￥{{item.price}}</div>
            </div>
        </div>
        <div v-else>
          <van-empty description="抱歉~暂无您想要的数据" />
        </div>
    </PubliceBg>
  </div>
</template>

<script>
import PubliceBg from "../components/PubliceBg.vue";
import "../assets/less/search.less";
export default {
  name: "Search",

  // 注册组件
  components: {
    PubliceBg,
  },

  data() {
    return {
        // 关键字
        name:'',
        // 商品列表
        products:[],

        isShow:false
        
    };
  },
  created() {
    this.$nextTick(() => {
      // 
      // 获取元素节点
      let searchIpt = this.$refs.search.querySelector("[type = 'search']");
      
      //获取焦点
      searchIpt.focus();
    });
  },

  methods: {
    goBack() {
      this.$router.go(-1);
    },


    search() {
      
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/search",
        params: {
          appkey: this.appkey,
          name:this.name
        },
      })
        .then((result) => {
          this.$toast.clear();
          
          if (result.data.code == 'Q001') {
            this.products = result.data.result;
          }else{
              this.$toast(result.data.msg);
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },
    goDetail(pid){
        this.$router.push({name:'Detail', params: { pid }})
    }
  },
};
</script>

<style lang="less" scoped>
</style>
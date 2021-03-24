<template>
  <div class="home">
    <van-nav-bar fixed>
      <template #left>
        <div class="home-nav">
          <div class="t1">{{time}}</div>
          <div class="t2">{{userInfo.nickName}}</div>
        </div>
      </template>

      <template #right>
        <div class="home-search">
          <van-search placeholder="输入商品名称" @focus="goSearch"/>
        </div>
      </template>
    </van-nav-bar>

    <van-notice-bar
      left-icon="volume-o"
      scrollable
      text="宝贝正在热销中, 卖完即止!"
      mode="closeable"
    />

    <div class="home-content">
      <!-- 轮播图 -->
      <div class="banner-box">
        <van-swipe @change="changeCurrentIndex" :autoplay="5000" loop>
          <van-swipe-item v-for="(item, index) in bannerData" :key="index" >
            <img
              class="auto-img"
              :src="item.bannerImg"
              alt=""
              @click="goDetail(item.pid)"
            />
          </van-swipe-item>
          <template #indicator>
            <div class="index-box">
              <div
                :class="{ active: index == currentIndex }"
                v-for="(item, index) in bannerData"
                :key="index"
              ></div>
            </div>
          </template>
        </van-swipe>
      </div>

      <!-- 商品 -->
      <div class="product-box">
        <div>
          <div class="clearfix pro-title-box">
            <span class="pro-title">热卖宝贝</span>
            <span class="pro-more" @click="more">更多 ></span>
          </div>
          <div class="products clearfix">

            <div class="pro-item fl" v-for="(item, index) in hotProduct" :key="index" @click="goDetail(item.pid)">
              <div>
                <img
                  class="auto-img img"
                  :src="item.smallImg"
                />
              </div>
              <div class="pro-info clearfix">
                <div class="pro-name one-text">{{item.name}}</div>
                <div class="pro-enname one-text">{{item.enname}}</div>
                <span class="pro-hot">Hot</span>
                <div class="pro-price fr">￥{{item.price}}</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/home.less";
export default {
  name: "Home",
  data() {
    return {
      //当前轮播图片索引
      currentIndex: 0,

      //轮播数据
      bannerData: [],

      //热卖商品数据
      hotProduct: [],

      // 用户信息
      userInfo:{},

      time:''
    };
  },

  created() {
    //获取轮播图数据
    this.getBannerData();

    //获取热卖推荐商品
    this.getHotProduct();

    // 获取用户信息
    this.getUserInfo();

    // 获取时间
    this.getTime()
  },

  methods: {

    // 获取时间
    getTime(){
      let time = new Date();
      let hours = time.getHours();
      // 
      if (hours < 12) {
        this.time = 'morning~';
      }else if (hours < 14) {
        this.time = 'noon~';
      }else if (hours < 17) {
        this.time = 'afternoon~';
      }else if (hours < 24) {
        this.time = 'evening~';
      }
    },


    //修改轮播图片索引
    changeCurrentIndex(index) {
      this.currentIndex = index;
    },

    // 点击更多
    more(){
      return this.$router.push({name: 'Menu'});
    },

    //获取轮播图数据
    getBannerData() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      //发起注册请求
      this.axios({
        //请求类型
        method: "GET",
        //请求路径
        url: "/banner",

        //GET请求参数, object
        params: {
          appkey: this.appkey,
        },
      })
        .then((result) => {
          this.$toast.clear();

          // 

          if (result.data.code == 300) {
            this.bannerData = result.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();

          
        });
    },

    //获取热卖推荐商品
    getHotProduct() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      //发起注册请求
      this.axios({
        //请求类型
        method: "GET",
        //请求路径
        url: "/typeProducts",

        //GET请求参数, object
        params: {
          appkey: this.appkey,
          key: 'isHot',
          value: 1
        },
      })
        .then((result) => {
          this.$toast.clear();

          // 

          if (result.data.code == 500) {
            this.hotProduct = result.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();

          
        });
    },

    // 获取用户信息
     getUserInfo() {
      let tokenString = localStorage.getItem("__tk");

      if (!tokenString) {
        //跳回登录页面
        this.$toast("请先登录");
        return ;
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/findMy",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          
          if (result.data.code == "A001") {
            this.userInfo = result.data.result[0];
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //查看商品详情页面
    goDetail(pid) {
      this.$router.push({name: 'Detail', params: {pid}});
    },

    goSearch(){
      this.$router.push({name: 'Search'})
    }
  },
};
</script>
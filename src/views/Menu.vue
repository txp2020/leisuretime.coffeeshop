<template>
  <div class="menu">
    <div class="menu-search">
      <van-search placeholder="输入商品名称" @focus="searchFocus" />
    </div>
    <div class="bg-box">
        <img class="bg-img auto-img" src="../assets/images/menu-bg.jpg" alt="">
    </div>
    <div class="menu-box">
      <!-- 侧边栏 -->
      <div class="menu-aside">
        <div class="nav-box">
          <div
            class="latte-box"
            v-for="(item, index) in itemData"
            :key="index"
            :class="{ active: activeKey == index }"
            @click="toggleMenu(index,item.type)"
          >
            <div class="latte-img">
              <img
                class="auto-img"
                :src="activeKey == index ? item.url1 : item.url"
              />
            </div>
            <div class="latte-text">{{ item.title }}</div>
          </div>
        </div>
      </div>
      <!-- 商品 -->
      <div class="pro-box">
        <div
          class="coll-box-item"
          v-for="(item, index) in productData"
          :key="index"
          @click="goDetail(item.pid)"
        >
          <div class="coll-img">
            <img class="auto-img" :src="item.smallImg" />
          </div>
          <div class="coll-content">
            <div class="coll-content-text">
              <div class="coll-name">{{item.name}} </div>
              <div class="coll-enname">{{item.enname}} </div>
            </div>
            <div class="coll-price-del clearfix">
              <div class="coll-price fr">￥ {{item.price}} </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/menu.less";
export default {
  name: "Menu",

  data() {
    return {
      activeKey: 0,

      itemData: [
        {
          title: "推荐",
          url: require("../assets/images/tui.png"),
          url1: require("../assets/images/tui1.png"),
        },
        {
          title: "拿铁",
          url: require("../assets/images/Latte.png"),
          url1: require("../assets/images/Latte1.png"),
        },
        {
          title: "咖啡",
          url: require("../assets/images/coffee.png"),
          url1: require("../assets/images/coffee1.png"),
        },
        {
          title: "瑞纳冰",
          url: require("../assets/images/ice.png"),
          url1: require("../assets/images/ice1.png"),
        },
      ],

      // 商品数据
      productData: [],
    };
  },

  created() {
    // 获取商品类型
    this.getProType();
  },

  methods: {
    // 点击切换
    toggleMenu(index, type) {
      if (this.activeKey == index) {
        return;
      }
      this.activeKey = index;
      // 调用商品类型数据
      this.getProByType(type);
    },

    // 获取商品类型
    getProType() {
      //获取token
      let tokenString = localStorage.getItem("__tk");
      // 
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
        url: "/type",
        params: {
          appkey: this.appkey,
        },
      })
        .then((result) => {
          this.$toast.clear();
          // 
          if (result.data.code == 400) {
            let data = result.data.result;
            data.unshift({ 
              type: "isHot" ,
               typeDesc: "推荐" 
            });
            this.itemData.map((v) => {
              for (let i = 0; i < data.length; i++) {
                if (v.title == data[i].typeDesc) {
                  v.type = data[i].type;
                  break;
                }
              }
            });

            let type = this.itemData[this.activeKey].type;
            this.getProByType(type);
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    // 通过类型获取商品数据
    getProByType(type) {
      //获取token
      let tokenString = localStorage.getItem("__tk");
      // 
      if (!tokenString) {
        //跳回登录页面
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }
      // 参数
      let params = {
        appkey: this.appkey,
      };
      if (type == "isHot") {
        params.key = "isHot";
        params.value = 1;
      } else {
        params.key = "type";
        params.value = type;
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/typeProducts",
        params,
      })
        .then((result) => {
          this.$toast.clear();
          
          if (result.data.code == 500) {
            this.productData = result.data.result;
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

    //搜索栏获取焦点
    searchFocus() {
       this.$router.push({name: 'Search'});
    },
  },
};
</script>
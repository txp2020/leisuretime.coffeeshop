<template>
  <div class="shopcat">
    <van-nav-bar
      title="购物车"
      left-text="返回"
      left-arrow
      fixed
      @click-left="goBack()"
      @click-right="isEdit = !isEdit"
    >
      <template #right>
        <div v-if="shopcatData.length > 0">{{isEdit ? '完成' : '管理'}}</div>
      </template>
    </van-nav-bar>
    <div v-if="shopcatData.length == 0">
      <van-empty description="购物袋空空如也，快去添加吧!">
        <van-button round color="#a9643d"  class="bottom-button" @click="goMenu">
          逛一逛
        </van-button>
      </van-empty>
    </div>
    <div class="shopcat-box" v-else>
      <div class="shopcat-bg"></div>

      <!-- 懒加载组件 -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="我是有底线的哦!"
        offset="20"
        @load="loadData"
      >
        <div class="shopcat-product">
          <div
            class="shopcat-item"
            v-for="(item, index) in shopcatData"
            :key="item.sid"
          >
            <div class="cell-item">
              <van-swipe-cell :disabled="!isEdit">
                <div class="clearfix cell-item-box">
                  <div class="fl check-box">
                    <van-checkbox
                      @change="simpleSelect"
                      v-model="item.isChecked"
                      checked-color="#a9643d"
                    />
                  </div>
                  <div class="fl pro-info-box">
                    <div class="fl pro-img">
                      <img class="auto-img" :src="item.small_img" alt="" />
                    </div>
                    <div class="fl pro-info">
                      <div class="pro-info-text">
                        <div class="clearfix">
                          <div class="fl pro-name">{{ item.name }}</div>
                          <div class="fl pro-rule">{{ item.rule }}</div>
                        </div>
                        <div class="pro-enname">{{ item.enname }}</div>
                      </div>
                      <div class="pro-count-box">
                        <div class="fl pro-price">￥{{ item.price }}</div>
                        <div class="fr step-box">
                          <van-stepper
                            v-model="item.count"
                            theme="round"
                            button-size="20"
                            disable-input
                            @change="changeCount(item)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <template #right>
                  <van-button
                    square
                    type="danger"
                    text="删除"
                    @click="removeOne(index, item.sid)"
                  />
                </template>
              </van-swipe-cell>
            </div>
          </div>
        </div>
      </van-list>

      <van-submit-bar
        v-if="!isEdit"
        :price="total"
        button-text="提交订单"
        @submit="commit"
      >
        <van-checkbox v-model="isAllChecked" @click="allSelect"
          >全选</van-checkbox
        >
      </van-submit-bar>

      <van-submit-bar
        v-else
        button-text="删除选择"
        button-color="linear-gradient(to right,#c5986c,#a9643d)"
        @submit="removeSelected"
      >
        <van-checkbox v-model="isAllChecked" @click="allSelect"
          >全选</van-checkbox
        >
      </van-submit-bar>
    </div>
  </div>
</template>

<script>
import "../assets/less/shopcat.less";
export default {
  name: "Shopcat",
  data() {
    return {
      isChecked: false,
      count: 2,
      isAllChecked: false,

      // 触发加载
      loading: true,

      //是否全部加载完成数据
      finished: false,

      //是否处于编辑状态
      isEdit: false,

      //所有购物袋数据
      allShopbagData: [],

      //每次触底懒加载截取8条数据
      dataCount: 8,

      //开始截取购物袋数据位置
      startIndex: 0,

      //购物袋数据
      shopcatData: [],

      //订单总金额
      total: 0,
    };
  },

  created() {
    //获取购物车数据
    this.getShopcatData();
  },

  methods: {
    //返回上一级
    goBack() {
      this.$router.go(-1);
    },

    // 若无数据,则点击逛一逛跳转到分类页面
    goMenu(){
      this.$router.push({name:'Menu'});
    },

    //获取购物车数据
    getShopcatData() {
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

      //发起获取购物袋数据请求
      this.axios({
        method: "GET",
        url: "/findAllShopcart",
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
          } else if (result.data.code == 5000) {

            result.data.result.map((v) => {
              v.isChecked = false;

            });

            this.allShopbagData = result.data.result;

            //根据开始截取位置和截取数据数量设置购物袋显示的数据
            this.shopcatData = this.allShopbagData.slice(
              this.startIndex,
              this.startIndex + this.dataCount
            );

            this.startIndex += this.dataCount;

            //未加载
            this.loading = false;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //懒加载购物袋数据
    loadData() {
      // 

      setTimeout(() => {
        //在allShopbagData截取数据
        let data = this.allShopbagData.slice(
          this.startIndex,
          this.startIndex + this.dataCount
        );

        // 

        this.startIndex += this.dataCount;

        this.shopcatData.push(...data);


        //如果当前截取数据不足8条数据，下次不可能截取的数据
        if (data.length < this.dataCount) {
          //没有数据可加载时，需要finished修改为true，这样可以不再onload事件
          this.finished = true;
        } else {
          //每次触发onload事件都需要将loading修改为false
          this.loading = false;
        }
      }, 1500);
    },

    //全选
    allSelect() {
      this.shopcatData.map((v) => {
        v.isChecked = this.isAllChecked;
      });

      this.sum();
    },

    //单选
    simpleSelect() {

      this.sum();

      for (let i = 0; i < this.shopcatData.length; i++) {
        if (!this.shopcatData[i].isChecked) {
          this.isAllChecked = false;
          return;
        }
      }

      this.isAllChecked = true;
    },

    //单个删除
    removeOne(index,sid) {
      //index: shopcatData数组元素下标
      //sid: 购物车sid
    
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
        method: "POST",
        url: "/deleteShopcart",
        data: {
          appkey: this.appkey,
          tokenString,

          // 把sid 格式转下
          sids: JSON.stringify([sid])
        },
      })
        .then((result) => {
          this.$toast.clear();
          // 
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 7000) {
            //如果删除成功, 则移除页面的商品，重新计算订单总金额
            this.shopcatData.splice(index, 1);
            // 这样是可以判断是否还全选了
            this.simpleSelect();
            // this.sum();
          }

          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //判断是否勾选商品
    isSelectProduct(msg) {
      // 遍历购物车商品数据
      for (let i = 0; i < this.shopcatData.length; i++) {
        if (this.shopcatData[i].isChecked) {
          //如果存在勾选商品
          return true
        }
      }

      return false;
    },

    //删除选择
    removeSelected() {

      // true  or false
      let isHas = this.isSelectProduct();
      // 判断是否有勾选商品
      if (!isHas) {
        this.$toast("请选择删除的商品");
        return;
      }

      // sids: 是勾选商品的 sid 集合
      let sids = [];
      this.shopcatData.map(v =>{
        if (v.isChecked) {
          sids.push(v.sid);
        }
      })

      // 获取token
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
        method: "POST",
        url: "/deleteShopcart",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(sids)
        },
      })
        .then((result) => {
          this.$toast.clear();
          // 
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 7000) {
            //如果删除成功, 则移除页面的商品，重新计算订单总金额
            
            //移除页面的数据
            for (let i = 0; i < this.shopcatData.length; i++) {
              if (this.shopcatData[i].isChecked) {
                this.shopcatData.splice(i, 1);
                i--;
              }
            }

            this.sum();
          }

          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //修改数量
    changeCount(item) {
      //sid: 购物袋sid
      //count: 商品数量

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
        method: "POST",
        url: "/modifyShopcartCount",
        data: {
          appkey: this.appkey,
          tokenString,
          sid: item.sid,
          count: item.count
        },
      })
        .then((result) => {
          this.$toast.clear();
          // 
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 6000) {
            if (item.isChecked) {
              this.sum();
            }
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //计算订单总金额
    sum() {
      this.total = 0;
      this.shopcatData.map(v => {
        if (v.isChecked) {
          this.total += v.price * v.count;
        }
      })

      this.total *= 100;
    },

    //提交订单，跳转到订单页面
    commit() {
      let isHas = this.isSelectProduct();
      if (!isHas) {
        this.$toast('请选择购买的商品');
        return;
      }

      //sids: 勾选商品的购物袋sid集合
      let sids = [];
      this.shopcatData.map(v => {
        if (v.isChecked) {
          sids.push(v.sid);
        }
      })

      //跳转到结算页面且携带sids查询参数
      this.$router.push({name: 'Pay', query: {sids: sids.join('-')}});
    },
  
  },
};
</script>
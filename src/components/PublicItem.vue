<template>
  <div class="cell-list">
    <div class="cell-item-box">
      <div class="pro-info-box">
        <div class="fl pro-img">
          <img class="auto-img" :src="item.small_img || item.smallImg" />
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
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PublicItem",
  props: {
    item: {
      type: Object,
      default() {
        return {
          name: '名称',
          rule: '规格',
          enname: '英文名称',
          price: 0,
          count: 1
        };
      },
    },
  },
};
</script>

<style lang="less" scoped>
.cell-list{
  // margin-bottom: 10px;
  &:first-child{
    border-top: 1px dashed #e8e8e8;
  }
  &:last-child{
    margin-bottom: 0;
  }
}

.cell-item-box {
  padding: 5px;
  padding-top: 15px;
}
.pro-info-box {
  display: flex;
  background-color: #fff;
  .pro-img {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    overflow: hidden;
  }
  .pro-info {
    width: calc(~"100% - 90px");
    margin-left: 10px;
    .pro-desc-top {
      height: 50px;
      .pro-title {
        color: #a9643d;
      }
      .name {
        display: flex;
      }
      .pro-rule {
        margin-left: 20px;
        margin-top: 2px;
        color: #ccc;
        font-size: 14px;
      }
      .pro-enname {
        margin-top: 5px;
        font-size: 14px;
        font-family: "STXingkai";
      }
    }
    .pro-desc-bot {
      margin-top: 14px;
      .pro-price {
        color: #a9643d;
        margin-top: 5px;
        font-family: "STXinwei";
      }
      .pro-num {
        font-size: 12px;
        margin-top: 2px;
        color: #ccc;
        margin-right: 20px;
      }
    }
  }
}
</style>
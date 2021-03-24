<template>
  <div class="publice-bg">
      <div class="bg">
      </div>
      <div class="bg-content">
        <slot></slot>
      </div>
    </div>
</template>

<script>

  export default {
    name: 'PubliceBg'
  }
</script>

<style lang="less" scoped>
  .publice-bg{

    .bg{
      height: 135px;
      background: url(../assets/images/publicbg1.jpg) no-repeat center center;
      background-size: 100% 100%;
      position: relative;
    }

    .bg-content{
      margin: 0 10px;
      position: relative;
      top: -25px;
      background-color: #fff;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      padding: 10px;
    }
  }
</style>
<template>
    <div class="addaddress">

        <van-nav-bar
            :title=" !aid ? '添加收货地址' : '编辑地址'"
            left-text="返回"
            left-arrow
            @click-left="goBack"
        />

        <van-address-edit
            show-postal
            :show-delete="!!aid"
            show-set-default
            show-search-result
            :area-list="areaList"
            :columns-placeholder="['请选择', '请选择', '请选择']"
            :address-info="addressInfo"
            @save = 'save'
            @delete="removeAddress"
        />
       
    </div>
</template>

<script>
    import areaList from '../assets/js/area'
    export default {
        name:'Addaddress',
        data() {
            return {
                areaList,

                // 地址的初始值
                addressInfo:{},

                //地址的 aid
                aid: ''
            }
        },

        created() {
            //截取查询参数
            //aid: 如果存在，则表示编辑地址, 否则新增地址
            this.aid = this.$route.query.aid;
            // 
            if (this.aid) {
                //根据地址aid查询地址数据
                this.getAddressDataByAid();
            }
        },
        methods: {

            // 返回上级
            goBack(){
                this.$router.go(-1)
            },

            // 保存地址
            save(content){

                let tokenString = localStorage.getItem("__tk");
                if (!tokenString) {
                    //跳回登录页面
                    this.$toast("请先登录");
                    return this.$router.push({ name: "Login" });
                }

                
                //复制content
                let addressInfo = Object.assign({}, content);

                //删除country 这一项
                delete addressInfo.country;

                // 重新给token赋值
                addressInfo.tokenString = tokenString;
                // 重新给appkey赋值
                addressInfo.appkey = this.appkey;

                // 把布尔值 转成 1 或 0
                addressInfo.isDefault = Number(addressInfo.isDefault);

                // 

                this.$toast.loading({
                    message: "加载中...",
                    forbidClick: true,
                    duration: 0,
                });
                // 
                if (!this.aid) {
                    //新增地址
                    this.addAddress(addressInfo, '/addAddress');
                }
                else{
                    //编辑地址
                    //如果是编辑地址，则需要验证用户是否修改过地址数据
                    let isModify = false;
                    for (let key in this.addressInfo) {
                        if (this.addressInfo[key] != content[key]) {
                            isModify = true;
                        }
                    }

                    if (isModify) {
                        // 发起请求
                        // 编辑地址
                        this.addAddress(addressInfo, '/editAddress');
                    }else{
                        return this.$toast('未修改地址!')
                    }
                }
            },

            //新增地址
            addAddress(addressInfo,url) {
                this.axios({
                    method: "POST",
                    url,
                    data: addressInfo,
                })
                .then((result) => {

                    this.$toast.clear();
                    // 

                    if (result.data.code == 700) {
                        //token检验无效,则跳到登录页面
                        this.$router.push({ name: "Login" });

                    } else if (result.data.code == 9000 || result.data.code == 30000) {
                        // 跳转到地址列表里栏
                        setTimeout(() => {
                            this.$router.push({name: 'AddressList'});
                        }, 800)
                    }

                    this.$toast(result.data.msg);
                })
                .catch((err) => {
                    this.$toast.clear();
                    
                });
            },

            // 根据地址aid查询地址数据
            getAddressDataByAid(){
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
                    url:"/findAddressByAid",
                    params: {
                        appkey: this.appkey,
                        tokenString,
                        aid: this.aid
                    }
                })
                .then((result) => {

                    this.$toast.clear();
                    // 

                    if (result.data.code == 700) {
                        //token检验无效,则跳到登录页面
                        this.$router.push({ name: "Login" });

                    } else if (result.data.code == 40000) {
                        let data = result.data.result[0];
                        // 转成布尔类型
                        data.isDefault = Boolean(data.isDefault);
                        // 给初始值赋值
                        this.addressInfo = data;
                    }

                    this.$toast(result.data.msg);
                })
                .catch((err) => {
                    this.$toast.clear();
                    
                });
            },

            // 删除地址
            removeAddress(){

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
                    url:"/deleteAddress",
                    data: {
                        appkey: this.appkey,
                        tokenString,
                        aid: this.aid
                    }
                })
                .then((result) => {

                    this.$toast.clear();
                    // 

                    if (result.data.code == 700) {
                        //token检验无效,则跳到登录页面
                        this.$router.push({ name: "Login" });

                    } else if (result.data.code == 10000) {
                        // 跳转到地址列表里栏
                        setTimeout(() => {
                            this.$router.push({name: 'AddressList'});
                        }, 800)
                    }

                    this.$toast(result.data.msg);
                })
                .catch((err) => {
                    this.$toast.clear();
                    
                });
            }
        },
    }
</script>

<style lang="less" scoped>
    /deep/ .van-nav-bar .van-icon{
      color: #a9643d;
    }
    /deep/ .van-nav-bar__text{
      color: #a9643d;
    }
     /deep/ .van-switch--on{
        background-color: #a9643d;
    }
    /deep/ .van-button--danger{
        background:linear-gradient(to right,#cb9966,#a9643d) !important;
        border-color: #a9643d;
    }
</style>
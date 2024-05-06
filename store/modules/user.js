export default{
    state:{
        // 登录状态
        loginStatus:false,
        // token
        token:null,
        // 用户信息 昵称头像等
        userInfo:{}
    },
    getters:{

    },
    mutations:{
        // 一旦进入app,就需要执行这个方法把用户信息读出来,放到App.vue的onLaunch中触发
        initUser(state){
            let userInfo = uni.getStorageSync('userInfo');
            if( userInfo ){
                userInfo = JSON.parse(userInfo);
                state.userInfo = userInfo;
                state.loginStatus = true;
                state.token = userInfo.token;
            }
        },
        
        // 登录后保存用户信息
        login(state,userInfo){
            state.userInfo = userInfo;
            state.loginStatus = true;
            state.token = userInfo.token;
            
            // 持久化存储 -- 把对象转换成字符串
            uni.setStorageSync('userInfo',JSON.stringify(userInfo));
        },
        
        // 退出登录
        loginOut(state){
            state.userInfo = {};
            state.loginStatus = false;
            state.token = null;
            // 删除本地持久化存储
            uni.removeStorageSync('userInfo');
        }
    },
    actions:{
        
    }
}

const user = {
    state:{
        // 存放的键值对就是所要管理的状态
        videoStatus : false, // 视频热点的播放状态，播放视频热点时候关闭背景音乐
    },
    mutations:{
        setVideoStatus(state, payload) {
            state.videoStatus = payload;
        }
    }
}

export default user
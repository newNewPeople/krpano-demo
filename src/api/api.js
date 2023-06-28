// 获取场景接口
import {
    axios
} from '@/libs/request'
// 配置
import config from "@/config";
import qs from 'qs'

export const GetTour = (params) => {
    return axios({
        url: '/render/Tour/GetTourById',
        method: 'get',
        params: params
    })
}

export const GetPano = (params) => {
    return axios({
        url: '/render/Tour/GetTourByTaskId',
        method: 'get',
        params: params
    })
}

export const GetScene = (params) => {
    return axios({
        url: '/render/Tour/GetTourBySceneId',
        method: 'get',
        params: params
    })
}
export const setWxShare = (data) => {
    const datater = qs.stringify(data)
    return axios({
        url: '/basic/WebShare/AccessGetJs',
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        data: datater
    })
}

// 将tokenId转化成mtdsId
export const getMtdsId = (cid) => {
    return axios({
        url: '/render/Tour/getMtdsId?cid=' + cid,
        method: 'get',
    })
};


// 获取欧派小程序
export function getQrcode({
    mtdsUserId,
    pageUrl
}) {
    let headers = {
        "AppCode": "GRZX",
        "appid": "wx3713b1d8b100b0be",
        "platform": "mp-weixin",
        "SubAppCode": "GRZXMP001"
    }
    let data = {
        "page": "pages/common/h5",
        "encrypt": true,
        "appid": "wx3713b1d8b100b0be",
        "originalScene": `mpType=userCenter&mtdsUserId=${mtdsUserId}&pageType=720&pageUrl=${pageUrl}`,
        "width": 500,
        "autoColor": false,
        "isHyaline": false,
        "lineColorR": 1,
        "lineColorG": 1,
        "lineColorB": 1,
        "envVersion": config.qrCode.envVersion // TRIAL 测试环境 RELEASE 正式环境
    }
    return new Promise((resolve, reject) => {
        axios.post('/appcenter/anonymous/wx/ma/qrCode/create', data, {
            headers: headers
        }).then(res => {
            resolve(res.data);
        }).catch(error => {
            reject(error);
        });
    });
}

// 获取品牌logo
export const getBrandLogoCodeList = (param) => {
    return axios({
        url: '/render/Tour/getBrandLogoCodeList',
        method: 'get',
        params: param
    })
}
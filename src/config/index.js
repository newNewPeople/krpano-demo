/*
 * @Author: your name
 * @Date: 2020-11-12 09:47:58
 * @LastEditTime: 2021-06-29 09:16:41
 * @LastEditors: Do not edit
 * @Description: In User Settings Edit
 * @FilePath: \FullPhotoViewer\src\config\index.js
 */
export default {
    qrCode: {
        // 欧派小程序码前缀
        // preQrCode: "https://opyx-mtds-test.oss-cn-shenzhen.aliyuncs.com/", // UAT环境
        // preQrCode: "https://opyx-mtds-test.oss-cn-shenzhen.aliyuncs.com/", // ver环境
        preQrCode: "https://opyx-mtds-pro.oss-cn-shenzhen.aliyuncs.com/", // 正式环境
        // 传参
        envVersion: 'RELEASE', // 正式环境
        // envVersion: 'TRIAL'
    }
};
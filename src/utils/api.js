
/*
       axios interceptor
       每一个事件都需要联系后端， 请求 响应
       每一次都需要使用axios进行判断 成功或失败 都有不同的处理方法
       可以封装起来
       first step , import axios, import what you need from dependency in package.json, not exist, then npm install first
 */

import axios from 'axios'
// this is not .vue file, import first
import { ElMessage } from "element-plus";
import router from "@/router";



//axios interceptor for response
//this success means you successfully connected to server
axios.interceptors.response.use(success =>{
    // connected! == 200
    if(success.status && success.status === 200){
        //check what we got from server
        // 500 : service logic error (wrong password...)
        // 401 : you should log in first
        if(success.data.code === 500 || success.data.code === 401){
            ElMessage.error({message:success.data.message});
            return;
        }
        // server return something correctly
        if(success.data.message){
            ElMessage.success({message:success.data.message});
        }
    }
    return success.data;

    },
    // this error means connection with server is failed
    error => {
        // something wrong with server
        if(error.response.code === 504 || error.response.code === 404 ){
            ElMessage.error({message : 'server is on vacation!'})
        }
        else if(error.response.code === 401){
            ElMessage.error({message : 'Please log in!'});
            router.replace('/');
        }
        else{
            if(error.response.data.message){
                ElMessage.error({message:error.response.data.message});
            }
            else{
                //unknown error
                ElMessage.error({message:'unknown error!'});
            }
        }
    });

// //axios interceptor for request
//
// // var a = 1;
// // console.log('一共有'+a+'个鸡蛋！')
// // 也可以用这种方式console.log(`一共有${a}个鸡蛋！`) 模版字符串 注意符号
//
// //base: in case the url needs to be changed in the future
// //home
// let base = 'http://10.6.97.12:8888/myChat_server';
// //uni
 let base = 'http://172.18.6.86:8888/myChat_server';
//
// // this is actually a method that can be used globally
//
// //java receive a object --axios data --@requestbody
export const postRequest = (url,params) => {
    return axios({
        method:'post',
        url:`${base}${url}`,
        data: params,
        headers: {
            'Content-Type': 'application/json'
        },
    })
}

//java receive a series of params -- axios params @requestParam, @requestParam...
export const postRequestParams = (url,params) => {
    return axios({
        method:'post',
        url:`${base}${url}`,
        params: params,

    })
}


import { createStore } from 'vuex'
import {postRequest, postRequestParams} from "@/utils/api";



export default createStore({
  state: {
    contactList:[],
    session:[],// for rendering chat message in chatroom (let obj = {msg, time,avatar, nickname, self})


    MsgFriendId:'',
    MsgFriendUsername:'',
    MsgFriendNickname:'',
    MsgFriendAvatar:'',

    friendRequestList:[],
    socket:null,
    connected:false,
    dataContent:'', // chat message
  },

  mutations: {

    renderMsg(state,data){
      state.session.push(data);
    },

    setDataContent(state,data){
      state.dataContent = data;
     // alert(state.dataContent);
    },



    setMsgFriendId(state,data){
      state.MsgFriendId = data;
      window.localStorage.setItem("MsgFriendId",data);
    },
    setMsgFriendUsername(state,data){
      state.MsgFriendUsername = data;
      window.localStorage.setItem("MsgFriendUsername",data);
    },
    setMsgFriendNickname(state,data){
      state.MsgFriendNickname = data;
      window.localStorage.setItem("MsgFriendNickname",data);
    },
    setMsgFriendAvatar(state,data){
      state.MsgFriendAvatar = data;
      window.localStorage.setItem("MsgFriendAvatar",data);
    },


    getContactList(state,data){
      state.contactList = data;
    },

    getFriendRequestList(state,data){
      state.friendRequestList = data;
    },
    setSocket(state,data){
      state.socket = data;
    },
    setConnected(state,data){
      state.connected = data;
    },


  },
  actions: {

    connect(context){
      if(context.state.connected === false){
       // alert("start");
        //let webSocket = new WebSocket('ws://10.6.97.12:8889/ws');
         let webSocket = new WebSocket('ws://172.18.28.15:8889/ws');


         webSocket.onopen=()=>{
          context.commit('setSocket',webSocket);
          //registration in netty with action 1- connect
          if(context.state.connected === false){
            let  DataContent = {
              action:1,
              // 名字得一样
              chatMSG:{
                senderId:window.localStorage.getItem("userid"),
                receiverId:null,
                msg:null
              }
            }
            webSocket.send(JSON.stringify(DataContent));
          }

          context.commit("setConnected",true);
         // alert("connected");
        }



        webSocket.onmessage=(e)=>{
          //alert("got message!!!!!!!!1")
          let d = JSON.parse(e.data).chatMSG;

          //render msg when receive msg

          let today = new Date();
          let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
          let time = date+'-' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
          let obj = {
            msg:d.msg,
            time:time,
            avatar:context.state.MsgFriendAvatar,
            nickname:context.state.MsgFriendNickname,
            self:false
          }
          context.commit("renderMsg",obj);
        }



       webSocket.onclose=(e)=>{
           alert(e);
       }


        webSocket.onerror=()=>{
          alert("connection failed!");
        }



      }else{
        alert("already connected");
      }
    },

    sendMsg(context){
      if(context.state.connected === true){
        context.state.socket.send(context.state.dataContent);
        //alert("msg sended");
      }
      else{
        alert(" you are offline")
      }
    },

















    requestFriendList(context){

      postRequest('/user/myFriends',window.localStorage.getItem("userid")).then(resp=>{
        if(resp){

          context.commit('getContactList',resp.data);
        }
      })

    },

    requestFriendRequestList(context){

      postRequest('/user/queryFriendRequest',window.localStorage.getItem("userid")).then((resp)=>{
        if(resp){
          context.commit('getFriendRequestList',resp.data);
        }
      })
    }
  },






  getters: {
    getTempFriendId(state){
      return state.MsgFriendId;
    }
  },
  modules: {
  }
})

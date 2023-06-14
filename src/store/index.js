import { createStore } from 'vuex'
import {postRequest, postRequestParams} from "@/utils/api";



export default createStore({
  state: {
    contactList:[],

    history:[],// for rendering chat message in chatroom (let obj = {msg, time,avatar, nickname, self})
    SnapShot:[],


    MsgFriendId:null,
    MsgFriendUsername:'',
    MsgFriendNickname:'',
    MsgFriendAvatar:'',

    friendRequestList:[],
    socket:null,
    connected:false,
    dataContent:'', // chat message
  },

  mutations: {
    setSnapshot(state,data){
      state.SnapShot = data;
    },
    setHistory(state,data){
      state.history = data;
    },

    setDataContent(state,data){
      state.dataContent = data;
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
      window.localStorage.setItem("contact",JSON.stringify(data));
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
         let webSocket = new WebSocket('ws://172.18.41.5:8889/ws');

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
          //notify of your friend request was passed!
          let action = JSON.parse(e.data).action;
          if(action === 5){// 5 ---- friend request was passed!
            context.dispatch("requestFriendList"); // for request sender
            context.dispatch("requestFriendRequestList"); // notify request receiver to load request
          }
          else{
            //when we receive message online, we need to sign these received message, when we offline and back online again, we will handle this somewhere else differently
            let d = JSON.parse(e.data).chatMSG;
            let DataContent = {
              action:3,   // signed
              chatMSG:null,
              extend:d.msgId
            }
            context.state.socket.send(JSON.stringify(DataContent));



            //render msg when receive msg and add to history
            let today = new Date();
            let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            let time = date+'-' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            let contact = JSON.parse(window.localStorage.getItem("contact"));
            let avatar = null;
            let nickname = null;
            let username = null;

            for(let i = 0; i< contact.length;i++){
              if(contact[i].friendUserId === d.senderId){
                username = contact[i].friendUsername;
                nickname = contact[i].friendNickname;
                avatar = contact[i].friendFaceImage;
              }
            }
            let obj = {
              id:d.senderId,
              msg:d.msg,
              time:time,
              avatar:avatar,
              nickname:nickname,
              username:username,
              self:false // i am sender-true; i am receiver-false
            }

            // save this message to the chat history with this friend, also can be used as online real time chatting, add received message into history
            let chatKey = window.localStorage.getItem("userid") + "with"+ d.senderId;
            let chatKey2 =  d.senderId + "with" + window.localStorage.getItem("userid");

            let h = JSON.parse(window.localStorage.getItem(chatKey));
            if(h === null){
              h = [];
            }
              h.push(obj);
            window.localStorage.setItem(chatKey, JSON.stringify(h));
            window.localStorage.setItem(chatKey2, JSON.stringify(h));

            //only if i am with you chatting right now, the history will be rendered
            if(context.state.MsgFriendId === d.senderId){
              context.commit("setHistory",h);
            }


            // add this message to snapshot array with this friend and save to local storage
            let snapKey = window.localStorage.getItem("userid") + "snapshot";
            let s = JSON.parse(window.localStorage.getItem(snapKey));
            if(s === null){
              s = [];
            }
            for(let i = 0; i < s.length; i++){
                if(s[i].id === d.senderId){
                  s.splice(i,1);
                }
            }
            s.unshift(obj);
            context.commit("setSnapshot",s);
            window.localStorage.setItem(snapKey, JSON.stringify(s));
          }
        }



       webSocket.onclose=(e)=>{
           alert(e.reason + "offline, plz refresh!");
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












    getUnreadMsg(context){
      postRequest('/user/getUnreadMsg',window.localStorage.getItem("userid")).then(resp=>{
        if(resp){
          console.log(resp.data); // return a list of message from different friends


          let msgArr = resp.data;
          let contact = JSON.parse(window.localStorage.getItem("contact"));
          let lst = "";

          for(let i = 0; i< msgArr.length; i++){
            console.log(msgArr[i].sendUserId);

            // batch sign each message(0->1 in database)
            lst += msgArr[i].id;
            lst += ",";

            let sendUserId = msgArr[i].sendUserId;
            let msg = msgArr[i].msg;
            let time = msgArr[i].createTime;

// save to chat history
            let avatar = null;
            let nickname = null;
            let username = null;

            for(let i = 0; i< contact.length;i++){
              if(contact[i].friendUserId === sendUserId){
                username = contact[i].friendUsername;
                nickname = contact[i].friendNickname;
                avatar = contact[i].friendFaceImage;
              }
            }

            let obj = {
              id:sendUserId,
              msg:msg,
              time:time,
              avatar:avatar,
              nickname:nickname,
              username:username,
              self:false // i am sender-true; i am receiver-false
            }

            // save this message to the chat history with this friend, also can be used as online real time chatting, add received message into history
            let chatKey = window.localStorage.getItem("userid") + "with"+ sendUserId;
            let chatKey2 =  sendUserId + "with" + window.localStorage.getItem("userid");

            let h = JSON.parse(window.localStorage.getItem(chatKey));
            if(h === null){
              h = [];
            }
            h.push(obj);
            window.localStorage.setItem(chatKey, JSON.stringify(h));
            window.localStorage.setItem(chatKey2, JSON.stringify(h));

            //only if i am with you chatting right now, the history will be rendered
            if(context.state.MsgFriendId === sendUserId){
              context.commit("setHistory",h);
            }


            // add this message to snapshot array with this friend and save to local storage
            let snapKey = window.localStorage.getItem("userid") + "snapshot";
            let s = JSON.parse(window.localStorage.getItem(snapKey));
            if(s === null){
              s = [];
            }
            for(let i = 0; i < s.length; i++){
              if(s[i].id === sendUserId){
                s.splice(i,1);
              }
            }
            s.unshift(obj);
            context.commit("setSnapshot",s);
            window.localStorage.setItem(snapKey, JSON.stringify(s));
          }

          // sign all the unread message
          let DataContent = {
            action:3,   // signed
            chatMSG:null,
            extend:lst
          }
          context.state.socket.send(JSON.stringify(DataContent));




        }
      })
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

import { createStore } from 'vuex'
import {postRequest, postRequestParams} from "@/utils/api";



export default createStore({
  state: {
    contactList:[],

    history:[],// for rendering chat message in chatroom (let obj = {msg, time,avatar, nickname, self})
    SnapShot:[],
    chatGroups:[],//each chat group is a element
    chatGroupHistory:[],
    groupChatIds:[],
    MsgFriendId:null,
    MsgFriendUsername:'',
    MsgFriendNickname:'',
    MsgFriendAvatar:'',
    isGroupChat:false,
    groupId:null,
    groupChatHistory:null,

    friendRequestList:[],
    socket:null,
    connected:false,
    dataContent:'', // chat message
  },

  mutations: {
    setGroupChatHistory(state,data){
      state.groupChatHistory = data;
    },
    setIsGroupChat(state,data){
      state.isGroupChat = data;
      window.localStorage.setItem("isGroupChat",JSON.stringify(state.isGroupChat));
    },
    setGroup(state,data){
      //group name
      let name = data.groupName;
      //names of group member
      let lst = data.groupLst;
      // ids of group member
      let groupChatIds = [];

      for( let k = 0; k< lst.length;k++){
        for(let i = 0; i< state.contactList.length; i++){
          if(state.contactList[i].friendUsername === lst[k]){
            groupChatIds.push(state.contactList[i].friendUserId);
          }
        }
      }

      lst.push(window.localStorage.getItem("username"));
      groupChatIds.push(window.localStorage.getItem("userid"));



      let GroupChatInfo = {
        id:"",

        groupname:name,

        groupmembers:JSON.stringify(groupChatIds)
      }



      postRequest('/user/createGroup', GroupChatInfo).then(resp=>{

        if(resp){
          let groupInfo = {
            groupName:name,
            groupMemberNames:lst,
            groupMemberIds: groupChatIds,
            groupChatHistory:[],
            groupChatSnapShot:[],
            groupId:resp.data
          }



          let chatGroups = JSON.parse(window.localStorage.getItem("chatGroups"+window.localStorage.getItem("userid")));
          if(chatGroups === null){
            chatGroups = [];
          }

          let chatGroupsSnapShot = {
            groupName:name,
            groupChatSS:""
          }

          chatGroups.push(chatGroupsSnapShot);

          state.chatGroups = chatGroups;
          state.groupChatIds = groupChatIds;
          // array of all the chat groups of this users
          window.localStorage.setItem("chatGroups"+window.localStorage.getItem("userid"), JSON.stringify(chatGroups));
          //each new chat group name as key,
          window.localStorage.setItem(name +window.localStorage.getItem("userid") ,JSON.stringify(groupInfo));
        }else{
          alert("error with create group");
        }
      })
    },
    setChatGroups(state,data){
      state.chatGroups = data;
    },

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
    //handle received group chat
    receiveGroupChat(state,data){
      let groupName = data.groupChat.groupName;
      console.log(groupName);
      let groupMembers = data.groupChat.groupMembers;
      console.log(groupMembers);

      // {"action":6,"chatMSG":{"msg":"2","msgId":"16384501227851859","receiverId":"5245012237488185","senderId":"1806935192113204"},
      //   "groupChat":{"groupId":"16371202473988107","groupMembers":["13078909881028689","5245012237488185","1806935192113204"],"groupName":"chat45","nameChanged":0}}


      let chatGroupsKey = "chatGroups"+window.localStorage.getItem("userid");
      let chatGroups = JSON.parse(window.localStorage.getItem(chatGroupsKey));
      if(chatGroups === null){
        chatGroups = [];
      }
      //group chat snapshot
      for(let i = 0; i< chatGroups.length; i++){
        if(chatGroups[i] !== null){
          if(chatGroups[i].groupName === groupName){
            chatGroups.splice(i,1);
          }
        }
      }
      let chatGroupsSnapShot = {
        groupName:groupName,
        groupChatSS:data.chatMSG.msg
      }
      chatGroups.unshift(chatGroupsSnapShot);
      window.localStorage.setItem(chatGroupsKey,JSON.stringify(chatGroups));
      state.chatGroups = chatGroups;

      //group info detail
      let groupKey = groupName+window.localStorage.getItem("userid");
      let groupInfo = JSON.parse(window.localStorage.getItem(groupKey));
      let groupChatNames = [];
      for( let k = 0; k < groupMembers.length;k++){
        for(let i = 0; i < state.contactList.length; i++){
          if(state.contactList[i].friendUserId === groupMembers[k]){
            groupChatNames.push(state.contactList[i].friendUsername);
          }
        }
      }

      if(groupInfo === null){
        groupInfo = {
          groupName:groupName,
          groupMemberNames:groupChatNames,
          groupMemberIds:groupMembers ,
          groupChatHistory:[],
          groupChatSnapShot:[],
          groupId:data.groupChat.groupId
        }
      }

      // who send what msg in a group at what time
      let today = new Date();
      let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      let time = date+'-' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();



      let groupChatHistoryDetail = {
        senderId:data.chatMSG.senderId,
        senderAvatar:null,
        msg:data.chatMSG.msg,
        time:time,
        self:false
      }


      groupInfo.groupChatHistory.push(groupChatHistoryDetail);
      groupInfo.groupName = groupName;
      groupInfo.groupMemberNames = groupChatNames;
      groupInfo.groupMemberIds = groupMembers;
      groupInfo.groupId = data.groupChat.groupId;

      window.localStorage.setItem(groupName +window.localStorage.getItem("userid") ,JSON.stringify(groupInfo));

    }

  },
  actions: {

    connect(context){
      if(context.state.connected === false){
       // let webSocket = new WebSocket('ws://10.6.97.12:8889/ws');
         let webSocket = new WebSocket('ws://172.18.6.86:8889/ws');
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
          context.dispatch("getUnreadMsg");
        }
         webSocket.onmessage=(e)=>{
          //alert("got message!!!!!!!!1")
          //notify of your friend request was passed!
          let action = JSON.parse(e.data).action;
          console.log(e.data);

          if(action === 5){// 5 ---- friend request was passed!
            context.dispatch("requestFriendList"); // for request sender
            context.dispatch("requestFriendRequestList"); // notify request receiver to load request
          }
          else if(action === 6){ // 6 -> group chat
            //when we receive message online, we need to sign these received message, when we offline and back online again, we will handle this somewhere else differently
            let d = JSON.parse(e.data).chatMSG;

            let DataContent = {
              action:3,   // signed
              chatMSG:null,
              extend:d.msgId
            }
            context.state.socket.send(JSON.stringify(DataContent));

            let data = JSON.parse(e.data);
            context.commit("receiveGroupChat",data);

            let groupName = data.groupChat.groupName
            let groupKey = groupName+window.localStorage.getItem("userid");
            let groupInfo = JSON.parse(window.localStorage.getItem(groupKey));
            //only if i am with you chatting right now, the history will be rendered
            if(context.state.MsgFriendId === groupName){
              context.commit("setGroupChatHistory",groupInfo.groupChatHistory);
            }
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
            console.log(msgArr[i].chatMsg.sendUserId);
            // batch sign each message(0->1 in database)
            lst += msgArr[i].chatMsg.id;
            lst += ",";

            //get unread one to one message
            if(msgArr[i].chatMsg.signFlag === 0){
              let sendUserId = msgArr[i].chatMsg.sendUserId;
              let msg = msgArr[i].chatMsg.msg;
              let time = msgArr[i].chatMsg.createTime;

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
            //get unread group chat message
            if(msgArr[i].chatMsg.signFlag === -1){
              alert("get unread group chat message")
              let msg = msgArr[i].chatMsg.msg;
              let groupId = msgArr[i].chatMsg.groupId;
              let sendUserId = msgArr[i].chatMsg.sendUserId;
              //group chat snapshot
              let groupName = msgArr[i].groupChat.groupName;
              let chatGroupsKey = "chatGroups"+window.localStorage.getItem("userid");
              let chatGroups = JSON.parse(window.localStorage.getItem(chatGroupsKey));
              if(chatGroups === null){
                chatGroups = [];
              }
              for(let i = 0; i< chatGroups.length; i++){
                if(chatGroups[i] !== null){
                  if(chatGroups[i].groupName === groupName){
                    chatGroups.splice(i,1);
                  }
                }
              }
              let chatGroupsSnapShot = {
                groupName:groupName,
                groupChatSS:msg
              }
              chatGroups.unshift(chatGroupsSnapShot);
              window.localStorage.setItem(chatGroupsKey,JSON.stringify(chatGroups));
              context.state.chatGroups = chatGroups;


              //group chat detail
              let groupMembers = msgArr[i].groupChat.groupMembers;
              let groupKey = groupName+window.localStorage.getItem("userid");
              let groupInfo = JSON.parse(window.localStorage.getItem(groupKey));
              let groupChatNames = [];
              for( let k = 0; k < groupMembers.length;k++){
                for(let i = 0; i < context.state.contactList.length; i++){
                  if(context.state.contactList[i].friendUserId === groupMembers[k]){
                    groupChatNames.push(context.state.contactList[i].friendUsername);
                  }
                }
              }

              if(groupInfo === null){
                groupInfo = {
                  groupName:groupName,
                  groupMemberNames:groupChatNames,
                  groupMemberIds:groupMembers,
                  groupChatHistory:[],
                  groupChatSnapShot:[],
                  groupId:groupId
                }
              }

              // who send what msg in a group at what time
              let today = new Date();
              let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
              let time = date+'-' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();



              let groupChatHistoryDetail = {
                senderId:sendUserId,
                senderAvatar:null,
                msg:msg,
                time:time,
                self:false
              }

              groupInfo.groupChatHistory.push(groupChatHistoryDetail);
              groupInfo.groupName = groupName;
              groupInfo.groupMemberNames = groupChatNames;
              groupInfo.groupMemberIds = groupMembers;
              groupInfo.groupId = groupId;


              window.localStorage.setItem(groupName +window.localStorage.getItem("userid") ,JSON.stringify(groupInfo));

              //only if i am with you chatting right now, the history will be rendered
              if(context.state.MsgFriendId === groupName){
                context.commit("setGroupChatHistory",groupInfo.groupChatHistory);
              }
            }
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

    logout(context){
      context.state.socket.close();
      window.localStorage.setItem("userid",null);
      window.localStorage.setItem("username",null);
      window.localStorage.setItem("userNickname",null);
      window.localStorage.setItem("userAvatar",null);
      window.localStorage.setItem("userAvatarBig",null);
      context.commit("setMsgFriendId",null);
      context.commit("setMsgFriendUsername",null);
      context.commit("setMsgFriendNickname",null);
      context.commit("setMsgFriendAvatar",null);
      context.commit("setConnected",false);
      context.commit("setSocket",null);
      window.localStorage.setItem("contact",null);
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

  modules: {
  }
})

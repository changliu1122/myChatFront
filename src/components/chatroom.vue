<template>
<!--  v-scroll-bottom="session"-->
  <el-scrollbar max-height="800px">

<!--    load history first-->
<!--    current chat will also be added into history, so we dont need session anymore-->
<!--    friend avatar, nickname... should be added from here, not vuex, cause i may not open a chat room, means i dont have current friend info-->
<!--    only i am currently in chat with you, your message will be render, problem: when i am chatting with other people, the-->
    <div id="message">
      <ul v-if="history !== []" >
        <li v-for="entry in history">
          <p class="time">
            <span>{{entry.time}}</span>
          </p>
          <div class="self"  v-if="entry.self === true">
            <img class="avatar" :src="entry.avatar" alt="">
            <p class="text">{{entry.msg}}</p>
          </div>
          <div class="main" v-if="entry.self === false">
            <img class="avatar" :src="entry.avatar" alt="">
            <p class="text">{{entry.msg}}</p>
          </div>
        </li>
      </ul>






      <ul v-if="groupChatHistory !== []" >
        <li v-for="entry in groupChatHistory">
          <p class="time">
            <span>{{entry.time}}</span>
          </p>
          <div class="self"  v-if="entry.self === true">
            <img class="avatar" :src="entry.senderAvatar" alt="">
            <div>
              <p>{{entry.senderId}}</p>
              <p class="text">{{entry.msg}}</p>
            </div>

          </div>
          <div class="main" v-if="entry.self === false">
            <img class="avatar" :src="entry.senderAvatar" alt="">
            <div>
              <p>{{entry.senderId}}</p>
              <p class="text">{{entry.msg}}</p>
            </div>
          </div>
        </li>
      </ul>









    </div>
  </el-scrollbar>

</template>

<script>
import {mapState} from 'vuex'
import store from "@/store";
import router from "@/router";

export default {
  name: 'message',
  data () {
    return {
      chatHistory:[],
    }
  },

  computed:mapState([
    "history",
    "groupChatHistory",
    "MsgFriendId"

  ]),
  filters:{
    time (date) {
      if (date) {
        date = new Date(date);
      }
      return `${date.getHours()}:${date.getMinutes()}`;
    }
  },


  // 一启动就自动调用这个方法
  // solved once the page was refreshed, the chat page should not change, but the friend id(name) on the header was gone, here we render it every time from local storage
  mounted:function (){

    let isGroupChat = JSON.parse(window.localStorage.getItem("isGroupChat"));
    if(isGroupChat){
      //load group chat
      let groupKey = window.localStorage.getItem("MsgFriendId") + window.localStorage.getItem("userid")
      let groupInfo = JSON.parse(window.localStorage.getItem(groupKey));
      if(groupInfo != null){
        if(groupInfo.groupChatHistory === null){
          groupInfo.groupChatHistory = [];
        }
        store.commit("setGroupChatHistory",groupInfo.groupChatHistory);
      }

    }
    else{
      // load chat history
      let chatKey = window.localStorage.getItem("userid") + "with" + window.localStorage.getItem("MsgFriendId");
      let h = JSON.parse(window.localStorage.getItem(chatKey));
      if(h === null){
        h = [];
      }
      store.commit("setHistory",h);
      store.commit("setMsgFriendId", window.localStorage.getItem("MsgFriendId") )
    }
  },



  // directives: {/*这个是vue的自定义指令,官方文档有详细说明*/
  //   // 发送消息后滚动到底部,这里无法使用原作者的方法，也未找到合理的方法解决，暂用setTimeout的方法模拟
  //   'scroll-bottom' (el) {
  //     //console.log(el.scrollTop);
  //     setTimeout(function () {
  //       el.scrollTop+=9999;
  //     },1)
  //   }
  // }
}
</script>

<style lang="scss" scoped>
#message {
  padding: 15px;
  max-height: 68%;
  overflow-y: scroll;
  ul {
    list-style-type: none;
    li {
      margin-bottom: 15px;
    }
  }
  .time {
    text-align: center;
    margin: 7px 0;
    > span {
      display: inline-block;
      padding: 0 18px;
      font-size: 12px;
      color: #FFF;
      background-color: #dcdcdc;
      border-radius: 2px;
    }
  }
  .main {
    .avatar {
      float: left;
      margin: 0 10px 0 0;
      border-radius: 3px;
      width: 30px;
      height: 30px;

    }
    .text {
      display: inline-block;
      padding: 0 10px;
      max-width: 80%;
      background-color: #fafafa;
      border-radius: 4px;
      line-height: 30px;
    }
  }
  .self {
    text-align: right;
    .avatar {
      float: right;
      margin: 0 0 0 10px;
      border-radius: 3px;
      width: 30px;
      height: 30px;
    }
    .text {
      display: inline-block;
      padding: 0 10px;
      max-width: 80%;
      background-color: #b2e281;
      border-radius: 4px;
      line-height: 30px;
    }
  }
}
</style>
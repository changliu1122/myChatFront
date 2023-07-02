<template>

    <el-container class="container1" >
      <div class="sidebar1" >
        <el-aside  width="80px"  >
          <el-menu @select="menuClick" style="--el-menu-bg-color: gray;height: 78vh"  >
            <el-menu-item >
              <card></card>
            </el-menu-item>

            <el-menu-item index="/chat">
              <el-icon ><ChatRound /></el-icon>
            </el-menu-item>

            <el-menu-item index="/contact">
              <el-icon ><UserFilled /></el-icon>
            </el-menu-item>

            <el-menu-item index="/explore">
              <el-icon ><Promotion /></el-icon>
            </el-menu-item>

            <el-menu-item index="/setting">
              <el-icon ><Setting /></el-icon>
            </el-menu-item>

          </el-menu>
        </el-aside>
      </div>

      <div  style="background-color: dimgrey">
        <!--        with out this container, the scroll bar inside this part will control the whole container-->
        <el-container>
          <el-aside width="280px">
            <router-view/>
          </el-aside>
        </el-container>

      </div>



      <img v-if=" MsgFriendId ==='null' "  v-bind:src="background" alt="" style="width: 75%; height: 78vh">

      <el-container v-else>
        <!--    display who you are chatting with-->
        <el-header style="background-color: cornsilk " >
          <div >{{MsgFriendId}}</div>
        </el-header>
        <!--chat area-->
        <el-main style="background-color: bisque">
          <chatroom></chatroom>
        </el-main>
        <!--text area input-->
        <el-footer class="footer"  height="200px" >

            <el-input
                v-on:keyup="send"
                v-model="textarea"
                :rows="9"
                type="textarea"
                placeholder="Ctrl + Enter = Send~"
                resize="none"

            >
            </el-input>


        </el-footer>
      </el-container>


    </el-container>

</template>

<script>
import {ChatRound, Promotion, Setting, UserFilled} from "@element-plus/icons-vue";
import card from '../components/card'
import list from '../components/list.vue'
import router from "@/router";
import store from "@/store";
import chatroom from "@/components/chatroom.vue";
import {mapState} from "vuex";

export default {
  name: "Home",
  components: {Promotion, Setting, UserFilled, ChatRound,card,list,chatroom},

  data(){
    return{
      background:require('../assets/background.jpeg'),
      startChat: true,
      textarea:'',

      fid:window.localStorage.getItem("MsgFriendId"),
      fusername: window.localStorage.getItem("MsgFriendUsername"),
      favatar: window.localStorage.getItem("MsgFriendAvatar"),
      fnickname:window.localStorage.getItem("MsgFriendNickname"),


      DataContent:{
        action:2,
        // 名字得一样
        chatMSG:{
          senderId:window.localStorage.getItem("userid"),
          receiverId:'',
          msg:''
        },
        groupChat:{
          groupId:null,
          groupName: null,
          groupMembers: null,
          newName: null,
          nameChanged:null
        }
      },


      //rendering
      sendMsg:[],
      receiveMsg:[],
    }
  },

  methods:{
    send(e){
      if (e.ctrlKey && e.keyCode ===13 && this.textarea.length) {
        this.DataContent.chatMSG.msg = this.textarea;
        let id = '';
        if(store.state.MsgFriendId !== ''){
          id = store.state.MsgFriendId;
        }else{
          id = window.localStorage.getItem("MsgFriendId");
        }
        this.DataContent.chatMSG.receiverId = id;

        // one to one chat
        if(store.state.isGroupChat === false){
          if(id !== "null" && id !== '' && id !== null){
            this.DataContent.action = 2;
            //  alert(this.DataContent.chatMSG.receiverId);
            store.commit("setDataContent",JSON.stringify(this.DataContent));
            // alert("get data");
            store.dispatch("sendMsg");
            //render send msg when sending msg
            let today = new Date();
            let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            let time = date+'-' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            let obj = {
              id:id,
              msg:this.DataContent.chatMSG.msg,
              time: time,
              avatar: window.localStorage.getItem("userAvatar"),
              nickname:window.localStorage.getItem("userNickname"),
              username:window.localStorage.getItem("MsgFriendUsername"),
              self:true
            }


            // save this message to the chat history with this friend
            let chatKey = window.localStorage.getItem("userid") + "with" + id;
            let chatKey2 =  id + "with" + window.localStorage.getItem("userid");
            let h = JSON.parse(window.localStorage.getItem(chatKey));
            if(h === null){
              h = [];
            }
            h.push(obj);

            store.commit("setHistory",h);
            window.localStorage.setItem(chatKey, JSON.stringify(h));
            window.localStorage.setItem(chatKey2, JSON.stringify(h));


            // add this message to snapshot array with this friend and save to local storage

            let obj2 = {
              id:id,
              msg:this.DataContent.chatMSG.msg,
              time: time,
              avatar: window.localStorage.getItem("MsgFriendAvatar"),
              nickname:window.localStorage.getItem("MsgFriendNickname"),
              username:window.localStorage.getItem("MsgFriendUsername"),
              self:true
            }

            let snapKey = window.localStorage.getItem("userid") + "snapshot";
            let s = JSON.parse(window.localStorage.getItem(snapKey));
            if(s === null){
              s = [];
            }
            for(let i = 0; i < s.length; i++){
              if(s[i].id === id){
                s.splice(i,1);
              }
            }

            s.unshift(obj2);
            store.commit("setSnapshot",s);
            window.localStorage.setItem(snapKey, JSON.stringify(s));


          }
          else{
            alert("Friend id is null");
          }
        }
        //group chat
        else{
          if( id !== "null" && id !=='' && id !== null){
            //render group chat snapshot
            let chatGroups = JSON.parse(window.localStorage.getItem("chatGroups"+window.localStorage.getItem("userid")));

            let chatGroupsSnapShot = {
              groupName:store.state.MsgFriendId,
              groupChatSS:this.DataContent.chatMSG.msg
            }
            for(let i = 0; i< chatGroups.length;i++){
              if(chatGroups[i].groupName === store.state.MsgFriendId){
                chatGroups.splice(i,1);
              }
            }
            chatGroups.unshift(chatGroupsSnapShot);
            window.localStorage.setItem("chatGroups"+window.localStorage.getItem("userid"),JSON.stringify(chatGroups));
            store.state.chatGroups = chatGroups;




            //current MsgFriendId is group name, get group info from local storage
            let groupKey = store.state.MsgFriendId + window.localStorage.getItem("userid")
            let groupInfo = JSON.parse(window.localStorage.getItem(groupKey));
            //render group chat history
            // who send what msg in a group at what time
            let today = new Date();
            let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            let time = date+'-' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            let groupChatHistoryDetail = {
              senderId:window.localStorage.getItem("userid"),
              senderAvatar:window.localStorage.getItem("userAvatar"),
              msg:this.DataContent.chatMSG.msg,
              time:time,
              self:true
            }

            groupInfo.groupChatHistory.push(groupChatHistoryDetail);
            window.localStorage.setItem(groupKey,JSON.stringify(groupInfo));
            store.commit("setGroupChatHistory",groupInfo.groupChatHistory);


            //send group msg
            this.DataContent.groupChat.groupId = groupInfo.groupId;
            this.DataContent.groupChat.groupName = groupInfo.groupName;
            this.DataContent.groupChat.groupMembers = groupInfo.groupMemberIds;
            this.DataContent.action = 6;


            store.commit("setDataContent",JSON.stringify(this.DataContent));
            store.dispatch("sendMsg");
          }
          else{
            alert("Group id is null");
          }
        }
        //clear text area after sending
        this.textarea = '';
      }
    },


    menuClick(index){

      router.push(index);
    }
  },
  computed:mapState([
    // 写state里面的属性
    "MsgFriendId"

  ]),
  // 一启动就自动调用这个方法 从后端获取好友列表
  mounted:function (){

    store.commit("setMsgFriendId", window.localStorage.getItem("MsgFriendId"));

    store.dispatch('connect');
    store.dispatch('requestFriendList');
    store.dispatch('requestFriendRequestList');


    let snapKey = window.localStorage.getItem("userid") + "snapshot";
    let s = JSON.parse(window.localStorage.getItem(snapKey));
    if(s === null){
      s = [];
    }
    store.commit("setSnapshot",s);

    let chatGroupKey = "chatGroups"+window.localStorage.getItem("userid");
    let c = JSON.parse(window.localStorage.getItem(chatGroupKey));
    if(c === null){
      c = [];
    }

    store.commit("setChatGroups",c);



    router.push('/chat');

  }

}
</script>

<style lang="scss"  scoped>
.container1{
  margin-top: 80px;
  margin-left: 80px;
  margin-right: 80px;
}






</style>
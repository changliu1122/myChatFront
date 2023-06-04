<template>
  <div class="common-layout">
    <el-container class="container1">
      <div class="sidebar1">

        <el-aside  width="80px" >
          <el-menu @select="menuClick" >
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




      <el-container>
<!--    display who you are chatting with-->
        <el-header style="background-color: cornsilk" >
          <div v-if="startChat">{{MsgFriendId}}</div>
        </el-header>


<!--chat area-->
        <el-main style="background-color: bisque">


<!--          这里用setting 的 div 来设计页面
              还要有 scroll bar 按照 contact 页面的 设计-->

        <chatroom></chatroom>












        </el-main>


<!--text area input-->
        <el-footer class="footer"  height="200px">
          <div style="margin-left: 0">
            <el-input
                v-on:keyup="send"
                v-model="textarea"
                :rows="9"
                type="textarea"
                placeholder="Ctrl + Enter = Send~"
                resize="none"
            >
            </el-input>
          </div>

        </el-footer>

      </el-container>

    </el-container>


  </div>
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

         // alert("reach here")
        }
        if(id !== ''){
          this.DataContent.chatMSG.receiverId = id;
        //  alert(this.DataContent.chatMSG.receiverId);
          store.commit("setDataContent",JSON.stringify(this.DataContent));
         // alert("get data");
          store.dispatch("sendMsg");
          //render send msg when sending msg
          let today = new Date();
          let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
          let time = date+'-' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
          let obj = {
            msg:this.DataContent.chatMSG.msg,
            time: time,
            avatar: window.localStorage.getItem("userAvatar"),
            nickname:window.localStorage.getItem("userNickname"),
            self:true
          }
          store.commit("renderMsg",obj);
          // this.renderSendMsg(this.DataContent.chatMSG);
          //clear text area after sended
          this.textarea = '';
        }
        else{
          alert("Friend id is null");
        }
      }
    },
    // renderSendMsg(data){
    //   alert(data.msg);
    //   let obj = {
    //
    //   }
    //   store.commit("renderMsg",obj);
    // },

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

    store.dispatch('requestFriendList');
    router.push('/chat');
    store.dispatch('connect');
  }

}
</script>

<style lang="scss"  scoped>
.container1{
  height: 100vh;
}




</style>
<template>
<el-scrollbar max-height="940px">
  <!--  friend request list-->
  <div id="list" >
    <ul style="padding-left: 0" >
      <li class="li" v-for="(item) in friendRequestList"
          :key="item.id"
      >

        <img class="avatar" :src="item.faceImage"  /><!--        :alt="item.username"-->
        <p class="name">{{item.username}}</p>
        <el-button-group >
          <el-button @click="accept(item)" style="width: 40%" type="success" >Accept</el-button>
          <el-button @click="ignore(item)" style="width: 40%" type="danger">Ignore</el-button>
        </el-button-group>
      </li>
    </ul>
  </div>


<!--  chat snapshot-->

  <div >
    <ul v-if="SnapShot !== []">

        <li class="li" v-for="(shot) in SnapShot"
            :key="shot.id"
            @click="sendMsg(shot)"
        >
          <el-badge :is-dot= notRead class="item">
          <p>{{shot.id}}</p>
          <p>{{shot.nickname}}</p>
          <p>{{shot.msg}}</p>
          </el-badge>

        </li>

    </ul>
  </div>





</el-scrollbar>



</template>

<script>
import {mapState} from "vuex";
import {postRequestParams} from "@/utils/api";
import router from "@/router";
import store from "@/store";
export default {
  name: "chat",
  data(){
    return{
      notRead:true,
      form:{
        acceptUserId:'',
        sendUserId:'',
        op:0
      }
    }
  },
  methods:{
    accept(item){
        this.form.op = 1;
        this.form.acceptUserId = window.localStorage.getItem("userid");
        this.form.sendUserId = item.id;
        postRequestParams('/user/operFriendRequest', this.form).then(resp=>{
          if(resp){
            store.dispatch('requestFriendRequestList');//reload request
            store.dispatch("requestFriendList");//reload friend list
          }
        })
    },
    ignore(item){
      this.form.op = 0;
      this.form.acceptUserId = window.localStorage.getItem("userid");
      this.form.sendUserId = item.id;
      postRequestParams('/user/operFriendRequest', this.form).then(resp=>{
        if(resp){
          store.dispatch('requestFriendRequestList');//reload request
        }
      })
    },
    sendMsg(shot){

      this.notRead = false;

      store.commit("setMsgFriendId",shot.id);
      store.commit("setMsgFriendUsername",shot.username);
      store.commit("setMsgFriendNickname",shot.nickname)
      store.commit("setMsgFriendAvatar",shot.avatar);

      // first clear the page

      // load chat history
      let chatKey = window.localStorage.getItem("userid") + "with"+ shot.id;
      let h = JSON.parse(window.localStorage.getItem(chatKey));
      if(h === null){
        h = [];
      }
      store.commit("setHistory",h);

    }

  },
  computed:mapState([
    // 写state里面的属性
    "friendRequestList",
      "SnapShot"
  ]),
  mounted:function (){
    let snapKey = window.localStorage.getItem("userid") + "snapshot";
    let s = JSON.parse(window.localStorage.getItem(snapKey));
    if(s === null){
      s = [];
    }
    store.commit("setSnapshot",s);
  }

}
</script>

<style scoped>
.avatar {
  border-radius: 2px;
  width: 30px;
  height: 30px;
  vertical-align: middle;
}

.name {
  display: inline-block;
  margin-left: 15px;
}

.item {
  margin-top: 10px;
  margin-right: 40px;
}

</style>
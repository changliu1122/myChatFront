<template>
<div>chat </div>
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
</template>

<script>
import {mapState} from "vuex";
import {postRequestParams} from "@/utils/api";
import router from "@/router";
export default {
  name: "chat",
  data(){
    return{
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
            location. reload();
            router.go(0);
          }
        })
    },
    ignore(item){
      this.form.op = 0;
      this.form.acceptUserId = window.localStorage.getItem("userid");
      this.form.sendUserId = item.id;
      postRequestParams('/user/operFriendRequest', this.form).then(resp=>{
        if(resp){
          location. reload();
          router.go(0);
        }
      })
    }

  },
  computed:mapState([
    // 写state里面的属性
    "friendRequestList"
  ])

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
</style>
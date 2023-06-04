<template>
<p>test page</p>

  <el-button  @click="testconnection" > test connection</el-button>
  <el-button  @click="testagain" > test again</el-button>
<!--  <el-button  @click="sendmsg" > test send</el-button>-->

</template>

<script>
import {mapState} from "vuex";
import router from "@/router";
import store from "@/store";
import userStore from "vuex";
import {computed} from "vue";


export default {
  data(){
    return{

      datacontent:{
        action:2,
        // 名字得一样
        chatMSG:{
          senderId:1806935192113204,
          receiverId:5245012237488185,
          msg:"hahahaaha nihao"

        }
      }
    }
  },
  // setup(){
  //   let socket = computed(()=> store.state.socket);
  //   return{
  //     socket,
  //   }
  //
  // },
  methods:{
    testconnection(){
        // this.socket =  new WebSocket('ws://172.18.28.15:8889/ws');

      // let socket = new WebSocket('ws://172.18.28.15:8889/ws');
      // socket.onopen=()=>{
      //   alert('haideishiyuanlaidefangfa');
      //   socket.send(JSON.stringify(this.datacontent));
      // }
    store.commit("setDataContent",JSON.stringify(this.datacontent));
    alert("get data");
    store.dispatch("sendMsg");
    },
    testagain(){
      store.dispatch('connect');
    }
    // testclose(){
    //   ws.close(1000,"work completed")
    // },
    // sendmsg(){
    //
    // }
  },
  mounted:function (){
    store.dispatch('connect');
  },

}
</script>
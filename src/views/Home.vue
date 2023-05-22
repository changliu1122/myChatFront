<template>
  <div class="common-layout">
    <el-container>

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



      <div class="sidebar2">

        <el-aside width="200px">


            <router-view/>



        </el-aside>
      </div>




      <el-container>
        <el-header>
          Header
        </el-header>

        <el-main>
          Main



        </el-main>

        <el-footer>
          Footer
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

export default {
  name: "Home",
  components: {Promotion, Setting, UserFilled, ChatRound,card,list},

  methods:{
    menuClick(index){
      router.push(index);
    }
  },
  // 一启动就自动调用这个方法 从后端获取好友列表
  mounted:function (){
    store.dispatch('requestFriendList');
  }

}
</script>

<style scoped>

</style>
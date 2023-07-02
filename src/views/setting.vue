<template>

  <header style="position: center" >Setting</header>
  <div>
    <ul style="padding-left: 0" >
      <li @click="profile">
        <p>Mein Profile</p>
      </li>
      <li @click="logout">
        <p>Log out</p>
      </li>
    </ul>
  </div>

  <el-drawer v-model="profileVisible" :show-close="false">
    <template #header="{ close, titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass" style="text-align: center">Mein Profile</h4>
      <el-button type="danger" @click="close">
        <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
        Close
      </el-button>
    </template>

    <div>

      <el-card>
        <el-row>
          <el-col :span="15">Profilefoto: </el-col>
          <el-col :span="8"><div style="text-align: right">{{ Profile_avatar }}</div> </el-col>
          <el-col :span="1"><el-icon @click="setProfilfoto" :size="20">
            <Edit />
          </el-icon></el-col>
        </el-row>
      </el-card>

      <el-card>
        <el-row>
          <el-col :span="15">Id:</el-col>
          <el-col :span="8"><div style="text-align: right">{{Profile_id}}</div> </el-col>
          <el-col :span="1"><el-icon :size="20">
            <Edit />
          </el-icon></el-col>
        </el-row>
      </el-card>
      <el-card>
        <el-row>
          <el-col :span="15">Name:</el-col>
          <el-col :span="8"><div style="text-align: right">{{Profile_Name}}</div> </el-col>
          <el-col :span="1"><el-icon @click="setName" :size="20">
            <Edit />
          </el-icon></el-col>
        </el-row>
      </el-card>
      <el-card>
        <el-row>
          <el-col :span="15">Nickname:</el-col>
          <el-col :span="8"><div style="text-align: right">{{ Profile_nickname }}</div> </el-col>
          <el-col :span="1"><el-icon @click="setNickname" :size="20">
            <Edit />
          </el-icon></el-col>
        </el-row>
      </el-card>

    </div>

  </el-drawer>



  <el-dialog v-model="newNicknamePopUp" title="Set up new nickname">
    <el-form :rules="rules" ref="checknickname" :model="newNicknameForm"  class="newNickname-container">
      <el-form-item prop="nickname">
        <el-input type="text" v-model=" newNicknameForm.nickname" placeholder="new nickname"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="newNicknamePopUp = false">Cancel</el-button>
        <el-button type="primary" @click="sendNewNickname">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>




</template>

<script>
import {CircleCloseFilled} from "@element-plus/icons-vue";
import {postRequest, postRequestParams} from "@/utils/api";
import router from "@/router";
import store from "@/store";
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: "setting",
  components: {CircleCloseFilled},
  data(){
    return{
      Profile_Name:window.localStorage.getItem("username"),
      Profile_id:window.localStorage.getItem("userid"),
      Profile_nickname:window.localStorage.getItem("userNickname"),
      Profile_avatar: window.localStorage.getItem("userAvatar"),
      Profile_avatarBig:window.localStorage.getItem("userAvatarBig"),

      newNicknameForm:{
        id:window.localStorage.getItem("userid"),
        nickname:'',
      },

      profileVisible: false,
      newNicknamePopUp: false,
      rules:{
        nickname: [
          { required: true, message: 'invalid input!', trigger: 'blur' },
          { min: 1, max: 10, message: 'Length should be 3 to 10', trigger: 'blur' }
        ]
      }
    }
  },
  methods:{
    profile(){
      this.profileVisible = true;
    },
    setProfilfoto(){
alert("ok");
    },
    setName(){

    },
    setNickname(){
      this.newNicknamePopUp = true;
    },

    sendNewNickname(){
      this.newNicknamePopUp = false;

      this.$refs.checknickname.validate((valid)=>{
        if(valid){
          postRequest('/user/changeNickname', this.newNicknameForm).then(resp=>{
            if(resp){
              if(resp.status === 200){
                alert("You got a new nickname!");
                window.localStorage.setItem("userNickname",resp.data.nickname);
                this.Profile_nickname =  window.localStorage.getItem("userNickname");
              }
            }
            else{
              alert(resp.msg);
            }
          })
        }
        else{
          this.$message.error('Oops, invalid input!');
          return false;
        }
      });
    },






    logout(){

      ElMessageBox.confirm(
          'you are going to log out. Continue?',
          'Warning',
          {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
          }
      )
          .then(() => {
            store.dispatch("logout");

            router.push('/');

          })
          .catch(() => {
            ElMessage({
              type: 'info',
              message: 'canceled',
            })
          })








    }
  }
}
</script>

<style scoped>


</style>
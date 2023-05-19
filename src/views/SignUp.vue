<template>
  <div>
    <el-form :rules="rules" ref="signUp" :model="signUpForm"  class="signUp-container">
      <h3 class="title">Sign Up</h3>

      <el-form-item prop="username">
        <el-input type="text" v-model="signUpForm.username" placeholder="username"></el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input type="password" v-model="signUpForm.password" placeholder="password"></el-input>
      </el-form-item>

      <el-form-item prop="nickname">
        <el-input type="nickname" v-model="signUpForm.nickname" placeholder="nickname"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" style="width: 100%" @click="submit" >Sign Up</el-button>
      </el-form-item>

    </el-form>
  </div>

</template>

<script>
import {postRequest} from "@/utils/api";
import router from '@/router';

export default {
  name: "SignUp",
  data(){
    return{
      signUpForm:{
        username:'',
        password:'',
        nickname:''
      },
      rules:{
        username: [
          { required: true, message: 'Please input username', trigger: 'blur' },
          { min: 3, max: 10, message: 'Length should be 3 to 10', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Please input password', trigger: 'blur' },
          { min: 3, max: 10, message: 'Length should be 3 to 10', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: 'Please input nick name', trigger: 'blur' },
          { min: 3, max: 10, message: 'Length should be 3 to 5', trigger: 'blur' }
        ],

      }
    }
  },
  methods:{
    //sign up
    submit(){
      this.$refs.signUp.validate((valid) => {
        if (valid) {
          alert(JSON.stringify(this.signUpForm));
          postRequest('/user/signup',this.signUpForm).then(resp => {
            if(resp){
              //push: can get back to the last page
              //replace: cannot get back to the last page

              //user already exist
              if(resp.status === 500){
                alert(resp.msg);

              }// good to go return to login page
              else if(resp.status === 200){
                alert(resp.msg);
                router.push('/');
              }
              //unknown error
              else{
                alert("unknown error");
              }
            }
          })
        }
        else {
          this.$message.error('Oops, invalid input!');
          return false;
        }
      });
    }

  }

}
</script>

<style scoped>

.signUp-container{

  border-radius: 15px;
  border:1px solid;
  background-clip: padding-box;
  padding: 15px 35px 15px 35px;
  width: 350px;
  margin: 180px auto;

}
.title{
  text-align: center;
}




</style>
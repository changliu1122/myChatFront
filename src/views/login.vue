<template class="template">

    <div>
      <el-form :rules="rules" ref="login" :model="loginForm"  class="login-container">
        <h3 class="title">Login</h3>

        <el-form-item prop="username">
          <el-input type="text" v-model="loginForm.username" placeholder="username"></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" placeholder="password"></el-input>
        </el-form-item>

        <el-form-item prop="code">
          <el-input type="text" v-model="loginForm.code" style="width: 250px;margin-right: 5px" placeholder="refresh code"></el-input>
          <img :src="captchaUrl" @click="refreshCaptcha">
        </el-form-item>


        <el-form-item>
          <el-checkbox v-model="loginForm.checked" class="loginremember">remenber</el-checkbox>
          <el-button type="primary" style="width: 100%" @click="submitLogin" >Login</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="signUp" >New User? Sign up here!</el-button>
        </el-form-item>
      </el-form>
    </div>

</template>

<script>
import {postRequest} from "@/utils/api";
import router from '@/router';

export default {
  name: "login",
  data(){
    return{
      // using get method, and add time stamp, API name is captcha
      captchaUrl:'/captcha?time='+ new Date() ,
      loginForm:{
        username:'',
        password:'',
        checked:true
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
        code: [
          { required: true, message: 'Please input code', trigger: 'blur' },
        ]
      }
    }
  },
  methods:{
    //refresh code
    refreshCaptcha(){
        this.captchaUrl = '/captcha?time='+ new Date();
    },
    signUp(){
      router.push('/signup');
    },
    //login
    submitLogin(){
      this.$refs.login.validate((valid) => {
        if (valid) {
          alert(JSON.stringify(this.loginForm));
          postRequest('/user/login',this.loginForm).then(resp => {
            if(resp){


              //push: can get back to the last page
              //replace: cannot get back to the last page

              //new user, sign up first
              if(resp.status === 201){
                alert(resp.msg);
                router.push('/signup');
              }// good to go
              else if(resp.status === 200){
                router.push('/home');
              }
              //wrong pwd
              else{
                alert(resp.msg);
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


<style>
  .login-container{

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

  .loginremember{
    margin:0px 0px 15px 0px;
    text-align: left;
  }







</style>
<template>
<div>
  <el-form :rules="rules" ref="searchCheck" :model="searchForm"  class="search-container">
    <el-form-item prop="friendUserName">
      <el-input  type="text" v-model="searchForm.friendUserName" style="width:75%" placeholder="Search Friend"> </el-input>
      <el-button @click="search" style="width: 20%" type="primary" :icon="Search">Go</el-button>
    </el-form-item>
  </el-form>
</div>
  <div id="list" >
    <ul >
      <li v-for="(item) in contactList"
          :key="item.friendUserId"
          @click="friendsInfo(item)"
          style="background-color: aqua"
      >
        <!--        这里的属性要按照 java 返回的类属性， 不用管这个warning-->
        <!--        <img class="el-avatar" :src="item.friendFaceImage" :alt="item.friendUsername" />-->
        <p class="name">{{item.friendUsername}}</p>
      </li>
    </ul>
  </div>








  <el-dialog v-model="dialogVisible" title="Info" width="30%">
    <el-row >
      <el-card  :body-style="{ padding: '0px' }"  style="width: 70%; margin-left: 15px" >
        <div style="padding: 14px">
          <span style="font-size: 30px" >Username: {{this.searchForm.friendUserName}}</span>
          <div class="bottom">
            <span style="font-size: 20px">UserId: {{friendUserId}}</span>
          </div>
          <div>
            <span style="font-size: 20px">Nickname: {{friendNickname}}</span>
          </div>
        </div>
      </el-card>
      <img class="image" v-bind:src="friendAvatar"/>
    </el-row>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="sendRequest">Send Request</el-button>
      </span>
    </template>
  </el-dialog>


</template>

<script>
import {mapState} from "vuex";
import router from "@/router";
import {postRequest, postRequestParams} from "@/utils/api";


export default {
  name: "contact",
  data(){
    return{
      dialogVisible: false,
      friendNickname: '',
      friendAvatar:'',
      friendUserId:'',


      searchForm:{
        myId: window.localStorage.getItem("userid"),
        friendUserName: ''
      },
      rules:{
        friendUserName: [
          { required: true, message: 'Please input username', trigger: 'blur' },
          { min: 3, max: 10, message: 'Length should be 3 to 10', trigger: 'blur' }
        ]
      }
    }
  },
  methods:{
    sendRequest(){
      postRequestParams('/user/sendFriendRequest',this.searchForm).then(resp => {
        if(resp.status === 200){
          alert("Friend request was sent!")
        }
        else{
          alert("Ops, something goes wrong!");
        }
      })

      this.dialogVisible = false;

    },
    friendsInfo(item){
        router.push({
          path:'/contactInfo',
          query:{
            username: item.friendUsername,
            img: item.friendFaceImage,
            id:item.friendUserId
          }

        })
    },

    search(){
      this.$refs.searchCheck.validate((valid) => {
        if (valid) {
          postRequestParams('/user/searchFriend',this.searchForm).then(resp => {
            if(resp.data == null){
              alert(resp.msg)
            }
            else{
              //rendering friend info
              this.friendNickname= resp.data.nickname;
              this.friendAvatar = resp.data.faceImage;
              this.friendUserId = resp.data.id;
              this.dialogVisible = true;
            }
          })
        }
        else {
          this.$message.error('Oops, invalid input!');
          return false;
        }
      });
    }

  },
  computed:mapState([
    // 写state里面的属性
    "contactList"
  ])
}
</script>

<style scoped>
.bottom {
  margin-top: 13px;
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.image {
  width: 20%;
  display: block;
}

</style>
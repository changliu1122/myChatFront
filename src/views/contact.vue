<template>
<div>
  <el-form :rules="rules" ref="searchCheck" :model="searchForm"  class="search-container">
    <el-form-item prop="friendUserName">
      <el-input  type="text" v-model="searchForm.friendUserName" style="width:75%" placeholder="Search Friend"> </el-input>
      <el-button @click="search" style="width: 20%" type="primary" :icon="Search">
        <el-icon style="vertical-align: middle">
        <Search />
      </el-icon>
      </el-button>
    </el-form-item>
  </el-form>
</div>

  <el-scrollbar max-height="940px">
<!--    only for test--><p v-for=" item in 50" >{{item}}</p>

    <ul style="padding-left: 0" >
      <li class="li" v-for="(item) in contactList"
          :key="item.friendUserId"
          @click="friendsInfo(item)"
      >
        <!--        这里的属性要按照 java 返回的类属性， 不用管这个warning-->
        <img class="avatar" :src="item.friendFaceImage" :alt="item.friendUsername" />
        <p class="name">{{item.friendUsername}}</p>
      </li>
    </ul>
  </el-scrollbar>





<!--contact friend info-->
  <el-dialog v-model="popupInfo" title="Info" width="30%">
    <el-row >
      <img class="image" v-bind:src="popupAvatar"/>
      <el-card  :body-style="{ padding: '0px' }"  style="width: 70%; margin-left: 15px" >
        <div style="padding: 14px">
          <span style="font-size: 30px" >Username: {{popupUsername}}</span>
          <div class="bottom">
            <span style="font-size: 20px">UserId: {{popupId}}</span>
          </div>
          <div>
            <span style="font-size: 20px">Nickname: {{popupNickname}}</span>
          </div>
        </div>
      </el-card>

    </el-row>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="popupInfo = false">Cancel</el-button>
        <el-button type="primary" @click="sendMessage">Send Message</el-button>
      </span>
    </template>
  </el-dialog>

<!--search friend result-->
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
import {postRequest, postRequestParams,} from "@/utils/api";
import store from "@/store";




export default {
  name: "contact",
  data(){
    return{
//contact friend info

      popupInfo:false,
      popupUsername:'',
      popupId:'',
      popupAvatar:'',
      popupNickname:'',


//search friend info
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
    sendMessage(){
      this.popupInfo=false;
      store.commit("setMsgFriendId",this.popupId);
      store.commit("setMsgFriendUsername",this.popupUsername);
      store.commit("setMsgFriendNickname",this.popupNickname)
      store.commit("setMsgFriendAvatar",this.popupAvatar);
      // load chat history
      // first clear the page
    },
    sendRequest(){
      postRequestParams('/user/sendFriendRequest',this.searchForm).then(resp => {
        if(resp.status === 200){
          alert("Friend request was sent!")
        }
        else{
         //alert("Ops, something goes wrong!");
          alert(resp.msg);
        }
      })

      this.dialogVisible = false;

    },
    friendsInfo(item){
      this.popupInfo = true;
      this.popupId = item.friendUserId;
      this.popupUsername=item.friendUsername;
      this.popupAvatar=item.friendFaceImage;
      this.popupNickname=item.friendNickname;
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

<style lang="scss" scoped>
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

.li {
  padding: 12px 15px;
  border-bottom: 1px solid #292C33;
  cursor: pointer;
  &:hover {
    background-color: rgba(255, 255, 255, 0.03);
  }
}
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
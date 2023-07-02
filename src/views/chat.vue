<template>

  <div>
    <el-button @click="creatGroup" style="width: 100%"  type="primary" >
      Create a char group
    </el-button>
  </div>

  <el-drawer v-model="creatGroupVisible" :show-close="false">
    <template #header="{ close, titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass" style="text-align: center">Create a chat group</h4>
      <el-button type="danger" @click="close">
        <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
        Close
      </el-button>
    </template>




    <el-scrollbar max-height="940px">

      <ul style="padding-left: 0" >
        <li class="li" v-for="(item) in contactList"
            :key="item.friendUserId"
        >


          <el-checkbox-group  v-model="checkArr"  @change="checkIfSelect">
            <el-checkbox  :label="item.friendUsername" size="large" border />
          </el-checkbox-group>








<!--          <img class="avatar" :src="item.friendFaceImage" :alt="item.friendUsername" />-->
<!--          <p class="name">{{item.friendUsername}}</p>-->

        </li>
      </ul>
    </el-scrollbar>


    <el-row>
      <el-col :span="24"><el-button @click="create" style="width: 100%" type="success">create</el-button></el-col>
    </el-row>

  </el-drawer>

  <el-dialog v-model="setName" title="Set up new group name">
    <el-form :rules="rules" ref="checkname"  :model="groupNameForm" >
      <el-form-item prop="groupName">
        <el-input type="text" v-model="groupNameForm.groupName" placeholder="new group name"></el-input>
      </el-form-item>
    </el-form>


    <template #footer>
      <span class="dialog-footer">
        <el-button @click="setName = false">Cancel</el-button>
        <el-button type="primary" @click="finishGroupCreation">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>

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


<!--  group chat-->
  <div>
    <ul>
      <li  v-for="(item) in chatGroups"
            :key="item.index"
           @click="sendGroupMsg(item)"
      >
        <p>{{item.groupName}}</p>
        <p>{{item.groupChatSS}}</p>

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
import {postRequest, postRequestParams} from "@/utils/api";
import router from "@/router";
import store from "@/store";
import {CircleCloseFilled} from "@element-plus/icons-vue";
export default {
  name: "chat",
  components: {CircleCloseFilled},
  data(){
    return{
      groupNameForm:{
        groupName:"",
      },

      notRead:true,
      form:{
        acceptUserId:'',
        sendUserId:'',
        op:0
      },


      checkArr:[],
      groupList:[],
      creatGroupVisible: false,
      setName:false,
      rules:{
        groupName: [
          { required: true, message: 'invalid input!', trigger: 'blur' },
          { min: 1, max: 15, message: 'Length should be 3 to 10', trigger: 'blur' }
        ]
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
      store.commit("setGroupChatHistory",null);
      store.commit("setIsGroupChat",false);
      this.notRead = false;
      store.commit("setIsGroupChat",false);
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

    },
    // get checked friend name as a array
    checkIfSelect(e){
        this.groupList = e;
    },
    creatGroup(){
      this.creatGroupVisible = true;
    },
    create(){
      if(this.groupList === null || this.groupList.length === 0){
        alert("You have to select at least one friend!");
      }else{
        this.setName = true;
      }
    },
    finishGroupCreation(){
      this.$refs.checkname.validate((valid)=>{
        if(valid){

          let group = {
            groupLst :this.groupList,
            groupName : this.groupNameForm.groupName
          }
          store.commit("setGroup", group);

          store.commit("setIsGroupChat",true);
          store.commit("setMsgFriendId",this.groupNameForm.groupName);

          store.commit("setHistory",null);

          this.setName = false;
          this.groupNameForm.groupName = "";
          this.groupList = [];
          this.checkArr = [];
          this.creatGroupVisible = false;
        }
        else{
          this.$message.error('Oops, invalid input!');
          return false;
        }
      });
    },
    sendGroupMsg(item){
      store.commit("setIsGroupChat",true);
      store.commit("setMsgFriendId",item.groupName);
      store.commit("setHistory",null);

      let groupKey = store.state.MsgFriendId + window.localStorage.getItem("userid")
      let groupInfo = JSON.parse(window.localStorage.getItem(groupKey));
      let his = groupInfo.groupChatHistory;
      if(his === null){
        his = [];
      }

      store.commit("setGroupChatHistory",his);

    }

  },
  computed:mapState([
    // 写state里面的属性
    "friendRequestList",
      "SnapShot",
      "contactList",
      "chatGroups"
  ]),
  mounted:function (){
    let snapKey = window.localStorage.getItem("userid") + "snapshot";
    let s = JSON.parse(window.localStorage.getItem(snapKey));
    if(s === null){
      s = [];
    }
    store.commit("setSnapshot",s);

    let chatGroupKey = "chatGroups"+window.localStorage.getItem("userid");
    let c = JSON.parse(window.localStorage.getItem(chatGroupKey));
    if(c === null){
      c = [];
    }

    store.commit("setChatGroups",c);
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
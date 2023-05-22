import { createStore } from 'vuex'
import {postRequest} from "@/utils/api";

export default createStore({
  state: {
    contactList:[],


  },

  mutations: {

    getContactList(state,data){
      state.contactList = data;
    }


  },
  actions: {
    requestFriendList(context){

      postRequest('/user/myFriends',window.localStorage.getItem("userid")).then(resp=>{
        if(resp){

          context.commit('getContactList',resp.data);
        }
      })

    }

  },






  getters: {
  },
  modules: {
  }
})

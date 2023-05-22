<template>
<h3>
  {{ this.$route.query.id }}
  {{ this.$route.query.username }}

</h3>


</template>






<script>

import router from "@/router";


export default {
  name: "contactInfo",
  data(){
    return{

    }

  }


}
</script>








<style scoped>

</style>
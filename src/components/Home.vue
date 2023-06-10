<template>
  <div>
    <the-header></the-header>
    <TheAside></TheAside>
    <div class="content-box" :class="{ 'content-collapse': $store.state.collapse }">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>

import TheHeader from "@/components/TheHeader";
import TheAside from "@/components/TheAside";

export default {
  components: {
    TheHeader,
    TheAside
  }
}
</script>

<style scoped>
  .content-box {
    position: absolute;
    left: 150px;
    right: 0;
    top: 60px;
    bottom: 0;
    /*overflow-y: scroll;*/
    transition: left 0.3s ease-in-out;
    padding: 20px;
  }

  .content-collapse {
    left: 65px;
  }
</style>
<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>
<script>
export default {};
</script>

<style lang="scss">
@import "@/assets/scss/all.scss";
</style>

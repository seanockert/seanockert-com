<template>
  <div id="app">
    <transition name="fade" mode="out-in" appear>
      <router-view :key="key"></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      transitionName: 'fade'
    }
  },
  computed: {
    // Provide a key for the router so the transition will change 
    // between the same view eg. /hello/a and hello/b
    // To transition all pages the same just use :key="$route.fullPath"  
    key () { 
      if (this.$route.name == 'department') {
        return this.$route.params.department 
      } else { 
        return this.$route.fullPath 
      } 
    }
  } 
}
</script>

<style lang="scss">
@import "./assets/scss/_reset.scss";
@import "./assets/scss/_variables.scss";
@import "./assets/scss/_animations.scss";
@import "./assets/scss/_skeleton.scss";

html, body {
  height: 100%;
  color: $color-dark;
}

#app {
  font-family: Helvetica, sans-serif;
  height: inherit;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

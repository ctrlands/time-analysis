<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'app-component',
  data () {
    return {
    }
  },
  created () {
    let _style = window.localStorage.getItem('style') ? window.localStorage.getItem('style') : 'light'
    document.documentElement.setAttribute("data-theme", _style)
  },
  methods: {
  }
}
</script>

<style lang="scss">
@import '@/scss/reset.scss';
@import '@/scss/vant.scss';
@import '@/scss/_handle.scss';
#app {
  @include font_color('font_color');
  @include background_color('background_color');
  height: 100vh;
}
body {
  @include font_color('font_color');
  @include background_color('background_color');
}
</style>

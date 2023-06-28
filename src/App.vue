<template>
  <div id="app" v-if="isRouterAlive">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isRouterAlive: true,
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
  },
};
</script>

<style>
#app,
body,
html {
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#pano {
  width: 100vw;
  height: 100vh;
}
</style>

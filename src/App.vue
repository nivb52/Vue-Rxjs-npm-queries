<template>
    <div id="app">
    <input type="text" v-model="term" />

  </div>

</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      term: "express"
    };
  },
  subscriptions() {
    const BASE_URL = "https://cors-anywhere.herokuapp.com/https://registry.npmjs.org/";
    const createLoader = url => from(this.$http.get(url)).pipe(pluck("data"));
    const package$ = n => createLoader(`${BASE_URL}${n}/latest`);

    
  }
}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

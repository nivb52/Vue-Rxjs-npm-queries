<template>
  <div id="app">
    <input type="text" v-model="term" />
    <button v-stream:click="click$">Load Data</button>
  
  </div>
</template>

<script>
import { interval, from } from "rxjs";
import {
  pipe,
  pluck,
  switchMap,
  catchError,
  tap
} from "rxjs/operators";

export default {
  name: "App",
  domStreams: ["click$"],
  data() {
    return {
      term: "express"
    };
  },
  subscriptions() {
    const BASE_URL =
      "https://cors-anywhere.herokuapp.com/https://registry.npmjs.org/";
    const createLoader = url => from(this.$http.get(url)).pipe(pluck("data"));
    const package$ = n => createLoader(`${BASE_URL}${n}/latest`);

    const fullData$ = this.click$
      .pipe(
        pluck("data"),
        switchMap(() => package$(this.$data.term)),
        tap(data => console.log(data)),
        // HANDLE AN ERROR
        catchError(err => {
          console.log("somemthing went wrong...", err);
          of(`Bad Promise: ${error}`);
          // return throwError(err);
        })
      )
    return {
    fullData$
    };
  }
};
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

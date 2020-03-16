<template>
  <div id="app">
    <input type="text" v-model="term" />
    <button v-stream:click="click$">Load Data</button>
    <h1>
      {{name$}}
      <sup>{{version$}}</sup>
    </h1>
    <ul class="tree">
      <li
        v-for="(version, name) in dependencies$"
        :key="name"
      >
        {{name}}
        <sup>{{version}}</sup>
      </li>
    </ul>
  </div>
</template>

<script>
import { from } from "rxjs";
import {
  pipe,
  pluck,
  switchMap,
  map,
  of,
  catchError,
  share,
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
    const BASE_URL = "https://cors-anywhere.herokuapp.com/https://registry.npmjs.org/";

    const createLoader = url => from(this.$http.get(url)).pipe(pluck("data"));
    const package$ = n => createLoader(`${BASE_URL}${n}/latest`);


    const fullData$ = this.click$
      .pipe(
        pluck("data"),
        switchMap(() => package$(this.$data.term)),
        // HANDLE AN ERROR
        catchError(err => {
          console.log("somemthing went wrong...", err);
          of(`Bad Promise: ${error}`);
          // return throwError(err);
        })
      )
      // SHARE THE STREAM
      .pipe(share());

    const name$ = fullData$.pipe(pluck("name"));
    const version$ = fullData$.pipe(pluck("version"));
    const dependencies$ = fullData$.pipe(pluck("dependencies"));

    return {
      name$,
      version$,
      dependencies$,
    };
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 60px auto;
}
</style>

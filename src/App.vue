<template>
  <div id="app">
    <input type="text" v-model="term$" />
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
  tap,
  catchError,
  share,
  startWith
} from "rxjs/operators";

export default {
  name: "App",
  domStreams: ["click$"],
  data() {
    return {
      term: " "
    };
  },
  subscriptions() {
    const CROS_URL = "https://cors-anywhere.herokuapp.com/";
    const BASE_URL = "https://registry.npmjs.org/";

    const createLoader = url => from(this.$http.get(url)).pipe(pluck("data"));
    const package$ = (data, version = 'latest') => createLoader(`${CROS_URL}${BASE_URL}${name}/${version}`)
      

    const getPackage$ = (name$ = term$) => {
      return name$.pipe(switchMap(name => package$({name})))};

    const fullData$ = this.click$
      .pipe(
        pluck("data"),
        switchMap(() => getPackage$(term$)),
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
    const term$ = this.$fromDOMEvent("input", "keyup").pipe(
      pluck("target", "value"),
      startWith("express")
    );

    return {
      name$,
      version$,
      dependencies$,
      term$
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
ul.tree {
  margin: 0 10%;
  text-align: start;
  list-style: none;
  padding-left: 0px;
}
</style>

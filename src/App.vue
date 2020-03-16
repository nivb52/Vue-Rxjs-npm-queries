<template>
  <div id="app">
    <input type="text" v-model="term$" placeholder="express"/>
    <button :disabled="pending$" v-stream:click="click$">{{buttonText$}}</button>
    <button v-stream:click="cancelClick$">cancel</button>
    <h1>
      {{name$}}
      <sup>{{version$}}</sup>
    </h1>
    <p v-if="!dependencies$ && description$">{{description$}}</p>
    <ul class="tree">
      <li
        v-for="(version, name) in dependencies$"
        :key="name"
        v-stream:click="{ subject: click$, data: {name,version} }"
      >
        {{name}}
        <sup>{{version}}</sup>
      </li>
    </ul>
  </div>
</template>

<script>
import { merge, from, isObservable } from "rxjs";
import {
  pipe, filter,
  pluck,
  switchMap,
  map,
  mapTo,
  tap,
  catchError,
  share,
  takeUntil,
  take,
  startWith,
  exhaustMap,
  debounceTime,
  repeat,
} from "rxjs/operators";

export default {
  name: "App",
  domStreams: ["click$", "cancelClick$"],
  data() {
    return {
      term: " "
    };
  },
  subscriptions() {
    const CROS_URL = "https://cors-anywhere.herokuapp.com/";
    const BASE_URL = "https://registry.npmjs.org/";

    const createLoader = url => from(this.$http.get(url)).pipe(pluck("data"));
    const package$ = data => {
      let { name = data, version = "latest" } = data;
      version =
        version.substring(0, 1) === "~" ? version.substring(1) : version;
      return createLoader(`${CROS_URL}${BASE_URL}${name}/${version}`);
    };


    const getPackage$ = (name$ = term$) => {
      if (!isObservable(name$)) return package$(name$);
      return name$.pipe(switchMap(name => package$({ name })));
    };

    const blockers$ = this.cancelClick$.pipe(
      tap(() => console.log("canceled")),
    );

    const term$ = this.$fromDOMEvent("input", "keyup").pipe(
      pluck("target", "value"),
      filter(value => value.trim() !== '' ),
      debounceTime(650)
    );


    const enter$ = this.$fromDOMEvent("input", "keydown").pipe(
      filter(key => key.code === 'Enter' ),
      tap(k => console.log(k)),
      take(1),
      repeat()
     );

    const search$ = merge(this.click$,enter$ ) 
    const fullData$ = search$
      .pipe(
        pluck("data" ||  ''),
        exhaustMap((data) => getPackage$(data)),
        takeUntil(blockers$),
        // HANDLE AN ERROR
        catchError(err => {
          console.log("somemthing went wrong...", err);
          of(`Bad Promise: ${error}`);
          // return throwError(err);
        })
      )
      // SHARE THE STREAM
      .pipe(share());
    // pluck the Data:
    const name$ = fullData$.pipe(pluck("name"));
    const version$ = fullData$.pipe(pluck("version"));
    const dependencies$ = fullData$.pipe(pluck("dependencies"));
    const description$ = fullData$.pipe(pluck("description"));
    //end full data
    
    // pending is bool,false = no loading
    const pending$ = merge(
      this.click$.pipe(mapTo(true)),
      this.cancelClick$.pipe(mapTo(false)),
      fullData$.pipe(mapTo(false), startWith(false))
    );

    const buttonText$ = pending$.pipe(
      startWith('Check it!'),
      map(isLoad => (isLoad ? "Loading" : "Check it !"))
    );

    return {
      name$,
      version$,
      dependencies$,
      description$,
      term$,
      pending$,
      buttonText$,
      enter$
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
ul.tree li {
  cursor: pointer;
}
</style>

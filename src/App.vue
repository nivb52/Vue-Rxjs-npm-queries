<template>
  <div id="app">
    <input
      type="text"
      autofocus
      :disabled="pending$"
      v-on:keyup.enter="doSearch"
      v-model="term"
      placeholder="express"
    />
    <button :disabled="pending$" v-stream:click="click$">{{buttonText$ || 'Go'}}</button>
    <button v-stream:click="cancelClick$">cancel</button>
    <!-- ========================= -->
    <!-- // SHOW DATA  -->
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
  pipe,
  filter,
  pluck,
  switchMap,
  map,
  mapTo,
  of,
  tap,
  catchError,
  share,
  takeUntil,
  take,
  startWith,
  exhaustMap,
  debounceTime,
  delay,
  repeat
} from "rxjs/operators";

export default {
  name: "App",
  domStreams: ["click$", "cancelClick$"],
  data() {
    return {
      term: ""
    };
  },
  subscriptions() {
    const CROS_URL = "https://cors-anywhere.herokuapp.com/";
    const BASE_URL = "https://registry.npmjs.org/";

    const createLoader = url => from(this.$http.get(url)).pipe(pluck("data"));

    const cache = {};
    const package$ = data => {
      let { name = data, version = "latest" } = data;
      version =
        version.substring(0, 1) === "~" ? version.substring(1) : version;
      name = name.trim();
      const key = name + "-" + version;
      return cache[key]
        ? cache[key]
        : (cache[key] = createLoader(
            `${CROS_URL}${BASE_URL}${encodeURIComponent(
              name
            )}/${encodeURIComponent(version)}`
          ));
    };

    const getPackage$ = (name$ = this.$data.term) => {
      if (!isObservable(name$)) return package$(name$);
      return name$.pipe(switchMap(name => package$({ name })));
    };
    // END AJAX STAFF

    const term$ = this.$watchAsObservable("term").pipe(
      pluck("newValue"),
      filter(value => value.trim() !== "")
      // debounceTime(650)
    );

    const esc$ = this.$fromDOMEvent("input", "keyup").pipe(
      filter(k => k.code === "Escape"),
      filter(_ => this.$data.term.trim() !== ""),
      tap(_ => console.log("canceled")),
      mapTo(k => of(true))
    );

    const cancelButton$ = this.cancelClick$.pipe(
      tap(_ => console.log("canceled")),
      mapTo(_ => of(true))
    );

    const blockers$ = merge(cancelButton$, esc$);

    const enter$ = this.$createObservableMethod("doSearch").pipe(
      mapTo(_ => of(true))
    );

    // full data
    const fullData$ = merge(this.click$, enter$)
      .pipe(
        filter(_ => this.$data.term.trim() !== ""),
        tap(_ => console.log("searching ...")),
        // delay(4000),
        pluck("data" || ""),
        exhaustMap(data => getPackage$(data)),
        takeUntil(blockers$),
        // HANDLE  ERROR
        catchError(err => {
          console.log("somemthing went wrong...", err);
          of(`Bad Promise: ${err}`);
          // return throwError(err);
        })
      )
      // SHARE THE STREAM
      .pipe(share(), repeat());
    // pluck the Data:
    const name$ = fullData$.pipe(pluck("name"));
    const version$ = fullData$.pipe(pluck("version"));
    const dependencies$ = fullData$.pipe(pluck("dependencies"));
    const description$ = fullData$.pipe(pluck("description"));
    //end full data

    // ===============
    // app ui state
    const pending$ = merge(
    // pending is bool,false = no loading
      this.click$.pipe(mapTo(true)),
      this.cancelClick$.pipe(mapTo(false)),
      fullData$.pipe(mapTo(false), startWith(false))
    );

    const buttonText$ = pending$.pipe(
      map(isLoad => (isLoad ? "Loading" : "Go")),
      startWith("Go")
    );

    return {
      name$,
      version$,
      dependencies$,
      description$,
      pending$,
      buttonText$,
      term$,
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

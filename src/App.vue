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
    <button :disabled="pending$" v-stream:click="click$">{{buttonText$ || 'GO'}}</button>
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
  debounceTime
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
    const package$ = data => {
      let { name = data, version = "latest" } = data;
      version =
        version.substring(0, 1) === "~" ? version.substring(1) : version;
      name = name.trim();
      return createLoader(
        `${CROS_URL}${BASE_URL}${encodeURIComponent(name)}/${encodeURIComponent(
          version
        )}`
      );
    };

    const getPackage$ = (name$ = this.$data.term) => {
      if (!isObservable(name$)) return package$(name$);
      return name$.pipe(switchMap(name => package$({ name })));
    };
    // END AJAX STAFF

    const term$ = this.$watchAsObservable("term").pipe(
      pluck("newValue"),
      filter(value => value.trim() !== ""),
      // debounceTime(650)
    );

    const blockers$ = this.cancelClick$.pipe(
      tap(() => console.log("canceled")),
    );
    
    // --> --> -->
    // other implementation of enter key stroke
    // using the observable on method
    const enter$ = this.$createObservableMethod("doSearch").pipe(
      tap(_ => console.log(_)),
      mapTo(_ => of(true))
    );

    const search$ = race(blockers$, merge(this.click$, enter$));

    const fullData$ = search$
      .pipe(
        tap(_ => console.log("searching ...")),
        pluck("data" || ""),
        exhaustMap(data => getPackage$(data)),
        // takeUntil(blockers$),
        // HANDLE AN ERROR
        catchError(err => {
          console.log("somemthing went wrong...", err);
          of(`Bad Promise: ${err}`);
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
    // const dependencies$ = fullData$  // for testing
    //end full data

    // pending is bool,false = no loading
    const pending$ = merge(
      this.click$.pipe(mapTo(true)),
      this.cancelClick$.pipe(mapTo(false)),
      fullData$.pipe(mapTo(false), startWith(false))
    );

    const buttonText$ = pending$.pipe(
      map(isLoad => (isLoad ? "Loading" : "Check it !"))
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
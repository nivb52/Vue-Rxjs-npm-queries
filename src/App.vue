<template>
  <div id="app">
    <div>
      <input
        class="search-package"
        autofocus
        v-on:keyup.enter="doSearch"
        v-model="term"
        placeholder="express"
      />

      <button class="blue" :disabled="pending$" v-stream:click="click$">{{buttonText$ || 'Go'}}</button>
      <button class="light" v-stream:click="cancelClick$">Cancel</button>
      <!-- ========================= -->
      <!-- // SHOW DATA  -->
    </div>
    <div v-if="pending$" class="loader-container">
      <div class="lds-facebook">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
    <!-- <div v-if="!pending$" class="lds-hourglass"></div> -->

    <h1>
      {{name$}}
      <sup>{{version$}}</sup>
    </h1>
    <p v-if="!dependencies$ && description$">{{description$}}</p>

    <!-- /////////// -->
    <!-- /////////// -->
    <!-- /////////// -->
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

    const fullData$ = merge(this.click$, enter$)
      .pipe(
        filter(_ => this.$data.term.trim() !== ""),
        tap(_ => console.log("searching ...")),
        // delay(4000),
        pluck("data" || ""),
        exhaustMap(data => getPackage$(data)),
        takeUntil(blockers$),
        // HANDLE ERROR
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
      enter$.pipe(mapTo(true)),
      this.cancelClick$.pipe(mapTo(false)),
      esc$.pipe(mapTo(false)),
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
@import "assets/loader-fb.css";
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
  border-bottom-color: #dbdbdb;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  color: #4a4a4a;
  margin-bottom: -1px;
  padding: 0.5em 1em;
}
button.blue {
  background-color: #167df0;
  color: #fff;
}
button.light {
  background-color: whitesmoke;
  color: #363636;
}

button {
  text-align: center;
  white-space: nowrap;
  border-color: transparent;
  border-radius: 2px;
  font-size: 1rem;
  padding: 0.5rem 0.75em;
}

input.search-package {
  width: auto;
  margin: 0 auto;
  box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.1);
  padding-left: 2.25em;
  background-color: white;
  border-color: #dbdbdb;
  border-radius: 4px;
  color: #363636;
  font-size: 1rem;
  height: 2em;
}

.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
}
</style>

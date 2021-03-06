<template>
  <main id="app">
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
    </div>
<!-- loader -->
    <div v-if="pending$" class="loader-container">
      <div class="lds-facebook">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
      <!-- /////////// -->
<!-- // SHOW DATA  -->
      <!-- /////////// -->
    <article v-else>
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
    </article>
  </main>
</template>

<script>
import { throwError, of, merge, race, from, isObservable, timer } from "rxjs";
import {
  pipe,
  filter,
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
  delay,
  timeout,
  repeat,
  takeWhile
} from "rxjs/operators";
import PackageService from "./service/packageService";

export default {
  name: "App",
  domStreams: ["click$", "cancelClick$"],
  data() {
    return {
      term: ""
    };
  },
  methods: {
    createToast(msg, type = "is-info", position = "is-top", duration = 3000) {
      this.$buefy.toast.open({ duration, message: msg, position, type });
    }
  },
  subscriptions() {

    const term$ = this.$watchAsObservable("term").pipe(
      pluck("newValue"),
      filter(value => value.trim() !== "")
    );

    const esc$ = this.$fromDOMEvent("input", "keyup").pipe(
      filter(k => k.code === "Escape"),
      filter(_ => this.$data.term.trim() !== ""),
      mapTo(k => of(true)),
      filter(_ => pending$),
      tap(_ => this.createToast(`operation canceled`))
    );

    const cancelButton$ = this.cancelClick$.pipe(mapTo(_ => of(true)));

    const blockers$ = merge(cancelButton$, esc$)
      .pipe(tap(_ => console.log("canceled")))
      .pipe(share());

    const enter$ = this.$createObservableMethod("doSearch").pipe(
      mapTo(_ => of(true))
    );

    const errorMsg = "something went wrong";
    const fullData$ = merge(this.click$, enter$)
      .pipe(
        filter(_ => this.$data.term.trim() !== ""),
        tap(_ => console.log("searching ...")),
        // delay(4000), // testing
        pluck("data" || ""),
        exhaustMap((data = this.$data.term)  => PackageService.getPackage$(data)),
        // stop ajax at blockers
        takeUntil(blockers$),
        // handle Error
        catchError((err, error$) => {
          console.error(err);
          this.cancelClick$.next(true);
          this.createToast(errorMsg, "is-danger", "is-top", 3500);
          return error$;
        })
      )
      // SHARE THE STREAM
      .pipe(share(), repeat());
    const name$ = fullData$.pipe(pluck("name"));
    const version$ = fullData$.pipe(pluck("version"));
    const dependencies$ = fullData$.pipe(pluck("dependencies"));
    const description$ = fullData$.pipe(pluck("description"));
    //end full data
    // ===============

    // control app ui state
    const pending$ = merge(
      // pending is bool,false = no loading
      this.click$.pipe(mapTo(true)),
      enter$.pipe(mapTo(true)),
      blockers$.pipe(mapTo(false)),
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
  text-align: center;
  box-sizing: border-box;
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


 <template>
  <li class="tree" @click="openTree(name,version)">
    {{name}}
    <sup>{{version}}</sup>
    <ul class="inner-node" v-if="isOpenTree && dependencies$">
      <node-tree
        v-for="(version, name) in dependencies$"
        :key="name"
        :name="name"
        :version="version"
      ></node-tree>
    </ul>
  </li>
</template>

<script>
import { of, merge, from } from "rxjs";
import {
  pipe,
  pluck,
  map,
  mapTo,
  tap,
  catchError,
  share,
  takeUntil,
  take,
  startWith,
  exhaustMap,
  delay,
  repeat,
  filter
} from "rxjs/operators";
import PackageService from "../service/packageService";
export default {
  name: "NodeTree",
  props: {
    name: String,
    version: String,
    handleClick: Function
  },
  data() {
    return {
      isOpenTree: false,
      nodeData$: null
    };
  },
  methods: {
    openTree(name, version) {
      console.log('click', name, version)
      const fullData$ = this.$watchAsObservable("nodeData$")
      .pipe(
        mapTo(_ =>
          of(PackageService.getPackage$({
            name, version
          }))
        ),
        tap(_ => console.log("running ")),
        tap(_ => (this.$data.isOpenTree = true)),
        tap(_ => console.log("isOpenTree ", this.$data.isOpenTree)),
        tap(res => res),
        // handle Error
        catchError((err, error$) => {
          console.error(err);
          this.createToast(errorMsg, "is-danger", "is-top", 3500);
          return error$;
        })
      )
      // SHARE THE STREAM
      .pipe(share());

    const name$ = fullData$.pipe(pluck("name"));
    const version$ = fullData$.pipe(pluck("version"));
    const dependencies$ = fullData$.pipe(pluck("dependencies"));
    const description$ = fullData$.pipe(pluck("description"));
    //end full data
    // ===============
      fullData$.subscribe()
    return {
      name$,
      version$,
      dependencies$,
      description$
   }
  },
  async beforeMount() {
    this.$data.nodeData$ = PackageService.getPackage$({
      name: this.name,
      version: this.version
    });
  },
  }
};
</script>

<style>
.inner-node{
    margin-inline-start: 1.2rem;
}
</style>

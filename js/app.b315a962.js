(function(e){function t(t){for(var r,i,o=t[0],s=t[1],u=t[2],l=0,d=[];l<o.length;l++)i=o[l],Object.prototype.hasOwnProperty.call(c,i)&&c[i]&&d.push(c[i][0]),c[i]=0;for(r in s)Object.prototype.hasOwnProperty.call(s,r)&&(e[r]=s[r]);p&&p(t);while(d.length)d.shift()();return a.push.apply(a,u||[]),n()}function n(){for(var e,t=0;t<a.length;t++){for(var n=a[t],r=!0,o=1;o<n.length;o++){var s=n[o];0!==c[s]&&(r=!1)}r&&(a.splice(t--,1),e=i(i.s=n[0]))}return e}var r={},c={app:0},a=[];function i(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=e,i.c=r,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)i.d(n,r,function(t){return e[t]}.bind(null,r));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="/Vue-Rxjs-npm-queries/";var o=window["webpackJsonp"]=window["webpackJsonp"]||[],s=o.push.bind(o);o.push=t,o=o.slice();for(var u=0;u<o.length;u++)t(o[u]);var p=s;a.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"034f":function(e,t,n){"use strict";var r=n("85ec"),c=n.n(r);c.a},"56d7":function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var r=n("2b0e"),c=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("div",[n("input",{directives:[{name:"model",rawName:"v-model",value:e.term,expression:"term"}],staticClass:"search-package",attrs:{autofocus:"",placeholder:"express"},domProps:{value:e.term},on:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.doSearch(t)},input:function(t){t.target.composing||(e.term=t.target.value)}}}),n("button",{directives:[{name:"stream",rawName:"v-stream:click",value:e.click$,expression:"click$",arg:"click"}],staticClass:"blue",attrs:{disabled:e.pending$}},[e._v(e._s(e.buttonText$||"Go"))]),n("button",{directives:[{name:"stream",rawName:"v-stream:click",value:e.cancelClick$,expression:"cancelClick$",arg:"click"}],staticClass:"light"},[e._v("Cancel")])]),e.pending$?n("div",{staticClass:"loader-container"},[e._m(0)]):e._e(),n("h1",[e._v(" "+e._s(e.name$)+" "),n("sup",[e._v(e._s(e.version$))])]),!e.dependencies$&&e.description$?n("p",[e._v(e._s(e.description$))]):e._e(),n("ul",{staticClass:"tree"},e._l(e.dependencies$,(function(t,r){return n("li",{directives:[{name:"stream",rawName:"v-stream:click",value:{subject:e.click$,data:{name:r,version:t}},expression:"{ subject: click$, data: {name,version} }",arg:"click"}],key:r},[e._v(" "+e._s(r)+" "),n("sup",[e._v(e._s(t))])])})),0)])},a=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"lds-facebook"},[n("div"),n("div"),n("div")])}],i=(n("99af"),n("498a"),n("3835")),o=n("5b40"),s=n("808d"),u=n("d3fb"),p=n("cebb"),l=n("17f5"),d=n("a748"),f=n("1585"),b=n("d792"),v=n("5670"),m=n("6863"),j=n("c4cc"),O=n("4b59"),g=n("e95d"),h=n("9f2d"),$=n("f59d"),k=n("373b"),y=n("a744"),_=n("ebb6"),w=(n("7db0"),n("b0c0"),n("ac1f"),n("841c"),n("1276"),function(e){var t,n;if("string"===typeof e){var r=e.split(" "),c=Object(i["a"])(r,2);t=c[0],n=c[1]}else t=e.name,n=e.version;if(t=t.trim(),n){n=n.trim();var a=function(e){return["@","~","\\^"].find((function(t){return e.search(t)>-1}))},o=a(n)?1:0;n=n.substr(o),"."===n.substr(0,1)&&(n="0"+n)}else n="latest";return[t,n]}),x=w,C={name:"App",domStreams:["click$","cancelClick$"],data:function(){return{term:""}},methods:{createToast:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"is-info",n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"is-top",r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:3e3;this.$buefy.toast.open({duration:r,message:e,position:n,type:t})}},subscriptions:function(){var e=this,t="https://cors-anywhere.herokuapp.com/",n="https://registry.npmjs.org/",r=function(t){return Object(o["a"])(Object(s["a"])(4e3),Object(u["a"])(e.$http.get(t)).pipe(Object(f["a"])("data")))},c={},a=function(e){var a=x(e),o=Object(i["a"])(a,2),s=o[0],u=o[1],p=s+"-"+u;return c[p]?c[p]:c[p]=r("".concat(t).concat(n).concat(encodeURIComponent(s),"/").concat(encodeURIComponent(u)))},w=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:e.$data.term;return Object(p["a"])(t)?t.pipe(Object(b["a"])((function(e){return a({data:e})}))):a(t)},C=this.$watchAsObservable("term").pipe(Object(f["a"])("newValue"),Object(v["a"])((function(e){return""!==e.trim()}))),S=this.$fromDOMEvent("input","keyup").pipe(Object(v["a"])((function(e){return"Escape"===e.code})),Object(v["a"])((function(t){return""!==e.$data.term.trim()})),Object(m["a"])((function(e){return Object(l["a"])(!0)})),Object(v["a"])((function(e){return V})),Object(j["a"])((function(t){return e.createToast("operation canceled")}))),P=this.cancelClick$.pipe(Object(m["a"])((function(e){return Object(l["a"])(!0)}))),T=Object(d["a"])(P,S).pipe(Object(j["a"])((function(e){return console.log("canceled")}))).pipe(Object(O["a"])()),N=this.$createObservableMethod("doSearch").pipe(Object(m["a"])((function(e){return Object(l["a"])(!0)}))),E="something went wrong",M=Object(d["a"])(this.click$,N).pipe(Object(v["a"])((function(t){return""!==e.$data.term.trim()})),Object(j["a"])((function(e){return console.log("searching ...")})),Object(f["a"])("data"),Object(g["a"])((function(e){return w(e)})),Object(h["a"])(T),Object($["a"])((function(t,n){return console.error(t),e.cancelClick$.next(!0),e.createToast(E,"is-danger","is-top",3500),n}))).pipe(Object(O["a"])(),Object(k["a"])()),A=M.pipe(Object(f["a"])("name")),R=M.pipe(Object(f["a"])("version")),q=M.pipe(Object(f["a"])("dependencies")),G=M.pipe(Object(f["a"])("description")),V=Object(d["a"])(this.click$.pipe(Object(m["a"])(!0)),N.pipe(Object(m["a"])(!0)),T.pipe(Object(m["a"])(!1)),M.pipe(Object(m["a"])(!1),Object(y["a"])(!1))),F=V.pipe(Object(_["a"])((function(e){return e?"Loading":"Go"})),Object(y["a"])("Go"));return{name$:A,version$:R,dependencies$:q,description$:G,pending$:V,buttonText$:F,term$:C,enter$:N}}},S=C,P=(n("034f"),n("2877")),T=Object(P["a"])(S,c,a,!1,null,null,null),N=T.exports,E=n("ce19"),M=n("bc3a"),A=n.n(M),R=n("a7fe"),q=n.n(R),G=(n("5abe"),n("aced")),V=n("9483");Object(V["a"])("".concat("/Vue-Rxjs-npm-queries/","service-worker.js"),{ready:function(){console.log("App is being served from cache by a service worker.\nFor more details, visit https://goo.gl/AFskqB")},registered:function(){console.log("Service worker has been registered.")},cached:function(){console.log("Content has been cached for offline use.")},updatefound:function(){console.log("New content is downloading.")},updated:function(){console.log("New content is available; please refresh.")},offline:function(){console.log("No internet connection found. App is running in offline mode.")},error:function(e){console.error("Error during service worker registration:",e)}}),r["a"].use(E["a"]),r["a"].use(q.a,A.a),r["a"].use(G["a"]),r["a"].config.productionTip=!1,new r["a"]({render:function(e){return e(N)}}).$mount("#app")},"85ec":function(e,t,n){}});
//# sourceMappingURL=app.b315a962.js.map
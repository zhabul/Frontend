(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{ROR4:function(n,l,t){"use strict";t.r(l);var e=t("CcnG"),u=t("f8S0").a,r=function(){return function(){}}(),o=t("pMnS"),a=function(){function n(){}return n.prototype.transform=function(n){for(var l="",t=n.length-1;t>=0;t--)l+=n.charAt(t);return l},n}(),i=function(){function n(){}return n.prototype.transform=function(n){return n.substring(7)},n}(),s=t("Ip0R"),b=t("t/Na"),c=t("LOCc"),p=function(){function n(n){this.http=n,this.getAllUrl=c.a+"api/generals/list",this.getGeneralUrl=c.a+"api/generals/get"}return n.prototype.getGenerals=function(){var n=new b.g;return n.append("X-Requested-With","XMLHttpRequest"),n.append("Content-Type","application/x-www-form-urlencoded"),this.http.get(this.getAllUrl,{headers:n}).toPromise().then(function(n){return n.status?n.data:[]}).catch(function(n){return[]})},n.prototype.getGeneral=function(n){var l=new b.g;return l.append("X-Requested-With","XMLHttpRequest"),l.append("Content-Type","application/x-www-form-urlencoded"),this.http.get(this.getGeneralUrl+"/"+n,{headers:l}).toPromise().then(function(n){return n.status?n.data:null})},n.ngInjectableDef=e.S({factory:function(){return new n(e.W(b.c))},token:n,providedIn:"root"}),n}(),f=function(){function n(n,l,t){this.route=n,this.router=l,this.generalsService=t}return n.prototype.ngOnInit=function(){this.generals=this.route.snapshot.data.generals},n}(),h=t("ZYCi"),g=e.nb({encapsulation:0,styles:[[""]],data:{}});function d(n){return e.Hb(0,[(n()(),e.pb(0,0,null,null,7,"tr",[],null,null,null,null,null)),(n()(),e.pb(1,0,null,null,4,"th",[["class",""]],null,null,null,null,null)),(n()(),e.Fb(2,null,["Company ",""])),e.Bb(3,1),e.Bb(4,1),e.Bb(5,1),(n()(),e.pb(6,0,null,null,1,"td",[],null,null,null,null,null)),(n()(),e.Fb(7,null,["",""]))],null,function(n,l){var t=e.Gb(l,2,0,n(l,5,0,e.yb(l.parent,0),e.Gb(l,2,0,n(l,4,0,e.yb(l.parent,0),e.Gb(l,2,0,n(l,3,0,e.yb(l.parent,1),l.context.$implicit.key))))));n(l,2,0,t),n(l,7,0,l.context.$implicit.value)})}function x(n){return e.Hb(0,[e.zb(0,a,[]),e.zb(0,i,[]),(n()(),e.pb(2,0,null,null,1,"h1",[["class","h4 pb-4"]],null,null,null,null,null)),(n()(),e.Fb(-1,null,["Our Company Details"])),(n()(),e.pb(4,0,null,null,3,"table",[["class","table table-responsiveX table-darkX table-striped"]],null,null,null,null,null)),(n()(),e.pb(5,0,null,null,2,"tbody",[],null,null,null,null,null)),(n()(),e.gb(16777216,null,null,1,null,d)),e.ob(7,278528,null,0,s.i,[e.O,e.L,e.s],{ngForOf:[0,"ngForOf"]},null)],function(n,l){n(l,7,0,l.component.generals)},null)}function v(n){return e.Hb(0,[(n()(),e.pb(0,0,null,null,1,"app-generals",[],null,null,null,x,g)),e.ob(1,114688,null,0,f,[h.a,h.o,p],null,null)],function(n,l){n(l,1,0)},null)}var y=e.lb("app-generals",f,v,{},{},[]),m=function(){function n(n){this.generalsService=n}return n.prototype.resolve=function(n,l){return this.generalsService.getGenerals().then(function(n){return n})},n}(),w=t("gIcY"),G=t("A7o+"),k=function(){return function(){}}();t.d(l,"GeneralsModuleNgFactory",function(){return C});var C=e.mb(r,[],function(n){return e.wb([e.xb(512,e.j,e.bb,[[8,[o.a,y]],[3,e.j],e.x]),e.xb(4608,s.l,s.k,[e.u,[2,s.r]]),e.xb(4608,m,m,[p]),e.xb(4608,w.v,w.v,[]),e.xb(4608,w.e,w.e,[]),e.xb(5120,G.f,u,[b.c]),e.xb(4608,G.c,G.e,[]),e.xb(4608,G.h,G.d,[]),e.xb(4608,G.b,G.a,[]),e.xb(4608,G.j,G.j,[G.k,G.f,G.c,G.h,G.b,G.l,G.m]),e.xb(1073742336,s.b,s.b,[]),e.xb(1073742336,G.g,G.g,[]),e.xb(1073742336,h.s,h.s,[[2,h.y],[2,h.o]]),e.xb(1073742336,k,k,[]),e.xb(1073742336,w.t,w.t,[]),e.xb(1073742336,w.h,w.h,[]),e.xb(1073742336,w.r,w.r,[]),e.xb(1073742336,r,r,[]),e.xb(1024,h.m,function(){return[[{path:"",component:f,resolve:{generals:m}}]]},[]),e.xb(256,G.m,void 0,[]),e.xb(256,G.l,void 0,[])])})}}]);
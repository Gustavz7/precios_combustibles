import{a as b}from"./chunk-XZ7UKLFH.js";import{a as S,b as C,c as w,d as y,e as i,f as _,g as h,h as N,i as F}from"./chunk-P5XTB4AY.js";import"./chunk-Z5FMLEE7.js";import{$a as g,Ja as l,Oa as n,Pa as p,Qa as f,Sa as c,X as a,Z as m,bb as d,d as s,eb as v,va as u}from"./chunk-YCCRMIHD.js";var A=(()=>{let e=class e{constructor(){this.loginService=a(b),this.login_status="",this.register_form=new y({username:new i(""),email:new i(""),password:new i("")})}onSubmitRegister(){return s(this,null,function*(){this.login_status=yield this.loginService.doRegister(this.register_form.value)})}};e.\u0275fac=function(t){return new(t||e)},e.\u0275cmp=m({type:e,selectors:[["app-register"]],standalone:!0,features:[v],decls:7,vars:2,consts:[[3,"ngSubmit","formGroup"],[1,""],["type","text","formControlName","username"],["type","email","formControlName","email"],["type","password","formControlName","password"],["type","submit","value","enviar"]],template:function(t,r){t&1&&(n(0,"form",0),c("ngSubmit",function(){return r.onSubmitRegister()}),n(1,"div",1),f(2,"input",2)(3,"input",3)(4,"input",4)(5,"input",5),g(6),p()()),t&2&&(l("formGroup",r.register_form),u(6),d(" logins status=",r.login_status," "))},dependencies:[F,_,S,C,w,h,N]});let o=e;return o})();export{A as RegisterComponent};
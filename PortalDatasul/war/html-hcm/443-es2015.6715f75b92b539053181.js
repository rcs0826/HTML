"use strict";(self.webpackChunkportal_meu_rh=self.webpackChunkportal_meu_rh||[]).push([[443],{19155:function(e,i,o){o.d(i,{v:function(){return t}});var t=(()=>{return(e=t||(t={})).OriginEnum={Clock:"clock",Manual:"manual",Automatic:"automatic",Empty:"empty",Geolocation:"geolocation"},e.DirectionEnum={Entry:"entry",Exit:"exit",Independ:"independ"},t;var e})()},18443:function(e,i,o){o.r(i),o.d(i,{ClockingRegisterModule:function(){return F}});var t=o(38583),n=o(56365),s=o(95987),r=o(51110),l=o(64762),a=o(44956),c=o(92340),g=o(19155),p=o(66163),d=o(81483),u=o(18494),m=o(81059),h=o(40469),f=o(97983),b=o(36227),k=o(74504),w=o(97394),v=o(37716),x=o(84479),y=o(96054),M=o(65241),C=o(36812),R=o(3679),Z=o(57706),q=o(20307),V=o(32268),A=o(29790);const T=["clockingRegisterForm"];function D(e,i){if(1&e&&v._UZ(0,"app-card-employee",27),2&e){const e=v.oxw();v.Q6J("image",e.employeeData.image)("name",null==e.employeeData||null==e.employeeData.employee?null:e.employeeData.employee.name)("role",null==e.employeeData||null==e.employeeData.employee?null:e.employeeData.employee.roleDescription)("status",null==e.employeeData||null==e.employeeData.employee?null:e.employeeData.employee.employeeStatus)}}function I(e,i){if(1&e){const e=v.EpF();v.TgZ(0,"po-input",28),v.NdJ("ngModelChange",function(i){return v.CHM(e),v.oxw().clockingRegisterView.hour.value=i}),v.ALo(1,"translate"),v.qZA()}if(2&e){const e=v.oxw();v.s9C("p-label",v.lcZ(1,4,"l-hour")),v.Q6J("ngModel",e.clockingRegisterView.hour.value)("p-required",!0)("p-disabled",!e.clockingRegisterView.hour.editable)}}function J(e,i){if(1&e){const e=v.EpF();v.TgZ(0,"po-radio-group",32),v.NdJ("ngModelChange",function(i){return v.CHM(e),v.oxw(2).clockingRegisterView.direction.value=i}),v.qZA()}if(2&e){const e=v.oxw(2);v.Q6J("ngModel",e.clockingRegisterView.direction.value)("p-disabled",!e.clockingRegisterView.direction.editable)("p-options",e.direction)}}function O(e,i){if(1&e){const e=v.EpF();v.TgZ(0,"po-radio-group",33),v.NdJ("ngModelChange",function(i){return v.CHM(e),v.oxw(2).clockingRegisterView.direction.value=i}),v.qZA()}if(2&e){const e=v.oxw(2);v.Q6J("ngModel",e.clockingRegisterView.direction.value)("p-disabled",!e.clockingRegisterView.direction.editable)("p-options",e.direction)}}function _(e,i){if(1&e&&(v.TgZ(0,"span",29),v.YNc(1,J,1,3,"po-radio-group",30),v.YNc(2,O,1,3,"po-radio-group",31),v.qZA()),2&e){const e=v.oxw();v.xp6(1),v.Q6J("ngIf",e.clockingRegisterView.direction.visible&&!e.clockingRegisterView.direction.required),v.xp6(1),v.Q6J("ngIf",e.clockingRegisterView.direction.visible&&e.clockingRegisterView.direction.required)}}function P(e,i){if(1&e){const e=v.EpF();v.TgZ(0,"po-select",34),v.NdJ("ngModelChange",function(i){return v.CHM(e),v.oxw().clockingRegisterView.reason.value=i}),v.ALo(1,"translate"),v.ALo(2,"translate"),v.qZA()}if(2&e){const e=v.oxw();v.s9C("p-label",v.lcZ(1,5,"l-reason")),v.s9C("p-placeholder",v.lcZ(2,7,"l-select-reason")),v.Q6J("ngModel",e.clockingRegisterView.reason.value)("p-options",e.reasons)("p-disabled",!e.clockingRegisterView.reason.editable)}}function S(e,i){if(1&e){const e=v.EpF();v.TgZ(0,"po-select",35),v.NdJ("ngModelChange",function(i){return v.CHM(e),v.oxw().clockingRegisterView.reason.value=i}),v.ALo(1,"translate"),v.ALo(2,"translate"),v.qZA()}if(2&e){const e=v.oxw();v.s9C("p-label",v.lcZ(1,6,"l-reason")),v.s9C("p-placeholder",v.lcZ(2,8,"l-select-reason")),v.Q6J("ngModel",e.clockingRegisterView.reason.value)("p-required",!0)("p-options",e.reasons)("p-disabled",!e.clockingRegisterView.reason.editable)}}function N(e,i){if(1&e){const e=v.EpF();v.TgZ(0,"div",3),v.TgZ(1,"po-textarea",36),v.NdJ("ngModelChange",function(i){return v.CHM(e),v.oxw().clockingRegisterView.justify.value=i})("p-change",function(){return v.CHM(e),v.oxw().validateJustify()}),v.ALo(2,"translate"),v.qZA(),v.qZA()}if(2&e){const e=v.oxw();v.xp6(1),v.s9C("p-label",v.lcZ(2,4,"l-justification")),v.Q6J("ngModel",e.clockingRegisterView.justify.value)("p-required",e.clockingRegisterView.justify.required)("p-disabled",!e.clockingRegisterView.justify.editable)}}const E=[{path:":referenceDate",component:(()=>{class e extends m.R{constructor(e,i,o,t,n,s,r,l,a){super(),this.route=e,this.windowUtilService=i,this.menuApplicationService=o,this.notificationService=t,this.appTranslateService=n,this.clockingRegisterService=s,this.fieldPropertiesService=r,this.profileService=l,this.imageService=a,this.pageName="clockingRegister",this.clockingConfirmed=!1,this.viewIsMobile=!1,this.viewIsTeamManagement=!1,this.clockingRegisterView=new w.A,this.reasons=[]}ngOnInit(){super.ngOnInit(),this.appTranslateService.getI18n(["l-entry","l-output"]).then(e=>{this.direction=[{label:e["l-entry"],value:"entry"},{label:e["l-output"],value:"exit"}]}),this.hideMenu(),this.windowUtilService.scrollToTop(),this.route.params.subscribe(e=>{const i=Number.parseFloat(e.referenceDate);this.referenceDate=new Date(i),this.referenceDate||(console.error("Invalid date: "+this.referenceDate),this.windowUtilService.back())}),this.getFieldProps(),this.getClockingReasonTypes(),this.dealWithQueryParams()}ngOnDestroy(){this.showMenu(),this.queryParamsSubscription&&this.queryParamsSubscription.unsubscribe()}getFieldProps(){this.fieldPropertiesService.getFieldProperties(this.pageName).then(e=>{e.forEach(e=>{switch(e.field){case"hour":this.clockingRegisterView.hour.editable=e.editable,this.clockingRegisterView.hour.required=e.required,this.clockingRegisterView.hour.visible=e.visible;break;case"justify":this.clockingRegisterView.justify.editable=e.editable,this.clockingRegisterView.justify.required=e.required,this.clockingRegisterView.justify.visible=e.visible;break;case"direction":this.clockingRegisterView.direction.editable=e.editable,this.clockingRegisterView.direction.required=e.required,this.clockingRegisterView.direction.visible=e.visible;break;case"reason":this.clockingRegisterView.reason.editable=e.editable,this.clockingRegisterView.reason.required=e.required,this.clockingRegisterView.reason.visible=e.visible}})})}hideMenu(){this.menuApplicationService.hideMenu()}showMenu(){this.menuApplicationService.showMenu()}getClockingReasonTypes(){this.clockingRegisterService.getClockingReasonTypes().then(e=>{this.clockingRegisterView.reason.required||e.length>0&&this.getLabelReasonForNotRequired(),this.resetFormStatus(),e.forEach(e=>{this.reasons.push({label:e.description,value:e.id})})})}getLabelReasonForNotRequired(){this.appTranslateService.getI18n("l-select-reason").then(e=>{this.reasons.push({label:e,value:void 0})})}parseReasonViewToObject(e){const i=this.reasons.find(i=>i.value===e);if(i)return{id:e,description:i.label}}confirmed(){if(this.validateHour()){const e=this.createClockingObject();this.clockingRegisterService.saveClocking(this.employeeId,e).then(()=>{this.resetFormStatus(),this.clockingConfirmed=!0})}}closeDialog(){this.showMenu(),this.windowUtilService.back()}validateJustify(){if(this.clockingRegisterView.justify.value&&""===this.clockingRegisterView.justify.value.trim())return this.clockingRegisterView.justify.value=""}createClockingObject(){return{date:this.referenceDate,direction:this.clockingRegisterView.direction.value,hour:d.Em.getTotalMilliseconds(this.clockingRegisterView.hour.value),referenceDate:this.referenceDate,justify:this.clockingRegisterView.justify.value,reason:this.parseReasonViewToObject(this.clockingRegisterView.reason.value),origin:g.v.OriginEnum.Manual}}validateHour(){return!(Number(this.clockingRegisterView.hour.value.replace(":",""))>2359&&(this.appTranslateService.getI18n("m-endHourInvalid").then(e=>{this.notificationService.showNotification(e,a.ik9.Error)}),1))}newClocking(){this.clockingConfirmed=!1,this.resetFormStatus()}resetFormStatus(){this.clockingRegisterView.reason.value=void 0,this.clockingRegisterForm.resetForm()}dealWithQueryParams(){this.queryParamsSubscription=this.route.queryParams.subscribe(e=>{e.employeeId?(this.employeeId=e.employeeId,this.viewIsTeamManagement=!0,this.getEmployeeData()):(this.employeeId=c.N.loggedUser,this.viewIsTeamManagement=!1,this.employeeData=null)})}getEmployeeData(){return(0,l.mG)(this,void 0,void 0,function*(){const e=yield this.profileService.getEmployeeSummary(this.employeeId);this.employeeData=new p.J,this.employeeData.employee=e,this.imageService.getImageStyle(this.employeeId).subscribe(e=>this.employeeData.image=e)})}}return e.\u0275fac=function(i){return new(i||e)(v.Y36(s.gz),v.Y36(x.g),v.Y36(h.Kv),v.Y36(y.g),v.Y36(M.g),v.Y36(k._),v.Y36(b.c),v.Y36(f.H),v.Y36(u.A))},e.\u0275cmp=v.Xpm({type:e,selectors:[["app-clocking-register"]],viewQuery:function(e,i){if(1&e&&v.Gf(T,5),2&e){let e;v.iGM(e=v.CRH())&&(i.clockingRegisterForm=e.first)}},features:[v.qOj],decls:38,vars:24,consts:[["pageTitle","l-include-clocking",3,"backIsVisible"],[1,"po-row"],["class","po-sm-12 po-md-12 po-lg-12 po-xl-12",3,"image","name","role","status",4,"ngIf"],[1,"po-sm-12","po-md-12","po-lg-12","po-xl-12"],[1,"panel","panel-default-box-shadow","total-height"],["clockingRegisterForm","ngForm"],[1,"panel-body"],[1,"featured","po-sm-12","po-md-12","po-lg-12","po-xl-12","panel-item-group"],[1,"day"],[1,"week-day"],[1,"po-sm-12","po-md-4","po-lg-6","po-xl-6","panel-item-group"],["id","txt-hour","name","hour","class","po-sm-12 hour-input","p-placeholder","00:00","p-mask","99:99","p-mask-format-model","true","p-pattern","^(2[0-3]|[01][0-9]):([0-5][0-9])$","p-maxlength","5",3,"ngModel","p-label","p-required","p-disabled","ngModelChange",4,"ngIf"],["class","po-sm-12 po-md-8 po-lg-6 po-xl-6 panel-item-group radio-form-align",4,"ngIf"],[1,"po-sm-12","po-md-12","po-lg-8","po-xl-8","panel-item-group"],["id","sel-reason","name","reason","class","po-sm-12 po-md-12 po-lg-12 po-xl-12",3,"ngModel","p-options","p-disabled","p-label","p-placeholder","ngModelChange",4,"ngIf"],["id","sel-reason","name","reason","class","po-sm-12 po-md-12 po-lg-12 po-xl-12",3,"ngModel","p-required","p-options","p-disabled","p-label","p-placeholder","ngModelChange",4,"ngIf"],["class","po-sm-12 po-md-12 po-lg-12 po-xl-12",4,"ngIf"],[1,"po-sm-12","po-md-12","po-lg-12","po-xl-12","panel-item-group","save-button-position"],["id","btn-po-button-save","p-primary","true",1,"btn-po-button","save-button-position",3,"p-disabled","p-label","p-click"],["id","comp-clocking-register-confirmed-dialog",3,"isVisible","closeDialogButtonEnable","closeDialogEvent"],["dialog-content","",1,"dialog-clocking-register-content"],[1,"text-center","message-clocking-register"],[1,"text-center"],["id","img-success",1,"clocking-register-image-success","mouse-pointer",3,"click"],["id","lbl-mensage-success",1,"mouse-pointer",3,"click"],[1,"text-center","new-clocking"],[1,"a-new-clocking-register","mouse-pointer","no-padding",3,"click"],[1,"po-sm-12","po-md-12","po-lg-12","po-xl-12",3,"image","name","role","status"],["id","txt-hour","name","hour","p-placeholder","00:00","p-mask","99:99","p-mask-format-model","true","p-pattern","^(2[0-3]|[01][0-9]):([0-5][0-9])$","p-maxlength","5",1,"po-sm-12","hour-input",3,"ngModel","p-label","p-required","p-disabled","ngModelChange"],[1,"po-sm-12","po-md-8","po-lg-6","po-xl-6","panel-item-group","radio-form-align"],["id","rdb-direction-clocking","name","directions","class","po-sm-12 po-md-12 po-lg-12 po-xl-12 po-radio-btn",3,"ngModel","p-disabled","p-options","ngModelChange",4,"ngIf"],["id","rdb-direction-clocking","name","directions","class","po-sm-12 po-md-12 po-lg-12 po-xl-12 po-radio-btn","p-required","",3,"ngModel","p-disabled","p-options","ngModelChange",4,"ngIf"],["id","rdb-direction-clocking","name","directions",1,"po-sm-12","po-md-12","po-lg-12","po-xl-12","po-radio-btn",3,"ngModel","p-disabled","p-options","ngModelChange"],["id","rdb-direction-clocking","name","directions","p-required","",1,"po-sm-12","po-md-12","po-lg-12","po-xl-12","po-radio-btn",3,"ngModel","p-disabled","p-options","ngModelChange"],["id","sel-reason","name","reason",1,"po-sm-12","po-md-12","po-lg-12","po-xl-12",3,"ngModel","p-options","p-disabled","p-label","p-placeholder","ngModelChange"],["id","sel-reason","name","reason",1,"po-sm-12","po-md-12","po-lg-12","po-xl-12",3,"ngModel","p-required","p-options","p-disabled","p-label","p-placeholder","ngModelChange"],["p-rows","3","id","txt-justify","name","justify",1,"po-sm-12","po-md-12","po-lg-12","po-xl-12",3,"p-label","ngModel","p-required","p-disabled","ngModelChange","p-change"]],template:function(e,i){if(1&e&&(v._UZ(0,"app-page-header",0),v.TgZ(1,"div",1),v.YNc(2,D,1,4,"app-card-employee",2),v.TgZ(3,"div",3),v.TgZ(4,"div",4),v.TgZ(5,"form",null,5),v.TgZ(7,"div",6),v.TgZ(8,"span",7),v.TgZ(9,"strong",8),v._uU(10),v.ALo(11,"utcDate"),v.qZA(),v.TgZ(12,"span",9),v._uU(13),v.ALo(14,"utcDate"),v.qZA(),v._UZ(15,"hr"),v.qZA(),v.TgZ(16,"span",10),v.YNc(17,I,2,6,"po-input",11),v.qZA(),v.YNc(18,_,3,2,"span",12),v.TgZ(19,"span",13),v.YNc(20,P,3,9,"po-select",14),v.YNc(21,S,3,10,"po-select",15),v.qZA(),v.YNc(22,N,3,6,"div",16),v.TgZ(23,"span",17),v.TgZ(24,"po-button",18),v.NdJ("p-click",function(){return i.confirmed()}),v.ALo(25,"translate"),v.qZA(),v.qZA(),v.qZA(),v.qZA(),v.qZA(),v.qZA(),v.qZA(),v.TgZ(26,"app-dialog",19),v.NdJ("closeDialogEvent",function(){return i.closeDialog()}),v.TgZ(27,"div",20),v.TgZ(28,"div",21),v.TgZ(29,"div",22),v.TgZ(30,"div",23),v.NdJ("click",function(){return i.closeDialog()}),v.qZA(),v.qZA(),v.TgZ(31,"strong"),v.TgZ(32,"h4",24),v.NdJ("click",function(){return i.closeDialog()}),v._uU(33,"Batida inserida com sucesso"),v.qZA(),v.qZA(),v.qZA(),v.TgZ(34,"div",25),v.TgZ(35,"a",26),v.NdJ("click",function(){return i.newClocking()}),v._uU(36),v.ALo(37,"translate"),v.qZA(),v.qZA(),v.qZA(),v.qZA()),2&e){const e=v.MAs(6);v.Q6J("backIsVisible",!0),v.xp6(2),v.Q6J("ngIf",null==i.employeeData?null:i.employeeData.employee),v.xp6(8),v.Oqu(v.xi3(11,14,i.referenceDate,"dd MMM yyyy")),v.xp6(3),v.Oqu(v.xi3(14,17,i.referenceDate,"EEEE")),v.xp6(4),v.Q6J("ngIf",i.clockingRegisterView.hour.visible),v.xp6(1),v.Q6J("ngIf",i.clockingRegisterView.direction.visible),v.xp6(2),v.Q6J("ngIf",i.clockingRegisterView.reason.visible&&!i.clockingRegisterView.reason.required),v.xp6(1),v.Q6J("ngIf",i.clockingRegisterView.reason.visible&&i.clockingRegisterView.reason.required),v.xp6(1),v.Q6J("ngIf",i.clockingRegisterView.justify.visible),v.xp6(2),v.s9C("p-label",v.lcZ(25,20,"l-confirm")),v.Q6J("p-disabled",!e.form.valid),v.xp6(2),v.Q6J("isVisible",i.clockingConfirmed)("closeDialogButtonEnable",!0),v.xp6(10),v.hij(" ",v.lcZ(37,22,"l-request-new-clocking-register"),"")}},directives:[C.q,t.O5,R._Y,R.JL,R.F,a.bOz,Z.a,q.x,a.xxV,R.JJ,R.On,a.pYk,a.C9q,a.gJm],pipes:[V.$,A.X$],styles:[".day[_ngcontent-%COMP%]{color:#28303e;float:left;margin-right:10px}.week-day[_ngcontent-%COMP%]{color:#9da7a9;margin-bottom:0;margin-top:0}.po-radio-btn[_ngcontent-%COMP%]{margin-top:-15px}.min-height-header-divider[_ngcontent-%COMP%]{min-height:500px}.message-clocking-register[_ngcontent-%COMP%]{position:fixed;left:50%;top:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.titleInput[_ngcontent-%COMP%]{font-weight:bold}.btn-po-button[_ngcontent-%COMP%]{margin-right:8px}[_nghost-%COMP%]     #rdb-direction-clocking label{font-family:NunitoSans-bold}.clocking-register-image-success[_ngcontent-%COMP%]{background:url(success.8b4116fbb4d6691356b7.png) no-repeat center;width:100%;height:64px;margin-bottom:20px}.summary-period-occurrences[_ngcontent-%COMP%]{height:calc(100vh - 16px);overflow:auto;padding-bottom:15px}.new-clocking[_ngcontent-%COMP%]{box-shadow:inset 0 2px #dbdedf;position:fixed;padding:6%;bottom:0px;left:0px;width:100%}.hour-input[_ngcontent-%COMP%]{margin-top:0}.radio-form-align[_ngcontent-%COMP%]{padding-top:40px}.save-button-position[_ngcontent-%COMP%]{margin-top:16px}.featured[_ngcontent-%COMP%]{font-size:20px;margin-left:8px;padding-right:24px}.a-new-clocking-register[_ngcontent-%COMP%]{font-size:18px;color:#0c9abe;font-weight:bold}.avatar-align[_ngcontent-%COMP%]{margin-left:5px}.avatar-small[_ngcontent-%COMP%]{width:42px;height:42px}.aboutEmployee[_ngcontent-%COMP%]{padding-left:55px}@media only screen and (max-width: 480px){.radio-form-align[_ngcontent-%COMP%]{padding-top:unset}}@media only screen and (-webkit-min-device-pixel-ratio: 2),only screen and (min--moz-device-pixel-ratio: 2),only screen and (-o-min-device-pixel-ratio: 2/1){.clocking-register-image-success[_ngcontent-%COMP%]{background:url(success@2x.3ef849f18cc8db5e719a.png) no-repeat center;width:100%;height:64px;background-size:contain}}@media (min-width: 961px){.dialog-clocking-register-content[_ngcontent-%COMP%]{height:350px}.message-clocking-register[_ngcontent-%COMP%]{position:fixed;left:50%;top:40%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}}"]}),e})(),canActivate:[r.P]}];let j=(()=>{class e{}return e.\u0275fac=function(i){return new(i||e)},e.\u0275mod=v.oAB({type:e}),e.\u0275inj=v.cJS({imports:[[s.Bz.forChild(E)],s.Bz]}),e})(),F=(()=>{class e{}return e.\u0275fac=function(i){return new(i||e)},e.\u0275mod=v.oAB({type:e}),e.\u0275inj=v.cJS({providers:[k._],imports:[[t.ez,j,n.q]]}),e})()},74504:function(e,i,o){o.d(i,{_:function(){return l}});var t=o(92340),n=o(59708),s=o(37716);const r="timesheet";let l=(()=>{class e{constructor(e){this.serviceGeneric=e}getClockingReasonTypes(){return this.serviceGeneric.get(`${r}/clockingsReasonTypes`).then(e=>e.items)}saveClocking(e=t.N.loggedUser,i){return this.serviceGeneric.post(`${r}/clocking/${e}`,i,!1)}}return e.\u0275fac=function(i){return new(i||e)(s.LFG(n.M))},e.\u0275prov=s.Yz7({token:e,factory:e.\u0275fac}),e})()},97394:function(e,i,o){o.d(i,{A:function(){return n}});var t=o(16898);class n{constructor(){this.hour=new t.f,this.direction=new t.f,this.reason=new t.f,this.justify=new t.f}}}}]);
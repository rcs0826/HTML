"use strict";(self.webpackChunkportal_meu_rh=self.webpackChunkportal_meu_rh||[]).push([[78],{73969:function(e,t,o){o.d(t,{P:function(){return g}});var i=o(37716),s=o(38583),n=o(82832),r=o(64762),a=o(44956),l=o(65241),p=o(29790);function c(e,t){if(1&e){const e=i.EpF();i.TgZ(0,"div"),i.TgZ(1,"span",7,8),i.NdJ("click",function(){return i.CHM(e),i.MAs(4).toggle()}),i.qZA(),i._UZ(3,"po-popup",9,10),i.qZA()}if(2&e){const e=i.MAs(2),t=i.oxw();i.xp6(3),i.Q6J("p-actions",t.popupActions)("p-target",e)}}function d(e,t){if(1&e&&(i.TgZ(0,"div",11),i.TgZ(1,"span",12),i.TgZ(2,"div",13),i._uU(3),i.ALo(4,"translate"),i.qZA(),i.TgZ(5,"div",14),i._uU(6),i.qZA(),i.qZA(),i.qZA()),2&e){const e=t.$implicit,o=i.oxw();i.xp6(1),i.Q6J("ngClass",o.getClass(e)),i.xp6(2),i.Oqu(i.lcZ(4,3,e.label)),i.xp6(3),i.Oqu(e.value)}}let m=(()=>{class e{constructor(e){this.appTranslateService=e,this.popupActions=[],this.removeTextKey="",this.removeInternalCardEvent=new i.vpe}ngOnInit(){this.initializeComponent()}getClass(e){return e.class}openModal(){this.modal.open()}deleteCard(){this.modal.close(),this.removeInternalCardEvent.emit(this.card.cardId)}initializeComponent(){return(0,r.mG)(this,void 0,void 0,function*(){yield this.initializePopupAction(),yield this.initializeModalAction()})}initializePopupAction(){return(0,r.mG)(this,void 0,void 0,function*(){this.popupActions=[{label:yield this.appTranslateService.getI18n("l-remove"),type:"default",action:this.openModal.bind(this)}]})}initializeModalAction(){return(0,r.mG)(this,void 0,void 0,function*(){this.cancelAction={action:()=>{this.modal.close()},label:yield this.appTranslateService.getI18n("l-cancel"),danger:!0},this.confirmAction={action:()=>{this.deleteCard()},label:yield this.appTranslateService.getI18n("l-yes")}})}}return e.\u0275fac=function(t){return new(t||e)(i.Y36(l.g))},e.\u0275cmp=i.Xpm({type:e,selectors:[["app-card-requested"]],viewQuery:function(e,t){if(1&e&&i.Gf(a.hmF,7),2&e){let e;i.iGM(e=i.CRH())&&(t.modal=e.first)}},inputs:{card:"card",removeTextKey:"removeTextKey"},outputs:{removeInternalCardEvent:"removeInternalCardEvent"},decls:11,vars:10,consts:[["card-header",""],[1,"po-sm-11","po-md-11","po-lg-11","po-xl-11","title-label"],[4,"ngIf"],["card-body","",4,"ngFor","ngForOf"],["p-size","sm","p-hide-close","true",3,"p-primary-action","p-secondary-action"],["modal",""],[1,"po-sm-11","po-md-11","po-lg-11","po-xl-11"],[1,"po-clickable","po-icon","po-icon-more","dropdown","see-more",3,"click"],["target",""],[3,"p-actions","p-target"],["popup",""],["card-body",""],[1,"po-mt-sm-1","po-mt-md-1","panel-item-group",3,"ngClass"],[1,"requested-label"],[1,"requested-value"]],template:function(e,t){1&e&&(i.TgZ(0,"div",0),i.TgZ(1,"h2",1),i._uU(2),i.ALo(3,"translate"),i.qZA(),i.YNc(4,c,5,2,"div",2),i.qZA(),i.YNc(5,d,7,5,"div",3),i.TgZ(6,"po-modal",4,5),i.TgZ(8,"div",6),i._uU(9),i.ALo(10,"translate"),i.qZA(),i.qZA()),2&e&&(i.xp6(2),i.hij(" ",i.lcZ(3,6,t.card.cardLabel)," "),i.xp6(2),i.Q6J("ngIf",t.card.canAlter),i.xp6(1),i.Q6J("ngForOf",t.card.cardItems),i.xp6(1),i.Q6J("p-primary-action",t.confirmAction)("p-secondary-action",t.cancelAction),i.xp6(3),i.hij(" ",i.lcZ(10,8,t.removeTextKey)," "))},directives:[s.O5,s.sg,a.hmF,a.TD5,s.mk],pipes:[p.X$],styles:['.dropdown[_ngcontent-%COMP%]{float:right}.see-more[_ngcontent-%COMP%]{font-size:20px;color:#0c9abe}[_nghost-%COMP%]     .po-modal-body{font-family:"Nunito Sans",sans-serif;font-size:16px;padding-left:5px}[_nghost-%COMP%]     .po-modal-header{padding:5px!important}[_nghost-%COMP%]     .po-modal-footer{padding:20px!important}[_nghost-%COMP%]     .po-modal-content{padding:0!important}@media screen and (min-width: 769px){[_nghost-%COMP%]     .po-modal-sm{width:25%}[_nghost-%COMP%]     .po-modal-body{margin-bottom:70px}}@media screen and (max-width: 480px){[_nghost-%COMP%]     .po-modal-body{margin-bottom:50px;padding-left:20px}[_nghost-%COMP%]     .po-modal-footer{padding:25px!important}}']}),e})();function u(e,t){if(1&e){const e=i.EpF();i.TgZ(0,"app-card",1),i.TgZ(1,"app-card-requested",2),i.NdJ("removeInternalCardEvent",function(t){return i.CHM(e),i.oxw().deleteCard(t)}),i.qZA(),i.qZA()}if(2&e){const e=t.$implicit,o=t.index,s=i.oxw();i.Q6J("ngClass",s.getCardClass(o)),i.xp6(1),i.Q6J("card",e)("removeTextKey",s.removeTextModal)}}let g=(()=>{class e{constructor(){this.removeTextModal="",this.removeCardEvent=new i.vpe}getCardClass(e){return 0===e?"po-xl-12 po-lg-12 po-md-12 po-sm-12":"po-mt-1 po-xl-12 po-lg-12 po-md-12 po-sm-12"}deleteCard(e){this.removeCardEvent.emit(e)}}return e.\u0275fac=function(t){return new(t||e)},e.\u0275cmp=i.Xpm({type:e,selectors:[["app-card-requested-list"]],inputs:{cards:"cards",removeTextModal:"removeTextModal"},outputs:{removeCardEvent:"removeCardEvent"},decls:1,vars:1,consts:[[3,"ngClass",4,"ngFor","ngForOf"],[3,"ngClass"],["card-header","",3,"card","removeTextKey","removeInternalCardEvent"]],template:function(e,t){1&e&&i.YNc(0,u,2,3,"app-card",0),2&e&&i.Q6J("ngForOf",t.cards)},directives:[s.sg,n.A,s.mk,m],styles:[""]}),e})()},86078:function(e,t,o){o.r(t),o.d(t,{OvertimeHoursModule:function(){return J}});var i=o(38583),s=o(56365),n=o(95987),r=o(51110),a=o(64762),l=o(81483),p=o(81059),c=o(97983),d=o(68014),m=o(59708),u=o(37716);let g=(()=>{class e{constructor(e){this.genericService=e}getOvertimeRequested(e){return this.genericService.get(`timesheet/overtimeHours/${e}`)}getHistory(e,t){const o=`timesheet/overtimeHours/history/${e}`,i=[];return this.genericService.parseParams(i,"page",t),this.genericService.parseParams(i,"pageSize",10),this.genericService.search(o,i)}deleteOvertimeRequested(e,t){return this.genericService.delete(`timesheet/overtimeHours/${e}/${t}`)}}return e.\u0275fac=function(t){return new(t||e)(u.LFG(m.M))},e.\u0275prov=u.Yz7({token:e,factory:e.\u0275fac,providedIn:"root"}),e})();var h=o(14833),v=o(65241),f=o(37503),y=o(36812),x=o(73969),b=(()=>((b||(b={})).StatusEnum={Approved:"approved",Reproved:"reproved",Approving:"approving"},b))(),C=o(90171),O=o(44956),Z=o(29790);function A(e,t){if(1&e&&(u.TgZ(0,"span"),u._UZ(1,"hr",11),u.TgZ(2,"div",12),u.TgZ(3,"span",13),u._uU(4),u.ALo(5,"translate"),u.qZA(),u.TgZ(6,"span",14),u._uU(7),u.qZA(),u.qZA(),u.qZA()),2&e){const e=t.$implicit;u.xp6(4),u.Oqu(u.lcZ(5,2,e.label)),u.xp6(3),u.Oqu(e.value)}}const M=function(e,t){return{circleBase:!0,type1:e,type2:t}};function w(e,t){if(1&e&&(u.TgZ(0,"mat-expansion-panel",null,6),u.TgZ(2,"mat-expansion-panel-header",7),u.TgZ(3,"mat-panel-title"),u.TgZ(4,"div",8),u._UZ(5,"div",9),u.TgZ(6,"div",10),u.TgZ(7,"span"),u._uU(8),u.qZA(),u.qZA(),u.qZA(),u.qZA(),u.qZA(),u.YNc(9,A,8,4,"span",3),u.qZA()),2&e){const e=t.$implicit,o=u.oxw(2);u.xp6(5),u.Q6J("ngClass",u.WLB(3,M,o.isApproved(e.status),!o.isApproved(e.status))),u.xp6(3),u.hij(" ",e.title," "),u.xp6(1),u.Q6J("ngForOf",e.content)}}function q(e,t){if(1&e){const e=u.EpF();u.TgZ(0,"po-button",15),u.NdJ("p-click",function(){return u.CHM(e),u.oxw(2).viewMoreHistory()}),u.ALo(1,"translate"),u.qZA()}2&e&&u.s9C("p-label",u.lcZ(1,1,"l-load-more"))}function T(e,t){if(1&e&&(u.TgZ(0,"div"),u.TgZ(1,"h2",1),u._uU(2),u.ALo(3,"translate"),u.qZA(),u.TgZ(4,"mat-accordion",2),u.YNc(5,w,10,6,"mat-expansion-panel",3),u.qZA(),u.TgZ(6,"div",4),u.YNc(7,q,2,3,"po-button",5),u.qZA(),u.qZA()),2&e){const e=u.oxw();u.xp6(2),u.Oqu(u.lcZ(3,3,e.titleLabel)),u.xp6(3),u.Q6J("ngForOf",e.history.items),u.xp6(2),u.Q6J("ngIf",e.history.hasNext)}}let _=(()=>{class e{constructor(){this.viewMore=new u.vpe}isApproved(e){return e.toLowerCase()===b.StatusEnum.Approved}viewMoreHistory(){this.viewMore.emit()}}return e.\u0275fac=function(t){return new(t||e)},e.\u0275cmp=u.Xpm({type:e,selectors:[["app-history"]],inputs:{titleLabel:"titleLabel",history:"history"},outputs:{viewMore:"viewMore"},decls:1,vars:1,consts:[[4,"ngIf"],[1,"po-mt-3","po-mb-2","latest-requests","po-sm-12","po-md-12","po-lg-12","po-xl-12"],[1,"po-sm-12","po-md-12","po-lg-12","po-xl-12"],[4,"ngFor","ngForOf"],[1,"po-row","po-table-footer-show-more"],["class","po-offset-xl-4 po-offset-lg-4 po-offset-md-3 po-lg-4 po-md-6",3,"p-label","p-click",4,"ngIf"],["dropdown",""],[1,"dropdown-history-header"],[1,"hide-overflow","po-row"],[1,"status-history",3,"ngClass"],[1,"ellipsis","text-history"],[1,"line"],[1,"historic-content"],[1,"historic-label"],[1,"historic-value"],[1,"po-offset-xl-4","po-offset-lg-4","po-offset-md-3","po-lg-4","po-md-6",3,"p-label","p-click"]],template:function(e,t){1&e&&u.YNc(0,T,8,5,"div",0),2&e&&u.Q6J("ngIf",t.history&&t.history.items&&t.history.items.length)},directives:[i.O5,C.pp,i.sg,C.ib,C.yz,C.yK,i.mk,O.bOz],pipes:[Z.X$],styles:[".dropdown-history-header[_ngcontent-%COMP%]{font-weight:bold;font-size:16px;color:#2b3639}.circleBase[_ngcontent-%COMP%]{border-radius:50%}.type1[_ngcontent-%COMP%]{display:inline-block;width:15px;height:15px;background:#00b28e}.color-base[_ngcontent-%COMP%]{color:#0c9abe}.historic-content[_ngcontent-%COMP%]{padding:0 24px}.historic-label-link[_ngcontent-%COMP%]{cursor:pointer;color:#0c9abe}.historic-label[_ngcontent-%COMP%]{font-weight:bold;color:#4a5c60}.status-history[_ngcontent-%COMP%]{margin-top:3px;float:left}.ellipsis[_ngcontent-%COMP%]{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.text-history[_ngcontent-%COMP%]{width:calc(100% - 43px);float:left;margin:0 10px}.mat-expansion-indicator[_ngcontent-%COMP%]{display:flex}.hide-overflow[_ngcontent-%COMP%]{overflow:hidden;white-space:nowrap}.historic-value[_ngcontent-%COMP%]{float:right;font-weight:bold;color:#2b3639}.mat-expansion-panel-header-title[_ngcontent-%COMP%]{width:100%}.mat-expansion-panel[_ngcontent-%COMP%]{box-shadow:0 2px 8px #e3e6f1!important;border-radius:6px;position:relative;background:#ffffff;display:flow-root;padding:0;margin-bottom:16px}.next-records[_ngcontent-%COMP%]{background-color:transparent;text-align:center;font-size:16px;font-weight:bold;line-height:3;color:#0c9abe;padding-bottom:20px;cursor:pointer}.type2[_ngcontent-%COMP%]{display:inline-block;width:15px;height:15px;background:#c64840}.right-align[_ngcontent-%COMP%]{position:relative;width:100%}.right-align[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{position:absolute;right:0}@media only screen and (-webkit-min-device-pixel-ratio: 2),only screen and (min--moz-device-pixel-ratio: 2),only screen and (-o-min-device-pixel-ratio: 2/1),only screen and (-webkit-min-device-pixel-ratio: 3),only screen and (min--moz-device-pixel-ratio: 3),only screen and (-o-min-device-pixel-ratio: 3/1){.right-align[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{top:10px;left:-5px}}"]}),e})();var P=o(20307);function H(e,t){if(1&e&&u._UZ(0,"app-card-employee",8),2&e){const e=u.oxw();u.Q6J("image",e.imageAvatar)("name",null==e.employeeData?null:e.employeeData.name)("role",null==e.employeeData?null:e.employeeData.roleDescription)("status",null==e.employeeData?null:e.employeeData.employeeStatus)}}function I(e,t){if(1&e){const e=u.EpF();u.TgZ(0,"po-button",9),u.NdJ("p-click",function(){return u.CHM(e),u.oxw().goToRequestOvertimeHours()}),u.ALo(1,"translate"),u.qZA()}2&e&&u.s9C("p-label",u.lcZ(1,1,"l-request-overtime-authorization"))}let S=(()=>{class e extends p.R{constructor(e,t,o,i,s,n,r,a){super(),this.overtimeHoursService=e,this.translate=t,this.router=o,this.permissionSelector=i,this.route=s,this.profile=n,this.globals=r,this.lastAccessService=a,this.pageHistory=1,this.viewIsTeamManagement=!1,this.histoyLabel="l-latest-requests",this.cards=[],this.removeTextKey="l-exclude-request",this.history={hasNext:!1,items:[]},this.routeSubsctiption=this.route.params.subscribe(e=>{this.id=e.id})}ngOnDestroy(){this.routeSubsctiption&&this.routeSubsctiption.unsubscribe(),this.permissionsSubscription&&this.permissionsSubscription.unsubscribe()}ngOnInit(){this.initialize()}initialize(){const e=Object.create(null,{ngOnInit:{get:()=>super.ngOnInit}});return(0,a.mG)(this,void 0,void 0,function*(){yield this.teamManagement(),this.getPermissions(),this.getOvertimeRequested(),this.getHistory(),this.setCountLastAccess(),e.ngOnInit.call(this)})}teamManagement(){return(0,a.mG)(this,void 0,void 0,function*(){if(this.id){const e=yield this.profile.getEmployeeSummary(this.id);this.employeeData=e;const t=yield this.profile.getImageBase64(this.id);this.viewIsTeamManagement=!0,t&&(this.imageAvatar=t.content)}})}getPermissions(){this.permissionsSubscription=this.permissionSelector.permissions$.subscribe(e=>{this.permissions=e,this.requestOvertimeHoursIsVisible=void 0!==this.permissions.requestOvertimeHours&&this.permissions.requestOvertimeHours})}getHistory(){return(0,a.mG)(this,void 0,void 0,function*(){const e=this.employeeData?this.employeeData.id:"{current}",t=yield this.overtimeHoursService.getHistory(e,this.pageHistory);this.pageHistory++,this.history.hasNext=t.hasNext;const o=yield this.translate.getI18n("l-overtime-authorization");t.items.forEach(e=>{this.history.items.push({status:e.status,title:`${l.Em.momentFormat(e.date)} - ${o} ${l.Em.getHoursByMilliseconds(e.init)} - ${l.Em.getHoursByMilliseconds(e.end)}`,content:[{label:"l-date",value:l.Em.momentFormat(e.date)},{label:"l-initial-hour",value:l.Em.getHoursByMilliseconds(e.init)},{label:"l-final-hour",value:l.Em.getHoursByMilliseconds(e.end)},{label:"l-type",value:e.type.label},{label:"l-status",value:e.statusLabel}]})})})}deleteOvertimeHour(e){return(0,a.mG)(this,void 0,void 0,function*(){yield this.overtimeHoursService.deleteOvertimeRequested(this.employeeData?this.employeeData.id:"{current}",e),this.cards=this.cards.filter(t=>t.cardId!==e)})}goToRequestOvertimeHours(){this.router.navigate(this.employeeData?["timesheet/requestOvertimeHours",this.employeeData.id]:["timesheet/requestOvertimeHours"])}setCountLastAccess(){this.globals.getEmployeeSummary().then(e=>{this.lastAccessService.setLastAccess(h.mw,e.id)})}getOvertimeRequested(){return(0,a.mG)(this,void 0,void 0,function*(){const e=this.employeeData?this.employeeData.id:"{current}";(yield this.overtimeHoursService.getOvertimeRequested(e)).items.forEach(e=>{this.cards.push({cardLabel:"l-overtime-requested",cardItems:[{label:"l-date",value:l.Em.momentFormat(e.date),class:"po-sm-6 po-md-2 po-lg-2 po-xl-2"},{label:"l-initial-hour",value:l.Em.getHoursByMilliseconds(e.init),class:"po-sm-6 po-md-2 po-lg-2 po-xl-2"},{label:"l-final-hour",value:l.Em.getHoursByMilliseconds(e.end),class:"po-sm-6 po-md-2 po-lg-2 po-xl-2"},{label:"l-type",value:e.type.label,class:"po-sm-6 po-md-2 po-lg-2 po-xl-2"},{label:"l-status",value:e.statusLabel,class:"po-sm-12 po-md-2 po-lg-2 po-xl-3"}],canAlter:e.canAlter,cardId:e.id})})})}}return e.\u0275fac=function(t){return new(t||e)(u.Y36(g),u.Y36(v.g),u.Y36(n.F0),u.Y36(d.eL),u.Y36(n.gz),u.Y36(c.H),u.Y36(f.O),u.Y36(h.Lx))},e.\u0275cmp=u.Xpm({type:e,selectors:[["app-overtime-hours"]],features:[u.qOj],decls:8,vars:7,consts:[[1,"overtime-hours"],[1,"po-row"],[1,"po-sm-12","po-md-12","po-lg-12","po-xl-12"],["pageTitle","im-overtime-hours",3,"backIsVisible"],["class","po-sm-12 po-md-12 po-lg-12 po-xl-12",3,"image","name","role","status",4,"ngIf"],["class","overtime-hours-btn po-mb-2 po-sm-12 po-md-12 po-lg-12 po-xl-12 block","p-primary","true","p-type","primary",3,"p-label","p-click",4,"ngIf"],[3,"cards","removeTextModal","removeCardEvent"],[3,"titleLabel","history","viewMore"],[1,"po-sm-12","po-md-12","po-lg-12","po-xl-12",3,"image","name","role","status"],["p-primary","true","p-type","primary",1,"overtime-hours-btn","po-mb-2","po-sm-12","po-md-12","po-lg-12","po-xl-12","block",3,"p-label","p-click"]],template:function(e,t){1&e&&(u.TgZ(0,"div",0),u.TgZ(1,"div",1),u.TgZ(2,"div",2),u._UZ(3,"app-page-header",3),u.qZA(),u.qZA(),u.YNc(4,H,1,4,"app-card-employee",4),u.YNc(5,I,2,3,"po-button",5),u.TgZ(6,"app-card-requested-list",6),u.NdJ("removeCardEvent",function(e){return t.deleteOvertimeHour(e)}),u.qZA(),u.TgZ(7,"app-history",7),u.NdJ("viewMore",function(){return t.getHistory()}),u.qZA(),u.qZA()),2&e&&(u.xp6(3),u.Q6J("backIsVisible",t.viewIsMobile||t.viewIsTeamManagement),u.xp6(1),u.Q6J("ngIf",t.employeeData),u.xp6(1),u.Q6J("ngIf",t.requestOvertimeHoursIsVisible),u.xp6(1),u.Q6J("cards",t.cards)("removeTextModal",t.removeTextKey),u.xp6(1),u.Q6J("titleLabel",t.histoyLabel)("history",t.history))},directives:[y.q,i.O5,x.P,_,P.x,O.bOz],pipes:[Z.X$],styles:[".overtime-hours-btn[_ngcontent-%COMP%]{padding-left:8px}[_nghost-%COMP%]     .card-well{margin-bottom:0}@media (min-width: 768px){.overtime-hours[_ngcontent-%COMP%]{padding:0 40px}}"]}),e})();const E=[{path:"",component:S,canActivate:[r.P]},{path:":id",component:S,canActivate:[r.P]}];let k=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=u.oAB({type:e}),e.\u0275inj=u.cJS({imports:[[n.Bz.forChild(E)],n.Bz]}),e})(),J=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=u.oAB({type:e}),e.\u0275inj=u.cJS({providers:[g],imports:[[i.ez,k,s.q]]}),e})()}}]);
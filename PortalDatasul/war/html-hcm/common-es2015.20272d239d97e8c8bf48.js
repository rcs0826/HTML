"use strict";(self.webpackChunkportal_meu_rh=self.webpackChunkportal_meu_rh||[]).push([[592],{86249:function(e,t,n){n.d(t,{w:function(){return b}});var o=n(37716),c=n(81483),i=n(81059),r=n(97185),l=n(84479),s=n(38583),a=n(57706),u=n(36812),g=n(32268),p=n(29790);function d(e,t){if(1&e&&(o.TgZ(0,"tr",16),o.TgZ(1,"td",17),o.TgZ(2,"span"),o.TgZ(3,"strong",18),o._uU(4),o.qZA(),o._UZ(5,"br"),o.TgZ(6,"span",19),o._uU(7),o.qZA(),o.qZA(),o.qZA(),o.TgZ(8,"td",20),o.TgZ(9,"span"),o.TgZ(10,"span",21),o._uU(11),o.qZA(),o.qZA(),o.qZA(),o.qZA()),2&e){const e=t.$implicit,n=o.oxw(3);o.xp6(4),o.Oqu(e.description),o.xp6(3),o.Oqu(n.getHoursFormmated(e.initHour,e.endHour)),o.xp6(4),o.Oqu(n.getHoursByMilliseconds(e.total))}}function m(e,t){if(1&e&&(o.TgZ(0,"tbody"),o.YNc(1,d,12,3,"tr",15),o.qZA()),2&e){const e=o.oxw(2);o.xp6(1),o.Q6J("ngForOf",e.occurrences.items)}}function Z(e,t){1&e&&(o.TgZ(0,"tbody"),o.TgZ(1,"tr"),o.TgZ(2,"td",22),o.TgZ(3,"strong",23),o._uU(4),o.ALo(5,"translate"),o.qZA(),o.qZA(),o.qZA(),o.qZA()),2&e&&(o.xp6(4),o.hij(" ",o.lcZ(5,1,"l-emptyOccurrence"),""))}function f(e,t){if(1&e){const e=o.EpF();o.TgZ(0,"app-dialog",2),o.NdJ("closeDialogEvent",function(){return o.CHM(e),o.oxw().closeDialog()}),o.TgZ(1,"div",3),o.TgZ(2,"app-page-header",4),o.NdJ("backFunction",function(){return o.CHM(e),o.oxw().closeDialog()}),o.TgZ(3,"span",5),o.TgZ(4,"strong",6),o._uU(5),o.ALo(6,"utcDate"),o.qZA(),o.TgZ(7,"span",7),o._uU(8),o.ALo(9,"utcDate"),o.qZA(),o.qZA(),o.qZA(),o.TgZ(10,"div",8),o.TgZ(11,"table",9),o.TgZ(12,"thead",10),o.TgZ(13,"tr",11),o.TgZ(14,"th",12),o.TgZ(15,"strong"),o._uU(16),o.ALo(17,"translate"),o.qZA(),o.qZA(),o.TgZ(18,"th",13),o.TgZ(19,"strong"),o._uU(20),o.ALo(21,"translate"),o.qZA(),o.qZA(),o.qZA(),o.qZA(),o.YNc(22,m,2,1,"tbody",14),o.YNc(23,Z,6,3,"tbody",14),o.qZA(),o.qZA(),o.qZA(),o.qZA()}if(2&e){const e=o.oxw();o.Q6J("isVisible",e.dialogIsVisible)("closeDialogButtonEnable",!e.viewIsMobile),o.xp6(5),o.Oqu(o.xi3(6,8,e.referenceDate,"dd/MM/yyyy")),o.xp6(3),o.Oqu(o.xi3(9,11,e.referenceDate,"EEEE")),o.xp6(8),o.Oqu(o.lcZ(17,14,"l-occurrence")),o.xp6(4),o.Oqu(o.lcZ(21,16,"total")),o.xp6(2),o.Q6J("ngIf",e.occurrencesHaveItems(e.occurrences)),o.xp6(1),o.Q6J("ngIf",!e.occurrencesHaveItems(e.occurrences))}}let b=(()=>{class e extends i.R{constructor(e,t){super(),this.occurrencesService=e,this.windowUtilService=t,this.initialized=!1,this.viewIsMobile=!1,this.closeDialogEvent=new o.vpe}ngOnInit(){super.ngOnInit(),this.isWebView(),this.getOccurrences()}isWebView(){this.viewIsMobile=this.windowUtilService.isWebView()}getOccurrences(){if(this.referenceDate){const e=c.Em.getDateWithoutTimezone(this.referenceDate);this.occurrencesService.getOccurrencesOfDay(this.employeeId,e).then(e=>{this.occurrences=e,this.initialized=!0})}}getHoursByMilliseconds(e){return c.Em.getHoursByMilliseconds(e)}getHoursFormmated(e,t){if(e>=0&&t>=0)return c.Em.getHoursByMilliseconds(e)+" - "+c.Em.getHoursByMilliseconds(t)}closeDialog(){this.closeDialogEvent.emit()}occurrencesHaveItems(e){return!!(e&&e.items&&e.items.length>0)}}return e.\u0275fac=function(t){return new(t||e)(o.Y36(r.$),o.Y36(l.g))},e.\u0275cmp=o.Xpm({type:e,selectors:[["app-occurrences"]],inputs:{dialogIsVisible:"dialogIsVisible",employeeId:"employeeId",referenceDate:"referenceDate"},outputs:{closeDialogEvent:"closeDialogEvent"},features:[o.qOj],decls:2,vars:1,consts:[[1,"panel-body","no-padding","po-sm-12","po-md-12","po-lg-12","po-xl-12"],["id","occurrences-dialog",3,"isVisible","closeDialogButtonEnable","closeDialogEvent",4,"ngIf"],["id","occurrences-dialog",3,"isVisible","closeDialogButtonEnable","closeDialogEvent"],["dialog-content",""],["pageTitle","l-dailySummary",3,"backFunction"],["sub-title",""],[1,"day"],[1,"week-day"],[1,"dailySummary-table-scrollable"],["id","table-occurrence",1,"table","table-occurrence","po-sm-11","po-md-11","po-lg-11","po-xl-11"],[1,"column-header"],[1,"no-padding"],[1,"occurrence-label-column","text-left"],[1,"occurrence-label-column","text-right"],[4,"ngIf"],["class","line",4,"ngFor","ngForOf"],[1,"line"],[1,"column-occurrence","no-padding"],[1,"occurrence-title"],[1,"occurrence"],[1,"column-occurrence","no-padding","text-right"],["name","total"],["colspan","2"],["id","empty"]],template:function(e,t){1&e&&(o.TgZ(0,"div",0),o.YNc(1,f,24,18,"app-dialog",1),o.qZA()),2&e&&(o.xp6(1),o.Q6J("ngIf",t.initialized))},directives:[s.O5,a.a,u.q,s.sg],pipes:[g.$,p.X$],styles:[".day[_ngcontent-%COMP%]{color:#28303e;float:left;margin-right:10px}.week-day[_ngcontent-%COMP%]{color:#9da7a9;margin-bottom:0;margin-top:0}.occurrence-label-column[_ngcontent-%COMP%]{font-size:10px;text-transform:uppercase;border-bottom:2px solid rgba(0,154,192,.5)!important;color:#0c9abe;border:none;padding:0}.table.table-occurrence[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]{vertical-align:middle!important;line-height:1}.column-occurrence[_ngcontent-%COMP%]{font-size:14px;color:#28303e}.line[_ngcontent-%COMP%]{border-bottom:1px solid #eceeee}.occurrence-title[_ngcontent-%COMP%]{line-height:35px;font-size:14px}.occurrence[_ngcontent-%COMP%]{font-size:12px}table.table-occurrence[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]{height:60px}table.table-occurrence[_ngcontent-%COMP%]{margin-left:3.5%}div[dialog-content][_ngcontent-%COMP%]{height:calc(100% - 75px)}.dailySummary-table-scrollable[_ngcontent-%COMP%]{height:inherit;overflow:auto}"]}),e})()},97899:function(e,t,n){n.r(t),n.d(t,{OccurrencesModule:function(){return d}});var o=n(38583),c=n(29790),i=n(56365),r=n(95987),l=n(51110),s=n(86249),a=n(37716);const u=[{path:":referenceDate",component:s.w,canActivate:[l.P]}];let g=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=a.oAB({type:e}),e.\u0275inj=a.cJS({imports:[[r.Bz.forChild(u)],r.Bz]}),e})();var p=n(97185);let d=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=a.oAB({type:e}),e.\u0275inj=a.cJS({providers:[p.$],imports:[[o.ez,g,c.aw,i.q]]}),e})()}}]);
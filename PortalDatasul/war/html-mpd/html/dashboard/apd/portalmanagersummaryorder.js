/*global angular */
define(['index',  '/dts/mpd/js/userpreference.js', '/dts/mpd/js/api/fchdis0046.js'], function(index) {

    portalOrdersSummaryController.$inject = ['$rootScope', 'mpd.fchdis0046.Factory', 'userPreference', '$filter', '$q'];

    function portalOrdersSummaryController($rootScope, portalOrdSum, userPreference, $filter, $q) {
                        
        var portalOrdersSumController = this;
        var i18n = $filter('i18n');
        var qtdDias = 0;
        portalOrdersSumController.emitente = " ";
        
        this.tooltip = "<b><i>" + i18n('l-status-order-portal-1', [], 'dts/mpd/') + "</i></b>: " + i18n('l-exp-order-portal-1', [], 'dts/mpd/') + "<br/>" +
                       "<b><i>" + i18n('l-status-order-portal-2', [], 'dts/mpd/') + "</i></b>: " + i18n('l-exp-order-portal-2', [], 'dts/mpd/') + "<br/>" +
                       "<b><i>" + i18n('l-status-order-portal-3', [], 'dts/mpd/') + "</i></b>: " + i18n('l-exp-order-portal-3', [], 'dts/mpd/') + "<br/>" +
                       "<b><i>" + i18n('l-status-order-portal-4', [], 'dts/mpd/') + "</i></b>: " + i18n('l-exp-order-portal-4', [], 'dts/mpd/') + "<br/>" +
                       "<b><i>" + i18n('l-status-order-portal-5', [], 'dts/mpd/') + "</i></b>: " + i18n('l-exp-order-portal-5', [], 'dts/mpd/');  
                       
        portalOrdersSumController.consideraDiasSemMovto = 0;
		portalOrdersSumController.comboDiasSemMovto = [
                {codDiasSemMovto: 0, descDiasSemMovto: i18n('l-dt-ult-alt-portal', [], 'dts/mpd/')},
                {codDiasSemMovto: 1, descDiasSemMovto: i18n('l-data-implant', [], 'dts/mpd/')}                
        ];   
             
        $q.all([userPreference.getPreference('summaryOrderManagerInitDate'),
                userPreference.getPreference('summaryOrderManagerTypeDateWhitoutMov'),
                userPreference.getPreference('summaryOrderManagerDayswithoutmov')]).then(function(results) {   

            portalOrdersSumController.iniDate               = "";                        
            
            portalOrdersSumController.consideraDiasSemMovto = 0;     
            portalOrdersSumController.diasSemMov            = 0;     

            if (results[0].prefValue) portalOrdersSumController.iniDate               = new Date(Number(results[0].prefValue)).getTime();
            if (results[1].prefValue) portalOrdersSumController.consideraDiasSemMovto = parseInt(results[1].prefValue);            
            if (results[2].prefValue) portalOrdersSumController.diasSemMov            = parseInt(results[2].prefValue);      

            if (portalOrdersSumController.iniDate               === "") portalOrdersSumController.iniDate              = new Date().getTime();                                 
                    
            var dt = new Date(parseFloat(portalOrdersSumController.iniDate)).getTime();

            if(!(dt > 0)){                                
                portalOrdersSumController.iniDate = new Date().getTime();
            }    
            
            portalOrdersSumController.summaryData = undefined;            
            portalOrdersSumController.loadData();
                                                                        
        });
                                                
        this.applyConfig = function(data) {

            if(portalOrdersSumController.iniDate < 0) portalOrdersSumController.iniDate = 7200000;

            $q.all([userPreference.setPreference('summaryOrderManagerInitDate', portalOrdersSumController.iniDate),                                                                                                                    
                    userPreference.setPreference('summaryOrderManagerTypeDateWhitoutMov', portalOrdersSumController.consideraDiasSemMovto),
                    userPreference.setPreference('summaryOrderManagerDayswithoutmov', portalOrdersSumController.diasSemMov)]).then(function() { 
                        portalOrdersSumController.summaryData = undefined;
                        portalOrdersSumController.summaryShow = true;
                        portalOrdersSumController.loadData();                        
                    });

        };
        
        this.loadData = function() {     
            
                if($rootScope.selectedcustomer){
                    portalOrdersSumController.emitente = $rootScope.selectedcustomer['cod-emitente'];;
                }else{
                    portalOrdersSumController.emitente = " ";
                }                                                                                              
                                             
               if (portalOrdersSumController.diasSemMov == undefined){
                   portalOrdersSumController.diasSemMov = 0;
                   qtdDias = portalOrdersSumController.diasSemMov; 
               }
                                             
               if(portalOrdersSumController.consideraDiasSemMovto == 1){
                   if(portalOrdersSumController.diasSemMov > 365){                       
                       portalOrdersSumController.diasSemMov = 365;
                       qtdDias = portalOrdersSumController.diasSemMov;
                       qtdDias -= (2 * qtdDias);                                              
                   }else if(portalOrdersSumController.diasSemMov < 0){
                       portalOrdersSumController.diasSemMov = 0;
                       qtdDias = portalOrdersSumController.diasSemMov;                       
                   }else{
                       qtdDias = portalOrdersSumController.diasSemMov;
                       qtdDias -= (2 * qtdDias);
                   }                                                                                               
               }else{
                   if(portalOrdersSumController.diasSemMov > 365){
                       portalOrdersSumController.diasSemMov = 365;
                       qtdDias = portalOrdersSumController.diasSemMov; 
                   }else if(portalOrdersSumController.diasSemMov < 0){
                       portalOrdersSumController.diasSemMov = 0;
                       qtdDias = portalOrdersSumController.diasSemMov;
                   }else{
                       qtdDias = portalOrdersSumController.diasSemMov;
                   }                   
               }       

            var queryParams = {emitente: portalOrdersSumController.emitente,
                               iniDate: portalOrdersSumController.iniDate,                               
                               diasSemMov: qtdDias};
                                                                                             
            var summary = portalOrdSum.getPortalOrderSummary(queryParams, function() {

                var s = new Array();
                var i = 0;
                                                                                          
                angular.forEach(summary, function(value, key) {
                                                                                
                    var chartLabel = value.summaryType + '&nbsp;</td><td class="legendLabel" style="text-align: right;">' + value.summaryValue;
                    s.push({label: chartLabel, data: value.summaryValue});
                    if (parseInt(value.summaryValue))
                        i++;
                });

                portalOrdersSumController.summaryData = s;

                if (i == 0) {
                    portalOrdersSumController.noResults = true;
                    portalOrdersSumController.summaryShow = false;
                } else {
                    portalOrdersSumController.noResults = false;
                    portalOrdersSumController.summaryShow = true;                                                                                
                }
                               
            });
                       
        };    
                
        this.summaryOptions = {
            tooltip: true,
            tooltipOpts: {
                content: function(label, x, y, item) {
                    return label.split('&')[0] + " " + y;
                }
            },
            grid: {hoverable: true},
            series: {
                pie: {
                    show: true
                }
            }
        };
        
        $rootScope.$on('selectedcustomer', function(event) {
            portalOrdersSumController.summaryData = undefined;
            portalOrdersSumController.loadData();                                                                                                                                                                                                                                                                                   
        });        
        
        this.summaryShow = true;                                       
                         
    }//function portalOrdersSummaryController(loadedModules, userMessages)

    index.register.controller('apd.dashboard.portalorderssumapd.Controller', portalOrdersSummaryController);    

});
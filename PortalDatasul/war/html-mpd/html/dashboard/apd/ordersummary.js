define([
    'index',
    '/dts/mpd/js/userpreference.js',
    '/dts/mpd/js/api/fchdis0046.js',
    '/dts/mpd/js/zoom/estabelec.js',
    '/dts/mpd/js/zoom/usuario.js',
    '/dts/mpd/js/portal-factories.js'
], function(index) {

    orderSummaryCtrl.$inject = [
        '$rootScope',
        'userPreference',
        'mpd.fchdis0046.Factory',
        '$filter',
        '$q',
        '$location',
        'TOTVSEvent'
    ];
    function orderSummaryCtrl(
        $rootScope,
        userPreference,
        ordersumapd,
         $filter,
         $q,
         $location,
         TOTVSEvent
    ) {
        var summaryCtrl = this,
            i18n = $filter('i18n'),
            custSelected = " ";
        
        summaryCtrl.nomeAbrev = custSelected;

        this.tooltip = "<b><i>" + i18n('l-status-order-9', [], 'dts/mpd/') + "</i></b>: " + i18n('l-exp-status-order-9', [], 'dts/mpd/') + "<br/>" +
                       "<b><i>" + i18n('l-status-order-4', [], 'dts/mpd/') + "</i></b>: " + i18n('l-exp-status-order-4', [], 'dts/mpd/') + "<br/>" +
                       "<b><i>" + i18n('l-status-order-10', [], 'dts/mpd/') + "</i></b>: " + i18n('l-exp-status-order-10', [], 'dts/mpd/') + "<br/>" +
                       "<b><i>" + i18n('l-status-order-5', [], 'dts/mpd/') + "</i></b>: " + i18n('l-exp-status-order-5', [], 'dts/mpd/') + "<br/>" +
                       "<b><i>" + i18n('l-status-order-6', [], 'dts/mpd/') + "</i></b>: " + i18n('l-exp-status-order-6', [], 'dts/mpd/') + "<br/>" +
                       "<b><i>" + i18n('l-status-order-7', [], 'dts/mpd/') + "</i></b>: " + i18n('l-exp-status-order-7', [], 'dts/mpd/') + "<br/>" +
                       "<b><i>" + i18n('l-status-order-8', [], 'dts/mpd/') + "</i></b>: " + i18n('l-exp-status-order-8', [], 'dts/mpd/');

        this.noResults = false;

        $q.all([
            userPreference.getPreference('sumInitDate'),
            userPreference.getPreference('sumCodEstabel'),
            userPreference.getPreference('sumUsuarioImp')
        ]).then(function(results) {
            if (results[0].prefValue) summaryCtrl.iniDate = new Date(Number(results[0].prefValue)).getTime();  
            if (results[1].prefValue) summaryCtrl.codEstabel = results[1].prefValue;
            if (results[2].prefValue) summaryCtrl.usuarioImp = results[2].prefValue;

            var dt = new Date(parseFloat(summaryCtrl.iniDate)).getTime();
                        
            if (!(dt > 0)) {
                summaryCtrl.iniDate = new Date().getTime();
            }

            summaryCtrl.allCustSelected  = true;
            $q.all([userPreference.setPreference('allCustomerPortletOrderAPD', summaryCtrl.allCustSelected)]).then(function() {});
            summaryCtrl.filterByPortalOrders = false;
            summaryCtrl.summaryData = undefined;
            summaryCtrl.loadData();
        });

        this.applyConfig = function(data) {
            $q.all([
                userPreference.setPreference('sumInitDate', summaryCtrl.iniDate),
                userPreference.setPreference('sumCodEstabel', summaryCtrl.codEstabel),
                userPreference.setPreference('sumUsuarioImp', summaryCtrl.usuarioImp)
            ]).then(function() {  
                summaryCtrl.summaryData = undefined;
                summaryCtrl.summaryShow = true;
                summaryCtrl.loadData();
            });
        };

        this.loadData = function() {
            var summaryIniDate = " ",
                summaryCodEstabel = " ",
                summaryUsuarioImp = " ";
            
            if ($rootScope.selectedcustomer) {
                if (!summaryCtrl.allCustSelected && summaryCtrl.filterByPortalOrders) {
                    summaryCtrl.nomeAbrev = $rootScope.selectedcustomer['nome-abrev'] + "^^^^^^";
                } else {
                    if (!summaryCtrl.allCustSelected && !summaryCtrl.filterByPortalOrders) {
                         summaryCtrl.nomeAbrev = $rootScope.selectedcustomer['nome-abrev'];
                    } else {
                        if (summaryCtrl.allCustSelected && summaryCtrl.filterByPortalOrders) { 
                            summaryCtrl.nomeAbrev = "^^^^^^";
                        } else {
                            if (summaryCtrl.allCustSelected && !summaryCtrl.filterByPortalOrders) summaryCtrl.nomeAbrev = " ";
                        }
                    }
                }
            } else {
                if (summaryCtrl.allCustSelected) {
                    if (summaryCtrl.filterByPortalOrders) summaryCtrl.nomeAbrev = "^^^^^^";
                    else summaryCtrl.nomeAbrev = " ";
                }
            }

            if (summaryCtrl.iniDate !== undefined) {
                summaryIniDate = summaryCtrl.iniDate;
            }
            
            if (summaryCtrl.codEstabel !== undefined) {
                summaryCodEstabel = summaryCtrl.codEstabel;
            }                                          
            
            if (summaryCtrl.usuarioImp !== undefined) {
                summaryUsuarioImp = summaryCtrl.usuarioImp;
            }

            var queryParams = {
                emitente: summaryCtrl.nomeAbrev,
                iniDate: summaryIniDate,
                codEstabel: summaryCodEstabel,
                orderAdder: summaryUsuarioImp
            };
            
            var summary = ordersumapd.ordersSummaryOrderAdder(queryParams, function() {
                var s = new Array(),
                    i = 0;

                angular.forEach(summary, function(value, key) {
                    var chartLabel = value.situation + '&nbsp;</td><td class="legendLabel" style="text-align: right;">' + value.quantity;

                    s.push({label: chartLabel, data: value.quantity});

                    if (parseInt(value.quantity)) { i++; }
                });

                summaryCtrl.summaryData = s;

                if (i == 0) {
                    summaryCtrl.noResults = true;
                    summaryCtrl.summaryShow = false;
                } else {
                    summaryCtrl.noResults = false;
                    summaryCtrl.summaryShow = true;
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

        this.customerSelected = function() {
            if (!$rootScope.selectedcustomer) {
                summaryCtrl.allCustSelected = true;

                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'warning',
                    title: i18n('l-order', [], 'dts/mpd/'),
                    detail: i18n('l-not-customer', [], 'dts/mpd/')
                });
            } else {
                summaryCtrl.summaryData = undefined;
                summaryCtrl.loadData();
            }

            $q.all([userPreference.setPreference('allCustomerPortletOrderAPD', summaryCtrl.allCustSelected)]).then(function() {});
         };

        this.portalOrders = function() {
            $q.all([userPreference.setPreference('portalOrderPortletOrderAPD', summaryCtrl.filterByPortalOrders)]).then(function() {});
            summaryCtrl.summaryData = undefined;
            summaryCtrl.loadData();
        }

        $rootScope.$on('selectedcustomer', function(event) {
            if(!$rootScope.selectedcustomer){
                summaryCtrl.allCustSelected = true;
                $q.all([userPreference.setPreference('allCustomerPortletOrderAPD', summaryCtrl.allCustSelected)]).then(function() {});
            }

            summaryCtrl.summaryData = undefined;
            summaryCtrl.loadData();
        });

        summaryCtrl.openInternalSalesOrders = function() {
            $q.all([userPreference.setPreference('portalOrderPortletOrderAPD', summaryCtrl.filterByPortalOrders)]).then(function() {
                $location.url('/dts/mpd/internalsalesorders/openbysummary');
            });
        }

        this.summaryShow = true;
    }

    index.register.controller('apd.dashboard.ordersumapd.Controller', orderSummaryCtrl);
});

define(['index', 
    '/dts/acr/js/acr-factories.js', 
    '/dts/acr/js/userpreference.js', 
    '/dts/acr/js/acr-components.js',
    '/dts/acr/js/api/inquirerepcomm.js',
    '/dts/acr/html/inquirerepcomm/inquirerepcomm-services.param.js'
], function (index) {

	dashboardInquireRepCommCtrl.$inject = ['$rootScope', '$scope', '$location', '$filter', '$window', 'acr.inquirerepcomm.Factory', 'userPreference', '$q', 'acr.inquirerepcomm.param-service', 'TOTVSEvent'];

	function dashboardInquireRepCommCtrl($rootScope, $scope, $location, $filter, $window, service, userPreference, $q, serviceInquireRepCommParam, TOTVSEvent) {
        	
        var controller = this;
        
        controller.listResult = [];
        controller.listRepComm = [];

        controller.optionsPredicted = [];
        controller.optionsPerformed = [];
        controller.optionsTotal = [];

        controller.dataPredicted = undefined;
        controller.dataPerformed = undefined;
        controller.dataTotal = undefined;
        controller.predicted = undefined;
        controller.performed = undefined;
        controller.model = undefined;

        controller.customersOfRepres = [];
        controller.dateRange = {};
        controller.currency = { nom_prefix_moeda: 'R$' };

        controller.cdncliente = 0;	

        controller.tamDiv = undefined;
        controller.tamGrafico = 150;
        controller.tamDiv = document.getElementById('inquirerepcomm_div').offsetWidth;
        
        if (controller.tamDiv >= 920) {
            controller.tamGrafico = 285;
        }
        
        this.formatCurrency = function (value) {
			return $filter('currency')(value, controller.currency.nom_prefix_moeda, 2);
        };
        
        $q.all([userPreference.getPreference('inquireRepComm.faixadata'),
                userPreference.getPreference('inquireRepComm.cdncliente')])
        .then(function(data) {
                            
            var dt = controller.dateRange,
                cdn = controller.cdncliente;

            if (data[0].prefValue && data[0].prefValue != "undefined") {
                dt = angular.fromJson(data[0].prefValue);
            }

            if (data[1].prefValue && data[1].prefValue != "undefined") {
                cdn = data[1].prefValue;
            }
            
            if(!(cdn > 0)){
                cdn = 0; 
            }
                                                        
            controller.dateRange = dt;
            controller.cdncliente = cdn;
             
            service.getNomAbrevCustomer(controller.cdncliente, function(result){
                if (result) {              
                    angular.forEach(result, function (value) {
                        controller.model.ttCustomer = value;
                    });
                }
            });
            
            controller.performed = undefined;
            controller.predicted = undefined;                   
            controller.loadData();
        });
		
		controller.loadData = function() {

            controller.listResult = [];
            controller.customersOfRepres = [];
            var i,
				series1 = [],
                series2 = [],
                series3 = [];
            
            service.getRangeInquireRepComm(controller.cdncliente, controller.dateRange.startDate, controller.dateRange.endDate, function(result){

                if (result) {

                    if (controller.customersOfRepres != undefined || controller.customersOfRepres != 0) {
                        controller.getCustomers();
                    }

                    controller.predicted = 0;
                    controller.performed = 0;
                    controller.listRepComm = [];

                    angular.forEach(result, function (value) {

                        controller.listRepComm.push({
                            name: value.nomAbrev,
                            predicted: value.valTotNaoRealiz,
                            performed: value.valTotRealiz,
                            total: value.valTotNaoRealiz + value.valTotRealiz
                        });

                        controller.predicted = controller.predicted + value.valTotNaoRealiz;
                        controller.performed = controller.performed + value.valTotRealiz;
                    });

                    controller.tooltipHelp = $rootScope.i18n('l-value', [], 'dts/acr');
                    controller.dataPredicted = [];
                    controller.dataPerformed = [];
                    controller.dataTotal = [];

                    for (i = 0; i < result.length; i += 1) {

                        series1 = parseFloat(result[i].valTotNaoRealiz);
                        series2 = parseFloat(result[i].valTotRealiz);
                        series3 = (parseFloat(result[i].valTotNaoRealiz) + parseFloat(result[i].valTotRealiz));

                        if (series1 > 0){
                            controller.dataPredicted.push({
                                name: 'transTypeNotExec',
                                id: result[i].cdnCliente,
                                category: result[i].nomAbrev,
                                value: series1.toString(),
                                total: series1
                            });
                        }

                        if ( series2 > 0){
                            controller.dataPerformed.push({
                                name: 'transTypeExec',
                                id: result[i].cdnCliente,
                                category: result[i].nomAbrev,
                                value: series2.toString(),
                                total: series2
                            });
                        }

                        controller.dataTotal.push({
                            name: 'all',
                            id: result[i].cdnCliente,
                            category: result[i].nomAbrev,
                            value: series3.toString(),
                            total: series3
                        });
                        
                    }

                    controller.optionsTotal = {
                        legend: {
                            position: "bottom",
                            visible: false
                        },
                        valueAxis: {
                            majorUnit: 1
                        },
                        tooltip: {
                            visible: true,
                            template: function (dataItem) {
                                return dataItem.dataItem.category + ": " +  controller.formatCurrency(dataItem.dataItem.total);
                            }
                        },
                        series: [{
                            overlay: {
                                gradient: "roundedBevel"
                            },
                            startAngle: 180,
                            data: controller.dataTotal,
                            type: "pie"
                        }]
                    };

                    controller.optionsPredicted = {
                        legend: {
                            position: "bottom",
                            visible: false
                        },
                        valueAxis: {
                            majorUnit: 1
                        },
                        tooltip: {
                            visible: true,
                            template: function (dataItem) {
                                return dataItem.dataItem.category + ": " +  controller.formatCurrency(dataItem.dataItem.total);
                            }
                        },
                        series: [{
                            overlay: {
                                gradient: "roundedBevel"
                            },
                            startAngle: 180,
                            data: controller.dataPredicted,
                            type: "pie"
                        }]
                    };

                    controller.optionsPerformed = {
                        legend: {
                            position: "bottom",
                            visible: false
                        },
                        valueAxis: {
                            majorUnit: 1
                        },
                        tooltip: {
                            visible: true,
                            template: function (dataItem) {
                                return dataItem.dataItem.category + ": " +  controller.formatCurrency(dataItem.dataItem.total);
                            }
                        },
                        series: [{
                            overlay: {
                                gradient: "roundedBevel"
                            },
                            startAngle: 180,
                            data: controller.dataPerformed,
                            type: "pie"
                        }]
                    };
                }
            });
        };
        
        $scope.safeApply = function (fn) {
			var phase = (this.$root ? this.$root.$$phase : undefined);

			if (phase === '$apply' || phase === '$digest') {
				if (fn && (typeof (fn) === 'function')) {
					fn();
				}
			} else {
				this.$apply(fn);
			}
        };
        
        this.getCustomers = function () {

            service.getCustomersOfRepresentative(controller.dateRange.startDate, controller.dateRange.endDate, function(result){
                if (result) {
                    controller.customersOfRepres = result;
                }
            });

        };

        this.onChangeCustomer = function (selectedCustomer) {

            if (selectedCustomer) {
                controller.model.ttCustomer = selectedCustomer;
                controller.cdncliente = controller.model.ttCustomer.cdnCliente;
            } else {
                controller.cdncliente = 0;
            }
            
        };

        this.onClick = function (event) {

            if (!event) {
                return;
            }

            controller.openDetail(event.dataItem.name, event.dataItem.id);

        }

        this.openList = function (situation) {

            var situacao = "";
            
            if (situation !== null) {
                switch (situation) {

                    case 1:
                        situacao = 'transTypeExec';
                        break;

                    case 2:
                        situacao = 'transTypeNotExec';
                        break;

                }
            }
            controller.openDetail(situacao, controller.cdncliente);
        };
        
        this.openDetail = function (situacao, cliente) {

            var url = $rootScope.appRootContext + 'program-html/html.representCommissionTransaction/',
                disclaimers = [];

            if (cliente != undefined) {
                disclaimers.push({
                    'property': 'customerList',
                    'value': cliente == 0 ? 'all' : cliente
                });
            }

            if (controller.dateRange != undefined ) {

                var initialDate = new Date(controller.dateRange.startDate),
                    finalDate = new Date(controller.dateRange.endDate);

                initialDate = initialDate.getFullYear() + '-' + ((initialDate.getMonth() + 1) <= 9 ? '0' + (initialDate.getMonth() + 1) : (initialDate.getMonth() + 1)) + '-' + (initialDate.getDate() <= 9 ? '0' + initialDate.getDate() : initialDate.getDate());
                finalDate = finalDate.getFullYear() + '-' + ((finalDate.getMonth() + 1) <= 9 ? '0' + (finalDate.getMonth() + 1) : (finalDate.getMonth() + 1)) + '-' + (finalDate.getDate() <= 9 ? '0' + finalDate.getDate() : finalDate.getDate());

                disclaimers.push({
                    'property': 'transactionDate',
                    'value': initialDate + ";" + finalDate
                });
            }

			if (situacao != undefined) {
                disclaimers.push({
                    'property': 'transactionType',
                    'value': situacao == '' ? 'all' : situacao
                });
            }

            $window.localStorage.setItem('RepCommTrans.dashboard', angular.toJson(disclaimers));

            $scope.safeApply(function () {
                $location.path(url);
            });
		};
        
        this.applyConfig = function () {

            this.isInvalidForm();

            if ( controller.invalidForm ) {
                return;
            }

			$q.all([userPreference.setPreference('inquireRepComm.faixadata', controller.dateRange),
                    userPreference.setPreference('inquireRepComm.cdncliente', controller.cdncliente)])
				.then(function () {
					controller.loadData();					
                    controller.listShow = true;
                    controller.chartsShow = false;
				});
				
        };

        this.isInvalidForm = function () {

            var isInvalidForm = false,
                messages = [];

			if ((controller.dateRange.startDate == undefined) || ( controller.dateRange.startDate == "" )) {
				isInvalidForm = true;
				messages.push('l-initial-transaction-date');
			}

			if ((controller.dateRange.endDate == undefined ) || (controller.dateRange.endDate == "" )) {
				isInvalidForm = true;
				messages.push('l-final-transaction-date');
            }

			if (isInvalidForm) {
				this.showInvalidFormMessage('l-restriction', messages);
			}

			controller.invalidForm = isInvalidForm;

			return;
        }

        this.showInvalidFormMessage = function (title, messages) {

			messages = messages || [];

			if (!angular.isArray(messages)) {
				messages = [messages];
			}

			var i,
				fields = '',
				isPlural,
				message;

			isPlural = messages.length > 1;
			message = 'msg-form-validation' + (isPlural ? '-plural' : '');

			for (i = 0; i < messages.length; i += 1) {
				fields += $rootScope.i18n(messages[i], [], 'dts/acr');
				if (isPlural && i !== (messages.length - 1)) {
					fields += ', ';
				}
			}

			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type: 'error',
				title: $rootScope.i18n(title, [], 'dts/acr'),
				detail: $rootScope.i18n(message, [fields], 'dts/acr')
			});
		};
        
        this.showConfig = function () {
			
            this.listShow = false;
            this.chartsShow = false;
				
        };
        
        this.showList = function () {
			
            this.listShow = true;
            this.chartsShow = false;
				
        };
        
        this.showCharts = function () {
			
            this.chartsShow = true;
            this.listShow = false;
				
		};
		
        this.listShow = true;
        this.chartsShow = false;
		
	} //function dashboardInquireRepCommCtrl(loadedModules, userMessages)

	index.register.controller('acr.dashboard.inquirerepcomm.Controller', dashboardInquireRepCommCtrl);
});

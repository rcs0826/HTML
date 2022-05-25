define(['index', 
    '/dts/apb/js/apb-factories.js', 
    '/dts/apb/js/userpreference.js', 
    '/dts/apb/js/apb-components.js',
    '/dts/apb/js/api/inquirevendordocdashboard.js',
    '/dts/apb/html/inquirevendordocs/inquirevendordocs-services.param.js'
], function (index) {

	dashboardInquireVendorDocCtrl.$inject = ['$rootScope', '$scope', '$location', '$filter', 'apb.inquirevendordocdashboard.Factory', 'userPreference', '$q', 'apb.inquirevendordocs.param-service', 'TOTVSEvent'];

	function dashboardInquireVendorDocCtrl($rootScope, $scope, $location, $filter, service, userPreference, $q, serviceInquireVendorDocsParam, TOTVSEvent) {
        	
        var controller = this;
        
        controller.listResult = [];
        controller.series = [];
        controller.categories = [];
        controller.currency = { nom_prefix_moeda: 'R$' };

        controller.dataemis = new Date().getTime();
        controller.datavenc = new Date().getTime();	
        controller.invalidForm = false;	

        controller.innerWidth = undefined;
        controller.tamGrafico = 550;

        controller.innerWidth = window.innerWidth;
        if (controller.innerWidth < 580){
            controller.tamGrafico = 285;
        }
        
        this.formatCurrency = function (value) {
			return $filter('currency')(value, controller.currency.nom_prefix_moeda, 2);
        };
        
        $q.all([userPreference.getPreference('inquireVendorDocs.dtEmis'),
                userPreference.getPreference('inquireVendorDocs.dtVenc')])
            .then(function(data) {
                                
                var dt = controller.dataemis;
                var dt2 = controller.datavenc;
                                    
                if (data[0].prefValue && data[0].prefValue != "undefined") {
                    dt = new Date(parseFloat(data[0].prefValue)).getTime();
                }					
                if (data[1].prefValue && data[1].prefValue != "undefined") {
                    dt2 = new Date(parseFloat(data[1].prefValue)).getTime();
                }				
                
                if(!(dt > 0)){
                    dt = new Date().getTime(); 
                }
                
                if(!(dt2 > 0)){
                    dt2 = new Date().getTime(); 
                }           
                                                            
                controller.dataemis = dt;
                controller.datavenc = dt2;
                
                controller.vencidos = undefined;
                controller.aVencer = undefined;                   
                controller.loadData();
            });
		
		controller.loadData = function() {

            controller.listResult = [];
            controller.categories = [];
            var i,
				dValueVencidos,
                dValueAVencer,
                dValue,
                series1 = [],
                series2 = [],
                series3 = [],
                series4 = [],
                series5 = [];
            
            service.getRangeInquireVendorDoc(controller.dataemis, controller.datavenc, function(result){
                if (result) {
                    
                    angular.forEach(result, function (value) {
                        // se tiver o atributo $length e popula o totalRecords
                        if (value && value.$length) {
                            controller.totalRecords = value.$length;
                        } else {
                            controller.totalRecords++;	                    	
                        }
                        // adicionar o item na lista de resultado
                        controller.listResult.push(value);
                    });

                    controller.tooltipHelp = $rootScope.i18n('l-value', [], 'dts/apb');

                    dValueVencidos = 0;
                    dValueAVencer = 0;

                    for (i = 0; i < result.length; i += 1) {

                        if (result[i].numSituacao == 1 || result[i].numSituacao == 2) {
                        
                            dValue = parseFloat(result[i].valSdoAber);

                            switch (result[i].numFaixaVencto) {
                                case 1:
                                    series1.push(dValue);
                                    break;
                                case 2:
                                    series2.push(dValue);
                                    break;
                                case 3:
                                    series3.push(dValue);
                                    break;
                                case 4:
                                    series4.push(dValue);
                                    break;
                                case 5:
                                    series5.push(dValue);
                                    break;
                            }
                            
                            switch (result[i].numSituacao) {
                                case 1:
                                    dValueVencidos = dValueVencidos + parseFloat(result[i].valSdoAber);
                                    break;
                                case 2:
                                    dValueAVencer = dValueAVencer + parseFloat(result[i].valSdoAber);
                                    break;
                                default:
                                    dValueVencidos = dValueVencidos;
                                    dValueAVencer = dValueAVencer;
                            }

                        }
                    }

                    controller.vencidos = dValueVencidos;
                    controller.aVencer = dValueAVencer;

                    controller.series = [
                        {
                            name: $rootScope.i18n('l-30-days', [], 'dts/apb'),
                            data: series1,
                            tooltip: { template: $rootScope.i18n('l-currency-format-wtout-space', [], 'dts/apb') + "#=kendo.toString(value, 'n2')#" }
                        }, {
                            name: $rootScope.i18n('l-31-to-60-days', [], 'dts/apb'),
                            data: series2,
                            tooltip: { template: $rootScope.i18n('l-currency-format-wtout-space', [], 'dts/apb') + "#=kendo.toString(value, 'n2')#" }
                        }, {
                            name: $rootScope.i18n('l-61-to-90-days', [], 'dts/apb'),
                            data: series3,
                            tooltip: { template: $rootScope.i18n('l-currency-format-wtout-space', [], 'dts/apb') + "#=kendo.toString(value, 'n2')#" }
                        }, {
                            name: $rootScope.i18n('l-91-to-120-days', [], 'dts/apb'),
                            data: series4,
                            tooltip: { template: $rootScope.i18n('l-currency-format-wtout-space', [], 'dts/apb') + "#=kendo.toString(value, 'n2')#" }
                        }, {
                            name: $rootScope.i18n('l-more-then-120-days', [], 'dts/apb'),
                            data: series5,
                            tooltip: { template: $rootScope.i18n('l-currency-format-wtout-space', [], 'dts/apb') + "#=kendo.toString(value, 'n2')#" }
                        }
                    ];
                    controller.categories = [
                        $rootScope.i18n('l-expired', [], 'dts/apb'),
                        $rootScope.i18n('l-not-expired', [], 'dts/apb')
                    ];

                    controller.listResult.reverse();
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

        this.onClick = function (event) {

            var faixa = "";

            if (!event) {
				return;
            }
            
            switch (event.series.name) {

                case $rootScope.i18n('l-30-days', [], 'dts/apb'):
                    faixa = $rootScope.i18n('l-30d', [], 'dts/apb');
                    break;

                case $rootScope.i18n('l-31-to-60-days', [], 'dts/apb'):
                    faixa = $rootScope.i18n('l-31-to-60d', [], 'dts/apb');
                    break;

                case $rootScope.i18n('l-61-to-90-days', [], 'dts/apb'):
                    faixa = $rootScope.i18n('l-61-to-90d', [], 'dts/apb');
                    break;
                
                case $rootScope.i18n('l-91-to-120-days', [], 'dts/apb'):
                    faixa = $rootScope.i18n('l-91-to-120d', [], 'dts/apb');
                    break;

                case $rootScope.i18n('l-more-then-120-days', [], 'dts/apb'):
                    faixa = $rootScope.i18n('l-more-than-120d', [], 'dts/apb');
                    break;

            }

            controller.openDetail(event.category, faixa);
        };

        this.openList = function (situation, range) {

            var situacao = "";
            var faixa = "";

            if (situation == 1) {
                situacao = $rootScope.i18n('l-expired', [], 'dts/apb');
            }
            else if (situation == 2) {
                situacao = $rootScope.i18n('l-not-expired', [], 'dts/apb');
            }

            if (range !== null){
                faixa = controller.traduzFaixa(range);
            }
            
            controller.openDetail(situacao, faixa);
        };
        
        this.openDetail = function (situacao, faixa) {
			var url = '/dts/apb/inquirevendordocs',
                disclaimers = [];
                
                        
            if (controller.dataemis != undefined ) {
                disclaimers.push({
                    property: 'dtEmis',
                    value: controller.dataemis,
                    model: {property: 'dtEmis', value: controller.dataemis}
                });
            }

            if (controller.datavenc != undefined ) {
                disclaimers.push({
                    property: 'dtVenc',
                    value: controller.datavenc,
                    model: {property: 'dtVenc', value: controller.datavenc}
                });
            }

			if (situacao == $rootScope.i18n('l-expired', [], 'dts/apb')) {
                disclaimers.push({
                    property: 'numSituacao',
                    value: 1,
                    title: 'VENCIDOS',
                    model: {property: 'numSituacao', value: 1}
                });
            }
            
            if (situacao == $rootScope.i18n('l-not-expired', [], 'dts/apb')) {
                disclaimers.push({
                    property: 'numSituacao',
                    value: 2,
                    title: 'AVENCER',
                    model: {property: 'numSituacao', value: 2}
                });
            }
            
            if (faixa == $rootScope.i18n('l-30d', [], 'dts/apb')) {
                disclaimers.push({
                    property: 'periodoVenc',
                    value: 1,
                    model: {property: 'periodoVenc', value: 1}
                });
            }
            
            if (faixa == $rootScope.i18n('l-31-to-60d', [], 'dts/apb')) {
                disclaimers.push({
                    property: 'periodoVenc',
                    value: 2,
                    model: {property: 'periodoVenc', value: 2}
                });
            }
            
            if (faixa == $rootScope.i18n('l-61-to-90d', [], 'dts/apb')) {
                disclaimers.push({
                    property: 'periodoVenc',
                    value: 3,
                    model: {property: 'periodoVenc', value: 3}
                });
            }
            
            if (faixa == $rootScope.i18n('l-91-to-120d', [], 'dts/apb')) {
                disclaimers.push({
                    property: 'periodoVenc',
                    value: 4,
                    model: {property: 'periodoVenc', value: 4}
                });
            }
            
            if (faixa == $rootScope.i18n('l-more-than-120d', [], 'dts/apb')) {
                disclaimers.push({
                    property: 'periodoVenc',
                    value: 5,
                    model: {property: 'periodoVenc', value: 5}
                });
            }

			serviceInquireVendorDocsParam.setParamOpp(disclaimers, function () {
				$scope.safeApply(function () {
					$location.path(url);
				});
			});
        };
        
        this.isInvalidForm = function () {

            var isInvalidForm = false,
                messages = [];

			if ((controller.dataemis == undefined) || ( controller.dataemis == "" )) {
				isInvalidForm = true;
				messages.push('l-print-date');
			}

			if ((controller.datavenc == undefined ) || (controller.datavenc == "" )) {
				isInvalidForm = true;
				messages.push('l-due-date');
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

        this.traduzFaixa = function(faixaVencto){
            var sentence = '';
            switch (faixaVencto) {
                case 1:
                    sentence = 'l-30d';
                    break;
                case 2:
                    sentence = 'l-31-to-60d';
                    break;
                case 3:
                    sentence = 'l-61-to-90d';
                    break;
                case 4:
                    sentence = 'l-91-to-120d';
                    break;
                case 5:
                    sentence = 'l-more-than-120d';
                    break;
                default:
                    sentence = '';
            }
            return $rootScope.i18n(sentence, [], 'dts/apb');
		}
				
		this.applyConfig = function () {

            controller.isInvalidForm();

            if ( controller.invalidForm ) {
                return;
            }
			
			$q.all([userPreference.setPreference('inquireVendorDocs.dtEmis', new Date(controller.dataemis).getTime()),
			        userPreference.setPreference('inquireVendorDocs.dtVenc', new Date(controller.datavenc).getTime())])
				.then(function () {
                    controller.vencidos = undefined;
                    controller.aVencer = undefined; 
					controller.loadData();					
                    controller.listShow = true;
                    controller.chartsShow = false;
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
		
	}//function dashboardInquireVendorDocCtrl(loadedModules, userMessages)

	index.register.controller('apb.dashboard.inquirevendordoc.Controller', dashboardInquireVendorDocCtrl);
});

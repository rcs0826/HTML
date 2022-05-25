define(['index', 
    '/dts/acr/js/acr-factories.js', 
    '/dts/acr/js/userpreference.js', 
    '/dts/acr/js/acr-components.js',
    '/dts/acr/html/inquirecustdocs/inquirecustdocs-services.param.js'
], function (index) {

	dashboardInquireCustDocsCtrl.$inject = ['$rootScope', '$scope', '$location', '$filter', 'acr.inquirecustdocs.Factory', 'userPreference', '$q', 'acr.inquirecustdocs.param-service', 'TOTVSEvent'];

	function dashboardInquireCustDocsCtrl($rootScope, $scope, $location, $filter, service, userPreference, $q, serviceInquireCustDocsParam, TOTVSEvent) {
        	
        var controller = this;
        
        controller.listResult = [];
        controller.seriesVencidos = [];
        controller.seriesAvencer = [];
        controller.series = [];
        controller.categories = [];
        controller.invalidForm = false;
        controller.optionsAvencer = undefined;
        controller.optionsVencidos = undefined;
        controller.currency = { nom_prefix_moeda: 'R$' };

        controller.dataemis = new Date().getTime();
        controller.datavenc = new Date().getTime();		

        controller.innerWidth = undefined;
        controller.tamGrafico = 550;

        controller.innerWidth = window.innerWidth;
        if (controller.innerWidth < 580){
            controller.tamGrafico = 285;
        }
        
        this.formatCurrency = function (value) {
			return $filter('currency')(value, controller.currency.nom_prefix_moeda, 2);
        };
        
        $q.all([userPreference.getPreference('inquireCustDocs.dataemis'),
                userPreference.getPreference('inquireCustDocs.datavenc')])
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
				dValue,
				seriesVencidos = [],
                seriesAvencer = [],
                series1 = [],
                series2 = [],
                series3 = [],
                series4 = [],
                series5 = [];
            
            service.getTotalInquireCustDocs(controller.dataemis, controller.datavenc, function(result){
                if (result) {
                    
                    angular.forEach(result, function (value) {
                        // se tiver o atributo $length e popula o totalRecords
                        if (value && value.$length) {
                            controller.totalRecords = value.$length;
                        } else {
                            controller.totalRecords++;	                    	
                        }
                        // adicionar o item na lista de resultado
                        
                        controller.vencidos = value.valSdoVencid;
                        controller.aVencer = value.valSdoAvencer;
                    });
                }
            });

            service.getRangeInquireCustDocs(controller.dataemis, controller.datavenc, function(result){
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
                    controller.listResult.reverse();

                    controller.tooltipHelp = $rootScope.i18n('l-value', [], 'dts/acr');

                    for (i = 0; i < result.length; i += 1) {

                        if (result[i].numSituacao == 1 || result[i].numSituacao == 2) {

                            dValue = parseFloat(result[i].valSdoFaixaVencto);
                            
                            if (result[i].numFaixaVencto == 1){
                                series1.push(dValue);
                            }

                            if (result[i].numFaixaVencto == 2){
                                series2.push(dValue);
                            }

                            if (result[i].numFaixaVencto == 3){
                                series3.push(dValue);
                            }

                            if (result[i].numFaixaVencto == 4){
                                series4.push(dValue);
                            }

                            if (result[i].numFaixaVencto == 5){
                                series5.push(dValue);
                            }

                        }

                    }

                    controller.seriesVencidos = seriesVencidos;
                    controller.seriesAvencer = seriesAvencer;

                    controller.series = [
                        {
                            name: $rootScope.i18n('l-30-days', [], 'dts/acr'),
                            data: series1,
                            tooltip: { template: $rootScope.i18n('l-currency-format-wtout-space', [], 'dts/acr') + "#=kendo.toString(value, 'n2')#" }
                        }, {
                            name: $rootScope.i18n('l-31-to-60-days', [], 'dts/acr'),
                            data: series2,
                            tooltip: { template: $rootScope.i18n('l-currency-format-wtout-space', [], 'dts/acr') + "#=kendo.toString(value, 'n2')#" }
                        }, {
                            name: $rootScope.i18n('l-61-to-90-days', [], 'dts/acr'),
                            data: series3,
                            tooltip: { template: $rootScope.i18n('l-currency-format-wtout-space', [], 'dts/acr') + "#=kendo.toString(value, 'n2')#" }
                        }, {
                            name: $rootScope.i18n('l-91-to-120-days', [], 'dts/acr'),
                            data: series4,
                            tooltip: { template: $rootScope.i18n('l-currency-format-wtout-space', [], 'dts/acr') + "#=kendo.toString(value, 'n2')#" }
                        }, {
                            name: $rootScope.i18n('l-more-then-120-days', [], 'dts/acr'),
                            data: series5,
                            tooltip: { template: $rootScope.i18n('l-currency-format-wtout-space', [], 'dts/acr') + "#=kendo.toString(value, 'n2')#" }
                        }
                    ]; 

                    controller.categories = [
                        $rootScope.i18n('l-expired', [], 'dts/acr'), 
                        $rootScope.i18n('l-not-expired', [], 'dts/acr')
                    ]; 
                    
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

                case $rootScope.i18n('l-30-days', [], 'dts/acr'):
                    faixa = $rootScope.i18n('l-30d', [], 'dts/acr');
                    break;

                case $rootScope.i18n('l-31-to-60-days', [], 'dts/acr'):
                    faixa = $rootScope.i18n('l-31-to-60d', [], 'dts/acr');
                    break;

                case $rootScope.i18n('l-61-to-90-days', [], 'dts/acr'):
                    faixa = $rootScope.i18n('l-61-to-90d', [], 'dts/acr');
                    break;
                
                case $rootScope.i18n('l-91-to-120-days', [], 'dts/acr'):
                    faixa = $rootScope.i18n('l-91-to-120d', [], 'dts/acr');
                    break;

                case $rootScope.i18n('l-more-then-120-days', [], 'dts/acr'):
                    faixa = $rootScope.i18n('l-more-than-120d', [], 'dts/acr');
                    break;

            }

            controller.openDetail(event.category, faixa);

        };

        this.openList = function (situation, range) {

            var situacao = "",
                faixa = "";

            if (situation == 1) {
                situacao = $rootScope.i18n('l-expired', [], 'dts/acr');
            }
            else if (situation == 2) {
                situacao = $rootScope.i18n('l-not-expired', [], 'dts/acr');
            }

            if (range !== null){
                faixa = controller.traduzFaixa(range);
            }
            
            controller.openDetail(situacao, faixa);
        };
        
        this.openDetail = function (situacao, faixa) {

			var url = '/dts/acr/inquirecustdocs',
				disclaimers = [];

            if ( controller.dataemis != undefined ) {
                disclaimers.push({
                    property: 'dtEmis',
                    value: controller.dataemis,
                    model: { property: 'dtEmis', value: controller.dataemis }
                });
            } 

            if ( controller.datavenc != undefined) {
                disclaimers.push({
                    property: 'dtVenc',
                    value: controller.datavenc,
                    model: { property: 'dtVenc', value: controller.datavenc }
                });
            }

			if (situacao == $rootScope.i18n('l-expired', [], 'dts/acr')) {
                disclaimers.push({
                    property: 'numSituacao',
                    value: 1,
                    title: 'VENCIDOS',
                    model: { property: 'numSituacao', value: 1 }
                });
            }
            
            if (situacao == $rootScope.i18n('l-not-expired', [], 'dts/acr')) {
                disclaimers.push({
                    property: 'numSituacao',
                    value: 2,
                    title: 'AVENCER',
                    model: {property: 'numSituacao', value: 2}
                });
            }
            
            if (faixa == $rootScope.i18n('l-30d', [], 'dts/acr')) {
                disclaimers.push({
                    property: 'periodoVenc',
                    value: 1,
                    model: {property: 'periodoVenc', value: 1}
                });
            }
            
            if (faixa == $rootScope.i18n('l-31-to-60d', [], 'dts/acr')) {
                disclaimers.push({
                    property: 'periodoVenc',
                    value: 2,
                    model: {property: 'periodoVenc', value: 2}
                });
            }
            
            if (faixa == $rootScope.i18n('l-61-to-90d', [], 'dts/acr')) {
                disclaimers.push({
                    property: 'periodoVenc',
                    value: 3,
                    model: {property: 'periodoVenc', value: 3}
                });
            }
            
            if (faixa == $rootScope.i18n('l-91-to-120d', [], 'dts/acr')) {
                disclaimers.push({
                    property: 'periodoVenc',
                    value: 4,
                    model: {property: 'periodoVenc', value: 4}
                });
            }
            
            if (faixa == $rootScope.i18n('l-more-than-120d', [], 'dts/acr')) {
                disclaimers.push({
                    property: 'periodoVenc',
                    value: 5,
                    model: {property: 'periodoVenc', value: 5}
                });
			}

			serviceInquireCustDocsParam.setParamOpp(disclaimers, function () {
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
            return $rootScope.i18n(sentence, [], 'dts/acr');
		}
				
		this.applyConfig = function () {

            this.isInvalidForm();

            if ( controller.invalidForm ) {
                return;
            }
			
			$q.all([userPreference.setPreference('inquireCustDocs.dataemis', new Date(controller.dataemis).getTime()),
			        userPreference.setPreference('inquireCustDocs.datavenc', new Date(controller.datavenc).getTime())])
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
		
	}//function dashboardInquireCustDocsCtrl(loadedModules, userMessages)

	index.register.controller('acr.dashboard.inquirecustdocs.Controller', dashboardInquireCustDocsCtrl);
});

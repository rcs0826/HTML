define(['index', 
    '/dts/acr/js/acr-factories.js', 
    '/dts/acr/js/userpreference.js', 
    '/dts/acr/js/acr-components.js',
    '/dts/acr/html/inquirerepdocs/inquirerepdocs-services.param.js'
], function (index) {

	dashboardInquireRepDocsCtrl.$inject = ['$rootScope', '$scope', '$location', '$filter', '$window', 'acr.inquirerepdocs.Factory', 'userPreference', '$q', 'acr.inquirerepdocs.param-service', 'TOTVSEvent'];

	function dashboardInquireRepDocsCtrl($rootScope, $scope, $location, $filter, $window, service, userPreference, $q, serviceInquireRepDocsParam, TOTVSEvent) {
        	
        var controller = this;
        
        controller.listResult = [];
        controller.seriesVencidos = [];
        controller.seriesAvencer = [];
        controller.series = [];
        controller.categories = [];
        controller.customersOfRepres = [];
        controller.optionsAvencer = undefined;
        controller.optionsVencidos = undefined;
        controller.currency = { nom_prefix_moeda: 'R$' };
        controller.model = undefined;

        controller.dataemis = new Date().getTime();
        controller.datavenc = new Date().getTime();		
        controller.cdncliente = 0;	

        controller.innerWidth = undefined;
        controller.tamGrafico = 550;

        controller.innerWidth = window.innerWidth;
        if (controller.innerWidth < 580){
            controller.tamGrafico = 285;
        }
        
        this.formatCurrency = function (value) {
			return $filter('currency')(value, controller.currency.nom_prefix_moeda, 2);
        };
        
        $q.all([userPreference.getPreference('inquireRepDocs.dataemis'),
                userPreference.getPreference('inquireRepDocs.datavenc'),
                userPreference.getPreference('inquireRepDocs.cdncliente')])
        .then(function(data) {
                            
            var dt = controller.dataemis;
            var dt2 = controller.datavenc;
            var cdn = controller.cdncliente;

            if (data[0].prefValue && data[0].prefValue != "undefined") {
                dt = new Date(parseFloat(data[0].prefValue)).getTime();
            }					
            if (data[1].prefValue && data[1].prefValue != "undefined") {
                dt2 = new Date(parseFloat(data[1].prefValue)).getTime();
            }
            if (data[2].prefValue && data[2].prefValue != "undefined") {
                cdn = data[2].prefValue;
            }			
            
            if(!(dt > 0)){
                dt = new Date().getTime(); 
            }
            
            if(!(dt2 > 0)){
                dt2 = new Date().getTime(); 
            }

            if(!(cdn > 0)){
                cdn = 0;
            }
                                                        
            controller.dataemis = dt;
            controller.datavenc = dt2;
            controller.cdncliente = cdn;
             
            service.getNomAbrevCustomer(controller.cdncliente, function(result){
                if (result) {              
                    angular.forEach(result, function (value) {
                        controller.model.ttCustomer = value;
                    });
                }
            });
            
            controller.vencidos = undefined;
            controller.aVencer = undefined;                   
            controller.loadData();
        });
		
		controller.loadData = function() {

            controller.listResult = [];
            controller.categories = [];
            controller.customersOfRepres = [];
            var i,
				dValue,
				seriesVencidos = [],
                seriesAvencer = [],
                series1 = [],
                series2 = [],
                series3 = [],
                series4 = [],
                series5 = [];
            
            service.getTotalInquireRepDocs(controller.cdncliente, controller.dataemis, controller.datavenc, function(result){
                
                if (result) {

                    controller.vencidos = 0;
                    controller.aVencer = 0;

                    angular.forEach(result, function (value) {
                        controller.vencidos = value.valSdoVencid;
                        controller.aVencer = value.valSdoAvencer;                        
                    });
                }
            });

            service.getRangeInquireRepDocs(controller.cdncliente, controller.dataemis, controller.datavenc, function(result){

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
        
        this.getCustomers = function () {
            service.getCustomersOfRepresentative(controller.dataemis, controller.datavenc, function(result){
                if (result) {
                    
                    angular.forEach(result, function (value) {
                        controller.customersOfRepres.push(value);
                    });
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

            var situacao = "",
                faixa = "";

            if (!event) {
				return;
            }

            switch (event.category) {

                case $rootScope.i18n('l-expired', [], 'dts/acr'):
                    situacao = 'docStatusOverdue';
                    break;

                case $rootScope.i18n('l-not-expired', [], 'dts/acr'):
                    situacao = 'docStatusDue';
                    break;

            }

            switch (event.series.name) {

                case $rootScope.i18n('l-30-days', [], 'dts/acr'):
                    faixa = 'upTo30days';
                    break;

                case $rootScope.i18n('l-31-to-60-days', [], 'dts/acr'):
                    faixa = 'from31to60days';
                    break;

                case $rootScope.i18n('l-61-to-90-days', [], 'dts/acr'):
                    faixa = 'from61to90days';
                    break;
                
                case $rootScope.i18n('l-91-to-120-days', [], 'dts/acr'):
                    faixa = 'from91to120days';
                    break;

                case $rootScope.i18n('l-more-then-120-days', [], 'dts/acr'):
                    faixa = 'over120days';
                    break;
   
            }

            controller.openDetail(situacao, faixa, controller.cdncliente);
        };

        this.openList = function (situation, range) {

            var situacao = "";
            var faixa = "";

            if (situation !== null) {
                switch (situation) {

                    case 1:
                        situacao = 'docStatusOverdue';
                        break;

                    case 2:
                        situacao = 'docStatusDue';
                        break;

                }

            }

            if (range !== null){

                switch (range) {

                    case 1:
                        faixa = 'upTo30days';
                        break;

                    case 2:
                        faixa = 'from31to60days';
                        break;

                    case 3:
                        faixa = 'from61to90days';
                        break;
                    
                    case 4:
                        faixa = 'from91to120days';
                        break;

                    case 5:
                        faixa = 'over120days';
                        break;
                    
                }

            }
            
            controller.openDetail(situacao, faixa, controller.cdncliente);
        };
        
        this.openDetail = function (situacao, faixa, cliente) {                     
            var url = $rootScope.appRootContext + 'program-html/html.RepresentReceivableDocument/',
                issueDate = new Date(controller.dataemis),
                dueDate = new Date(controller.datavenc),
                disclaimers = [];
                
            disclaimers.push({
                property: 'queryType',
                value: 'openDocuments'
            });

            if (cliente != undefined) {
                disclaimers.push({
                    'property': 'customerList',
                    'value': cliente == 0 ? 'all' : cliente.toString()
                });
            }

            if (controller.dataemis != undefined ) {

                issueDate = issueDate.getFullYear() + '-' + ((issueDate.getMonth() + 1) <= 9 ? '0' + (issueDate.getMonth() + 1) : (issueDate.getMonth() + 1)) + '-' + (issueDate.getDate() <= 9 ? '0' + issueDate.getDate() : issueDate.getDate());
                
                disclaimers.push({
                    'property': 'afterIssueDate',
                    'value': issueDate
                });
            }

            if ( controller.datavenc != undefined) {

                dueDate = dueDate.getFullYear() + '-' + ((dueDate.getMonth() + 1) <= 9 ? '0' + (dueDate.getMonth() + 1) : (dueDate.getMonth() + 1)) + '-' + (dueDate.getDate() <= 9 ? '0' + dueDate.getDate() : dueDate.getDate());

                disclaimers.push({
                    'property': 'untilDueDate',
                    'value': dueDate
                });
            }

			if (situacao != undefined) {
                disclaimers.push({
                    'property': 'documentStatus',
                    'value': situacao == "" ? "all" : situacao
                });
            }

            if (faixa != undefined) {
                disclaimers.push({
                    'property': 'dueRange',
                    'value': faixa == "" ? "all" : faixa
                });
            }

            $window.localStorage.setItem('RepRecDoc.dashboard', angular.toJson(disclaimers));

            $scope.safeApply(function () {
                $location.path(url);
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
			
			$q.all([userPreference.setPreference('inquireRepDocs.dataemis', new Date(controller.dataemis).getTime()),
                    userPreference.setPreference('inquireRepDocs.datavenc', new Date(controller.datavenc).getTime()),
                    userPreference.setPreference('inquireRepDocs.cdncliente', controller.cdncliente)])
				.then(function () {
                    controller.vencidos = undefined;
                    controller.aVencer = undefined; 
					controller.loadData();					
                    controller.listShow = true;
                    controller.chartsShow = false;
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
		
	}//function dashboardInquireRepDocsCtrl(loadedModules, userMessages)

	index.register.controller('acr.dashboard.inquirerepdocs.Controller', dashboardInquireRepDocsCtrl);
});

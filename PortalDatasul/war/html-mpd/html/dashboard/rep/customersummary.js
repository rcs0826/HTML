/* global angular*/
define(['index',  '/dts/mpd/js/userpreference.js', '/dts/mpd/js/portal-factories.js', '/dts/mpd/js/mpd-factories.js', '/dts/mpd/js/zoom/grupo-cli.js'], function(index) {

    customerSummaryCtrl.$inject = ['$rootScope', 'salesorder.customer.Factory', 'userPreference', '$q', 'mpd.companyChange.Factory'];

    function customerSummaryCtrl($rootScope, customerSummary, userPreference, $q, companyChange) {
	
        var customerCtrl = this;
        this.summaryShow = true;
        customerCtrl.repres = [];
        customerCtrl.allUserGroups = [];
        customerCtrl.disclaimers = [];
        
        $q.when($rootScope.currentuser).then(function (result) {
            $q.all([userPreference.getPreference('custSummaryRepGroups')])
                .then(function (data) {
                    if (data[0].prefValue) {
                        customerCtrl.disclaimers = angular.fromJson(data[0].prefValue);

                        angular.forEach(customerCtrl.disclaimers, function (value, key) {
                            var codeGroup = value.title.split(' - ');
                            customerCtrl.allUserGroups.push({ codgrcli: codeGroup[0] });
                        });
                    }
                    customerCtrl.customerData = undefined;
                    customerCtrl.loadData();
                });
        });
                       
        this.addDisclaimer = function(property, value, label) {
                                                
            customerCtrl.disclaimers.push({
                property: property,
                value: value,
                title: label
            });
                                                
        }             
        
        this.removeDisclaimer = function(disclaimer) {
                                                                                              
            // pesquisa e remove o disclaimer do array
            var index = customerCtrl.disclaimers.indexOf(disclaimer);
            if (index != -1) {
                customerCtrl.disclaimers.splice(index, 1);
            }                                    
                                                            
            for(i = 0; i < customerCtrl.allUserGroups.length; i++) {                                
                if(disclaimer.title.split(' - ')[0] == customerCtrl.allUserGroups[i].codgrcli){                                                                                                                                                                
                    var index = customerCtrl.allUserGroups.indexOf(customerCtrl.allUserGroups[i])                   
                        if (index != -1) {                                                
                        customerCtrl.allUserGroups.splice(index, 1);
                    }                                        
                } 
            }                                    
        }               
                       
                       	
		// Busca todas as empresas vinculadas ao usuario logado | Método getDataCompany presente na fchdis0035api.js |
		if (companyChange.checkContextData() === false){
			companyChange.getDataCompany(true);
		}

		// busca os dados novamente quando feita a troca de empresa
		//$rootScope.$$listeners['mpd.selectCompany.event'] = [];
		$rootScope.$on("mpd.selectCompany.event", function (event, currentcompany) {
                    customerCtrl.customerData = undefined;
                    customerCtrl.loadData();
        });
        
        $rootScope.$on('selectedRepresentatives', function(event) {
			customerCtrl.customerData = undefined;
            customerCtrl.loadData();
		});

        this.loadData = function() {

            if ($rootScope.selectedRepresentatives){
				customerCtrl.repres = [];
				angular.forEach($rootScope.selectedRepresentatives, function (value, key) {			
                    //customerCtrl.repres = customerCtrl.repres + value['cod-rep'] + '|';		
                    
                    customerCtrl.repres.push({ codrep: value['cod-rep'] });
				});
			} else {
				customerCtrl.repres = [];
            }
                        
            obj = {
                ttRepres: customerCtrl.repres,
                ttGrupoCliente: customerCtrl.allUserGroups
            };
                           
            customerSummary.getCustomerSummary({}, obj, function(result) {

                var s = new Array();
                var i = 0;
              
                angular.forEach(result, function(value, key) {
                                                                                
                    var chartLabel = value.categoria + '&nbsp;</td><td class="legendLabel" style="text-align: right;">' + value.quantidade;
                    s.push({label: chartLabel, data: value.quantidade});
                    if (parseInt(value.quantidade))
                        i++;
                });

                customerCtrl.customerData = s;


                if (i == 0) {
                    customerCtrl.noResults = true;
                    customerCtrl.summaryShow = false;
                } else {
                    customerCtrl.noResults = false;
                    customerCtrl.summaryShow = true;                                                                                
                }
            });              
                                                                                                             
        };

        this.customerOptions = {
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

        this.applyConfig = function() {
            this.summaryShow = false;
			$q.all([userPreference.setPreference('custSummaryRepGroups', angular.toJson(customerCtrl.disclaimers))])
                    .then(function() {
                            customerCtrl.customerData = undefined;
                            customerCtrl.summaryShow = true;     
                            customerCtrl.loadData();
                    });
        }
              
       this.onZoomSelectUsersOrGroups = function() {
                                                                      
		   if (!this.selectedUsersOrGroups) return;
                      
		   if (this.selectedUsersOrGroups.objSelected && this.selectedUsersOrGroups.size >= 0) {               
				this.selectedUsersOrGroups = this.selectedUsersOrGroups.objSelected;
		   }

		   if (!angular.isArray(this.selectedUsersOrGroups)) {               
			    this.selectedUsersOrGroups = [this.selectedUsersOrGroups];
		   }
                        
		   var userGroups = [];    
           customerCtrl.disclaimers = [];                                                                    
                                                                                                                                  
		   for (var i = 0; i < this.selectedUsersOrGroups.length; i++) {                               
                                                                                                                                                                                       
		       var userGroup = this.selectedUsersOrGroups[i];                                                                
               userGroups.push({codgrcli: userGroup['cod-gr-cli']});                                                                
               customerCtrl.addDisclaimer(null, null, userGroup['cod-gr-cli'] + ' - ' + userGroup['descricao'] + ' ');                
                                         
			}  
                                                                                                                            
            this.allUserGroups = userGroups;                                                                                                                                                                                                                    
            delete this.selectedUsersOrGroups;                                                           
            
		}
                     
    }//function customerSummaryCtrl(loadedModules, userMessages)

    index.register.controller('salesorder.dashboard.customerSummary.Controller', customerSummaryCtrl);
});
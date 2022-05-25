/* global angular*/
define(['index',  '/dts/mpd/js/userpreference.js', '/dts/mpd/js/api/fchdis0048.js', '/dts/mpd/js/portal-factories.js', '/dts/mpd/js/zoom/grupo-cli.js'], function(index) {

    customerSummaryApdCtrl.$inject = ['$rootScope', 'mpd.customerapd.Factory', 'userPreference', '$q', 'portal.getUserData.factory', '$location'];

    function customerSummaryApdCtrl($rootScope, customerSummaryApd, userPreference, $q, userdata, $location) {
                               
        var customerCtrl  = this;
        this.summaryShow  = true;
        customerCtrl.allUserGroups = [];
        customerCtrl.disclaimers = [];
        
        $q.all([userPreference.getPreference('custSummaryGroups')])
                       .then(function(data) {                                                                                                                                                                 
                           if (data[0].prefValue){ 
                               customerCtrl.disclaimers    = angular.fromJson(data[0].prefValue);
                               
                               angular.forEach(customerCtrl.disclaimers, function(value, key) {
                                   var codeGroup = value.title.split(' - ');
                                   customerCtrl.allUserGroups.push({codgrcli: codeGroup[0]}); 
                               });
                           }                                                                                                            
                           
                           customerCtrl.customerData = undefined;
                           customerCtrl.loadData();
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
                                                                                                                                                                                                                     
        this.loadData = function() {
                                                                                              
            customerSummaryApd.returnCustomerSumaryOrderAdder(customerCtrl.allUserGroups, function(result) {

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
			$q.all([userPreference.setPreference('custSummaryGroups', angular.toJson(customerCtrl.disclaimers))])
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
        
        this.openCustomerList = function(){
            customerCtrl.queryCustomerGroups = '';
            
            angular.forEach(customerCtrl.allUserGroups, function(value, key) {
                if(value) customerCtrl.queryCustomerGroups = value['codgrcli'] + ',' + customerCtrl.queryCustomerGroups;                
            });
            
            if(customerCtrl.queryCustomerGroups){
                $location.url('/dts/mpd/internalcustomers/true?groups=' + customerCtrl.queryCustomerGroups);
            }else{
                $location.url('/dts/mpd/internalcustomers');
            }
        }

    }//function customerSummaryCtrl(loadedModules, userMessages)

    index.register.controller('apd.dashboard.customerSummaryApd.Controller', customerSummaryApdCtrl);
});
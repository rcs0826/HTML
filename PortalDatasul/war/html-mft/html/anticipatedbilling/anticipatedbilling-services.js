define([
	'index',
	'/dts/mft/js/api/fchdis0062.js'
	
], function(index) {
	'use strict';

	anticipatedBillingController.$inject = [
		'$scope',
		'$rootScope',
		'mft.anticipatedbilling.Factory',
		'$filter',
		'$totvsprofile',
		'totvs.app-main-view.Service',
		'$stateParams',
		'$q',		
		'$location',
		'TOTVSEvent',
		'mft.anticipatedbilling.helper',
		'$modal',
		'$timeout'
	];
	function anticipatedBillingController($scope,
									  	  $rootScope,
										  appsintegFactory,
										  $filter,
										  $totvsprofile,
										  appViewService,
										  $stateParams,
										  $q,										
										  $location,
										  TOTVSEvent,
										  helper,
										  $modal,
										  $timeout) {			
		var vm = this;

		vm.i18n = $filter('i18n');
			
		vm.apps = [];
		vm.disclaimers = [];
		vm.applications = 0;
		vm.settings;	
		vm.filters = [];
		
		vm.advancedSearch = {model: {}};	

		this.init = function init() {
			vm.search(false);
		};
		
		this.init = function init() {
			
			var hasError = false;
			            
            if (!hasError) {
                vm.search(false);
			} 
			           
		};

		vm.search = function search(isMore) {
			
			var options;
			
			vm.addFilters();
	
			vm.appsCount = 0;
			if (!isMore) {
				vm.apps = [];
			}

			if(vm.filters.length > 0){
			vm.filters.forEach(function(filter) {
				if(filter.property == 'productFirst'){
				    vm.productFirstValue = filter.value;
				}
				if(filter.property == 'productLast'){
					vm.productLastValue = filter.value;
				 }
				 if(filter.property == 'siteFirst'){
					vm.siteFirstValue = filter.value;
				 }
				 if(filter.property == 'siteLast'){
					vm.siteLastValue = filter.value;
				 }
			});
			}
			
			options = {
				page: vm.apps.length,
				pageSize: 50,
				productFirst: vm.productFirstValue,
				productLast: vm.productLastValue,
				siteFirst: vm.siteFirstValue,
				siteLast: vm.siteLastValue
			};			

			if(vm.searchValue){
				options.searchValue = vm.searchValue
			}

			appsintegFactory.getAnticipatedBalance(options, function(result) {																	
				vm.hasNext = result.hasNext;	
				vm.total   = result.total;			
				vm.apps    = vm.apps.concat(result.items);			
			});				
			
		};

		vm.openAdvancedSearch = function openAdvancedSearch() {

			var modalInstance = $modal.open({
				templateUrl: '/dts/mft/html/anticipatedbilling/anticipatedbilling-adv-search.html',
				controller: 'mft.anticipatedbilling.adv-search.Controller as controller',
				size: 'lg',
				resolve: {
				  model: function () {
					return vm.advancedSearch;
				  }
				}
			  });

			  modalInstance.result.then(function (selectedItem) {
				  vm.search(false);	
				  vm.filters = [];
				  vm.addFilters(); 
				  vm.addDisclaimers(); 
			  });

		}

		vm.addFilters = function () {
	
			if (vm.searchValue && vm.searchValue.trim().length > 0) {
				var searchValue = $.grep(vm.disclaimers, function(filter){ return filter.property.indexOf('searchValue') >= 0; });
				var disclaimer = helper.addFilter('searchValue', vm.searchValue, $rootScope.i18n('l-simple-filter'));
				if(searchValue.length > 0) {
					var index = vm.disclaimers.indexOf(searchValue[0]);
					vm.disclaimers[index] = disclaimer;
				} else {
					vm.disclaimers.push(disclaimer);
				}

				vm.filters.push(disclaimer);

			}

	    	if (vm.advancedSearch.model.productFirst)
				vm.filters.push(helper.addFilter('productFirst',vm.advancedSearch.model.productFirst, vm.i18n('l-item-first'), ' : ' + vm.advancedSearch.model.productFirst));
        	if (vm.advancedSearch.model.productLast)
				vm.filters.push(helper.addFilter('productLast',vm.advancedSearch.model.productLast, vm.i18n('l-item-last') , ': ' + vm.advancedSearch.model.productLast));
		    if (vm.advancedSearch.model.siteFirst)
				vm.filters.push(helper.addFilter('siteFirst',vm.advancedSearch.model.siteFirst, vm.i18n('l-initial-estabelec'), ' : ' + vm.advancedSearch.model.siteFirst));
        	if (vm.advancedSearch.model.siteLast)
				vm.filters.push(helper.addFilter('siteLast',vm.advancedSearch.model.siteLast, vm.i18n('l-final-estabelec'),  ' : ' + vm.advancedSearch.model.siteLast));	
                        		
		}	
				
		vm.addDisclaimers = function () {
			vm.disclaimers = [];

			if(vm.filters.length > 0){
				vm.filters.forEach(function(filter) {
					vm.disclaimers.push(filter);
				});
			}
		}	

		vm.applySimpleFilter = function applySimpleFilter() {
			if (vm.searchValue && vm.searchValue.trim().length > 0) {
				var searchValue = $.grep(vm.disclaimers, function(filter){ return filter.property.indexOf('searchValue') >= 0; });
				var disclaimer = helper.addFilter('searchValue', vm.searchValue, $rootScope.i18n('l-simple-filter'));
				if(searchValue.length > 0) {
					var index = vm.disclaimers.indexOf(searchValue[0]);
					vm.disclaimers[index] = disclaimer;
				} else {
					vm.disclaimers.push(disclaimer);
				}

			}else{
				vm.disclaimers.forEach(function(tag) {
					var index = tag.property.indexOf('searchValue');
					if (index >= 0) {
						vm.disclaimers.splice(vm.disclaimers.indexOf(tag), 1);
					}
				});
			}
			vm.search(false);
		};

		vm.removeDisclaimer = function removeDisclaimer(disclaimer) {
			var index = vm.disclaimers.indexOf(disclaimer);
			if(index >= 0) {
				vm.disclaimers.splice(index,1);
			}

			if(disclaimer.property == "searchValue"){
			   vm.searchValue = "";	
			}
			if(disclaimer.property == 'productFirst'){
			   vm.advancedSearch.model.productFirst = "";
			}
			if(disclaimer.property == 'productLast'){
			   vm.advancedSearch.model.productLast = "";
			}
			if(disclaimer.property == 'siteFirst'){
			   vm.advancedSearch.model.siteFirst = "";
			}
			if(disclaimer.property == 'siteLast'){
			   vm.advancedSearch.model.siteLast = "";
			}

			if(vm.filters.length > 0){
			    vm.filters.forEach(function(filter) {

			      if(filter.property == 'productFirst'){
				     filter.value = "";
				  }
				  if(filter.property == 'productLast'){
				  	 filter.value = "";
				  }
				  if(filter.property == 'siteFirst'){
				   	 filter.value = "";
				  }
				  if(filter.property == 'siteLast'){
					filter.value = "";
				  }
				});
			}

			vm.search(false);
		};

		vm.removeSimpleFilter = function removeSimpleFilter() {
			vm.searchValue = "";
			vm.disclaimers.forEach(function (tag) {
				var index = tag.property.indexOf('searchValue');
				if (index >= 0) {
					vm.disclaimers.splice(vm.disclaimers.indexOf(tag), 1);
				}
			});

			vm.search();
		};

		vm.setQuickFilter = function setQuickFilter(filter) {
			vm.disclaimers = [].concat(filter.value);
			vm.search(false);
		};
						
		vm.listMovements = function(movSelected){

			var options, filters = [];

			options = {
				page: 0,
				pageSize: 50,
				reference: movSelected['reference'],
				itemCode: movSelected['itemCode'],
				customer: movSelected['customer'],
				site: movSelected['site']
			};	
						
			appsintegFactory.getAnticipatedMovement(options, function (result) {	

				if (!result.$hasError) {
					
					var modalInstance = $modal.open({
						templateUrl: '/dts/mft/html/anticipatedbilling/anticipatedbillingmovement.list.html',
						controller: 'mft.anticipatedbillingmovement.list.control as controller',
						backdrop: 'static',
						keyboard: false,
						size: 'lg',
						resolve: {
							modalParams: function() {
								return {
								  listMov: result.items,
								  listTotal: result.total,
								  balanceTotal: result.items[0].balanceBilling
								}
							}
						}
					});
				}
			});
		}

		$scope.$on('$destroy', function () {
			vm = undefined;
		});

		if (appViewService.startView(vm.i18n('l-search-atincipated-billing'), this)) {
			vm.init();
		}else{
			vm.init();
		}
				
	}
	
	// *************************************************************************************
	// *** HELPER
	// *************************************************************************************
	anticipatedBillingHelper.$inject = ['$filter'];
	function anticipatedBillingHelper($filter) {
		
		return {

			addFilter: function (property, value, title, type, hide) {
				var filter = {
					'property': property,
					'value': value,
					'type': type ? type : 'string',
					'hide': hide === true
				};

				switch (type) {
					case 'date':
						filter.title = title + ': ' + $filter('date')(value, 'shortDate');
					break;
					case 'boolean':
						filter.title = title;
					break;
					default:
						filter.title = title + ': ' + value;
					break;
				}
				return filter;
			},

			parseDisclaimersToFilter: function(disclaimers) {
				disclaimers = disclaimers || [];
				var filters = {};
				disclaimers.forEach(function(disclaimer) {
					filters[disclaimer.property] = disclaimer.value;
				});
				return filters;
			},

			parseDisclaimersToParameters: function(disclaimers) {
				disclaimers = disclaimers || [];
				var options = {
					properties: [],
					values: []
				};
				disclaimers.forEach(function(filter) {
					if (filter.property) {
						options.properties.push(filter.property);
						switch (filter.type) {
							case 'date':
								options.values.push($filter('date')(filter.value, 'shortDate'));
							break;
							default:
								options.values.push(filter.value);
							break;
						}
					}
				});
				return options;
			}
		};
		
	}
		
	index.register.service('mft.anticipatedbilling.helper', anticipatedBillingHelper);
	index.register.controller('mft.anticipatedbilling.list.control', anticipatedBillingController);

	anticipatedBillingMovementController.$inject = ['$modalInstance', 'modalParams'];
	function anticipatedBillingMovementController($modalInstance, modalParams) {

		var controller = this;

		controller.movements    = modalParams.listMov;
		controller.total        = modalParams.listTotal;
		controller.balanceTotal = Number(modalParams.balanceTotal).toFixed(4);

		controller.close = function() {
			$modalInstance.dismiss();
		}

	}
	index.register.controller('mft.anticipatedbillingmovement.list.control', anticipatedBillingMovementController);

	anticipatedbillingAdvSearchController.$inject = ['$modalInstance', 'model'];
	function anticipatedbillingAdvSearchController ($modalInstance, model) {

		this.advancedSearch = model;

		this.search = function () {
			$modalInstance.close();
		}
		
		this.close = function () {
			$modalInstance.dismiss();
		}
	}
	index.register.controller('mft.anticipatedbilling.adv-search.Controller', anticipatedbillingAdvSearchController);

});

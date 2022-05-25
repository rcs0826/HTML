define(['index',  
		'/dts/mpd/js/userpreference.js', 
		'/dts/mpd/js/portal-factories.js' ,
		'/dts/mpd/js/zoom/estabelec.js', 
		'/dts/mpd/js/mpd-factories.js',
		'/dts/dts-utils/js/lodash-angular.js',
		'/dts/mpd/js/api/fchdis0035api.js' ], function (index) {
	
	index.stateProvider
	
	.state('dts/mpd/salesgoals', {  
		abstract: true,				 
		template: '<ui-view/>'       
	})
	.state('dts/mpd/salesgoals.start', {
	  url:'/dts/mpd/salesgoals',
	  controller:'salesorder.salesgoals.Controller',
	  controllerAs: 'controller',
	  templateUrl:'/dts/mpd/html/salesgoals/salesgoals.html'
	})
	

	salesGoalsCtrl.$inject = ['$rootScope', 
							  'salesorder.salesgoals.Factory', 
							  'userPreference', 
							  'totvs.app-main-view.Service', 
							  'portal.generic.Controller', 
							  'portal.getUserData.factory', 
							  '$filter', 
							  '$q', 
							  '$modal', 
							  'mpd.companyChange.Factory',
							  'mpd.fchdis0035.factory'];

	function salesGoalsCtrl($rootScope, 
							salesgoals, 
							userPreference, 
							appViewService, 
							genericController, 
							userdata, 
							$filter, 
							$q, 
							$modal, 
							companyChange,
							fchdis0035) {
		
		var controller = this;
		
		var date = $filter('date');
		var i18n = $filter('i18n');
				
		genericController.decorate(controller, salesgoals);
		
		controller.advancedSearch = {model: {}};
				
        controller.loadMore = function() {
        	controller.findRecords(controller.listResult.length, controller.filterBy);
        };
        
        controller.removeSelectedFilter = function (filter) {
        	controller.removeFilter(filter);
			if (filter.property == "simpleFilter") {
				controller.quickSearchText = '';
			}
			delete controller.advancedSearch.model[filter.property];
            controller.loadData();
        }
        
        controller.setQuickFilter = function (filter) {
        	controller.addFilters();   
			if (filter == 'reachedTarget') controller.addFilter(filter,true, filter, i18n('l-sales-goals-reached'), controller);
			if (filter == 'openTarget') controller.addFilter(filter,true, filter, i18n('l-sales-goals-open'), controller);
		    controller.loadData();
        }
        
        controller.addFilters = function () {
		    controller.clearFilter();
		    if (controller.quickSearchText)
		    	controller.addFilter('product',controller.quickSearchText, 'produtc', controller.quickSearchText);		    
        	if (controller.advancedSearch.model.codEstabel)
        		controller.addFilter('site',controller.advancedSearch.model.codEstabel, 'l-estabel', i18n('l-estabel') + ': ' + controller.advancedSearch.model.codEstabel);
        	if (controller.advancedSearch.model.productFirst)
        		controller.addFilter('productFirst',controller.advancedSearch.model.productFirst, 'productFirst', i18n('productFirst') + ': ' + controller.advancedSearch.model.productFirst);
        	if (controller.advancedSearch.model.productLast)
        		controller.addFilter('productLast',controller.advancedSearch.model.productLast, 'productLast', i18n('productLast') + ': ' + controller.advancedSearch.model.productLast);
        	if (controller.advancedSearch.model.refDate)
        		controller.addFilter('refDate',controller.advancedSearch.model.refDate, 'reference-date', i18n('reference-date') + ': ' + date(controller.advancedSearch.model.refDate, 'shortDate'));
        }
        
        controller.search = function() {        	
            controller.clearDefaultData(true);
		    controller.clearFilter();
            controller.addFilters();
            controller.loadData();
        }
        
        controller.loadData = function () {
        	controller.findRecords(null, controller.filterBy);
        }
		
		if (appViewService.startView(i18n('l-sales-goals'), 'salesorder.salesgoals.Controller', this)) {
			
			var paramVisibleFieldsMetasRepres = {cTable: "metas-repres"};

			fchdis0035.getVisibleFields(paramVisibleFieldsMetasRepres, function(result) {

				controller.metasRepresVisibleFields = result;	

				// Busca todas as empresas vinculadas ao usuario logado | M�todo getDataCompany presente na fchdis0035api.js |
				if (companyChange.checkContextData() === false){
					companyChange.getDataCompany(true);
				}
				
				// busca os dados novamente quando feita a troca de empresa
				$rootScope.$$listeners['mpd.selectCompany.event'] = [];
				$rootScope.$on("mpd.selectCompany.event", function (event, currentcompany) {			     
					controller.loadData();	
				});  
				
				$q.all([userPreference.getPreference('salesGoals.refDate'),
						userPreference.getPreference('salesGoals.codEstabel')]).then(function (results) {
							
					controller.advancedSearch.model.refDate = new Date().getTime();				
					if (results[0].prefValue) {
						controller.advancedSearch.model.refDate = new Date(Number(results[0].prefValue)).getTime();	
					}
					
					controller.advancedSearch.model.codEstabel = results[1].prefValue;			    
					if (controller.advancedSearch.model.codEstabel === "") controller.advancedSearch.model.codEstabel = " ";
					
					controller.addFilters();
					controller.loadData();
					
				});

			});
			
		}else {	
		
			// busca os dados novamente quando feita a troca de empresa 
			$rootScope.$$listeners['mpd.selectCompany.event'] = [];
		 	$rootScope.$on("mpd.selectCompany.event", function (event, currentcompany) {			     
				 controller.loadData();	
			});
		}
		
		controller.openAdvancedSearch = function() {
			var modalInstance = $modal.open({
			  templateUrl: '/dts/mpd/html/salesgoals/salesgoals-adv-search.html',
			  controller: 'salesorder.salesgoals.adv-search.Controller as controller',
			  size: 'lg',
			  resolve: {
				model: function () {
				  return controller.advancedSearch;
				}
			  }
			});

			modalInstance.result.then(function (selectedItem) {
				controller.search();
			});
		}
				
		

	} // function salesGoalsCtrl(loadedModules) 
	
	index.register.controller('salesorder.salesgoals.Controller', salesGoalsCtrl);
	
	salesgoalsAdvSearchController.$inject = ['$modalInstance', 'model'];
	function salesgoalsAdvSearchController ($modalInstance, model) {
		
		this.advancedSearch = model;
		
		this.search = function () {
			$modalInstance.close();
		}
		
		this.close = function () {
			$modalInstance.dismiss();
		}
	}
	index.register.controller('salesorder.salesgoals.adv-search.Controller', salesgoalsAdvSearchController);
	

});
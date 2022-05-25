define(['index',  '/dts/mpd/js/userpreference.js', '/dts/mpd/js/portal-factories.js', '/dts/mpd/js/mpd-factories.js'], function (index) {
	
    index.stateProvider
	
    .state('dts/mpd/prices', {  
            abstract: true,				 
            template: '<ui-view/>'       
    })
    .state('dts/mpd/prices.start', {
        url:'/dts/mpd/prices',
	controller:'salesorder.prices.Controller',
	controllerAs: 'controller',
	templateUrl:'/dts/mpd/html/prices/prices.html'
    });
    
    pricescontroller.$inject = ['$rootScope', '$filter', 'salesorder.prices.Factory', 'userPreference', 'totvs.app-main-view.Service', 'portal.generic.Controller', 'portal.getUserData.factory', 'mpd.companyChange.Factory'];

    function pricescontroller($rootScope, $filter, prices, userPreference, appViewService, genericController, userdata, companyChange) {
		
        var controller = this;
        var i18n = $filter('i18n');
				
		genericController.decorate(this, prices);
        
        this.advancedSearch = {model: {}};
        
        this.loadMore = function() {
            this.findRecords(controller.listResult.length, controller.filterBy).then(this.addLinkProperty);;
        };
        
        this.removeSelectedFilter = function (filter) {
            controller.removeFilter(filter);
			if (filter.property == "simpleFilter") {
				controller.quickSearchText = '';
			}
            delete controller.advancedSearch.model[filter.property];
            controller.loadData();
        };
        
        this.search = function() {
            controller.clearFilter(controller);            
            controller.addFilters();            
            controller.loadData();
        };
        
        this.addFilters = function() {
            controller.clearFilter();
            if (controller.quickSearchText) {
                controller.addFilter("simpleFilter", controller.quickSearchText, '', i18n('l-simple-filter') + ":" + controller.quickSearchText);
            }
        }
		
		this.addLinkProperty = function (data) {
			for (var index = 0; index < controller.listResult.length; index++) {
				var element = controller.listResult[index];
				// problema com caracter barra no codigo da tabela de preço
				// tem que codificar 2 vezes, porque o browser decodifica automaricamente na URL;
				element.nrTabpre = encodeURIComponent(encodeURIComponent(element['nr-tabpre']));
			}
		}
		
        this.loadData = function () {
            this.findRecords(null, controller.filterBy).then(this.addLinkProperty);
        };
        
        if (appViewService.startView(i18n('l-search-pricetable'), 'salesorder.prices.Controller', this)) {
			
			// Busca todas as empresas vinculadas ao usuario logado | Método getDataCompany presente na fchdis0035api.js | 
			if (companyChange.checkContextData() === false){
				companyChange.getDataCompany(true);
			}
			
			// busca os dados novamente quando feita a troca de empresa
			$rootScope.$$listeners['mpd.selectCompany.event'] = [];
			$rootScope.$on("mpd.selectCompany.event", function (event, currentcompany) {
			    controller.loadData();	
			});
		
            controller.loadData();	
	    }else {
		
			// busca os dados novamente quando feita a troca de empresa
			$rootScope.$$listeners['mpd.selectCompany.event'] = [];
		 	$rootScope.$on("mpd.selectCompany.event", function (event, currentcompany) {	
				controller.loadData();	
			});
		}
		
    } // function pricescontroller(loadedModules) 
    
    index.register.controller('salesorder.prices.Controller', pricescontroller);   
});
define(['index',
	'/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
    '/dts/hgp/html/hvp-healthDeclarationPending/healthDeclarationPendingFactory.js'
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER 
    // *************************************************************************************
    
    advancedFilterController.$inject = ['$rootScope', '$scope', '$modalInstance','listOfHealthDeclarationPending','AbstractAdvancedFilterController','TOTVSEvent','disclaimers','hvp.healthDeclarationPendingFactory'];
    function advancedFilterController($rootScope, $scope, $modalInstance, listOfHealthDeclarationPending, AbstractAdvancedFilterController,TotvsEvent,disclaimers,healthDeclarationPendingFactory) {

        var _self = this;
        this.model = {};

        this.disclaimers = disclaimers;
        this.listOfHealthDeclarationPending = listOfHealthDeclarationPending;
        _self.today = new Date();

        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        this.save = function () {
            $modalInstance.dismiss('cancel');
        };
		
        this.search = function(){
             
            var startAt = 0;
            this.totalOfhealthDeclaCount = 0;

            _self.hasDoneSearch = false;
            _self.listOfHealthDeclarationPending = [];

            
            filters = [{'cdModalidade':_self.model.cdModalidadeStart,'nrTerAdesao':_self.model.nrTermoStart,'nmUsuario':_self.model.nmUsuarioStart}];
                                  
            $modalInstance.close(filters);      
        }
        this.init = function () {
            this.initialize();

          /*  _self.model.documentStatus = 0;
            _self.model.invoiceType = 0;*/
        };

			
        $.extend(this, AbstractAdvancedFilterController);
        
    }

    index.register.controller('hvp.healthDeclarationPendingAdvanceFilterController', advancedFilterController);
	
});


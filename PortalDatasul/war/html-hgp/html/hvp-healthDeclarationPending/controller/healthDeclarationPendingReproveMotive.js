define(['index'	
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER 
    // *************************************************************************************    
	reproveMotive.$inject = ['$rootScope', '$scope','$modalInstance','healthDeclaPending','hvp.healthDeclarationPendingFactory','TOTVSEvent','listOfHealthDeclarationPending'];
    function reproveMotive($rootScope, $scope, $modalInstance,healthDeclaPending,healthDeclarationPendingFactory,TOTVSEvent,listOfHealthDeclarationPending) {

        var _self = this;
        this.model = {};
		_self.healthDeclaPending             = healthDeclaPending;
        _self.listOfHealthDeclarationPending = listOfHealthDeclarationPending;
        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        this.save = function () {
            healthDeclarationPendingFactory.disapprove(_self.healthDeclaPending, function (result) { 
                    if(result.$hasError){
                        $modalInstance.dismiss('cancel');
                    } else if (result) {     
                        if (_self.listOfHealthDeclarationPending != undefined){
                            for(i=0;i < _self.listOfHealthDeclarationPending.length;i++){
                                if(_self.listOfHealthDeclarationPending[i].id == _self.healthDeclaPending.id){
                                    _self.listOfHealthDeclarationPending.splice(i,1);
                                }
                            }
                        }
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'success', title: 'Beneficiario ' +  healthDeclaPending.nmBeneficiario +' reprovado com sucesso!'
                        });
                         $modalInstance.close();                     
                    }
                });  
        };		

        this.init = function () {
            this.initialize();
        };
		      
        
    }

    index.register.controller('hvp.healthDeclarationPendingReproveMotive', reproveMotive);
	
});


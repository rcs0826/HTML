define(['index',    
], function (index) {

    bondDeclarationModalController.$inject = ['$rootScope', '$scope','$modalInstance', '$state', '$stateParams', '$location',
                                                'TOTVSEvent', '$filter'];
    function bondDeclarationModalController($rootScope, $scope, $modalInstance, $state, $stateParams, $location,
                                              TOTVSEvent, $filter) {

        var _self = this;        

        _self.inTipoPessoaOptions = [
            {data: 1, label:"Pessoa Física/Pessoa Jurídica"},
            {data: 2, label:"Pessoa Física"},
            {data: 3, label:"Pessoa Jurídica"}
        ];

        this.cancel = function () {           
            $modalInstance.dismiss('cancel');
        };

        this.init = function () {            
            _self.lgGeraDeclaracaoPessoaFisica = true;
            _self.lgGeraDeclaracaoPessoaJuridica = true;            

            _self.inTipoPessoa = 1;
        }

        this.generateBondReport = function(){
            var inTipoPessoaAux = "";

            switch(_self.inTipoPessoa){
                case 1:
                    inTipoPessoaAux = "AMBOS";
                    break;

                case 2:
                    inTipoPessoaAux = "PESSOA_FISICA";
                    break;

                case 3:
                    inTipoPessoaAux = "PESSOA_JURIDICA";
                    break;
            }            
                    
            var obj = {property: "inTipoPessoaGeracao", value: inTipoPessoaAux };

            $modalInstance.close(obj);
        }

        $scope.$watch('$viewContentLoaded', function() {
            _self.init();
        }); 
    }
    index.register.controller('hrs.bondDeclarationModal.Control', bondDeclarationModalController);
});


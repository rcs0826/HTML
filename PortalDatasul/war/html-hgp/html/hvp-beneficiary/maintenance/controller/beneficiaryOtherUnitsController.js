define(['index',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/hvp-beneficiary/beneficiaryFactory.js',
    '/dts/hgp/html/global/hcgGlobalFactory.js',
    '/dts/hgp/html/hcg-city/cityZoomController.js'
], function (index) {

    beneficiaryOtherUnitsController.$inject = ['$rootScope', '$scope', '$stateParams', 'totvs.app-main-view.Service',
                                               'hvp.beneficiary.Factory', 'hcg.cityZoomController','$location', 'hcg.global.Factory'];
    function beneficiaryOtherUnitsController($rootScope, $scope, $stateParams, appViewService,
                            beneficiaryFactory, cityZoomController, $location, hcgglobalFactory) {

        var _self = this;
        
        this.genderValues = [
            {value: 0, label: 'Feminino'},
            {value: 1, label: 'Masculino'}
        ];
        
        this.contractNatureValues = [
            {value: 0, label: '0 - Não Informado'},
            {value: 2, label: '2 - Física'},
            {value: 3, label: '3 - Empresarial'},
            {value: 4, label: '4 - Adesão'},
            {value: 5, label: '5 - Beneficiente'}
        ];
        
        this.onCitySelect = function(){

            hcgglobalFactory.getCityByKey(_self.beneficiary.cdCidade, [],
                function (val) {
                    //_self.city = cityZoomController.getItemResult();
                    _self.city = val;
            _self.beneficiary.enUf = _self.city.estado;
                });
        };
        
        this.save = function() {
            //se for 0, está preenchido todos os campos que tem o required
            var isValid = 0;
            
            _self.dates.dtCadastro = new Date(_self.beneficiary.dtCadastro).toLocaleDateString() + " 00:00:00:0000";
            
            if(angular.isUndefined(_self.beneficiary.cdCarteiraUsuario) && 
               StringTools.hasOnlyNumbers(_self.beneficiary.cdCarteiraUsuario) === false){
                $('#cdCarteiraUsuario').querySelectorAll('input').css('border', '1px solid #f00');
                isValid += 1;
            }else{
                if(_self.beneficiary.cdCarteiraUsuario.toString().length !== 17){
                    $('#cdCarteiraUsuario').querySelectorAll('input').css('border', '1px solid #f00');
                    isValid += 1;
                    
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error', title: 'É necessário que o campo Carteira Beneficiário tenha 17 dígitos!'
                    });
                }else{
                    $('#cdCarteiraUsuario').querySelectorAll('input').css('border', '');
                }
            }
            
            if(angular.isUndefined(_self.beneficiary.nmUsuario)){
                $('#nmUsuario').querySelectorAll('input').css('border', '1px solid #f00');
                isValid += 1;
            }else{
                $('#nmUsuario').querySelectorAll('input').css('border', '');
            }
            
            if(!angular.isUndefined(_self.beneficiary.dtValidadeCart)){
               _self.dates.dtValidadeCart = new Date(_self.beneficiary.dtValidadeCart).toLocaleDateString() + " 00:00:00:0000";
               $('#dtValidadeCart').querySelectorAll('input').css('border', '');
            }else{
                $('#dtValidadeCart').querySelectorAll('input').css('border', '1px solid #f00');
                isValid += 1;
            }
            
            if(!angular.isUndefined(_self.beneficiary.dtNascimento)){
                _self.dates.dtNascimento = new Date(_self.beneficiary.dtNascimento).toLocaleDateString() + " 00:00:00:0000";
                $('#dtNascimento').querySelectorAll('input').css('border', '');
            }else{
                $('#dtNascimento').querySelectorAll('input').css('border', '1px solid #f00');
                isValid += 1;
            }
            
            if(isValid === 0){
                var lgSexo;
                if(this.beneficiary.lgSexo === 0){
                    lgSexo = false;
                }else{
                    lgSexo = true;
                }
                
                var beneficiaryOtherUnity = {
                    cdCarteiraUsuario  :  _self.beneficiary.cdCarteiraUsuario,
                    nmUsuario          :  _self.beneficiary.nmUsuario,
                    dtValidadeCart     :  _self.beneficiary.dtValidadeCart,
                    lgSexo             :  lgSexo,
                    cdCpf              :  _self.beneficiary.cdCpf,
                    dtNascimento       :  _self.beneficiary.dtNascimento,
                    enRua              :  _self.beneficiary.enRua,
                    enNumero           :  _self.beneficiary.enNumero,
                    enBairro           :  _self.beneficiary.enBairro,
                    cdCidade           :  _self.beneficiary.cdCidade,
                    enUf               :  _self.beneficiary.enUf,
                    enTelefone         :  _self.beneficiary.enTelefone,
                    nmResponsavelPlano :  _self.beneficiary.nmResponsavelPlano,
                    nmContratante      :  _self.beneficiary.nmContratante,
                    cdPlanoOut         :  _self.beneficiary.cdPlanoOut,
                    nmPlano            :  _self.beneficiary.nmPlano,
                    dtCadastro         :  _self.beneficiary.dtCadastro,
                    inNaturezaContrato :  _self.beneficiary.inNaturezaContrato,
                    nmClaHos           :  _self.beneficiary.nmClaHos,
                    nmFormaPagto       :  _self.beneficiary.nmFormaPagto};

                beneficiaryFactory.saveBeneficiaryOtherUnit(beneficiaryOtherUnity, function (result) {
                    if (result) {
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'success', title: 'Beneficiário de Outra Unidade salvo com sucesso!'
                        });
                        
                        appViewService.removeView({active: true,
                                        name  : 'Beneficiário de Outra Unidade',
                                        url   : _self.currentUrl});
                    }
                });  
            }else{
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'É necessário preencher os campos obrigatórios!'
                });
            }
        };
        
        this.onCancel = function(){
             appViewService.removeView({active: true,
                                        name  : 'Beneficiário de Outra Unidade',
                                        url   : _self.currentUrl});
        }
        
        this.init = function () {
            appViewService.startView('Beneficiário de Outra Unidade', 'hvp.benefOtherUnitsControlller', _self);
            
            if(appViewService.lastAction != 'newtab'
            && _self.currentUrl == $location.$$path){
                return;
            }
            
            this.action = 'INSERT';
            this.city = {};
            this.dates = {};
            this.beneficiary = {};
            
            _self.beneficiary.cdCarteiraUsuario = $stateParams.benefCardNumber;
            this.beneficiary.dtCadastro = new Date().getTime();
            this.beneficiary.lgSexo = 0;
            this.beneficiary.inNaturezaContrato = 0;
            _self.currentUrl = $location.$$path;
        };
        
        $scope.$watch('$viewContentLoaded', function () {
            _self.init();
        });
    }
    
    index.register.controller('hvp.benefOtherUnitsControlller', beneficiaryOtherUnitsController);
});

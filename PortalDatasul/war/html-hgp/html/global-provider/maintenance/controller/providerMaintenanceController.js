define(['index',
        '/dts/hgp/html/js/util/HibernateTools.js',
        '/dts/hgp/html/js/util/StringTools.js',
        '/dts/hgp/html/util/customFilters.js',
        '/dts/hgp/html/global-provider/providerFactory.js',
        '/dts/hgp/html/enumeration/addressTypeEnumeration.js',
        '/dts/hgp/html/enumeration/assistanceProfileEnumeration.js',
        '/dts/hgp/html/enumeration/backyardTypeEnumeration.js',
        '/dts/hgp/html/enumeration/collectTypeEnumeration.js',
        '/dts/hgp/html/enumeration/contactTypeEnumeration.js',
        '/dts/hgp/html/enumeration/graduationTypeEnumeration.js',
        '/dts/hgp/html/enumeration/irrfIndexEnumeration.js',
        '/dts/hgp/html/enumeration/healthEstablishmentClassificationEnumeration.js',
        '/dts/hgp/html/global-emsProvider/emsProviderZoomController.js',
        '/dts/hgp/html/global-emsProviderGroup/emsProviderGroupZoomController.js',
        '/dts/hgp/html/global-emsTax/emsTaxZoomController.js',
        '/dts/hgp/html/global-emsTaxClassification/emsTaxClassificationZoomController.js',        
        '/dts/hgp/html/global-emsFinancialFlowType/emsFinancialFlowTypeZoomController.js',   
        '/dts/hgp/html/global-emsBank/emsBankZoomController.js',
        '/dts/hgp/html/global-emsPaymentForm/emsPaymentFormZoomController.js',
        '/dts/hgp/html/util/dts-utils.js',
        '/dts/hgp/html/global-parameters/parametersFactory.js',
        '/dts/hgp/html/hcg-unit/unitZoomController.js',
        '/dts/hgp/html/hcg-providerGroup/providerGroupZoomController.js',
        '/dts/hgp/html/hcg-providerCouncil/providerCouncilZoomController.js',
        '/dts/hgp/html/hcg-urgencyTime/urgencyTimeZoomController.js',
        '/dts/hgp/html/hcg-medicalSpecialty/medicalSpecialtyZoomController.js',
        '/dts/hgp/html/hcg-rejectionReason/rejectionReasonZoomController.js',
        '/dts/hgp/html/hcg-attachmentType/attachmentTypeZoomController.js',
        '/dts/hgp/html/hcg-city/cityZoomController.js',
        '/dts/hgp/html/global/hcgGlobalFactory.js',
        '/dts/hgp/html/enumeration/identityDepartmentEnumeration.js',
        '/dts/hgp/html/enumeration/maritalStatusEnumeration.js',
        '/dts/hgp/html/hvp-person/maintenance/controller/personMaintenanceController.js',
        '/dts/hgp/html/hvp-demographic/demographicFactory.js',
        '/dts/hgp/html/hvp-company/companyFactory.js',
        '/dts/hgp/html/hvp-demographic/demographicZoomController.js',
        '/dts/hgp/html/hvp-company/companyZoomController.js',
        '/dts/hgp/html/hpr-modality/modalityZoomController.js',
    ], function (index) {

    providerMaintenanceController.$inject = ['$rootScope', '$scope', '$stateParams', '$controller', 'totvs.app-main-view.Service', '$state',
                                             '$location', 'global.provider.Factory', 'global.parameters.Factory', 'hcg.global.Factory',
                                             'hvp.demographic.Factory', 'hvp.company.Factory'];
    function providerMaintenanceController($rootScope, $scope, $stateParams, $controller, appViewService, $state,
                                           $location, providerFactory, parametersFactory, hcgGlobalFactory,
                                           hvpDemographicFactory, hvpCompanyFactory) {

        var _self = this;

        _self.today = new Date();

        $scope.StringTools = StringTools;
        $scope.CONTACT_TYPE_ENUM        = CONTACT_TYPE_ENUM;
        $scope.MARITAL_STATUS_ENUM      = MARITAL_STATUS_ENUM;
        $scope.IDENTITY_DEPARTMENT_ENUM = IDENTITY_DEPARTMENT_ENUM;
        $scope.BACKYARD_TYPE_ENUM       = BACKYARD_TYPE_ENUM;
        $scope.ADDRESS_TYPE_ENUM        = ADDRESS_TYPE_ENUM;
        $scope.GRADUATION_TYPE_ENUM     = GRADUATION_TYPE_ENUM;
        $scope.COLLECT_TYPE_ENUM        = COLLECT_TYPE_ENUM;
        $scope.IRRF_INDEX_ENUM          = IRRF_INDEX_ENUM;
        $scope.ASSISTANCE_PROFILE_ENUM  = ASSISTANCE_PROFILE_ENUM;
        $scope.HEALTH_ESTABLISHMENT_CLASSIFICATION_ENUM = HEALTH_ESTABLISHMENT_CLASSIFICATION_ENUM;

        _self.maritalStatusValue      = MARITAL_STATUS_ENUM.ENUMERATION_VALUES;
        _self.identityDepartmentValue = IDENTITY_DEPARTMENT_ENUM.ENUMERATION_VALUES;
        _self.backyardTypeValue       = BACKYARD_TYPE_ENUM.ENUMERATION_VALUES;
        _self.addressTypeValue        = ADDRESS_TYPE_ENUM.ENUMERATION_VALUES;
        _self.contactTypeValue        = CONTACT_TYPE_ENUM.ENUMERATION_VALUES;
        _self.graduationTypeValue     = GRADUATION_TYPE_ENUM.ENUMERATION_VALUES;
        _self.collectTypeValue        = COLLECT_TYPE_ENUM.ENUMERATION_VALUES;
        _self.irrfIndexValue          = IRRF_INDEX_ENUM.ENUMERATION_VALUES;
        _self.assistanceProfileValue  = ASSISTANCE_PROFILE_ENUM.ENUMERATION_VALUES;
        _self.healthEstablishmentClassificationValue = HEALTH_ESTABLISHMENT_CLASSIFICATION_ENUM.ENUMERATION_VALUES;

        _self.rejectionReasonFixedFilters = {};
        _self.emsProviderFixedFilters = {};
        _self.emsTaxFixedFilters = {};
        _self.emsInssTaxClassificationFixedFilters = {};
        _self.emsSingleTaxClassificationFixedFilters = {};
        _self.emsCofinsTaxClassificationFixedFilters = {};
        _self.emsPisPasepTaxClassificationFixedFilters = {};
        _self.emsCsllTaxClassificationFixedFilters = {};
        _self.emsIrrfTaxClassificationFixedFilters = {};
        _self.emsIssTaxClassificationFixedFilters = {};

        this.init = function () {
            appViewService.startView('Dados do Prestador','global.providerMaintenance.Control', _self);

            console.log('param1', $scope);
            
            if(appViewService.lastAction != 'newtab'
            && _self.currentUrl == $location.$$path){
                return;
            }

            _self.action = 'INSERT';

            $.extend(this, $controller('hvp.personMaintenanceController', {$scope: $scope}));
            _self.provider = {};
            $scope.person = {};

            console.log('param2', $scope);

            _self.lgManutencaoPrestadores = true;

            _self.currentUrl = $location.$$path;

            parametersFactory.getParamecp(function(result){
                _self.paramecp = result;
                _self.emsProviderFixedFilters['codEmpresa'] = _self.paramecp.cdUnidade;
            });

            //TIRAR DAQUI
            _self.loadUfs();
            _self.loadCountrys();

            _self.rejectionReasonFixedFilters['inEntidade'] = 'CG';

            // --- Filtros fixos dos zoons dos impostos --- //
            _self.emsTaxFixedFilters['codPais'] = 'BRA';
            _self.emsTaxFixedFilters['codUnidFederac'] = '  '; //INSERIR UF INFORMADO NO ENDERECO

            _self.emsInssTaxClassificationFixedFilters['codPais'] = 'BRA';
            /*_self.emsInssTaxClassificationFixedFilters['codUnidFederac'] = '  '; //INSERIR UF INFORMADO NO ENDERECO*/
            /*_self.emsInssTaxClassificationFixedFilters['codImposto'] = '0588';   //INSERIR IMPOSTO INFORMADO NO CAMPO*/


            _self.emsSingleTaxClassificationFixedFilters['codPais'] = 'BRA';
            _self.emsSingleTaxClassificationFixedFilters['codUnidFederac'] = '  '; //INSERIR UF INFORMADO NO ENDERECO
            _self.emsSingleTaxClassificationFixedFilters['codImposto'] = '0588';   //INSERIR IMPOSTO INFORMADO NO CAMPO        

            _self.emsCofinsTaxClassificationFixedFilters['codPais'] = 'BRA';
            _self.emsCofinsTaxClassificationFixedFilters['codUnidFederac'] = '  '; //INSERIR UF INFORMADO NO ENDERECO
            _self.emsCofinsTaxClassificationFixedFilters['codImposto'] = '0588';   //INSERIR IMPOSTO INFORMADO NO CAMPO

            _self.emsPisPasepTaxClassificationFixedFilters['codPais'] = 'BRA';
            _self.emsPisPasepTaxClassificationFixedFilters['codUnidFederac'] = '  '; //INSERIR UF INFORMADO NO ENDERECO
            _self.emsPisPasepTaxClassificationFixedFilters['codImposto'] = '0588';   //INSERIR IMPOSTO INFORMADO NO CAMPO

            _self.emsCsllTaxClassificationFixedFilters['codPais'] = 'BRA';
            _self.emsCsllTaxClassificationFixedFilters['codUnidFederac'] = '  '; //INSERIR UF INFORMADO NO ENDERECO
            _self.emsCsllTaxClassificationFixedFilters['codImposto'] = '0588';   //INSERIR IMPOSTO INFORMADO NO CAMPO

            _self.emsIrrfTaxClassificationFixedFilters['codPais'] = 'BRA';
            /*_self.emsIrrfTaxClassificationFixedFilters['codUnidFederac'] = ''; //INSERIR UF INFORMADO NO ENDERECO*/
            _self.emsIrrfTaxClassificationFixedFilters['codImposto'] = '1708';   //INSERIR IMPOSTO INFORMADO NO CAMPO            

            _self.emsIssTaxClassificationFixedFilters['codPais'] = 'BRA';
            /*_self.emsIssTaxClassificationFixedFilters['codUnidFederac'] = '  '; //INSERIR UF INFORMADO NO ENDERECO
            _self.emsIssTaxClassificationFixedFilters['codImposto'] = '0588';   //INSERIR IMPOSTO INFORMADO NO CAMPO*/
            // -------------------------------------------- //

            if (angular.isUndefined($stateParams.cdUnidade)
            && angular.isUndefined($stateParams.cdPrestador)){
                return;
            }

            if($state.current.name === 'dts/hgp/global-provider.detail'){
                _self.action = 'DETAIL';                                                
            }else{
                _self.action = 'EDIT';
            }

            _self.provider = {};
            
            if ($stateParams.cdUnidade) {  
                providerFactory.prepareDataToProviderWindow($stateParams.cdUnidade, $stateParams.cdPrestador,
                    function(result){
                        
                        //Atualiza dados da pessoa
                        _self.updatePersonData(result);

                        if(_self.action == 'EDIT'){
                            _self.provider.dtAtualizacao = Date.now();                        
                        }
                        
                        _self.providerAddress = result.tmpEndpres[0];
                        _self.provider = result.tmpPreserv[0];

                        _self.emsInssTaxClassificationFixedFilters['codImposto'] = _self.provider.cdImpostoInss;
                        _self.emsIssTaxClassificationFixedFilters['codImposto'] = _self.provider.cdImpostoIss;
                    });
            }
        };

        this.loadUfs = function(callback){
            if(angular.isUndefined(_self.ufs) === true
            || _self.ufs.length === 0){
                hcgGlobalFactory.getStateByFilter('', 0, 0, false, [],
                    function (result) {
                        _self.ufs = result;
                        _self.ufs.unshift({enUf: '', nmEstado:'', rotulo:' '});
                        
                        if(callback){
                            callback();
                        }
                    });
            }else{
                if(callback){
                    callback();
                }
            } 
        };

        this.loadCountrys = function(callback){
            if(angular.isUndefined(_self.countrys) === true
            || _self.countrys.length === 0){
                hcgGlobalFactory.getCountryByFilter('', 0, 0, false, [],
                    function (result) {
                        _self.countrys = result;
                        _self.countrys.unshift({nmPais: '', nmEstado:'', rotulo:' '});
                        
                        if(callback){
                            callback();
                        }
                    });
            }else{
                if(callback){
                    callback();
                }
            } 
        };

        this.getLabelContactTypeByKey = function (value) {
            return CONTACT_TYPE_ENUM.getLabelByKey(value);
        };

        this.onPersonSelect = function(){
            if(angular.isUndefined(_self.personReturnObject) == true
            || _self.personReturnObject == null){
                $scope.person = {};
                return;
            }

            if(_self.provider.inTipoPessoa == 'F'){
                hvpDemographicFactory.prepareDataToDemographicWindow(_self.personReturnObject.idPessoa, _self.updatePersonData);
            }else{
                hvpCompanyFactory.prepareDataToCompanyWindow(_self.personReturnObject.idPessoa, _self.updatePersonData);
            }
        }

        this.onChangePersonType = function () {
            $scope.person = {};
            _self.personReturnObject = {};
        };

        this.onCancel = function(){
            appViewService.removeView({active: true,
                                       name  : 'Dados do Prestador',
                                       url   : _self.currentUrl});
        };

        this.save = function(){
            _self.savePerson();
        };

        this.savePerson = function () {
            if(_self.provider.inTipoPessoa == 'F'){
                if($scope.person['in-sexo'] == 'M'){
                    $scope.person['lg-sexo'] = true;
                }else{
                    $scope.person['lg-sexo'] = false;
                }

                hvpDemographicFactory.saveDemographic($scope.person, function(result){
                    console.log('saveDemographic', result);
                });
            }else{
                $scope.person['lg-prestador'] = true;
                hvpCompanyFactory.saveCompany($scope.person, function(result){
                    console.log('saveCompany', result);
                });
            }
        };

        $scope.$on('$viewContentLoaded', function(){
            _self.init();
        });
    }

    index.register.controller('global.providerMaintenance.Control', providerMaintenanceController);

});

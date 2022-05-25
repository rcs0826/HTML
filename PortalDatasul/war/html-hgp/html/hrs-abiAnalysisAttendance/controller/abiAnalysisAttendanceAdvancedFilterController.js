define(['index',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',   
    '/dts/hgp/html/hvp-beneficiary/beneficiaryZoomController.js',
    '/dts/hgp/html/enumeration/attendanceTypesEnumeration.js',
    '/dts/hgp/html/enumeration/attendanceStatusEnumeration.js',
    '/dts/hgp/html/global/hrcGlobalFactory.js', 
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/hrc-movement/movementFactory.js',
    '/dts/hgp/html/hrc-movement/movementZoomController.js',
    '/dts/hgp/html/hvp-contractingparty/contractingPartyZoomController.js',
    '/dts/hgp/html/hrs-reason/reasonFactory.js',
    '/dts/hgp/html/hrs-situation/situationFactory.js',
    '/dts/hgp/html/hrs-situation/situationZoomController.js',

], function (index) {

    abiAnalysisAttendanceAdvancedFilterController.$inject = ['$rootScope', '$scope','$modalInstance','disclaimers', 
            'AbstractAdvancedFilterController','TOTVSEvent','hrc.movement.Factory','hrc.global.Factory',
            'hrs.reason.Factory','hrs.situation.Factory',];
    function abiAnalysisAttendanceAdvancedFilterController($rootScope, $scope, $modalInstance, disclaimers, 
             AbstractAdvancedFilterController,TOTVSEvent,movementFactory,hrcGlobalFactory,
             reasonFactory,situationFactory) {

        var _self = this;

        $scope.ATTENDANCE_TYPES_ENUM  = ATTENDANCE_TYPES_ENUM;
        $scope.ATTENDANCE_STATUS_ENUM = ATTENDANCE_STATUS_ENUM;
        $scope.StringTools            = StringTools;

        _self.model = {};
        
        _self.disclaimers = disclaimers;

        _self.today = new Date();
        _self.benefFixedFilters = {SEARCH_OPTION : 'withCard'};

        _self.model.cdTipoInsumo = 0;
        _self.model.movementReturnObject;
        _self.impugnationMotives = [];

        _self.movementFixedFilters = {};
        

        _self.filtersConfig = [

            {property: 'codTipAtendim',           title: 'Tipo de Atendimento',        modelVar: 'codTipAtendim' },
            {property: 'cddMovto',                title: 'Procedimento Principal',     modelVar: 'movementReturnObject', objectId:'formattedCodeWithType', isZoom: true, defaultValue: undefined},
            {property: 'cdUnidCdCarteiraUsuario', title: 'Beneficiário',               modelVar: 'cdUnidCdCarteiraUsuario' },
            {property: 'nomPrestdor',             title: 'Prestador',                  modelVar: 'nomPrestdor'             },
            {property: 'nomCidade',               title: 'Cidade',                     modelVar: 'nomCidade'               },

            {property: 'datInicAtendim',          title: 'Data Inicio Atendimento',    modelVar: 'datInicAtendim',     isDate: true},
            {property: 'datFimAtendim',           title: 'Data Fim Atendimento',       modelVar: 'datFimAtendim',      isDate: true},

            {property: 'valCobradoInicial',       title: 'Valor Cobrado Inicial',      modelVar: 'valCobradoInicial'              },
            {property: 'valCobradoFinal',         title: 'Valor Cobrado Final',        modelVar: 'valCobradoFinal'                },

            {property: 'valReconhecidoInicial',   title: 'Valor Reconhecido Inicial',  modelVar: 'valReconhecidoInicial'              },
            {property: 'valReconhecidoFinal',     title: 'Valor Reconhecido Final',    modelVar: 'valReconhecidoFinal'                },

            {property: 'valGlosadoInicial',       title: 'Valor Glosado Inicial',      modelVar: 'valGlosadoInicial'              },
            {property: 'valGlosadoFinal',         title: 'Valor Glosado Final',        modelVar: 'valGlosadoFinal'                },

            {property: 'valParticipacaoInicial',  title: 'Valor Participação Inicial', modelVar: 'valParticipacaoInicial'              },
            {property: 'valParticipacaoFinal',    title: 'Valor Participação Final',   modelVar: 'valParticipacaoFinal'                },
            
            {property: 'cdnMotiv',                title: 'Motivo de Impugnação',       modelVar: 'cdnMotiv'               },
            {property: 'idiStatus',               title: 'Status',                     modelVar: 'idiStatus'               },
            {property: 'idiSubStatus',            title: 'Substatus',                  modelVar: 'situationReturnObject', objectId:'idSituacao', isZoom: true, defaultValue: undefined},
        ];

        this.search = function () {
            var isValid = true;

            isValid = _self.validaInicialFinal(_self.model.datInicAtendim, _self.model.datFimAtendim, 'Data Inicial do Atendimento', 'Data Final do Atendimento', isValid );
            isValid = _self.validaInicialFinal(_self.model.valCobradoInicial, _self.model.valCobradoFinal, 'Valor Cobrado Inicial', 'Valor Cobrado Final', isValid );
            isValid = _self.validaInicialFinal(_self.model.valReconhecidoInicial, _self.model.valReconhecidoFinal, 'Valor Reconhecido Inicial', 'Valor Reconhecido Final', isValid );
            isValid = _self.validaInicialFinal(_self.model.valGlosadoInicial, _self.model.valGlosadoFinal, 'Valor Glosado Inicial', 'Valor Glosado Final', isValid );
            isValid = _self.validaInicialFinal(_self.model.valParticipacaoInicial, _self.model.valParticipacaoFinal, 'Valor Participação Inicial', 'Valor Participação Final', isValid );
            
            if (isValid === true) {          
                var arrayLength = this.disclaimers.length - 1;
                
                for (var i = arrayLength ; i >= 0 ; i--) {
                    this.disclaimers.splice(i, 1);
                }      

                this.constructDisclaimers();
                
                $modalInstance.close(this.disclaimers);
            }
        };

        this.validaInicialFinal = function(inicial, final, descricaoInicial, descricaoFinal, isValid) {

            if (   (!angular.isUndefined(inicial) && inicial !==null)
            && (!angular.isUndefined(final) && final !==null && final !== "") 
            && (final < inicial) ){
            
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: descricaoFinal + ' deve ser maior que o ' + descricaoInicial
                });
            }

            return isValid;
        }

        this.changeRange = function (sourceField,observerField) {
            if (angular.isUndefined(_self.model[observerField]) 
            || _self.model[observerField] === ''
            || _self.model[observerField] === _self.model[sourceField]){
                _self.model[observerField] = _self.model[sourceField];        
            }
        };

        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        this.init = function () {
            this.addSearchOption(_self.movementFixedFilters, 'PROCEDIMENTOS');

            _self.getImpugnationMotives();

            this.initialize();
        };

        this.onMovementSelect = function(){
            if(angular.isUndefined(_self.model.movementReturnObject) == true
               || _self.model.movementReturnObject.formattedCodeWithType == '') {
                _self.selectedMovement = {};
                _self.model.movementReturnObject = undefined;
                return;
            }

            _self.model.cddMovto = _self.model.movementReturnObject.formattedCodeWithType;
            
        };


        this.onSituationSelect = function (){
            if(angular.isUndefined(_self.model.situationReturnObject) == true
               || _self.model.situationReturnObject.idSituacao == '') {
                _self.model.situationReturnObject = undefined;
                return;
            }

            _self.model.idiSubStatus = _self.model.situationReturnObject.idSituacao;
        };


        this.addSearchOption = function(obj, option){
            if(angular.isUndefined(obj[HibernateTools.SEARCH_OPTION_CONSTANT]) == true){
                obj[HibernateTools.SEARCH_OPTION_CONSTANT] = option;
            } else {
                obj[HibernateTools.SEARCH_OPTION_CONSTANT] += '@@' + option;
            }                    
        };

        this.getImpugnationMotives = function(){
            reasonFactory.getReasonByFilter('', 0, 999, true, null, function (result) {
                
                //Se encontrou resultados, preenche a lista de periodos com os mesmos.
                if (result) {
                    angular.forEach(result, function (value) {

                        _self.impugnationMotives.push(value);
                    });
                }


            });
        }

        $scope.$watch('$viewContentLoaded', function () {
            _self.init();
        });

        $.extend(this, AbstractAdvancedFilterController);
    }

    index.register.controller('hrs.abiAnalysisAttendanceAdvFilter.Control', abiAnalysisAttendanceAdvancedFilterController);
});



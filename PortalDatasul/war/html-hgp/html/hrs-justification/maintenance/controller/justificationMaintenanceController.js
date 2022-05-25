define(['index', 
        '/dts/hgp/html/js/util/DateTools.js',
        '/dts/hgp/html/hrs-justification/justificationFactory.js',        
        '/dts/hgp/html/hrs-nature/natureFactory.js',             
        '/dts/hgp/html/hrs-reason/reasonFactory.js',             
        '/dts/hgp/html/hrs-reason/reasonZoomController.js',
        '/dts/hgp/html/js/libs/mention.js',
        '/dts/hgp/html/js/libs/bootstrap-typeahead.js',
        '/dts/hgp/html/enumeration/hashVariableEnumeration.js',
    ], function(index) {

	justificationMaintenanceController.$inject = ['$rootScope', '$scope','$state', '$stateParams', 'totvs.utils.Service', 'totvs.app-main-view.Service','$location','hrs.justification.Factory','hrs.nature.Factory','hrs.reason.Factory','TOTVSEvent', '$timeout'];
	function justificationMaintenanceController($rootScope, $scope, $state, $stateParams, totvsUtilsService, appViewService, $location, justificationFactory, natureFactory, reasonFactory, TOTVSEvent, $timeout) {

		var _self = this;
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height"; 
        _self.reasonFixedFilters = {};

        $scope.HASH_VARIABLE_ENUM = HASH_VARIABLE_ENUM;

        this.cleanModel = function (){
            _self.justification = {};           
        }   

        this.openVariableFields = function () {
            $('#variablefields').popover('show');
        }; 
                              
        this.createMention = function () {
            /* Se tirar o mouse do popover, fecha ele */
            $('body').on('mouseover', function (e) {
                if ($(e.target).data('toggle') !== 'popover'
                &&  $(e.target).parents('.popover.in').length === 0) {
                    $('[data-toggle="popover"]').popover('hide');
                }
            });

            /* Abrir componente de hashtags nos textarea */
            $("input[type=textarea], textarea").mention({
                delimiter: '#',
                emptyQuery: true,
                sensitive: true,
                users: HASH_VARIABLE_ENUM.ENUMERATION_VALUES
            });
        }    

        this.init = function(){
            appViewService.startView("Manutenção Justificativas de Impugnação",
                                     'hrs.justificationMaintenance.Control', 
                                     _self);

            if(appViewService.lastAction != 'newtab'
            && _self.currentUrl == $location.$$path){
                return;
            }
            _self.cleanModel(); 
            _self.createMention();    
            
            _self.currentUrl = $location.$$path; 
            
            natureFactory.getNatureByFilter('', 0, 20, true, [], function (result) {
                if (result) {
                        _self.natures = result;
                    for(var i = 0; i < _self.natures.length; i++){
                        var nature = _self.natures[i];
                        nature.value = nature.idNatureza;
                        nature.label = nature.dsNatureza;
                    }
                }
            });
            reasonFactory.getReasonByFilter('', 0, 20, true, [], function (result) {
                if (result) {
                        _self.reasons = result;
                    for(var i = 0; i < _self.reasons.length; i++){
                        var reason = _self.reasons[i];
                        reason.value = reason.idMotivo;
                        reason.label = reason.dsMotivo;
                    }
                }
            });
            
            if (!angular.isUndefined($stateParams.idJustificativa)) { 
                
                justificationFactory.prepareDataToMaintenanceWindow($stateParams.idJustificativa,             
                    function (result) {
                        angular.forEach(result, function (value) {
                            _self.justification = value;
                        });
                });
            }
                                         
            if($state.current.name === 'dts/hgp/hrs-justification.new'){
                _self.action = 'INSERT'; 
                _self.justification.idJustificativa = 0;                                               
            }else if($state.current.name === 'dts/hgp/hrs-justification.detail'){
                _self.action = 'DETAIL';                                                
            }else{
                _self.action = 'EDIT';
            }
        };

        this.cleanjustificationInputFields = function (){

        }

        this.saveNew = function(){
            _self.save(true, false);
        };
        
        this.saveClose = function (){
            _self.save(false, true);
        };

        this.save = function (isSaveNew, isSaveClose) {
            var novoRegistro = false;
            if (_self.action == 'INSERT'){
                novoRegistro = true;
            }

            if (_self.justificationForm.$invalid){
                _self.justificationForm.$setDirty();              
                angular.forEach(_self.justificationForm, function(value, key) {
                    if (typeof value === 'object' && value.hasOwnProperty('$modelValue')){
                        value.$setDirty(); 
                        value.$setTouched(); 
                    }
                });      
                
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Existem campos com valor inválido ou não informado.\nRevise as informações.'
                });
                
                return;
            }

            justificationFactory.savejustification(novoRegistro, _self.justification,
                function (result) {
                    if(result.$hasError == true){
                        return;
                    }
                                        
                    result = result[0];

                    _self.invalidateJustification(result);
                    
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: 'Justificativa de Impugnação salva com sucesso'
                    });

                    //Salva e limpa o model para um nova inclusao
                    if(isSaveNew){
                        _self.cleanModel();
                        _self.cleanjustificationInputFields();
                        if(_self.action != 'INSERT'){                            
                            $state.go($state.get('dts/hgp/hrs-justification.new')); 
                        }
                    //Salva e fecha a tela
                    }else if(isSaveClose){
                        
                        appViewService.removeView({active: true,
                                                   name  : 'Manutenção Justificativas de Impugnação',
                                                   url   : _self.currentUrl});  
                    //Salva e redireciona para o edit do item incluido
                    }else{
                        $state.go($state.get('dts/hgp/hrs-justification.edit'), 
                                             {idJustificativa: result.idJustificativa});
                    }

                    _self.resetPage();
            });
        };

        this.invalidateJustification = function(justification){
            //dispara um evento pra lista atualizar o registro
            $rootScope.$broadcast('invalidateJustification',
                                  {idJustificativa: justification.idJustificativa});
        };

        this.onCancel = function(){                    
            if(_self.action == 'DETAIL'){
                appViewService.removeView({active: true,
                                           name  : 'Manutenção Justificativas de Impugnação',
                                           url   : _self.currentUrl}); 
                return;
            }

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'Atenção!',
                text: 'Você deseja cancelar e descartar os dados não salvos?',
                cancelLabel: 'Não',
                confirmLabel: 'Sim',
                size: 'md',
                callback: function (hasChooseYes) {
                    if (hasChooseYes != true) 
                        return;

                    appViewService.removeView({active: true,
                                               name  : 'Manutenção Justificativas de Impugnação',
                                               url   : _self.currentUrl}); 
                }
            }); 
            
        };

        this.onNatureChanged = function(){
            $timeout(function() {
                        _self.reasonFixedFilters.idNatureza = _self.justification.idNatureza;
                    });
            _self.justification.idMotivo = 0;
        };

        $scope.$on('$viewContentLoaded', function(){
            _self.init();
            _self.resetForm();
        });

        $rootScope.$on('$stateChangeSuccess', function(){
            _self.resetForm(); 
        });

        this.resetPage = function(){
            _self.init();
            _self.resetForm();
        }

        this.resetForm = function (){
            if(_self == undefined
            || _self.justificationForm == undefined)
                return;
                
            _self.justificationForm.$setPristine();
            _self.justificationForm.$setUntouched();
        } 
	}
	
	index.register.controller('hrs.justificationMaintenance.Control', justificationMaintenanceController);	
});



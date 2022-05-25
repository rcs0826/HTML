define(['index', 
        '/dts/hgp/html/js/util/DateTools.js',
        '/dts/hgp/html/hfp-contaProvisReceita/contaProvisReceitaFactory.js',  
        '/dts/hgp/html/hpp-ledgerAccount/ledgerAccountZoomController.js',
        '/dts/hgp/html/hpr-coverageModule/coverageModuleZoomController.js',
        '/dts/hgp/html/hpr-modality/modalityZoomController.js',
        '/dts/hgp/html/hpr-plan/planZoomController.js',     
        '/dts/hgp/html/hpr-planType/planTypeZoomController.js',
        '/dts/hgp/html/hrb-event/eventZoomController.js',
        '/dts/hgp/html/hrc-movement/movementZoomController.js',
        '/dts/hgp/html/js/util/HibernateTools.js'
    ], function(index) {

    contaProvisReceitaMaintenanceController.$inject = ['$rootScope', '$scope','$state', '$stateParams', 'totvs.utils.Service', 'totvs.app-main-view.Service','$location','hfp.contaProvisReceita.Factory','TOTVSEvent', '$timeout'];
	function contaProvisReceitaMaintenanceController($rootScope, $scope, $state, $stateParams, totvsUtilsService, appViewService, $location, contaProvisReceitaFactory , TOTVSEvent, $timeout) {

		var _self = this;
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height"; 

        _self.benefFixedFilters = {SEARCH_OPTION : 'withCard'};
        _self.movementFixedFilters = {};
        _self.ledgerAccountCCFixedFilters = {};
        _self.ledgerAccountFixedFilters = {};

        this.cleanModel = function (){
            _self.contaProvisReceita = {};   
            _self.listTipoMovimento= [                
                { 'value': 'P', 'label': 'Procedimento' },
                { 'value': 'I', 'label': 'Insumo' },
                { 'value': 'C', 'label': 'Pacote' },
                { 'value': 'A', 'label': 'Todos' }]; 
            _self.zoomPlano = {};
            _self.zoomTipoPlano = {};
            _self.zoomEvento = {};            
            _self.listMeses= [                
                { 'value': 1, 'label': '01'},
                { 'value': 2, 'label': '02'},
                { 'value': 3, 'label': '03'},
                { 'value': 4, 'label': '04'},
                { 'value': 5, 'label': '05'},
                { 'value': 6, 'label': '06'},
                { 'value': 7, 'label': '07'},
                { 'value': 8, 'label': '08'},
                { 'value': 9, 'label': '09'},
                { 'value': 10, 'label': '10'},
                { 'value': 11, 'label': '11'},
                { 'value': 12, 'label': '12'}];                  
                
            _self.listFormaPagamento = [];
            _self.listTipoInsumo = [];
            _self.listGrupoProcedimento = [];
    
            _self.currentUrl = $location.$$path; 

            if (!angular.isUndefined($stateParams)) { 
            
                contaProvisReceitaFactory.prepareDataToMaintenanceWindow($stateParams,
                    function (result) {
                        if (result) {                                                   
                            angular.forEach(result.tmpFormaPagamento, function(formaPagamento){
                                _self.listFormaPagamento.push({
                                    value: formaPagamento.cdFormaPagto,
                                    label: formaPagamento.dsFormaPagto
                                });
                            });
                            angular.forEach(result.tmpTipoInsumo, function(tipoInsumo){
                                _self.listTipoInsumo.push({
                                    value: tipoInsumo.cdTipoInsumo,
                                    label: tipoInsumo.dsTipoInsumo
                                });
                            });
                            angular.forEach(result.tmpGrupoProcedimento, function(grupoProcedimento){
                                _self.listGrupoProcedimento.push({
                                    value: grupoProcedimento.cdGrupoProc,
                                    label: grupoProcedimento.nmGrupoProc
                                });
                            });  

                            //atualiza campos de zoom
                            _self.zoomPlano.cdModalidade = result.tmpContaProvisReceita[0].cdModalidade;
                            _self.zoomTipoPlano.cdModalidade = result.tmpContaProvisReceita[0].cdModalidade;
                            _self.zoomTipoPlano.cdPlano = result.tmpContaProvisReceita[0].cdPlano;    
                            _self.zoomEvento.inEntidade = "FT";
                            
                            if (result.tmpContaProvisReceita[0].inMovto == 'P'){
                                _self.movementFixedFilters[HibernateTools.SEARCH_OPTION_CONSTANT] = 'PROCEDIMENTOS';
                                _self.movementFixedFilters.cdGrupoProc = result.tmpContaProvisReceita[0].cdGrupoTipo;
                            }
                            if (result.tmpContaProvisReceita[0].inMovto == 'I'){
                                _self.movementFixedFilters[HibernateTools.SEARCH_OPTION_CONSTANT] = 'INSUMOS';
                                _self.movementFixedFilters.cdTipoInsumo = result.tmpContaProvisReceita[0].cdGrupoTipo;
                            }

                            if (result.tmpContaProvisReceita[0].inMovto == 'C'){                                
                                _self.movementFixedFilters[HibernateTools.SEARCH_OPTION_CONSTANT] = 'PACOTES';                                
                                _self.movementFixedFilters.cdProcInsu = result.tmpContaProvisReceita[0].cdProcInsu;                                
                                _self.movementFixedFilters["allowExchangePackage"] = true;                                                                
                            }

                            _self.ledgerAccountCCFixedFilters.mmValidade = result.tmpContaProvisReceita[0].mmValidade;
                            _self.ledgerAccountCCFixedFilters.aaValidade = result.tmpContaProvisReceita[0].aaValidade;

                            _self.ledgerAccountFixedFilters.mmValidade = result.tmpContaProvisReceita[0].mmInicioValidade;
                            _self.ledgerAccountFixedFilters.aaValidade = result.tmpContaProvisReceita[0].aaInicioValidade;

                            _self.contaProvisReceita = result.tmpContaProvisReceita[0];

                            if (_self.contaProvisReceita.inMovto == undefined){
                                _self.contaProvisReceita.inMovto = "A";
                            }

                            if (_self.contaProvisReceita.mmValidade == 0){
                                _self.contaProvisReceita.mmValidade = 1;
                            }

                            // Marca campos "Todos" 
                            if (_self.contaProvisReceita.cdTipoPlano == 0
                                || _self.contaProvisReceita.cdPlano == 0
                                || _self.contaProvisReceita.cdModalidade == 0){                                
                                _self.contaProvisReceita.cdTipoPlano = null;
                                _self.contaProvisReceita.lgTodosTiposPlano = true;
                            }
                            if (_self.contaProvisReceita.cdPlano == 0
                                || _self.contaProvisReceita.cdModalidade == 0){                                
                                _self.contaProvisReceita.cdPlano = null;
                                _self.contaProvisReceita.lgTodosPlanos = true;
                            }
                            if (_self.contaProvisReceita.cdModalidade == 0){
                                _self.contaProvisReceita.cdModalidade = null;
                                _self.contaProvisReceita.lgTodasModalidades = true;
                            }
                            if (_self.contaProvisReceita.cdFormaPagto == 0){
                                _self.contaProvisReceita.cdFormaPagto = null;
                                _self.contaProvisReceita.lgTodasFormaPagamento = true;
                            }
                            if (_self.contaProvisReceita.cdModulo == 0){
                                _self.contaProvisReceita.cdModulo = null;
                                _self.contaProvisReceita.lgTodosModulos = true;
                            }
                            if (_self.contaProvisReceita.cdFormaPagto == 0){
                                _self.contaProvisReceita.cdFormaPagto = null;
                                _self.contaProvisReceita.lgTodasFormaPagamento = true;
                            }
                            
                            if (_self.contaProvisReceita.inMovto == "P"
                                && _self.contaProvisReceita.cdProcInsu == 0){
                                _self.contaProvisReceita.lgTodosProcedimentos = true;                                
                            }

                            if (_self.contaProvisReceita.inMovto == "I"
                                && _self.contaProvisReceita.cdProcInsu == 0){
                                _self.contaProvisReceita.lgTodosInsumos = true;                                
                            }

                            if (_self.contaProvisReceita.inMovto == "C" 
                                && _self.contaProvisReceita.cdProcInsu == 0){
                                _self.contaProvisReceita.lgTodosPacotes = true;
                            }                                                                           
                        }
                    });
            }
        }

        this.init = function(){
            appViewService.startView("Manutenção de Conta de Provisionamento de Receita",
            'hfp.contaProvisReceitaMaintenance.Control', 
            _self);
            
            if(appViewService.lastAction != 'newtab'
            && _self.currentUrl == $location.$$path){
                return;
            }

            _self.cleanModel();
                               
            if($state.current.name === 'dts/hgp/hfp-contaProvisReceita.new'){
                _self.action = 'INSERT';                
            }
            else {
                if($state.current.name === 'dts/hgp/hfp-contaProvisReceita.detail'){
                    _self.action = 'DETAIL';    
                }else{
                    _self.action = 'EDIT';
                }                            
            }
        };

        this.onTodasModalidadesChange = function (evento) {            
            function changeField(){
                if (_self.contaProvisReceita.lgTodasModalidades){
                    _self.contaProvisReceita.lgTodosPlanos = true;
                    _self.contaProvisReceita.lgTodosTiposPlano = true;                                    
                }
                $rootScope.$apply();
              }
            //o onChange roda antes do data bind, o timeout 0 faz com que o bind rode antes e o valor seja  atualizado
            $timeout(changeField, 0);            
        };

        this.onTodosPlanosChange = function () {
            function changeField(){
                if (_self.contaProvisReceita.lgTodosPlanos){
                    _self.contaProvisReceita.lgTodosTiposPlano = true;           
                }
                $rootScope.$apply();
              }
            //o onChange roda antes do data bind, o timeout 0 faz com que o bind rode antes e o valor seja  atualizado
            $timeout(changeField, 0);            
        };

        this.onTipoMovimentoChanged = function (event) {
            function changeField(){
                if (_self.contaProvisReceita.inMovto == 'P') {
                    _self.movementFixedFilters[HibernateTools.SEARCH_OPTION_CONSTANT] = 'PROCEDIMENTOS'
                }

                if (_self.contaProvisReceita.inMovto == 'I') {
                    _self.movementFixedFilters[HibernateTools.SEARCH_OPTION_CONSTANT] = 'INSUMOS';
                }

                if (_self.contaProvisReceita.inMovto == 'C') {
                    _self.movementFixedFilters[HibernateTools.SEARCH_OPTION_CONSTANT] = 'PACOTES';                    
                    _self.movementFixedFilters["allowExchangePackage"] = true;                                                                
                }
                
                $rootScope.$apply();
              }
            //o onChange roda antes do data bind, o timeout 0 faz com que o bind rode antes e o valor seja  atualizado
            $timeout(changeField, 0);                
        };

        this.onModalityChanged = function(event){
            _self.zoomPlano.cdModalidade     = _self.contaProvisReceita.cdModalidade;
            _self.zoomTipoPlano.cdModalidade = _self.contaProvisReceita.cdModalidade;
            if (_self.zoomPlano.cdModalidade == 0){
                _self.zoomTipoPlano.cdPlano = 0;
            }
        };
        
        this.onPlanChanged = function(event){
            _self.zoomTipoPlano.cdPlano = _self.contaProvisReceita.cdPlano;            
        };

        this.onGrupoTipoChanged = function(event){  
            function changeField(){
                if (_self.contaProvisReceita.inMovto == 'I'){
                    _self.movementFixedFilters[HibernateTools.SEARCH_OPTION_CONSTANT] = 'INSUMOS';
                    _self.movementFixedFilters.cdTipoInsumo = _self.contaProvisReceita.cdGrupoTipo;
                }
                
                if (_self.contaProvisReceita.inMovto == 'P'){
                    _self.movementFixedFilters[HibernateTools.SEARCH_OPTION_CONSTANT] = 'PROCEDIMENTOS';
                    _self.movementFixedFilters.cdGrupoProc = _self.contaProvisReceita.cdGrupoTipo;
                }
            }
            //o onChange roda antes do data bind, o timeout 0 faz com que o bind rode antes e o valor seja atualizado
            $timeout(changeField, 0);
        };

        this.onValidateCCChanged = function(event){  
            function changeField(){
                _self.ledgerAccountCCFixedFilters.mmValidade = _self.contaProvisReceita.mmValidade;
                _self.ledgerAccountCCFixedFilters.aaValidade = _self.contaProvisReceita.aaValidade;
            }
            //o onChange roda antes do data bind, o timeout 0 faz com que o bind rode antes e o valor seja atualizado
            $timeout(changeField, 0);
        };

        this.onValidateChanged = function(event){  
            function changeField(){
                _self.ledgerAccountFixedFilters.mmValidade = _self.contaProvisReceita.mmInicioValidade;
                _self.ledgerAccountFixedFilters.aaValidade = _self.contaProvisReceita.aaInicioValidade;
            }
            //o onChange roda antes do data bind, o timeout 0 faz com que o bind rode antes e o valor seja atualizado
            $timeout(changeField, 0);
        };
        
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

            if (!_self.permiteSalvar()){
                return;
            }

            if (_self.contaProvisReceita.lgTodasModalidades)
                _self.contaProvisReceita.cdModalidade = 0;
                
            if (_self.contaProvisReceita.lgTodosPlanos)
                _self.contaProvisReceita.cdPlano = 0;

            if (_self.contaProvisReceita.lgTodosTiposPlano)
                _self.contaProvisReceita.cdTipoPlano = 0;                

            if (_self.contaProvisReceita.lgTodasFormaPagamento)
                _self.contaProvisReceita.cdFormaPagto = 0;

            if (_self.contaProvisReceita.lgTodosModulos)
                _self.contaProvisReceita.cdModulo = 0;

            if (_self.contaProvisReceita.lgTodasFormaPagamento)
                _self.contaProvisReceita.cdFormaPagto = 0;                       

            switch (_self.contaProvisReceita.inMovto) {
                case 'P':
                    if (_self.contaProvisReceita.lgTodosProcedimentos)
                        _self.contaProvisReceita.cdProcInsu = 0;
                    break;
                case 'I':
                    if (_self.contaProvisReceita.lgTodosInsumos)
                        _self.contaProvisReceita.cdProcInsu = 0;
                    break;
                case 'C':
                    if (_self.contaProvisReceita.lgTodosPacotes)
                        _self.contaProvisReceita.cdProcInsu = 0;

                    if (_self.contaProvisReceita.cdProcInsu != 0)
                        _self.contaProvisReceita.cdProcInsu = String(_self.contaProvisReceita.cdProcInsu).substring(0,8);
                    break;
            }                       
            
            this.invalidateContaProvisReceita = function(contaProvisReceita){
                //dispara um evento para a lista atualizar o registro
                $rootScope.$broadcast('invalidateContaProvisReceita', contaProvisReceita);
            };

            contaProvisReceitaFactory.saveContaProvisReceita(novoRegistro, _self.contaProvisReceita,
                function (result) {
                    if(result.$hasError == true){
                        return;
                    }

                    result = result.tmpContaProvisReceita[0];
                    
                    var titleAux = 'Conta de Provisionamento da Receita salva com sucesso';
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: titleAux
                    });

                    //Salva e limpa o model para um nova inclusao
                    if(isSaveNew){
                        _self.cleanModel();
                        if(_self.action != 'INSERT'){                           
                            $state.go($state.get('dts/hgp/hfp-contaProvisReceita.new')); 
                        }
                    //Salva e fecha a tela
                    }else if(isSaveClose){
                        _self.invalidateContaProvisReceita(result);

                        appViewService.removeView({active: true,
                                                   name  : 'Manutenção de Contas de Provisionamento da Receita',
                                                   url   : _self.currentUrl});  
                    //Salva e redireciona para o edit do item incluido
                    }
                    else{
                        $state.go($state.get('dts/hgp/hfp-contaProvisReceita.edit'), 
                                             {  contaProvisReceita: result });
                    }
            });
        };

        this.permiteSalvar = function(){
            var permiteSalvarAux = true;
            var mensagem = [];            

            if (!_self.contaProvisReceita.lgTodasModalidades 
                && !_self.contaProvisReceita.cdModalidade){
                permiteSalvarAux = false;
                mensagem.push('Modalidade deve ser informada.');
            }

            if (!_self.contaProvisReceita.lgTodosPlanos 
                && !_self.contaProvisReceita.cdPlano){
                permiteSalvarAux = false;
                mensagem.push('Plano deve ser informado.');
            }

            if (!_self.contaProvisReceita.lgTodosTiposPlano 
                && !_self.contaProvisReceita.cdTipoPlano){
                permiteSalvarAux = false;
                mensagem.push('Tipo de plano deve ser informado.');
            }
             
            if (!_self.contaProvisReceita.lgTodasFormaPagamento 
                && !_self.contaProvisReceita.cdFormaPagto){
                permiteSalvarAux = false;
                mensagem.push('Forma de Pagamento deve ser informada.');
            }   

            if (!_self.contaProvisReceita.lgTodosModulos 
                && !_self.contaProvisReceita.cdModulo){
                permiteSalvarAux = false;  
                mensagem.push('Módulo deve ser informado.');
            }    

            if (!permiteSalvarAux){
                    mensagem.forEach(function(element) {
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'error', title: element
                        });
                    }, this);
                    
                return false;
            }
            return true;
        }

        this.onCancel = function(){                    
            if(_self.action == 'DETAIL'){
                appViewService.removeView({active: true,
                                           name  : 'Manutenção de Contas de Provisionamento da Receita',
                                           url   : _self.currentUrl}); 
                return;
            }

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'Atenção',
                text: 'Você deseja cancelar e descartar os dados não salvos?',
                cancelLabel: 'Nao',
                confirmLabel: 'Sim',
                size: 'md',
                callback: function (hasChooseYes) {
                    if (hasChooseYes != true) 
                        return;

                    appViewService.removeView({active: true,
                                               name  : 'Manutenção de Contas de Provisionamento da Receita',
                                               url   : _self.currentUrl}); 
                }
            }); 
            
        };        

        $scope.$on('$viewContentLoaded', function(){
            _self.init();            
        });           

	}
	
	index.register.controller('hfp.contaProvisReceitaMaintenance.Control', contaProvisReceitaMaintenanceController);	
});



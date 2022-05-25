define(['index',
    '/dts/hgp/html/hrc-paramrc/paramrcFactory.js',      
    '/dts/hgp/html/global/sharedGlobalFactory.js',
    '/dts/hgp/html/hcg-layout/layoutZoomController.js',
    '/dts/hgp/html/hrc-movement/movementZoomController.js',
    '/dts/hgp/html/hrc-restrictionRecourseSpecie/restrictionRecourseSpecieZoomController.js',
    '/dts/hgp/html/global-financialDocumentKind/financialDocumentKindZoomController.js',
    '/dts/hgp/html/js/util/HibernateTools.js',
], function (index) {

    paramrcController.$inject = ['$rootScope', '$scope', '$state', '$location', 'totvs.app-main-view.Service',
                'hrc.paramrc.Factory', 'shared.global.Factory', 'TOTVSEvent'];
    function paramrcController($rootScope, $scope, $state, $location, appViewService, 
        paramrcFactory, sharedGlobalFactory, TOTVSEvent) {

        var _self = this;

        
        /* usado para os testes nas propriedades das tags */
        _self.paramrc = {};

        _self.dtToday = new Date(); 

        _self.movementFixedFilters = {};
        _self.movementFixedFilters = {property: HibernateTools.SEARCH_OPTION_CONSTANT, value: 'PROCEDIMENTOS'};
         
        _self.layoutImprContaMedicaFixedFilters = {'cdTipoLayout': '60'};

        _self.layoutExpoA450FixedFilters        = {'cdTipoLayout': '52'};
       
        _self.layoutExpoA1100FixedFilters       = {'cdTipoLayout': '101'};

        _self.layoutExpoA1200FixedFilters       = {'cdTipoLayout': '57'};

        _self.layoutImpoA1200FixedFilters       = {'cdTipoLayout': '57'};

        _self.layoutExpoA1300FixedFilters       = {'cdTipoLayout': '58'};
        
        /* -= PARÂMETROS =- */

        // Combo-box Tipo de Validade
        _self.validTypesList = [
            {value:1 , label:"01 - Prestador"}, 
            {value:2 , label:"02 - Prestador x Especialidade"},  
            {value:3 , label:"03 - Especialidade"}];

        // Combo-box Tipo de Validade dos Procedimentos
        _self.tpValidadeProced = [
            {value:0 , label:"00 - Contínua"}, 
            {value:1 , label:"01 - Mensal"}];       

        // Combo-box Local de Atendimento
        _self.buscaLocalAtend = [
            {value:0 , label:"Dig. anterior para parametrização zerada"}, 
            {value:1 , label:"Dig. anterior para todos os casos"},  
            {value:2 , label:"Sempre da parametrização na transação"}];         

        // Combo-box Tipo de Prestador para Controle de Documentos
        _self.tpPrestBase = [
            {value:0 , label:"0 - Nenhum"}, 
            {value:1 , label:"1 - Todos"},  
            {value:2 , label:"2 - Solicitante"},
            {value:3 , label:"3 - Executante"},
            {value:4 , label:"4 - Principal"},
            {value:5 , label:"5 - Solicitante/Principal"},
            {value:6 , label:"6 - Solicitante/Executante"},
            {value:7 , label:"7 - Executante/Principal"}];

         // Combo-box Restrição Quando Combinação não Permitida
        _self.lgCombNaoPer = [
            {value:false , label:"Movimento em Validação"}, 
            {value:true , label:"Movimento Secundário"}]; 

         // Combo-box Tipo de Valorização dos Pacotes
        _self.tpValPacotes = [
            {value:0 , label:"1 - Por Ordem de Digitação"}, 
            {value:1 , label:"2 - Por Ordem de Maior Valor"}];    

        // Combo-box Data Base Pagamento por Performance
        _self.tpDatPgtoPerfor = [
            {value:0 , label:"Data de Conhecimento"}, 
            {value:1 , label:"Data de Realização"},
            {value:2 , label:"Data Base do Período"}];

        /* executa toda a vez que carrega a pagina */
        this.init = function(){
            appViewService.startView("Manutenção de Parâmetros do Revisão de Contas", 'hrc.paramrc.Control', _self);

            if($state.current.name === 'dts/hgp/hrc-paramrc.start'){
                _self.action = 'DETAIL';
            }else if($state.current.name === 'dts/hgp/hrc-paramrc.edit'){
                _self.action = 'EDIT';
            }
            
            if(appViewService.lastAction != 'newtab' 
            && _self.currentUrl == $location.$$path){
                return;
            }
         
            _self.currentUrl = $location.$$path;

            /* função que chama o método do factory PARAMRC para buscar os dados no progress */
            paramrcFactory.getParamrc(
                function (result) {
                    if (result.length > 0) {
                        _self.paramrc = result[0];

                        _self.movementReturnObject = {formattedCodeWithType : _self.paramrc.codProcedPadr};
                    }else{
                        _self.paramrc = {};
                    }       

                })

            if (_self.paramrc.dtNovaValorizacao <= _self.dtToday){

                _self.isNovaValorizacaoDisabled = true; 

                if (_self.paramrc.dtNovaValorizacao == null){
                    _self.isNovaValorizacaoDisabled = false; 

                }
           }


            /* função que chama o método do factory SHARED GLOBAL para buscar os dados no progress */
            sharedGlobalFactory.getEmsGlobalCalendarByFilter('', 0, 0, false, {},
                function (result) {
                    _self.emsGlobalCalendarList = result;   

                })
        };

         /* abre a aba referenciada'dts/hgp/hrc-paramrc.edit' */
        this.editCurrentRegister = function () {
            _self.action = 'EDIT';
            $state.go($state.get('dts/hgp/hrc-paramrc.edit'));             
        };

        /* cancela edição - volta para o detail */
        this.onCancel = function () {   
            _self.action = 'DETAIL';
            $state.go($state.get('dts/hgp/hrc-paramrc.start'));                   
        };


        /* salva os parametros alterados */
        this.save = function () {  

            paramrcFactory.saveParamrc(_self.paramrc,
                function (result) {
                    if(result.$hasError == true){
                        return;
                    }

                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: 'Salvo com sucesso'
                    });                                   

                    $state.go($state.get('dts/hgp/hrc-paramrc.start'));  
                })   
        };

        this.onMovementSelect = function (argumento) {
            
            if(angular.isUndefined(_self.movementReturnObject) == true
            || _self.movementReturnObject.formattedCodeWithType == ''){
                _self.movementReturnObject = undefined;
                _self.paramrc.codProcedPadr = "";
                return;
            }
            
            _self.paramrc.codProcedPadr = _self.movementReturnObject.formattedCodeWithType;
        };

        /* executado quando inicializa a pagina  */
        if ($rootScope.currentuserLoaded) {
            this.init();
        } else {
            $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
                _self.init();
            });
        }      
    
    }

    /* registra o controlador com o nome da função "paramrcController" */
    index.register.controller('hrc.paramrc.Control', paramrcController);
});

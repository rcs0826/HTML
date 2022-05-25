define(['index',
    '/dts/hgp/html/hac-webParams/webParamsFactory.js'      
], function (index) {

    webParamsController.$inject = ['$rootScope', '$scope', '$state', '$location', 'totvs.app-main-view.Service','hac.webParams.Factory', 'TOTVSEvent'];
    function webParamsController($rootScope, $scope, $state, $location, appViewService, webParamsFactory, TOTVSEvent) {

        var _self = this;

        /* usado para os testes nas propriedades das tags */
        _self.webParams = {};

        // Combo-box extensão da foto do beneficiário
        _self.extensaoArqFotoBeneValues = [
            {value:"bmp" , label:"BMP"}, 
            {value:"jpg" , label:"JPG"},  
            {value:"png" , label:"PNG"}];

        // Combo-box unidade de validade da senha do prest e do benef
        _self.unidValidValues = [
            {value:"dd" , label:"DIA"}, 
            {value:"mm" , label:"MÊS"},  
            {value:"aa" , label:"ANO"}];            

        // Combo-box com as formas de armazenamento da AIH
        _self.armazenamentoAIHValues = [
            {value:1 , label:"AIH"}, 
            {value:2 , label:"ANO/MÊS/AIH"},  
            {value:3 , label:"ANO/MÊS/SEMANA/AIH"}];           

        // Combo-box leitores biométricos
        _self.leitorBiometricoValues = [
            {value:0 , label:"ALLBIOMETRICS"}, 
            {value:1 , label:"GRIAULE"},  
            {value:2 , label:"NITGEN"},
            {value:3 , label:"SECUGEN"}];

        /* executa toda a vez que carrega a pagina */
        this.init = function(){
            appViewService.startView("Manutenção de Parâmetros Web", 'hac.webParams.Control', _self);

            if($state.current.name === 'dts/hgp/hac-webParams.start'){
                _self.action = 'DETAIL';
            }else if($state.current.name === 'dts/hgp/hac-webParams.edit'){
                _self.action = 'EDIT';
            }
            
            if(appViewService.lastAction != 'newtab' && _self.currentUrl == $location.$$path){
                return;
            }
         
            _self.currentUrl = $location.$$path;

            /* função que chama o método do factory para buscar os dados no progress */
            webParamsFactory.getWebParamsByFilter('', 0, 0, false, [],
                function (result) {
                    _self.webParams = result[0];   

                    /*console.log('result', _self.webParams);*/

                    if (_self.webParams == null){
                        _self.webParams = {};                          
                        _self.action = 'EDIT';
                        _self.onEdit();
                    }                                                     
                }                   
        )};
    
        /* abre a aba referenciada'dts/hgp/hac-webParams.edit' */
        this.onEdit = function () {
   
            _self.webParams.dtAtualizacao = Date.now();    
            $state.go($state.get('dts/hgp/hac-webParams.edit'));             
        };

        /* cancela edição - volta para o detail */
        this.cancel = function () {   
            $state.go($state.get('dts/hgp/hac-webParams.start'));                   
        };

        /* salva os parametros alterados */
        this.save = function () {  

            if (_self.webParams.nrFaixaEtariaIni == undefined) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error', title: 'Parâmetro Faixa Etária Inicial não preenchido'
                    });   
                    return;             
            }
            if (_self.webParams.nrFaixaEtariaFim == undefined) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error', title: 'Parâmetro Faixa Etária Final não preenchido'
                    }); 
                    return;
            }
            if (_self.webParams.logEnviaSms) {
                if (_self.webParams.nomLayoutSms == undefined || _self.webParams.nomLayoutSms == "") {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error', title: 'Parâmetro [Layout] do envio de SMS não preenchido'
                    }); 
                    return;
                }
            }

            webParamsFactory.saveWebParams(_self.webParams,
                function (result) {
                    if(result.$hasError == true){
                        return;
                    }

                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: 'Salvo com sucesso'
                    });                                   

                    $state.go($state.get('dts/hgp/hac-webParams.start'));  
                })   
        };

        // Foto do Beneficiario 
        this.onBenefIdentificationChange = function(){
            if(!_self.webParams.lgBuscaFotoBenef){
                _self.webParams.nmDiretorioFotoBenef = "";
                _self.webParams.nmExtensaoArqFotoBenef = "bmp";
            }
            return;            
        };

        // Valida Senha do Beneficiario 
        this.onBenefPasswordValidateChange = function(){
            if(!_self.webParams.lgValidaSenhaBenef){
                _self.webParams.lgSenhaBenefValidade = false;
                _self.webParams.qtValidadeSenhaBenef  = 0;
                _self.webParams.cdUnidValidSenhaBenef = "dd";  
            }
            return;            
        };   

        // Valida Senha do Beneficiario 
        this.onPrestPasswordValidateChange = function(){
            if(!_self.webParams.lgSenhaPrestValidade){                
                _self.webParams.qtValidadeSenhaPrest  = 0;
                _self.webParams.cdUnidValidSenhaPrest = "dd";  
            }
            return;            
        };

        // Faixa Etaria 
        this.onAgeRangeChange = function(){
            if(_self.webParams.nrFaixaEtariaIni > _self.webParams.nrFaixaEtariaFim){
                _self.webParams.nrFaixaEtariaFim = _self.webParams.nrFaixaEtariaIni;
            }  
            return;            
        };       

        // Envio de SMS
        this.onSmsChange = function() {
            if (!_self.webParams.logEnviaSms) {
                _self.webParams.logEnviaSmsAutom = false;
                _self.webParams.nomLayoutSms = "";
                _self.webParams.nomUsuarSms = "";
                _self.webParams.desSenhaSms = "";
            }
            return;
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

    /* registra o controlador com o nome da função "webParamsController" */
    index.register.controller('hac.webParams.Control', webParamsController);
});

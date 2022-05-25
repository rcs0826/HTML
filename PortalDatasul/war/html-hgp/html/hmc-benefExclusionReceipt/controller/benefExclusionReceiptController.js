define(['index',
    '/dts/hgp/html/hmc-benefExclusionReceipt/benefExclusionReceiptFactory.js',
    '/dts/hgp/html/util/customFilters.js',
    '/dts/hgp/html/js/util/StringTools.js'
],function (index) {

    benefExclusionReceiptController.$inject = ['$rootScope', '$timeout', '$scope', '$state', '$location', 'totvs.app-main-view.Service', 'TOTVSEvent', 'hmc.benefExclusionReceipt.Factory', 'MailService'];
    function benefExclusionReceiptController($rootScope, $timeout, $scope, $state, $location, appViewService, TOTVSEvent, benefExclusionReceiptFactory, MailService) {

        var _self = this;

        $scope.StringTools = StringTools;        

        _self.openSearch = null;
        _self.isMore;
        _self.nrRegistrosBusca = 20;  
        this.disclaimers = [];              

        this.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";

        _self.parameters = {lgEmail: false,
                            dsRemetente: '',
                            dsDestinatario: '',
                            lgEnviaCentral: true};

        var protocol = "";

        this.listOfBenefs = [];
        this.listOfBenefsCount = 0;

        this.removeDisclaimer = function (disclaimer) {

            // percorre os disclaimers até encontrar o disclaimer passado na função e o remove
            // obs.: Não funciona para mais de um disclaimer quando são apenas 2, 
            //       pois o length dos disclaimers usado no for é modificado assim
            //       que é removido o primeiro disclaimer

            for (var i = 0; i < _self.disclaimers.length; i++) {
                if (_self.disclaimers[i].property === disclaimer.property) {
                    _self.disclaimers.splice(i, 1);
                }
            }             
        };

        this.openCloseParamFields = function(fieldsDivId){              
            $('#' + fieldsDivId).slideToggle();            
        };

        this.changeSearchType = function(fieldsDivId){

            if (_self.openSearch == fieldsDivId) return;

            this.openCloseParamFields(_self.openSearch);
            this.openCloseParamFields(fieldsDivId);

            _self.openSearch = fieldsDivId; 
        }

        this.search = function(isMore){

            var startAt = 0;
            _self.hasDoneSearch = false;
            _self.listOfBenefsCount = 0;


            //Testa se a busca é normal ou se é a busca de mais registros, 
            //se for a de mais registros a busca começará do tamanho da lista (padrão:100)
            if (isMore) {
                startAt = this.listOfBenefs.length;
                _self.isMore = true;
            } else {
                this.listOfBenefs = [];                
                _self.isMore = false;
            }

            //Remove todos os disclaimers
            var arrayLength = this.disclaimers.length - 1;

            for (var i = arrayLength ; i >= 0 ; i--) {                
                this.disclaimers.splice(i, 1);                
            }

            switch(_self.openSearch) {
                case 'contractSearch':
                    this.searchByContract(startAt);
                    break;
                case 'contractingPartySearch':
                    this.searchByContractingParty(startAt);                    
                    break;
                case 'protocolSearch':
                    this.searchByProtocol();
                    break;
                case 'dateSearch':
                    this.searchByDate(startAt);
                    break; 
                default:
                    $rootScope.$broadcast(TOTVSEvent.showBusinessMessage,
                        [{code: 'Atenção!',
                        detail: 'Selecione uma opção de busca de protocolos',
                        type: 'error'}]
                    );  
            }             
        }        

        this.searchByContract = function(startAt){            
            
            if (angular.isUndefined(_self.modalityRange) ){
                _self.modalityRange = {start: 0, end: 99};                                    
            }else{
                if (angular.isUndefined(_self.modalityRange.start) ||
                    _self.modalityRange.start == ''){
                    _self.modalityRange.start = 0;
                }
                if (angular.isUndefined(_self.modalityRange.end) ||
                    _self.modalityRange.end == ''){
                    _self.modalityRange.end = 99;
                }
            }
            
            if (angular.isUndefined(_self.contractRange)){
                _self.contractRange = {start: 0, end: 999999};                                                      
            }else{
                if (angular.isUndefined(_self.contractRange.start) ||
                    _self.contractRange.start == ''){
                    _self.contractRange.start = 0;
                }
                if (angular.isUndefined(_self.contractRange.end) ||
                    _self.contractRange.end == ''){
                    _self.contractRange.end = 999999;
                }
            }

            if (angular.isUndefined(_self.userRange)){
                _self.userRange = {start: 0, end: 999999};                                                      
            }else{
                if (angular.isUndefined(_self.userRange.start) ||
                    _self.userRange.start == ''){
                    _self.userRange.start = 0;
                }
                if (angular.isUndefined(_self.userRange.end) ||
                    _self.userRange.end == ''){
                    _self.userRange.end = 999999;
                }
            }

            //cria disclaimers para a busca
            _self.disclaimers.push({property:'modalityIni',title:'Modalidade inicial: ' + _self.modalityRange.start, 
                        value: _self.modalityRange.start});

            _self.disclaimers.push({property:'modalityFim',title:'Modalidade final: ' + _self.modalityRange.end, 
                        value: _self.modalityRange.end});

            _self.disclaimers.push({property:'contractIni',title:'Contrato inicial: ' + _self.contractRange.start, 
                        value: _self.contractRange.start});

            _self.disclaimers.push({property:'contractFim',title:'Contrato final: ' + _self.contractRange.end, 
                        value: _self.contractRange.end});

            _self.disclaimers.push({property:'userIni',title:'Beneficiário inicial: ' + _self.userRange.start, 
                        value: _self.userRange.start});

            _self.disclaimers.push({property:'userFim',title:'Beneficiário final: ' + _self.userRange.end, 
                        value: _self.userRange.end});


            benefExclusionReceiptFactory.getBenefsByFilter('', startAt, _self.nrRegistrosBusca, true, _self.disclaimers, _self.callback);           
        }

        this.searchByContractingParty = function(startAt){

            if (angular.isUndefined(_self.contractingPartyRange)){
                _self.contractingPartyRange = {start: 0, end: 999999999};                                                      
            }else{
                if (angular.isUndefined(_self.contractingPartyRange.start) ||
                    _self.contractingPartyRange.start == ''){
                    _self.contractingPartyRange.start = 0;
                }
                if (angular.isUndefined(_self.contractingPartyRange.end) ||
                    _self.contractingPartyRange.end == ''){
                    _self.contractingPartyRange.end = 999999999;
                }
            }

            if (angular.isUndefined(_self.dateRange) ){                         
                $rootScope.$broadcast(TOTVSEvent.showBusinessMessage,
                    [{code: 'Atenção!',
                    detail: 'Informe a faixa de datas a ser buscada',
                    type: 'error'}]
                );
                return;                    
            } 

            //seta variaveis date para usar format nos disclaimers
            var dtIni = new Date(_self.dateRange.start);
            var dtFim = new Date(_self.dateRange.end);

            _self.disclaimers.push({property:'dateIni',title:'Data inicial: ' + dtIni.toLocaleDateString(), 
                                    value: _self.dateRange.start});

            _self.disclaimers.push({property:'dateFim',title:'Data final: ' + dtFim.toLocaleDateString(), 
                                    value: _self.dateRange.end});


            /*caso tenha deixado contratante sem filtro, busca apenas por data*/
            if (_self.contractingPartyRange.start == 0 && _self.contractingPartyRange.end == 999999999){                

                benefExclusionReceiptFactory.getBenefsByFilter('', startAt, _self.nrRegistrosBusca, true, _self.disclaimers, _self.callback);
                
            }else{

                _self.disclaimers.push({property:'contractingPartyIni',title:'Contratante inicial: ' + _self.contractingPartyRange.start, 
                                        value: _self.contractingPartyRange.start});
    
                _self.disclaimers.push({property:'contractingPartyFim',title:'Contratante final: ' + _self.contractingPartyRange.end, 
                                        value: _self.contractingPartyRange.end});

                benefExclusionReceiptFactory.getBenefsByContractingPartyFilter('', startAt, _self.nrRegistrosBusca, true, _self.disclaimers, _self.callback);                
            }            
            
        }

        this.searchByProtocol = function(){

            if (angular.isUndefined(this.protocol)){                
                $rootScope.$broadcast(TOTVSEvent.showBusinessMessage,
                    [{code: 'Atenção!',
                    detail: 'Informe o protocolo',
                    type: 'error'}]
                );
                return;                    
            }

            benefExclusionReceiptFactory.getBenefByProtocol(this.protocol, _self.callback);

            _self.listOfBenefsCount = 1;
        }

        this.searchByDate = function(startAt){

             if (angular.isUndefined(_self.protocolDateRange) ){
                
                $rootScope.$broadcast(TOTVSEvent.showBusinessMessage,
                    [{code: 'Atenção!',
                    detail: 'Informe a faixa de datas do protocolo a ser buscada',
                    type: 'error'}]
                );              
                return;                    
            }           

            //seta variaveis date para usar format nos disclaimers
            var dtIni = new Date(_self.protocolDateRange.start);
            var dtFim = new Date(_self.protocolDateRange.end);

            _self.disclaimers.push({property:'dateIni',title:'Data inicial: ' + dtIni.toLocaleDateString(), 
                        value: _self.protocolDateRange.start});

            _self.disclaimers.push({property:'dateFim',title:'Data final: ' + dtFim.toLocaleDateString(), 
                        value: _self.protocolDateRange.end});                 

            benefExclusionReceiptFactory.getBenefsByFilter('', startAt, _self.nrRegistrosBusca, true, _self.disclaimers, _self.callback);
        }

        this.callback = function(result){

            _self.hasDoneSearch = true;

            if (result) {                  

                angular.forEach(result, function (value) {

                    if (value && value.$length) {
                       _self.listOfBenefsCount = value.$length;
                    }
                    _self.listOfBenefs.push(value);                     
                });

                if (_self.isMore === false) {
                    $('.page-wrapper').scrollTop(0);
                }              
            }
        }       


        this.onGenerateClick = function(){

            if (_self.parameters.lgEmail){

                $timeout(function(){
                    $('.submitButton').click();
                });
            }else{
                this.generate();
            }
        }

        this.generate = function(){            

            var selectedBenefs = [];

            for(benef in _self.listOfBenefs){                
                if (_self.listOfBenefs[benef].$selected){
                    selectedBenefs.push(_self.listOfBenefs[benef]);                    
                }
            }

            if (selectedBenefs.length == 0){               
                $rootScope.$broadcast(TOTVSEvent.showBusinessMessage,
                    [{code: 'Atenção!',
                    detail: 'Selecione ao menos um protocolo',
                    type: 'error'}]
                );
                return;
            }

            benefExclusionReceiptFactory.generateExclusionReceipt(selectedBenefs, _self.parameters, 
                function(result){
                    if(result.$hasError == true){
                        return;                       
                    }

                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'information', 
                        title: 'Arquivo ' + result.nmArquivoGerado + ' gerado'
                    });
                }
            );
        }

        /* executa toda a vez que carrega a pagina */
        this.init = function(){            

            appViewService.startView("Comprovante de Exclusão de Beneficiário", 'hmc.benefExclusionReceiptController', _self);           
            

            if (_self.openSearch != null){
                $timeout(function(){
                    _self.openCloseParamFields(_self.openSearch);
                    $('#'+ _self.openSearch + 'Btn').click();                    
                });                
            }

            if (_self.parameters.lgEmail){
                $timeout(function(){
                    _self.openCloseParamFields('email-params');
                });
            }

            if(appViewService.lastAction != 'newtab' 
            && _self.currentUrl == $location.$$path){
                return;
            }
         
            _self.currentUrl = $location.$$path;                          
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

    /* registra o controlador com o nome da função "benefExclusionReceipt" */
    index.register.controller('hmc.benefExclusionReceiptController', benefExclusionReceiptController);
});

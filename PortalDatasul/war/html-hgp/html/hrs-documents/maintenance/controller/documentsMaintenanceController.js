define(['index',  
        '/dts/hgp/html/js/util/DateTools.js',
        '/dts/hgp/html/hrs-documents/documentsFactory.js',        
        '/dts/hgp/html/hrs-reason/reasonFactory.js',        
        '/dts/hgp/html/hrs-documents/maintenance/controller/documentsContratMaintenanceController.js',
        '/dts/hgp/html/enumeration/documentsEnumeration.js',
        '/dts/hgp/html/js/libs/mention.js',
        '/dts/hgp/html/js/libs/bootstrap-typeahead.js',
        '/dts/hgp/html/enumeration/hashVariableEnumeration.js',
    ], function(index) {

	documentsMaintenanceController.$inject = ['$rootScope', '$scope','$state', '$stateParams', '$modal', 'totvs.utils.Service', 'totvs.app-main-view.Service','$location','hrs.documents.Factory','hrs.reason.Factory','TOTVSEvent'];
	function documentsMaintenanceController($rootScope, $scope, $state, $stateParams, $modal, totvsUtilsService, appViewService, $location, documentsFactory, reasonFactory , TOTVSEvent) {

		var _self = this;
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height"; 
        _self.documents = {};  
        _self.listReason = [];
        _self.listDocReason = [];
        $scope.TP_ANEXO_ENUM = TP_ANEXO_ENUM;
        
        // Inclusão de documento
            _self.documentoNovo = false;
            _self.uploadURL="/dts/datasul-rest/resources/api/fch/fchsau/hrs/fchsaudocuments/uploadfile";       
            _self.listDoctoContrat = [];

        this.cleanModel = function (){
            _self.documents = {};           
            _self.listReason    = [];
            _self.listDocReason = [];  
            _self.listDoctoContrat = [];    
        }       

        this.init = function(){
            appViewService.startView("Manutenção de Documentos Comprobatórios",
                                     'hrs.documentsMaintenance.Control', 
                                     _self);

            if(appViewService.lastAction != 'newtab'
            && _self.currentUrl == $location.$$path){
                return;
            }
			            
            _self.currentUrl = $location.$$path;
            
            _self.carregaInformacoes(true);

            _self.createMention();
        };

        this.carregaInformacoes = function (primeiraCarga) {
            _self.cleanModel(); 

            if (!angular.isUndefined($stateParams.idImpugdocs)) { 
                documentsFactory.prepareDataToMaintenanceWindow($stateParams.idImpugdocs,             
                    function (result) {
                        if (result) {
                            angular.forEach(result.tmpAbiImpugdocs, function (value) {
                                _self.documents = value;

                                if ((_self.documents.documentoPadrao != undefined) &&
                                    (_self.documents.documentoPadrao != ''))
                                    setTimeout(_self.carregaArquivo,100);
                            });
                            angular.forEach(result.tmpDocumentoMotivo, function (value) {
                                if (_self.listDocReason[value.idNatur] == undefined)
                                    _self.listDocReason[value.idNatur] = [];
                                
                                _self.listDocReason[value.idNatur][value.idMotiv] = true;
                            });
                            
                            _self.listDoctoContrat = result.tmpDocumentoContratante;
                        }
                    });
            } 
                                         
            reasonFactory.getReasonByFilter('', 0, 1000, true, [],      
                function (result) {
                    if (result) 
                        angular.forEach(result, function (value) { 
                            if (value.idNatureza > 0) {
                                if (_self.listReason[value.idNatureza] == undefined)
                                    _self.listReason[value.idNatureza] = {idNatureza: value.idNatureza, dsNatureza: value.dsNatureza, motivos:[]};
                                
                                if (_self.listDocReason[value.idNatureza] == undefined) 
                                    _self.listDocReason[value.idNatureza] = new Array();

                                selecionado = (_self.listDocReason[value.idNatureza][value.idMotivo] != undefined);

                                _self.listReason[value.idNatureza].motivos.push({idMotivo:value.idMotivo, dsMotivo:value.idMotivo + " - " + value.dsMotivo, checked: selecionado});
                            }
                        });
                });
                                         
            if($state.current.name === 'dts/hgp/hrs-documents.new'){
                _self.action = 'INSERT';                                                
            }else if($state.current.name === 'dts/hgp/hrs-documents.detail'){
                _self.action = 'DETAIL';                                                
            }else{
                _self.action = 'EDIT';
            }
        }

        this.cleandocumentsInputFields = function (){
        }

        this.saveNew = function(){
            _self.documentoNovo = false;
            _self.save(true, false);
        };
        
        this.saveClose = function (){
            _self.documentoNovo = false;
            _self.save(false, true);
        };

        this.save = function (isSaveNew, isSaveClose) {
            var novoRegistro = false;
            if (_self.action == 'INSERT'){
                novoRegistro = true;
            }

            if (_self.documentsForm.$invalid){
                _self.documentsForm.$setDirty();              
                angular.forEach(_self.documentsForm, function(value, key) {
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

            var tmpDocumentoMotivo = [];
            $(_self.listDocReason).each(function( idNatureza, motivos ) {
                if (motivos != undefined) {
                    $(motivos).each(function( idMotivo, value ) {
                        if ((value != undefined) && (value))
                            tmpDocumentoMotivo.push({idNatur: idNatureza, idMotiv: idMotivo, idImpugDocto: 0, dsMotivo: ""});
                    });
                }
            });


            documentsFactory.saveDocuments(novoRegistro, _self.documents, tmpDocumentoMotivo, _self.listDoctoContrat,
                function (result) {
                    if(result.$hasError == true){
                        return;
                    }
                    _self.carregaInformacoes(false);

                    result = result[0];
                    
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: 'Registro salvo com sucesso'
                    });
                    

                    //Salva e limpa o model para um nova inclusao
                    if(isSaveNew){
                        _self.cleanModel();
                        _self.cleandocumentsInputFields();
                        if(_self.action != 'INSERT'){                            
                            $state.go($state.get('dts/hgp/hrs-documents.new')); 
                        }
                    //Salva e fecha a tela
                    }else if(isSaveClose){
                        _self.invalidateDocument(result);

                        appViewService.removeView({active: true,
                                                    name  : _self.nomeTab,
                                                    url   : _self.currentUrl}); 
                    //Salva e redireciona para o edit do item incluido
                    }else{
                        $state.go($state.get('dts/hgp/hrs-documents.edit'), 
                                             {idImpugdocs: result.idImpugdocs});
                    }

                    _self.resetPage();
            });
        };

        this.invalidateDocument = function(document){
            //dispara um evento pra lista atualizar o registro
            $rootScope.$broadcast('invalidateDocument',
                                  {idImpugdocs: document.idImpugdocs});
        };

        this.removeDocuments = function (documento) {
            documento.cdnStatus = 9;
        }

        this.onCancel = function(){                    
            if ((_self.action == 'DETAIL') || (!_self.documentsForm.$dirty && !_self.documentoNovo)){

                appViewService.removeView({active: true,
                                            name  : _self.nomeTab,
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

                    if (_self.documentoNovo) {
                        var tmpListaArquivosUpload = [];
                        if (_self.documents.documentoPadrao != "")
                            tmpListaArquivosUpload.push({nomCaminhoArq: _self.documents.documentoPadrao});
                        if (_self.listDoctoContrat.length > 0){

                            for (var index = 0; index < _self.listDoctoContrat.length; index++) {
                                var element = _self.listDoctoContrat[index];
                                tmpListaArquivosUpload.push({nomCaminhoArq: element.nomCaminhoArq});                                
                            }
                        } 

                        documentsFactory.removeuploadedfile(tmpListaArquivosUpload, function(retorno) {});
                    }                   

                    appViewService.removeView({active: true,
                        name  : _self.nomeTab,
                        url   : _self.currentUrl}); 
                }
            }); 
            
        };

        this.openVariableFields = function () {
            $('#variablefields').popover('show');
        }; 
                              
        this.createMention = function () {
            _self.dsCamposVariaveis = HASH_VARIABLE_ENUM.TOOLTIP;

            /* Se tirar o mouse do popover, fecha ele */
            $('body').on('mouseover', function (e) {
                if ($(e.target).data('toggle') !== 'popover'
                &&  $(e.target).parents('.popover.in').length === 0) {
                    $('[data-toggle="popover"]').popover('hide');
                }
            });

            /* Abrir componente de hashtags nos textarea */
            $(".mentions input").mention({
                delimiter: '#',
                emptyQuery: true,
                sensitive: true,
                queryBy: ['username', 'name'],
                users: HASH_VARIABLE_ENUM.ENUMERATION_VALUES
            });
        }

        this.openDocumentContratMaintenance = function (impugDoctoContrat, tipoModal) {
            var impDocContrat = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrs-documents/maintenance/ui/documentsContratMaintenance.html', 
                size: 'lg',
                backdrop: 'static',
                controller: 'hrs.documentsContratMaintenance.Control as dcmController',
                resolve: {
                    incDoctoContrat : function(){
                        return impugDoctoContrat;
                    },
                    tipoModal : function() {
                        return tipoModal;
                    }}
            });
                
            impDocContrat.result.then(function (incDoctoContrat) {
                if (impugDoctoContrat != null) {                     
                    impugDoctoContrat = angular.copy(incDoctoContrat);
                }
                else
                    _self.listDoctoContrat.push(incDoctoContrat);
            });
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
            || _self.documentsForm == undefined)
                return;
                
            _self.documentsForm.$setPristine();
            _self.documentsForm.$setUntouched();
        } 

        $scope.filtroDocumento = function(tipoDoc){
            return function(item){
                teste =  ((item.cdnModalidade == undefined) || ((item.cdnModalidade == 0) && (item.cdnPlano == 0) &&
                (item.cdnTipPlano == 0) && (item.cdnContrnte == 0) && 
                (item.cdnTerAdesao == 0)));
                
                if (item.cdnStatus < 9)
                    if (tipoDoc == 'P')
                        return teste;
                    else
                        return !teste;
                else
                    return false;
            }
        }
	}
	
	index.register.controller('hrs.documentsMaintenance.Control', documentsMaintenanceController);	
});



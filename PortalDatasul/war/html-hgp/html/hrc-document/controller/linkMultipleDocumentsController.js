define(['index',
    '/dts/hgp/html/hrc-document/documentFactory.js',
    '/dts/hgp/html/js/util/HibernateTools.js',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/js/util/DateTools.js',
    '/dts/hgp/html/util/genericConfigController.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    linkMultipleDocumentsController.$inject = ['$rootScope', '$scope', 'totvs.app-main-view.Service',
                'hrc.document.Factory', '$location', '$modal', '$timeout', '$state', '$stateParams',
                'global.userConfigs.Factory', 'TOTVSEvent'];
    function linkMultipleDocumentsController($rootScope, $scope, appViewService, 
                documentFactory, $location, $modal, $timeout, $state, $stateParams, 
                userConfigsFactory, TOTVSEvent) {

        var _self = this;
        $scope.StringTools = StringTools;
        $scope.DOCUMENT_STATUS_ENUM = DOCUMENT_STATUS_ENUM;

        // *********************************************************************************
        // *** Functions
        // *********************************************************************************	

        this.search = function (isMore) {
            var startAt = 0;

            if (isMore) {
                startAt = this.listOfdocument.length + 1;
            } else {
                this.listOfdocument = [];
            }
            
            var filters = [];

            filters = this.disclaimers.slice();
            _self.hasDoneSearch = false;

            //Caso não possua filtros não realiza busca dos documentos
            if(filters.length == 0){
                return;
            }      
            
            filters.push({property: HibernateTools.SEARCH_OPTION_CONSTANT, value: 'Descriptions'});

            documentFactory.getAllDocumentsToLink(0, 0, true,
                filters, _self.tmpUnselectedDocuments, function (result) {  
                    _self.hasDoneSearch = true;

                    if (result.numRegisters && isMore != true) {
                        _self.listOfdocumentCount = result.numRegisters;
                    }

                    if (result.tmpDocrecon) {
                        angular.forEach(result.tmpDocrecon, function (value) {
                            

                            value.$selected = true;
                            value.listLinkDocuments = [];
                            
                            var listLinkDocumentsAux = result.tmpDocreconResults;
                            var objDoc = {};
    
                            for (var i = listLinkDocumentsAux.length - 1; i >= 0; i--) {
                                objDoc = {};
                                objDoc = angular.copy(listLinkDocumentsAux[i]);
                                objDoc.$selected = true;
                                
                                if (value.idDocumento == objDoc.idDocumentoPai){
                                    value.listLinkDocuments.push(angular.copy(objDoc));
                                }
                            }
                            
                            _self.listOfdocument.push(value);  

                        });
                        
                        if (isMore === false) {
                            $('.page-wrapper').scrollTop(0);
                        }
                    }

                });
        };

        this.linkDocuments = function () {
            var listDocuments = [];
            var listDocumentsToLink = [];
            var lgAchoDocto = false;
            var idDocumento = 1;
            var doc = {};

            for (var i = _self.listOfdocument.length - 1; i >= 0; i--) {
                lgAchoDocto = false;
                doc = _self.listOfdocument[i];

                for (var j = doc.listLinkDocuments.length - 1; j >= 0; j--) {
                    if(doc.listLinkDocuments[j].$selected == true){
                        doc.listLinkDocuments[j].idDocumentoPai = idDocumento;

                        listDocumentsToLink.push(angular.copy(doc.listLinkDocuments[j]))
                        lgAchoDocto = true;
                    }
                }

                if (lgAchoDocto == true){
                    doc.idDocumento = idDocumento;
                    listDocuments.push(angular.copy(doc));
                    idDocumento ++;
                }
            }

            if (listDocuments.length == 0){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', 
                    title: 'Nenhum documento foi selecionado para Vincular!'
                });
                return;
            }

             
            if(_self.doBatchExecution(listDocuments.length)){
                documentFactory.batchLinkAllDocuments(listDocuments, listDocumentsToLink, 
                    function (result) {

                        if(result.$hasError){
                            return;
                        }

                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'information', 
                            title: 'Criado pedido ' + result.nrPedido + ' para execução batch '
                                + ' para Vincular Documentos nas Internações.'
                        });
                    });
            }else{
                documentFactory.linkAllDocuments(listDocuments, listDocumentsToLink, 
                    function (result) {  
                        
                        var modalVar = $modal.open({
                            animation: true,
                            templateUrl: '/dts/hgp/html/hrc-document/ui/statusReportLinkDocument.html',
                            size: 'lg',
                            backdrop: 'static',
                            keyboard: false,
                            controller: 'hrc.statusReportLinkDocument.Control as controller',
                            resolve: {
                                configs: function(){
                                    return {
                                        doneStr: 'Vinculados',
                                        actionStr: 'Vinculação de Documentos'
                                    };  
                                },
                                resultList: function () {
                                    return result;
                                }
                            }
                        });

                        modalVar.result.then(function (){
                            _self.search(false);
                        });
                    });
            }
        };

        this.doBatchExecution = function(numDoctos){
            if(numDoctos > _self.config.minDoctosExecBatch){
                return true;
            }
            return false;
        };

        this.closeTab = function(){
            appViewService.removeView({active: true,
                                       name  : 'Vincular Documentos nas Internações',
                                       url   : _self.currentUrl});
        }

        this.init = function () {
            appViewService.startView("Vincular Documentos nas Internações", 'hrc.linkMultipleDocuments.Control', _self);
            
            if(appViewService.lastAction != 'newtab'
            || $stateParams.disclaimers == undefined){
                return;
            }

            _self.currentUrl = $location.$$path;
            _self.hasDoneSearch = false;
            
            _self.disclaimers = $stateParams.disclaimers;

            for (var i = 0; i < _self.disclaimers.length; i++) {
                _self.disclaimers[i].fixed = true;
            }

            _self.config      = $stateParams.config;
            _self.tmpUnselectedDocuments = $stateParams.tmpUnselectedDocuments;

            _self.listOfdocument = [];
            _self.listOfdocumentCount = 0;
            
            _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";

            _self.search(false);

        };

        /*$scope.$watch(*/
        $scope.$on('$viewContentLoaded', function(){
            _self.init();
        });       
    }

    index.register.controller('hrc.linkMultipleDocuments.Control', linkMultipleDocumentsController);

});

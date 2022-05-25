define(['index',  
        '/dts/hgp/html/js/util/DateTools.js',
        '/dts/hgp/html/js/util/StringTools.js',
        '/dts/hgp/html/hrs-documents/documentsFactory.js',  
        '/dts/hgp/html/hpr-modality/modalityZoomController.js',
        '/dts/hgp/html/hpr-plan/planZoomController.js',
        '/dts/hgp/html/hpr-planType/planTypeZoomController.js',
        '/dts/hgp/html/hvp-contractingparty/contractingPartyCodeZoomController.js',   
    ], function(index) {

    documentsContratMaintenanceController.$inject = ['$rootScope', '$scope','$state', '$stateParams', '$modalInstance', '$q',  
                                                     'totvs.utils.Service', 'totvs.app-main-view.Service','$location',
                                                     'hrs.documents.Factory', 'TOTVSEvent', 'incDoctoContrat', 'tipoModal'];
    function documentsContratMaintenanceController ($rootScope, $scope, $state, $stateParams, $modalInstance, $q,
                                                   totvsUtilsService, appViewService, $location, 
                                                   documentsFactory, TOTVSEvent, incDoctoContrat, tipoModal) {

        var _self = this;
        _self.uploadURL="/dts/datasul-rest/resources/api/fch/fchsau/hrs/fchsaudocuments/uploadfile";
        _self.documentoNovo = false;

         // Inclusão de documento por contratant
         _self.periodoVigencia  = {};
         _self.incDoctoContrat  = {};
         _self.planFixedFilters = {};
         _self.documentoPadrao  = "";
         _self.planTypeFixedFilters = {};
         _self.tipoModal = tipoModal;
        
        $scope.StringTools = StringTools;
 
        this.cleanModel = function (){
            _self.documentoNovo    = false;
            _self.periodoVigencia  = {};
            _self.incDoctoContrat  = {};
            _self.planFixedFilters = {};
            _self.planTypeFixedFilters = {};
        }       

        this.init = function(){
            if (_self.tipoModal == "P"){
                $('#modalDocuments').css('height', '260px');
            }

            if (incDoctoContrat != null) {
                _self.incDoctoContrat = angular.copy(incDoctoContrat);

                if(_self.incDoctoContrat.cdnTerAdesao != undefined){
                    _self.incDoctoContrat.cdnTerAdesao = incDoctoContrat.cdnTerAdesao.toString();     
                }                
                _self.periodoVigencia = {startDate:_self.incDoctoContrat.datVigencInic, endDate:  _self.incDoctoContrat.datVigencFim};
                _self.planFixedFilters.cdModalidade = _self.incDoctoContrat.cdnModalidade;
                _self.planFixedFilters.simpleFilter = _self.incDoctoContrat.cdnPlano;
                
                _self.planTypeFixedFilters.cdModalidade = _self.incDoctoContrat.cdnModalidade;
                _self.planTypeFixedFilters.cdPlano = _self.incDoctoContrat.cdnPlano;
                _self.planFixedFilters.simpleFilter = _self.incDoctoContrat.cdnTipPlano;

                setTimeout(_self.carregaArquivo,100);
            } else {
                incDoctoContrat = {};

                _self.incDoctoContrat.datVigencInic = new Date("01/01/1900").getTime();
                _self.incDoctoContrat.datVigencFim  = 253402221600000; /* 31/12/9999 */
            }
        };

        /*
            Função criada para adicionar os arquivos já carregados.
            Foi necessário
        */
        this.carregaArquivo = function () {
            if ($("#uploadDocPadrao .k-header").length == 0)
                setTimeout(_self.carregaArquivo,100);
            else
                if (_self.incDoctoContrat.nomCaminhoArq != undefined)
                    $("<ul class='k-upload-files k-reset'><li class='k-file ng-scope k-file-success' id='fileFake'" +
                        "data-uid='6afb62e4-d1e2-438b-9401-0d52da5a190d'><div class='template-upload' style='width: auto'>" +
                        "<div class='row'><span class='k-progress' style='width: 100%;'></span>" +
                        "<div class='col-lg-6 col-md-6 col-sm-6 col-xs-9' style='overflow: hidden; white-space: nowrap;" +
                        " text-overflow:ellipsis;' title='" + _self.incDoctoContrat.nomCaminhoArq + "'>" + _self.incDoctoContrat.nomCaminhoArq + "</div>" +
                        "<div class='col-lg-2 col-md-2 col-sm-2 col-xs-6'>&nbsp;</div><div class='col-lg-1 col-md-1 col-sm-1 col-xs-1' " +
                        "style='float: right;'> <button type='button' class='k-upload-action k-button k-button-bare' style='display: " +
                        "inline-block;'>&nbsp;</span></button></div></div></div>" +
                        "</li></ul>").appendTo('#uploadDocPadrao .k-header');
        }
        
        this.close = function(){
            if (_self.documentoNovo) {
                var tmpListaArquivosUpload = [];
                if (_self.documentoPadrao != "")
                    tmpListaArquivosUpload.push({nomCaminhoArq: _self.documentoPadrao});

                documentsFactory.removeuploadedfile(tmpListaArquivosUpload, function(retorno) {});
            }


            $modalInstance.dismiss('cancel');
        };

        this.onUploadSelect = function(event){
            $("#fileFake").remove();
            
            var semArquivo = false;
            if (angular.isUndefined(event.files)){
                semArquivo = true;
            }
            else if (event.files.length == 0){
                semArquivo = true;
            }
            else if (angular.isUndefined(event.files[0])){
                semArquivo = true;
            }   
            else if (!event.files[0]){
                semArquivo = true;
            }
            if (semArquivo){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'warning', title: 'Documento padrão não selecionado ou inválido.'
                }); 
                return;
            } else {
                _self.documentoNovo = true;
            }
        };

        this.onUploadSuccess = function(event){
            _self.incDoctoContrat.documentoPadrao = event.response.data.fileTempName;
        }

        this.onModalidChanged = function(event){
            _self.planFixedFilters.cdModalidade = _self.incDoctoContrat.cdnModalidade;
            _self.planTypeFixedFilters.cdModalidade = _self.incDoctoContrat.cdnModalidade;

            if (_self.incDoctoContrat.cdModalidade != incDoctoContrat.cdModalidade)
                _self.incDoctoContrat.cdnPlano = 0;
        };

        this.onPlanChanged = function(){
            _self.planTypeFixedFilters.cdPlano = _self.incDoctoContrat.cdnPlano;

            if (_self.incDoctoContrat.cdnPlano != incDoctoContrat.cdnPlano)
                _self.incDoctoContrat.cdnTipPlano = 0;
        };

        this.addDoctoContrat = function() {
            var formValido = true;
            if ((!_self.documentoNovo) && (_self.incDoctoContrat.nomCaminhoArq == null)) {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Você deve efetuar o upload de um arquivo'
                })
                formValido=false;
            }
            if (_self.tipoModal == "C") {
                // Contratante
                if (_self.incDoctoContrat.cdnModalidade == null) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error', title: 'Você deve preencher a modalidade'
                    });
                    formValido=false;
                }

                if (_self.incDoctoContrat.cdnTerAdesao == null){
                    if (   (_self.incDoctoContrat.cdnPlano == null)  
                        || (_self.incDoctoContrat.cdnTipPlano == null)
                        || (_self.incDoctoContrat.cdnContrnte == null)) {
                    
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'error', title: 'Você deve preencher o Plano, Tipo de Plano e Contratante ou o Termo'
                        });                    
                        formValido=false;
                    }
                }
            } 
           
            if (_self.incDoctoContrat.desDescr == null) {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Você deve preencher a descrição do arquivo'
                });
                formValido=false;
            }

            if(_self.incDoctoContrat.datVigencInic > _self.incDoctoContrat.datVigencFim){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Data de Vigência Inicial deve ser maior que a final'
                });
                formValido=false;   
            }            
            
            if (((_self.documentoNovo) || (_self.incDoctoContrat.nomCaminhoArq != null)) && formValido)  {
                if (_self.incDoctoContrat.documentoPadrao != null)
                    _self.incDoctoContrat.nomCaminhoArq = _self.incDoctoContrat.documentoPadrao;

                if(_self.incDoctoContrat.datVigencInic == null){
                    _self.incDoctoContrat.datVigencInic = new Date("01/01/1900").getTime();
                }

                if(_self.incDoctoContrat.datVigencFim == null){
                    _self.incDoctoContrat.datVigencFim  = 253402221600000; /* 31/12/9999 */
                }
                        
                _self.incDoctoContrat.cdnStatus = 2; //Alteração.                
                                                          
                // Cria novo objeto para não ser alterado pela próxima inclusão.
                _self.documentoPadrao = "";
                $(".k-upload-files").remove();
                $(".k-upload-status").hide();

                $modalInstance.close(_self.incDoctoContrat);    
            }
        }

        $scope.$watch('$viewContentLoaded', function () {   
            _self.init();
        });
    }
    
    index.register.controller('hrs.documentsContratMaintenance.Control', documentsContratMaintenanceController);    
});



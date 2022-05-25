define(['index',
        '/dts/hgp/html/js/util/DateTools.js',
        '/dts/hgp/html/global/hrcGlobalFactory.js',
        '/dts/hgp/html/hrs-ressusAbiImportation/ressusAbiImportationFactory.js',
        '/dts/hgp/html/hrs-ressusAbiImportation/maintenance/controller/abiAttendanceModalController.js',
    ], function(index) {

	ressusAbiImportationMaintenanceController.$inject = ['$rootScope', '$scope','$state', '$stateParams',
                                                         'totvs.utils.Service', 'totvs.app-main-view.Service',
                                                         '$location','hrs.ressusAbiImportation.Factory',
                                                         'hrc.global.Factory','TOTVSEvent','$modal'];
	function ressusAbiImportationMaintenanceController($rootScope, $scope, $state, $stateParams,
                                                       totvsUtilsService, appViewService,
                                                       $location, ressusAbiImportationFactory,
                                                       hrcGlobalFactory, TOTVSEvent,$modal) {

		var _self = this;
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        _self.ressusAbiImportation = {};
        _self.arqImportacao = "";
        _self.uploadURL="/dts/datasul-rest/resources/api/fch/fchsau/hrs/fchsauressus/uploadfile";
        _self.lgUploadSuccess = false;
        _self.dsArqImpTemp = "";
        _self.dsArqImp = "";
        _self.lgValidateSucess = false;

        this.init = function(){
            appViewService.startView("Manutenção de ABI",
                                     'hrs.ressusAbiImportationMaintenance.Control',
                                     _self);

            _self.lgUploadSuccess = false;
            _self.lgValidateSucess = false;
            _self.dsArqImpTemp = "";
            _self.dsArqImp = "";
            _self.dtAnoNrPerRef = "";
            _self.titulo = "Informações da ABI";


            if(appViewService.lastAction != 'newtab'
            && _self.currentUrl == $location.$$path){
                return;
            }

            if (angular.isUndefined($stateParams.cddRessusAbiDados)) {
                _self.ressusAbiImportation = {};
                _self.action = 'INSERT';
                _self.titulo = 'Importação RESSUS';
                _self.getPeriodList();
                return;
            }

            var disclaimers = [{ property: 'cddRessusAbiDados', value: $stateParams.cddRessusAbiDados }];

            if ($state.current.name === 'dts/hgp/hrs-ressusAbiImportation.detail') {
                _self.action = 'DETAIL';
            } else {
                _self.action = 'EDIT';
            }

            ressusAbiImportationFactory.getRessusAbiDadosByFilter('', 0, 0, false, disclaimers,
                function (result) {
                    _self.ressusAbiImportation = result[0];
                });
        };

        this.getPeriodList = function () {
             hrcGlobalFactory.getActivePeriods(function (result) {

                if(result.$hasError){
                    return;
                }

                _self.periodsList = result;

                if (result
                 && result.length > 0){
                    _self.dtAnoNrPerRef = _self.periodsList[0].dtAnoNrPerRef;
                }
            });
        }

        this.onCancel = function(){
            appViewService.removeView({active: true,
                                       name  : "Manutenção de ABI",
                                       url   : _self.currentUrl});
            return;
        };

        this.onUploadSuccess = function(event){
            _self.lgUploadSuccess = true;

            _self.dsArqImpTemp = event.response.data.fileTempName; /* Nome do arquivo temporario */
            _self.dsArqImp = event.files[0].name; /* Nome do Arquivo */

            _self.validateXMLfile();
        }

        this.validateXMLfile = function(){

            _self.lgValidateSucess = false;

            ressusAbiImportationFactory.validateXMLfile(_self.dsArqImpTemp,
                function (result) {
                    if(result.$hasError == true){
                        return;
                    }

                    _self.ressusAbiImportation = result[0];
                    _self.lgValidateSucess = true;
            });

        }

        this.createAbiData = function(){

            if(_self.lgUploadSuccess === false
            || _self.lgValidateSucess === false){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'warning', title: 'Necessário selecionar um arquivo XML para importar'
                });
                return;
            }

            if(angular.isUndefined(_self.dtAnoNrPerRef)
            || _self.dtAnoNrPerRef == ""){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'warning',
                    title: 'Necessário selecionar uma competência do Revisão de Contas para realizar a importação!'
                });
                return;
            }

            ressusAbiImportationFactory.createAbiData(_self.ressusAbiImportation,
                                                     _self.dsArqImpTemp,
                                                     _self.dsArqImp,
                                                     _self.dtAnoNrPerRef,
                function (result) {
                    if(result.$hasError == true){
                        $state.reload();
                        return;
                    }

                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: 'ABI ' + _self.ressusAbiImportation.codAbi + ' Carregada com sucesso! '
                                             + ' Aguarde o carregamento dos dados na base.'
                                             + ' Lote: ' + result.nrLoteNrSeqImportacao
                                             + ' Prestador: ' + result.rotuloPrestador
                    });

			        var dsMensagem = 'Criado pedido ' + result.nrPedido + ' para execução batch da Importação da ABI';

                    dsMensagem += " " + _self.ressusAbiImportation.codAbi;

                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'information',
                            title: dsMensagem
                        });

                    _self.lgUploadSuccess == false;
                    _self.lgValidateSucess == false;
                    $state.reload();
            });
        };

        $scope.$on('$viewContentLoaded', function(){
            _self.init();
        });
	}

	index.register.controller('hrs.ressusAbiImportationMaintenance.Control', ressusAbiImportationMaintenanceController);
});
define(['index',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/hrc-document/documentFactory.js',
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER 
    // *************************************************************************************
    rpwExecutionDetailsController.$inject =
        ['$scope', '$modalInstance', 'hrc.document.Factory',
            '$rootScope', 'TOTVSEvent', 'documentMaintenanceController', 'document'];
    function rpwExecutionDetailsController(
        $scope, $modalInstance, documentFactory,
        $rootScope, TOTVSEvent, documentMaintenanceController, document) {
        var _self = this;
        $scope.controller = rpwExecutionDetailsController;
        this.errors = [];
        this.documentMaintenanceController = documentMaintenanceController;
        this.document = document;
        this.docBloquado = false;

        this.init = function () {
            documentFactory.getRpwExecutionErrors(_self.document, function (result) {
                _self.errors = result;
                documentFactory.verificaDocBloqueado(_self.document, function (result) {
                    _self.docBloquado = result.lgBloqueadoPar;
                });
            });
        };

        this.releaseDocumentRpw = function () {
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'Atenção!', size: 'md',
                text: 'Esta ação libera o documento para alteração de outros usuarios '
                    + ' e remove os dados anteriormente alterados.',
                cancelLabel: 'Não',
                confirmLabel: 'Sim',
                callback: function (lgContinue) {
                    if (lgContinue == true) {
                        documentFactory.releaseDocumentRpw(_self.document, function (result) {
                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type: 'success', title: 'Dados da execução RPW removidos com sucesso.'
                            });
                            _self.documentMaintenanceController.document.lgErroExecucaoRpw = false;
                            _self.close();
                        });
                    }
                }
            });
        }

        this.recoverDataRpw = function () {
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'Atenção!', size: 'md',
                text: 'Esta ação libera o documento para alteração de outros usuarios ',
                cancelLabel: 'Não',
                confirmLabel: 'Sim',
                callback: function (lgContinue) {
					
					var lgErroExecucaoRpwAux = false;
                    if (lgContinue == true) {
                        documentFactory.recoverDataRpw(_self.document.cdUnidade, _self.document.cdUnidadePrestadora, _self.document.cdTransacao,
                            _self.document.nrSerieDocOriginal, _self.document.nrDocOriginal, _self.document.nrDocSistema, function (recoveredData) {
								
								lgErroExecucaoRpwAux = _self.documentMaintenanceController.document.lgErroExecucaoRpw;
                                _self.documentMaintenanceController.document = JSON.parse(recoveredData.jsonDocrecon).document;
								_self.documentMaintenanceController.document.lgErroExecucaoRpw = lgErroExecucaoRpwAux;
								
								_self.recoverInfosDoc(JSON.parse(recoveredData.jsonDocrecon));
								
                                _self.close();
						});
                    }
                }
            });
        }

        this.recoverInfosDoc = function(recoveredData){
            _self.documentMaintenanceController.invoice = recoveredData.invoice;									
			_self.documentMaintenanceController.mainProvider = recoveredData.mainProvider;
			_self.documentMaintenanceController.solicProvider = recoveredData.solicProvider;
			_self.documentMaintenanceController.beneficiary = recoveredData.beneficiary;
			_self.documentMaintenanceController.cid1 = recoveredData.cid1;
			_self.documentMaintenanceController.cid2 = recoveredData.cid2;
			_self.documentMaintenanceController.cid3 = recoveredData.cid3;
			_self.documentMaintenanceController.cid4 = recoveredData.cid4;

			_self.documentMaintenanceController.movementFilters = recoveredData.movementFilters;
			_self.documentMaintenanceController.appliedMovementFilters = recoveredData.appliedMovementFilters;

			_self.documentMaintenanceController.appliedMovementFiltersParam = recoveredData.appliedMovementFiltersParam;

			_self.documentMaintenanceController.hasMovementFilter = recoveredData.hasMovementFilter;
			_self.documentMaintenanceController.isMovementFilterOpen = recoveredData.isMovementFilterOpen;
			_self.documentMaintenanceController.selectedMovement = recoveredData.selectedMovement;
			_self.documentMaintenanceController.movementReturnObject = recoveredData.movementReturnObject;
			_self.documentMaintenanceController.tissLeaveReason = recoveredData.tissLeaveReason;
			_self.documentMaintenanceController.tissAccidentIndications = recoveredData.tissAccidentIndications;
			_self.documentMaintenanceController.tissAttendanceTypes = recoveredData.tissAttendanceTypes;
			_self.documentMaintenanceController.tissBillingTypes = recoveredData.tissBillingTypes;
			_self.documentMaintenanceController.tissInternmentTypes = recoveredData.tissInternmentTypes;
			_self.documentMaintenanceController.tissInternmentRegimes = recoveredData.tissInternmentRegimes;
			_self.documentMaintenanceController.fatoresRedAcres = recoveredData.fatoresRedAcres;
			_self.documentMaintenanceController.accessWays = recoveredData.accessWays;
			_self.documentMaintenanceController.tissTechniques = recoveredData.tissTechniques;
			_self.documentMaintenanceController.tissConsultationTypes = recoveredData.tissConsultationTypes;
			_self.documentMaintenanceController.tissProviderLevels = recoveredData.tissProviderLevels;

			_self.documentMaintenanceController.canEditMainProvider = recoveredData.canEditMainProvider;

			_self.documentMaintenanceController.canEditMainBond = recoveredData.canEditMainBond;

			_self.documentMaintenanceController.lastCidFilled = recoveredData.lastCidFilled;
			_self.documentMaintenanceController.isMovementsVisible = recoveredData.isMovementsVisible;
			_self.documentMaintenanceController.isMovementEnabled = recoveredData.isMovementEnabled;           

			_self.documentMaintenanceController.consultationMovementList = recoveredData.consultationMovementList;
			
			_self.documentMaintenanceController.action = recoveredData.action;

			_self.documentMaintenanceController.proceduresPageOffset  = recoveredData.proceduresPageOffset;
			_self.documentMaintenanceController.inputsPageOffset      = recoveredData.inputsPageOffset;
			_self.documentMaintenanceController.packagesPageOffset    = recoveredData.packagesPageOffset;

			_self.documentMaintenanceController.proceduresMovementKey  = recoveredData.proceduresMovementKey;
			_self.documentMaintenanceController.inputsMovementKey  = recoveredData.inputsMovementKey;
			_self.documentMaintenanceController.packagesMovementKey  = recoveredData.packagesMovementKey;

			_self.documentMaintenanceController.procAplliedWithLastFilter = recoveredData.procAplliedWithLastFilter;
			_self.documentMaintenanceController.inputAplliedWithLastFilter = recoveredData.inputAplliedWithLastFilter;
			_self.documentMaintenanceController.packageAplliedWithLastFilter = recoveredData.packageAplliedWithLastFilter;

			_self.documentMaintenanceController.unsavedProceduresNumber = recoveredData.unsavedProceduresNumber;
			_self.documentMaintenanceController.unsavedInputsNumber = recoveredData.unsavedInputsNumber;
			_self.documentMaintenanceController.unsavedPackagesNumber = recoveredData.unsavedPackagesNumber;

			_self.documentMaintenanceController.movementFilterFixedFilters = recoveredData.movementFilterFixedFilters;
			_self.documentMaintenanceController.movementFilterInputTypes = recoveredData.movementFilterInputTypes;            

        }
		
        this.close = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.$watch('$viewContentLoaded', function () {
            _self.init();
        });
    }
    index.register.controller('hrc.rpwExecutionDetailsController', rpwExecutionDetailsController);
});


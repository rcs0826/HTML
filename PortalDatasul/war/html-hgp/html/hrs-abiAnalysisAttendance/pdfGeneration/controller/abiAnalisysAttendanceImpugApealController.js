define(['index',
        '/dts/hgp/html/hrs-abiAnalysisAttendance/abiAnalysisAttendanceFactory.js',
        '/dts/hgp/html/hrs-ressusAbiImportation/ressusAbiImportationFactory.js',
], function (index) {

    abiAnalisysAttendanceImpugApealController.$inject = ['$rootScope', '$scope','$modalInstance', '$location', 'TOTVSEvent', 
                                                            'hrs.abiAnalysisAttendance.Factory',
                                                            'hrs.ressusAbiImportation.Factory',
                                                            'analisysAttendance',
                                                            'cddRessusAbiDados',
                                                            'idPermissao'];
    function abiAnalisysAttendanceImpugApealController($rootScope, $scope, $modalInstance,  $location, TOTVSEvent, 
                                                        abiAnalysisAttendanceFactory,
                                                        ressusAbiImportationFactory, 
                                                        analisysAttendance,
                                                        cddRessusAbiDados,
                                                        idPermissao) {

        var _self = this;

        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";

        _self.listItemInfoClasses2col = "col-sm-6 col-md-6 col-lg-6 col-sm-height";
        _self.listItemInfoClasses3col = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        _self.listItemInfoClasses4col = "col-sm-3 col-md-3 col-lg-3 col-sm-height";
        _self.listItemInfoClasses6col = "col-sm-2 col-md-2 col-lg-2 col-sm-height";

        _self.today = new Date().toLocaleDateString();
        

        _self.analisysAttendance = analisysAttendance;

        _self.cddRessusAbiDados = cddRessusAbiDados;

        _self.lstKindRequest = [];                                                

        _self.abiImportation = {};
        _self.tmpImpugValues = [];
        _self.dsCargoRespLegal = '';
        _self.dsCidade = '';
        _self.dsCNPJ = '';
        _self.dsRegistroAns = '';
        _self.iTipoPedido = '1';
        _self.idPermissao = 2;
        

        _self.model = {}; 

        this.close = function () {
            $modalInstance.dismiss('cancel');
        };

        this.generateImpugApeal = function generateImpugApeal(){        

            abiAnalysisAttendanceFactory.generateImpugApeal(2,      
                                                            _self.analisysAttendance.cddRessusAbiAtendim,
                function(){
                    console.log("RETORNO DA GERAÇÃO !!! ");
                }
            );
        };

        this.init = function () {
            _self.currentUrl = $location.$$path;

            _self.dsRazaoSocOperadora = 'Valor Inicial';

            _self.lstKindRequest = [{value: 1, label: '1 - Anulação da identificação do atendimento'},
                                    {value: 2, label: '2 - Retificação do valor a ser ressarcido'},
                                    {value: 3, label: '3 - Anulação da identificação do atendimento ou, subsidiariamente, retificação do valor a ser ressarcido'}];

            
            
            abiAnalysisAttendanceFactory.getImpugnationsInfo(function(result){
                    if (typeof result[0] === 'object')
                        _self.tmpImpugValues  = result[0];
                    else
                        _self.tmpImpugValues  =  {dsCargoRespLegal:"", dsCidade:"", dsCNPJ:"", dsRegistroAns:"", iTipoPedido:""};
                }
            ); 

            ressusAbiImportationFactory.getRessusAbiDadosByKey(cddRessusAbiDados,
                function (result) {

                  _self.abiImportation = result[0];
            });

        };

        $scope.$watch('$viewContentLoaded', function () {
            _self.init();
        });

        $.extend(this, abiAnalisysAttendanceImpugApealController);
    }

    index.register.controller('hrs.abiAnalisysAttendanceImpugApeal.Control', abiAnalisysAttendanceImpugApealController);
});



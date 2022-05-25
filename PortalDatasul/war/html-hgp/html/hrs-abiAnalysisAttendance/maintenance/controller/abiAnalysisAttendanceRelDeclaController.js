define(['index', 
        '/dts/hgp/html/js/util/DateTools.js',
        '/dts/hgp/html/hrs-abiAnalysisAttendance/abiAnalysisAttendanceFactory.js',      
        '/dts/hgp/html/hrs-situation/situationFactory.js',  
        '/dts/hgp/html/js/util/StringTools.js',
    ], function(index) {

    abiAnalysisAttendanceRelDecla.$inject = ['$rootScope', '$scope','$state', '$stateParams', '$modalInstance', '$q',  
                                                     'totvs.utils.Service', 'totvs.app-main-view.Service','$location',
                                                     'hrs.abiAnalysisAttendance.Factory',
                                                     'hrs.situation.Factory',
                                                     'TOTVSEvent', 'abiAnalysisAttendance', 'idPermissao'];
    function abiAnalysisAttendanceRelDecla ($rootScope, $scope, $state, $stateParams, $modalInstance, $q,
                                                   totvsUtilsService, appViewService, $location, 
                                                   abiAnalysisAttendanceFactory,
                                                   situationFactory,
                                                   TOTVSEvent, abiAnalysisAttendance, idPermissao) {

        var _self = this;

        _self.attandenceDeclaration = {};
        _self.inDeclaration = [{value: '0', label: 'Beneficiário'}, {value: '1', label: 'Operadora'}];
        _self.inEsclarecimento = [{value: '0', label: 'Beneficiário'}, {value: '1', label: 'Informante/Declarante'}];
        
        /*----------------------------------------------------------------------------------------------*/
        /* Setado fixo 2 para poder testar enquanto a tela anterior não carrega corretamente a permissão*/
        /*_self.idPermissao = idPermissao;*/
        _self.idPermissao = 2;
        /*----------------------------------------------------------------------------------------------*/

        $scope.StringTools = StringTools;
 
        this.cleanModel = function () {
            _self.abiAnalysisAttendance = {};           
            _self.attandenceDeclaration = {};
        }       

        this.init = function() {
            appViewService.startView("Análise do atendimento da ABI",
                                     'hrs.abiAnalysisAttendanceRelDecla.Control', 
                                     _self);

            _self.montaDadosTela();
        };

        this.montaDadosTela = function () {
            _self.montaBeneficiario();
            _self.montaDeclarante();
            _self.montaDadosFinais();
        }

        this.montaBeneficiario = function () {
            abiAnalysisAttendanceFactory.getBeneficiaryByAIH(abiAnalysisAttendance.cddRessusAbiAtendim, 
                function (result) {
                    if (!angular.isUndefined(result)) {
                        result = result[0];
                        _self.attandenceDeclaration.nmBeneficiario     = result.nmUsuario;
                        _self.attandenceDeclaration.nrCPF              = result.cdCpf;
                        _self.attandenceDeclaration.dtNascimento       = result.dtNascimento;
                        _self.attandenceDeclaration.nmNaturalidade     = result.dsMunicipioNascimento;
                        _self.attandenceDeclaration.nrRG               = result.nrIdentidade;
                        _self.attandenceDeclaration.dtRGExpedicao      = result.dtEmissaoIdent;
                        _self.attandenceDeclaration.nmPai              = result.nmPai;
                        _self.attandenceDeclaration.nmMae              = result.nmMae;
                        _self.attandenceDeclaration.nmLogradouro       = result.dsEndereco.split(",")[0];
                        _self.attandenceDeclaration.nrLogradouroNumero = result.dsEndereco.split(",")[1];
                        _self.attandenceDeclaration.nmComplemento      = result.dsComplemento;
                        _self.attandenceDeclaration.nmBairro           = result.dsBairro;
                        _self.attandenceDeclaration.nmMunicipio        = result.dsMunicipioEndereco;
                        _self.attandenceDeclaration.nmUF               = result.cdUf;
                        _self.attandenceDeclaration.nmCEP              = result.cdCep;
                        _self.attandenceDeclaration.nmTelefone         = result.dsTelefoneContato;
                        _self.attandenceDeclaration.nmEmail            = result.dsEmailContato;
                    }
                }
            );
        }

        this.montaDeclarante = function () {
            abiAnalysisAttendanceFactory.getDeclarantInfo (
                function (result) {
                    if (!angular.isUndefined(result)) {
                        result = result[0];
                        _self.attandenceDeclaration.nmOperadoraCargo   = result.cargo;
                        _self.attandenceDeclaration.nmOperadoraNome    = result.nome;
                    }
                }
            );
        }

        this.montaDadosFinais = function () {
            _self.attandenceDeclaration.dtInternacao                   = { startDate: abiAnalysisAttendance.datInicAtendim, 
                                                                           endDate: abiAnalysisAttendance.datFimAtendim };
            _self.attandenceDeclaration.nmInternacaoEstabelecimento    = abiAnalysisAttendance.rotuloPrestador;
            _self.attandenceDeclaration.nmCidadeDocumento              = abiAnalysisAttendance.rotuloEndereco;
            _self.attandenceDeclaration.dtDeclaracao                   = new Date();
        }
        
        this.generateDeclaration = function() {
            if (_self.attandenceDeclaration.fgDeclarante == "1" && angular.isUndefined(_self.attandenceDeclaration.fgEsclarecimento)) {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', 
                    title: 'Informe o campo [Esclarecimento fornecido pelo]'
                });
                return;
            }

            _self.attandenceDeclaration.dtInternacaoIni = _self.attandenceDeclaration.dtInternacao.startDate;
            _self.attandenceDeclaration.dtInternacaoFim = _self.attandenceDeclaration.dtInternacao.endDate;

            abiAnalysisAttendanceFactory.generateAttendanceDeclaration(
                abiAnalysisAttendance.cddRessusAbiAtendim,
                _self.attandenceDeclaration,
                function() {
                    _self.close();
                }
            );
        };

        this.onCancel = function(){                    
            appViewService.removeView({active: true,
                                       name  : _self.nomeTab,
                                       url   : _self.currentUrl});
        };
        this.close = function(){
            $modalInstance.dismiss('cancel');
        };

        $scope.$watch('$viewContentLoaded', function () {
            _self.init();
        });
    }
    
    index.register.controller('hrs.abiAnalysisAttendanceRelDecla.Control', abiAnalysisAttendanceRelDecla);    
});



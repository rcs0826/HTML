define(['index',
    '/dts/hgp/html/hrc-contingAuditPos/contingAuditPosFactory.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
    '/dts/hgp/html/hrc-transaction/transactionZoomController.js',
    
    '/dts/hgp/html/global-provider/providerZoomController.js',
    '/dts/hgp/html/util/customFilters.js',
    '/dts/hgp/html/global-provider/providerFactory.js',
    '/dts/hgp/html/hcg-attendanceNetwork/maintenance/controller/providerMaintenanceModalController.js',
    '/dts/hgp/html/hcg-providerGroup/providerGroupZoomController.js',
    
    '/dts/hgp/html/hcg-unit/unitZoomController.js',
    '/dts/hgp/html/hrc-periodSituation/sitPerZoomController.js'
], function (index) {

    contingAuditPosAdvancedFilterController.$inject = ['$rootScope', '$scope','$modalInstance','disclaimers', 'AbstractAdvancedFilterController','TOTVSEvent','parametros','hrc.contingAuditPos.Factory'];
    function contingAuditPosAdvancedFilterController($rootScope, $scope, $modalInstance, disclaimers, AbstractAdvancedFilterController,TOTVSEvent,parametros,contingAuditPosFactory) {

        var _self = this;
        this.model = {}; 
        
        this.disclaimers = disclaimers;
        _self.today = new Date();

        this.filtersConfig = [

            {property: 'inTipSelecao',   title: 'Tipo Seleção',         modelVar: 'inTipSelecao'    },
            {property: 'inTipoProcesso',   title: 'Tipo Processo',      modelVar: 'inTipoProcesso'    },

            /* Campos periodo */ 
            {property: 'cdnAnoRefIni',   title: 'Ano Ref Inicial',       modelVar: 'cdnAnoRefIni'    },
            {property: 'cdnAnoRefFim',   title: 'Ano Ref Final',         modelVar: 'cdnAnoRefFim'    },
            {property: 'cdnPeriodoIni',  title: 'Nr. Periodo Inicial',   modelVar: 'cdnPeriodoIni'   },
            {property: 'cdnPeriodoFim',  title: 'Nr. Periodo Final',     modelVar: 'cdnPeriodoFim'   },

            /* Campos fatura */ 
            {property: 'cdnAnoFatIni',   title: 'Ano Fatura Inicial',    modelVar: 'cdnAnoFatIni'    },
            {property: 'cdnAnoFatFim',   title: 'Ano Fatura Final',      modelVar: 'cdnAnoFatFim'    },
            {property: 'cdnSerieFatIni', title: 'Série Fatura Inicial',  modelVar: 'cdnSerieFatIni'  },
            {property: 'cdnSerieFatFim', title: 'Série Fatura Final',    modelVar: 'cdnSerieFatFim'  },
            {property: 'cdnFaturaIni',   title: 'Número Fatura Inicial', modelVar: 'cdnFaturaIni'    },
            {property: 'cdnFaturaFim',   title: 'Número Fatura Final',   modelVar: 'cdnFaturaFim'    },

            /* Campos Lote */ 
            {property: 'cdnLoteIni',     title: 'Nr. Lote Inicial',      modelVar: 'cdnLoteIni'      },
            {property: 'cdnLoteFim',     title: 'Nr. Lote Final',        modelVar: 'cdnLoteFim'      },
            {property: 'cdnSeqLoteIni',  title: 'Seq. Lote Inicial',     modelVar: 'cdnSeqLoteIni'   },
            {property: 'cdnSeqLoteFim',  title: 'Seq. Lote Final',       modelVar: 'cdnSeqLoteFim'   },

            /* Campos globais */ 
            {property: 'cdnTransacaoIni',    title: 'Transação Inicial',          modelVar: 'cdnTransacaoIni'               },
            {property: 'cdnTransacaoFim',    title: 'Transação Final',            modelVar: 'cdnTransacaoFim'               },
            {property: 'cdnSerieDocIni',     title: 'Série Documento Inicial',    modelVar: 'cdnSerieDocIni'                },
            {property: 'cdnSerieDocFim',     title: 'Série Documento Final',      modelVar: 'cdnSerieDocFim'                },            
            {property: 'cdnDocIni',          title: 'Número Documento Inicial',   modelVar: 'cdnDocIni'                     },
            {property: 'cdnDocFim',          title: 'Número Documento Final',     modelVar: 'cdnDocFim'                     },
            {property: 'cdnUnidPrestIni',    title: 'Unidade Prestadora Inicial', modelVar: 'cdnUnidPrestIni'               },
            {property: 'cdnUnidPrestFim',    title: 'Unidade Prestadora Final',   modelVar: 'cdnUnidPrestFim'               },
            {property: 'cdnPrestadorIni',    title: 'Prestador Inicial',          modelVar: 'cdnPrestadorIni'               },
            {property: 'cdnPrestadorFim',    title: 'Prestador Final',            modelVar: 'cdnPrestadorFim'               },
            {property: 'datRealizacaoIni',   title: 'Dt. Realização Inicial',     modelVar: 'datRealizacaoIni', isDate: true},
            {property: 'datRealizacaoFim',   title: 'Dt. Realização Final',       modelVar: 'datRealizacaoFim', isDate: true},
            {property: 'cdnRegraIni',        title: 'Número Regra Inicial',       modelVar: 'cdnRegraIni'                   },
            {property: 'cdnRegraFim',        title: 'Número Regra Final',         modelVar: 'cdnRegraFim'                   },
            {property: 'cdnUnidCarteiraIni', title: 'Número Regra Inicial',       modelVar: 'cdnUnidCarteiraIni'            },
            {property: 'cdnUnidCarteiraFim', title: 'Número Regra Final',         modelVar: 'cdnUnidCarteiraFim'            },
            {property: 'cdnAnoIni',                title: 'Ano Inicial',                modelVar: 'cdnAnoIni'                     },
            {property: 'cdnAnoFim',                title: 'Ano Final',                  modelVar: 'cdnAnoFim'                     },
            {property: 'nrGuiaIni',                title: 'Guia Inicial',               modelVar: 'nrGuiaIni'                     },
            {property: 'nrGuiaFim',                title: 'Guia Final',                 modelVar: 'nrGuiaFim'                     },
            {property: 'cdnPrestadorPrincipalIni', title: 'Prestador Inicial',          modelVar: 'cdnPrestadorPrincipalIni'      },
            {property: 'cdnPrestadorPrincipalFim', title: 'Prestador Final',            modelVar: 'cdnPrestadorPrincipalFim'      },
            {property: 'datDigitacaoIni',          title: 'Data Digitação Inicial',     modelVar: 'datDigitacaoIni'               },
            {property: 'datDigitacaoFim',          title: 'Data Digitação Final',       modelVar: 'datDigitacaoFim'               },

        ];

        this.search = function (isMore) {
 
            var isValid = true;  
           
            var startAt = 0;
            _self.listOfContingAuditPosCount = 0;

            if (isMore) {
                startAt = _self.listOfContingAuditPos.length + 1;
            } else {
                _self.listOfContingAuditPos = [];
            }
           
            if (   (!angular.isUndefined(_self.model.cdnAnoRefIni) && _self.model.cdnAnoRefIni !=='')
                && (!angular.isUndefined(_self.model.cdnAnoRefFim) && _self.model.cdnAnoRefFim !=='')
                && (_self.model.cdnAnoRefIni > _self.model.cdnAnoRefFim) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Ano Ref. Final deve ser maior que Ano Ref. Inicial'
                });
            }

            if (   (!angular.isUndefined(_self.model.cdnPeriodoIni) && _self.model.cdnPeriodoIni !=='')
                && (!angular.isUndefined(_self.model.cdnPeriodoFim) && _self.model.cdnPeriodoFim !=='')
                && (_self.model.cdnPeriodoIni > _self.model.cdnPeriodoFim) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Período Final deve ser maior que Período Inicial'
                });
            }

            if (   (!angular.isUndefined(_self.model.cdnAnoFatIni) && _self.model.cdnAnoFatIni !=='')
                && (!angular.isUndefined(_self.model.cdnAnoFatFim) && _self.model.cdnAnoFatFim !=='')
                && (_self.model.cdnAnoFatIni > _self.model.cdnAnoFatFim) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Ano Fat. Final deve ser maior que Ano Fat. Inicial'
                });
            }
            
            if (   (!angular.isUndefined(_self.model.cdnSerieFatIni) && _self.model.cdnSerieFatIni !=='')
                && (!angular.isUndefined(_self.model.cdnSerieFatFim) && _self.model.cdnSerieFatFim !=='')
                && (_self.model.cdnSerieFatIni > _self.model.cdnSerieFatFim) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Série Fatura Final deve ser maior que Série Fatura Inicial'
                });
            }            
            
            if (   (!angular.isUndefined(_self.model.cdnLoteIni) && _self.model.cdnLoteIni !==null)
                && (!angular.isUndefined(_self.model.cdnLoteFim) && _self.model.cdnLoteFim !==null)
                && (_self.model.cdnLoteIni > _self.model.cdnLoteFim) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Lote Final deve ser maior que Lote Inicial'
                });
            }

            if (   (!angular.isUndefined(_self.model.cdnSeqLoteIni) && _self.model.cdnSeqLoteIni !==null)
                && (!angular.isUndefined(_self.model.cdnSeqLoteFim) && _self.model.cdnSeqLoteFim !==null)
                && (_self.model.cdnSeqLoteIni > _self.model.cdnSeqLoteFim) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Seq. Lote Final deve ser maior que Seq. Lote Inicial'
                });
            }

            if (   (!angular.isUndefined(_self.model.cdnTransacaoIni) && _self.model.cdnTransacaoIni !==null)
                && (!angular.isUndefined(_self.model.cdnTransacaoFim) && _self.model.cdnTransacaoFim !==null)
                && (_self.model.cdnTransacaoIni > _self.model.cdnTransacaoFim) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Transação Final deve ser maior que Transação Inicial'
                });
            }

            if (   (!angular.isUndefined(_self.model.cdnSerieDocIni) && _self.model.cdnSerieDocIni !==null)
                && (!angular.isUndefined(_self.model.cdnSerieDocFim) && _self.model.cdnSerieDocFim !==null)
                && (_self.model.cdnSerieDocIni > _self.model.cdnSerieDocFim) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Série do Documento Final deve ser maior que a Série do Documento Inicial'
                });
            }

            if (   (!angular.isUndefined(_self.model.cdnDocIni) && _self.model.cdnDocIni !==null)
                && (!angular.isUndefined(_self.model.cdnDocFim) && _self.model.cdnDocFim !==null)
                && (_self.model.cdnDocIni > _self.model.cdnDocFim) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Documento Final deve ser maior que Documento Inicial'
                });
            }

            if (   (!angular.isUndefined(_self.model.cdnUnidPrestIni) && _self.model.cdnUnidPrestIni !==null)
                && (!angular.isUndefined(_self.model.cdnUnidPrestFim) && _self.model.cdnUnidPrestFim !==null)
                && (_self.model.cdnUnidPrestIni > _self.model.cdnUnidPrestFim) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Unidade Prestadora Final deve ser maior que Unidade Prestadora Inicial'
                });
            }

            if (   (!angular.isUndefined(_self.model.cdnPrestadorIni) && _self.model.cdnPrestadorIni !==null)
                && (!angular.isUndefined(_self.model.cdnPrestadorFim) && _self.model.cdnPrestadorFim !==null)
                && (_self.model.cdnPrestadorIni > _self.model.cdnPrestadorFim) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Prestador Final deve ser maior que Prestador Inicial'
                });
            }

            if (   (!angular.isUndefined(_self.model.datRealizacaoIni) && _self.model.datRealizacaoIni !==null)
                && (!angular.isUndefined(_self.model.datRealizacaoFim) && _self.model.datRealizacaoFim !==null)
                && (_self.model.datRealizacaoIni > _self.model.datRealizacaoFim) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Dt. Realização Final deve ser maior que Dt. Realização Inicial'
                });
            }

            if (   (!angular.isUndefined(_self.model.cdnRegraIni) && _self.model.cdnRegraIni !==null)
                && (!angular.isUndefined(_self.model.cdnRegraFim) && _self.model.cdnRegraFim !==null)
                && (_self.model.cdnRegraIni > _self.model.cdnRegraFim) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Regra Final deve ser maior que Regra Inicial'
                });
            }

            if (   (!angular.isUndefined(_self.model.cdnUnidCarteiraIni) && _self.model.cdnUnidCarteiraIni !==null)
                && (!angular.isUndefined(_self.model.cdnUnidCarteiraFim) && _self.model.cdnUnidCarteiraFim !==null)
                && (_self.model.cdnUnidCarteiraIni > _self.model.cdnUnidCarteiraFim) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Unidade Carteira Final deve ser maior que Unidade Carteira Inicial'
                });
            }
            
            if (   (!angular.isUndefined(_self.model.cdnAnoIni) && _self.model.cdnAnoIni !==null)
                && (!angular.isUndefined(_self.model.cdnAnoFim) && _self.model.cdnAnoFim !==null)
                && (_self.model.cdnAnoIni > _self.model.cdnAnoFim) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Ano Final deve ser maior que Ano Inicial'
                });
            }

            if (   (!angular.isUndefined(_self.model.nrGuiaIni) && _self.model.nrGuiaIni !==null)
                && (!angular.isUndefined(_self.model.nrGuiaFim) && _self.model.nrGuiaFim !==null)
                && (_self.model.nrGuiaIni > _self.model.nrGuiaFim) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Numero Guia Final deve ser maior que Numero Guia Inicial'
                });
            }

            if (   (!angular.isUndefined(_self.model.cdnPrestadorPrincipalIni) && _self.model.cdnPrestadorPrincipalIni !==null)
                && (!angular.isUndefined(_self.model.cdnPrestadorPrincipalFim) && _self.model.cdnPrestadorPrincipalFim !==null)
                && (_self.model.cdnPrestadorPrincipalIni > _self.model.cdnPrestadorPrincipalFim) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Prestador Principal Final deve ser maior que Prestador Principal Inicial'
                });
            }

            if (   (!angular.isUndefined(_self.model.datDigitacaoIni) && _self.model.datDigitacaoIni !==null)
                && (!angular.isUndefined(_self.model.datDigitacaoFim) && _self.model.datDigitacaoFim !==null)
                && (_self.model.datDigitacaoIni > _self.model.datDigitacaoFim) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Data Digitação Final deve ser maior que Data Digitação Inicial'
                });
            }

            switch(parametros.selecao) {
                case 'periodo':

                    if ( (_self.model.cdnDocIni !== _self.model.cdnDocFim) && (_self.model.cdnPeriodoIni !== _self.model.cdnPeriodoFim) ) {
                        isValid = false;
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'error',
                            title: 'O número do documento ou o número do período são obrigatórios. Ao menos um deve ser preenchido.'
                        });
                    }
                    
                    // pesquisa por numero de documento
                    if (_self.model.cdnDocIni === _self.model.cdnDocFim) {

                        if (_self.model.cdnTransacaoIni !== _self.model.cdnTransacaoFim){
                            isValid = false;
                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type: 'error',
                                title: 'O código da transação é obrigatório quando o número do documento estiver preenchido.'
                            });
                        }

                        if (_self.model.cdnSerieDocIni !== _self.model.cdnSerieDocFim){
                            isValid = false;
                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type: 'error',
                                title: 'O código da série é obrigatório quando o número do documento estiver preenchido.'
                            });
                        }
                    }

                    // pesquisa por periodo do documento
                    if (_self.model.cdnPeriodoIni === _self.model.cdnPeriodoFim) {

                        if (_self.model.cdnUnidPrestIni !== _self.model.cdnUnidPrestFim){
                            isValid = false;
                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type: 'error',
                                title: 'O código da unidade do prestador é obrigatório quando o número do período estiver preenchido.'
                            });
                        }

                        if (_self.model.cdnPrestadorIni !== _self.model.cdnPrestadorFim){
                            isValid = false;
                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type: 'error',
                                title: 'O código do prestador é obrigatório quando o número do período estiver preenchido.'
                            });
                        }
                    }

                    break;

                case 'fatura':
                    if (_self.model.cdnFaturaIni !== _self.model.cdnFaturaFim){
                        isValid = false;
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'error',
                            title: 'O número da fatura é obrigatório. O número inicial deve ser igual ao final.'
                        });
                    }

                    if (_self.model.cdnUnidPrestIni !== _self.model.cdnUnidPrestFim){
                        isValid = false;
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'error',
                            title: 'O código da unidade do prestador é obrigatório. O código inicial deve ser igual ao final.'
                        });
                    }

                    if (_self.model.cdnPrestadorIni !== _self.model.cdnPrestadorFim){
                        isValid = false;
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'error',
                            title: 'O código do prestador é obrigatório. O código inicial deve ser igual ao final.'
                        });
                    }

                    break;

                case 'lote':
                    if (_self.model.cdnLoteIni !== _self.model.cdnLoteFim){
                        isValid = false;
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'error',
                            title: 'O número do lote é obrigatório. O número inicial deve ser igual ao final.'
                        });
                    }

                    if (_self.model.cdnUnidPrestIni !== _self.model.cdnUnidPrestFim){
                        isValid = false;
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'error',
                            title: 'O código da unidade do prestador é obrigatório. O código inicial deve ser igual ao final.'
                        });
                    }

                    if (_self.model.cdnPrestadorIni !== _self.model.cdnPrestadorFim){
                        isValid = false;
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'error',
                            title: 'O código do prestador é obrigatório. O código inicial deve ser igual ao final.'
                        });
                    }

                    break;
            }

            if ((_self.model.nrGuiaIni === _self.model.nrGuiaFim) && (_self.model.cdnAnoIni !== _self.model.cdnAnoFim))  {
            
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'O ano da guia é obrigatório quando o número da guia estiver preenchido.'
                });
            }
            
            if (isValid === true) {          
                var arrayLength = this.disclaimers.length - 1;
                for (var i = arrayLength ; i >= 0 ; i--) {
                    this.disclaimers.splice(i, 1);
                }      
           
                this.constructDisclaimers();
                $modalInstance.close(this.disclaimers);
            }
        };

        this.changeRange = function (sourceField,observerField) {
            if (angular.isUndefined(_self.model[observerField]) 
            || _self.model[observerField] == ''
            || _self.model[observerField] == _self.model[sourceField]){
                _self.model[observerField] = _self.model[sourceField];        
            }
        };

		this.setCodPrestador = function(value, target){
			if (value != null){
				_self.model[target] = value.substring(4,value.length);
			}
		}
			
        this.cancel = function () {
            _self.selecao = "";
            $modalInstance.dismiss('cancel');
        };

        this.init = function () {
             this.initialize();
             
             //Carrega tela conforme seleção
             $(".periodo").each(function() { 
                $(this).hide();
             });
             $(".fatura").each(function() { 
                $(this).hide();
             });
             $(".lote").each(function() { 
                $(this).hide();
             });
             $("."+parametros.selecao).each(function() { 
                $(this).show();

                if (parametros.selecao == 'fatura'){
                    $('#modalAuditPosAdvancedFilter').css('height', '720px');
                }else{
                    $('#modalAuditPosAdvancedFilter').css('height', '660px');
                }

             });          
             
            if (this.disclaimers.length == 0){
                _self.cleanFieldsFilter();
            }

        };

        this.cleanFieldsFilter = function(){
            _self.model.cdnAnoRefIni = ""
            _self.model.cdnAnoRefFim = ""
            _self.model.cdnPeriodoIni = ""
            _self.model.cdnPeriodoFim = ""
            _self.model.cdnAnoFatIni = ""
            _self.model.cdnAnoFatFim = ""
            _self.model.cdnSerieFatIni = ""
            _self.model.cdnSerieFatFim = ""
            _self.model.cdnFaturaIni = ""
            _self.model.cdnFaturaFim = ""
            _self.model.cdnLoteIni = ""
            _self.model.cdnLoteFim = ""
            _self.model.cdnSeqLoteIni = ""
            _self.model.cdnSeqLoteFim = ""

            if (parametros.selecao == "periodo"){
                _self.model.cdnAnoRefIni = _self.today.toString("yyyy")
                _self.model.cdnAnoRefFim = _self.today.toString("yyyy")
                _self.model.cdnPeriodoIni = 0
                _self.model.cdnPeriodoFim = 999

            } else if (parametros.selecao == "fatura"){
                _self.model.cdnAnoFatIni = 1900 /* Ano da Fatura*/
                _self.model.cdnAnoFatFim = _self.today.toString("yyyy")
                _self.model.cdnSerieFatIni = ""
                _self.model.cdnSerieFatFim = "ZZZ"
                _self.model.cdnFaturaIni = ""
                _self.model.cdnFaturaFim = "9999999999999999"

            } else if (parametros.selecao == "lote"){
                _self.model.cdnLoteIni = 0
                _self.model.cdnLoteFim = 99999999
                _self.model.cdnSeqLoteIni = 0
                _self.model.cdnSeqLoteFim = 999
            }

            _self.model.inTipoProcesso = 'contingencia'
            _self.model.inTipSelecao = parametros.selecao
            _self.model.cdnTransacaoIni = 0
            _self.model.cdnTransacaoFim = 9999
            _self.model.cdnSerieDocIni = ""
            _self.model.cdnSerieDocFim = "ZZZZ"
            _self.model.cdnDocIni = 0
            _self.model.cdnDocFim = 99999999
            _self.model.cdnUnidPrestIni = 0
            _self.model.cdnUnidPrestFim = 9999
            _self.model.cdnPrestadorIni = 0
            _self.model.cdnPrestadorFim = 99999999
            _self.model.cdnRegraIni = 1
            _self.model.cdnRegraFim = "99999999999999999999"
            _self.model.cdnUnidCarteiraIni = 1
            _self.model.cdnUnidCarteiraFim = 9999
            _self.model.datRealizacaoIni = new Date('1990-01-02')* 1
            _self.model.datRealizacaoFim = new Date(_self.today)* 1
            _self.model.cdnAnoIni = 0 /* Ano da Guia */
            _self.model.cdnAnoFim = _self.today.toString("yyyy")
            _self.model.nrGuiaIni = 0
            _self.model.nrGuiaFim = 99999999
            _self.model.cdnPrestadorPrincipalIni = 0
            _self.model.cdnPrestadorPrincipalFim = 99999999
            _self.model.datDigitacaoIni = new Date('1990-01-02')* 1
            _self.model.datDigitacaoFim = new Date(_self.today)* 1
        };



        $scope.$watch('$viewContentLoaded', function () {
            
            _self.init();
        });

        $.extend(this, AbstractAdvancedFilterController);
    }

    index.register.controller('hrc.contingAuditPosAdvFilter.Control', contingAuditPosAdvancedFilterController);
});



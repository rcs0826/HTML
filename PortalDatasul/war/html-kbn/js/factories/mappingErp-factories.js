define(['index', '/dts/kbn/js/factories/kbn-factories.js'], function(index) {

    factorymappingErp.$inject = ['kbn.helper.FactoryLoader', 'kbn.generic.Factory', 'kbn.generic-crud.Factory', 'kbn.typeahead.Factory'];

    function factorymappingErp(factoryResource, kbnGenericFactory, kbnGenericCrud, typeaheadFactory) {

        var specificResources  = {

            createFlowAtMapping: {
                method: 'POST',
                isArray: false,
                params: {
                    url: 'createFlowAtMapping'
                }
            },
            //Parametro: mapId
            //Parametro: sku
            //Parametro: refer
            //Retorno: RowErrors

            cloneByCopy: {
                method: 'POST',
                isArray: false,
                params: {
                    url: 'cloneByCopy'
                }
            },
            //Parametro: fatherMapId
            //Parametro: descMap
            //Retorno: MapIdCreated
            //Retorno: RowErrors

            cloneByStructure: {
                method: 'POST',
                isArray: false,
                params: {
                    url: 'cloneByStructure'
                }
            },
            //Parametro: fatherMapId
            //Parametro: cutOffDate
            //Parametro: c-descMap
            //Retorno: i-MapIdCreated
            //Retorno: RowErrors
            getCtFromCel: {
                method: 'POST',
                isArray: true,
                params: {
                    url: 'getCtFromCel'
                }
            },
            //Parametro: num_id_cel_mestre
            getCtFromMasterCel: {
                method: 'GET',
                isArray: true,
                params: {
                    url: 'getCtFromMasterCel'
                }
            },
            //Parametro: num_id_cel
            deleteCtFromCel: {
                method: 'POST',
                isArray: false,
                params: {
                    url: 'deleteCtFromCel'
                }
            },
            //Parametro: num_id_cel
            //Parametro:num_id_ct_mestre
            regenWorkCenter: {
                method: 'POST',
                isArray: false,
                params: {
                    url: 'regenWorkCenter'
                }
            },
            //Parametro: num_id_cel
            //Parametro: cod_estab_erp
            getItensFlow: {
                method: 'POST',
                isArray: true,
                params: {
                    url: 'getItensFlow'
                }
            },
            //Parametro: num_id_fluxo_pai
            getDataSetItensEstruct: {
                method: 'GET',
                isArray: false,
                params: {
                    url: 'getDataSetItensEstruct'
                }
            },
            //Parametro: num_id_cel
            getDSCellProductionReportData: {
                method: 'POST',
                isArray: false,
                params: {
                    url: 'getDSCellProductionReportData'
                }
            },
            getKanbanStatus: {
                method: 'POST',
                isArray: true,
                params: {
                    url: 'getKanbanStatusData'
                }
            },
            getInventoryAdjustment: {
                method: 'POST',
                isArray: true,
                params: {
                    url: 'getInventoryAdjustmentData'
                }
            },
            calculaCartaoExtra: {
                method: 'POST',
                isArray: true,
                params: {
                    url: 'calculaCartaoExtra'
                }
            },
            //Parametro: num_id_item_det
            //Parametro: qtdDeman
            //Retorno: tt_kbn_item_det_cartao_extra

            aplicarCartaoExtra: {
                method: 'POST',
                isArray: false,
                params: {
                    url: 'aplicarCartaoExtra'
                }
            },
            //Parametro: tt_kbn_item_det_cartao_extra

            deletarCartaoExtra: {
                method: 'POST',
                isArray: false,
                params: {
                    url: 'deletarCartaoExtra'
                }
            },
            //Parametro: tt_integer_values

            bloquearCartao: {
                method: 'POST',
                isArray: false,
                params: {
                    url: 'bloquearCartao'
                }
            },
            //Parametro: QP_justificative
            //Parametro: tt_integer_values

            desbloquearCartao: {
                method: 'POST',
                isArray: false,
                params: {
                    url: 'desbloquearCartao'
                }
            },
            //Parametro: tt_integer_values

            CreateKbnCateg: {
                method: 'POST',
                isArray: false,
                params: {
                    url: 'CreateKbnCateg'
                }
            },
            //Parametro: tt-kbn_categoria
            //Retorno: RowErrors

            UpdateKbnCateg: {
                method: 'POST',
                isArray: false,
                params: {
                    url: 'UpdateKbnCateg'
                }
            },
            //Parametro: tt-kbn_categoria
            //Retorno: RowErrors

            getCategClassif: {
                method: 'GET',
                isArray: true,
                params: {
                    url: 'getCategClassif'
                }
            },
            //Parametro:

            CreateKbnClassif: {
                method: 'POST',
                isArray: false,
                params: {
                    url: 'CreateKbnClassif'
                }
            },
            //Parametro: tt-kbn_clasdor
            //Retorno: RowErrors

            UpdateKbnClassif: {
                method: 'POST',
                isArray: false,
                params: {
                    url: 'UpdateKbnClassif'
                }
            },
            //Parametro: tt-kbn_clasdor
            //Retorno: RowErrors

            getItemsOnClassif: {
                method: 'GET',
                isArray: true,
                params: {
                    url: 'getItemsOnClassif'
                }
            },
            //Parametro: tt-kbn_clasdor
            //Retorno: RowErrors

            CreateKbnRelacItemClassif: {
                method: 'POST',
                isArray: false,
                params: {
                    url: 'CreateKbnRelacItemClassif'
                }
            },
            //Parametro: cod_estab_erp
            //Parametro: num_id_item
            //Parametro: num_id_clasdor
            //Retorno: RowErrors

            DeleteKbnRelacItemClassif: {
                method: 'POST',
                isArray: false,
                params: {
                    url: 'DeleteKbnRelacItemClassif'
                }
            },
            //Parametro: tt-kbn-items-filtered
            //Retorno: RowErrors

            ItemsEstab: {
                method: 'GET',
                isArray: true,
                params: {
                    url: 'ItemsEstab'
                }
            },
            //Parametro: cod_estab_erp
            //Retorno: tt_itens_estab

            GetKbnClassif: {
                method: 'GET',
                isArray: true,
                params: {
                    url: 'GetKbnClassif'
                }
            },
            //Parametro: num_id_clasdor
            //Retorno: dsClassifCateg
            deleteClasdor: {
                method: 'GET',
                isArray: false,
                params: {
                    url: 'deleteClasdor'
                }
            },
            //Parametro: num_id_clasdor
            deleteCateg: {
                method: 'GET',
                isArray: false,
                params: {
                    url: 'deleteCateg'
                }
            },
            //Parametro: num_id_categoria

            dashBoardKanbanStatus: {
                method: 'GET',
                isArray: true,
                params: {
                    url: 'dashBoardKanbanStatus'
                }
            },

            dashBoardParetoItem: {
                method: 'GET',
                isArray: true,
                params: {
                    url: 'dashBoardParetoItem'
                }
            },

            getFrequencyItem: {
                method: 'GET',
                isArray: true,
                params: {
                    url: 'dashBoardFrequencyItem'
                }

            },

            dashBoardProdPerformance: {
                method: 'GET',
                isArray: true,
                params: {
                    url: 'dashboardProdPerformance'
                }
            },

            dashBoardProductionDaily: {
                method: 'GET',
                isArray: true,
                params: {
                    url: 'DashBoardProductionDaily'
                }
            },

            dashboardItemTimeRange: {
                method: 'GET',
                isArray: true,
                params: {
                    url: 'dashboardItemTimeRange'
                }
            },

            dashboardItemTimeByRangeDailyView: {
                method: 'GET',
                isArray: true,
                params: {
                    url: 'dashboardItemTimeByRangeDailyView'
                }
            },

            getFrequencyConsumptionData: {
                method: 'GET',
                isArray: true,
                params: {
                    url: 'getFrequencyConsumptionWithClassifiers'
                }
            },

            getItemTimeByRangeColorData: {
                method: 'GET',
                isArray: true,
                params: {
                    url: 'getItemTimeByColorRangeWithClassifiers'
                }
            },

            getProducedQuantityData: {
                method: 'POST',
                isArray: true,
                params: {
                    url: 'getProducedDataWithClassifiers'
                }
            },

            generateEstablishment: {
                method: 'POST',
                isArray: false,
                params: {
                    url: 'generateEstablishment'
                }
            },

            getKbnEstablishment:{
                method: 'GET',
                isArray: true,
                params: {
                    url: 'getKbnEstablishment'
                }
            },

            getKbnEstablishmentByCode:{
                method: 'GET',
                isArray: true,
                params: {
                    url: 'getKbnEstablishmentByCode'
                }
            },            

            getItens:{
                method: 'GET',
                isArray: true,
                params: {
                    url: 'getItens'
                }
            },

            getKbnItemferam:{
                method: 'GET',
                isArray: true,
                params: {
                    url: 'getKbnItemferam'
                }
            },

            createMapping: {
                method: 'POST',
                isArray: false,
                params: {
                    url: 'createMapping'
                }
            },

            deleteMapping: {
                method: 'DELETE',
                isArray: false,
                params: {
                    url: 'deleteMapping'
                }
            },

            saveIntegratedDatasul:{
                method: 'POST',
                isArray: false,
                params: {
                    url: 'integratedDatasul'
                }
            },

            getIntegratedDatasul:{
                method: 'GET',
                isArray: false,
                params: {
                    url: 'integratedDatasul'
                }
            },

            getCellsFlowBatchEdit:{
                method: 'GET',
                isArray: true,
                params: {
                    url: 'getCellsFlowBatchEdit'
                }
            },

            setCellsFlowBatchEdit:{
                method: 'POST',
                isArray: false,
                params: {
                    url: 'setCellsFlowBatchEdit'
                }

            },

            getItemsFlowBatchEdit:{
                method: 'GET',
                isArray: true,
                params: {
                    url: 'getItemsFlowBatchEdit'
                }
            },

            setItemsFlowBatchEdit:{
                method: 'POST',
                isArray: false,
                params: {
                    url: 'setItemsFlowBatchEdit'
                }

            },

            deleteFlowAtMapping:{
                method: 'DELETE',
                isArray: false,
                params:{
                    url: 'deleteFlowAtMapping'
                }

            },

            GetSupermarket:{
                method: 'GET',
                isArray: true,
                params: {
                    url: 'Supermarket'
                }
            },

            SaveSupermarket:{
                method: 'PUT',
                isArray: false,
                params: {
                    url: 'Supermarket'
                }
            },

            ItensImpactados:{
                method: 'GET',
                isArray: true,
                params: {
                    url: 'ItensImpactados'
                }
            },

            listChecklist:{
                method: 'GET',
                isArray: true,
                params: {
                    url: 'listChecklist'
                }
            },

            checklistSaveRecord:{
                method: 'POST',
                isArray: false,
                params: {
                    url: 'checklistSaveRecord'
                }
            },

            checklistDeleteRecord:{
                method: 'POST',
                isArray: false,
                params: {
                    url: 'checklistDeleteRecord'
                }
            },

            CheckPendencies:{
                method: 'GET',
                isArray: false,
                params: {
                    url: 'CheckPendencies'
                }
            },

            listMappings: {
                method: 'GET',
                isArray: true,
                params: {
                    url: 'listMappings'
                }
            },

            MappingPublish: {
                method: 'POST',
                isArray: false,
                params: {
                    url: 'MappingPublish'
                }
            },

            getFlowCell: {
                method: 'GET',
                isArray: true,
                params: {
                    url: 'getFlowCell'
                }
            },

            getFlowCellEdit: {
                method: 'GET',
                isArray: true,
                params: {
                    url: 'getFlowCellEdit'
                }
            },

            saveFlowCell: {
                method: 'POST',
                isArray: false,
                params: {
                    url: 'saveFlowCell'
                }
            },

            saveFlowCellItem: {
                method: 'POST',
                isArray: false,
                params: {
                    url: 'saveFlowCellItem'
                }
            },

            saveFlowCellEdit: {
                method: 'POST',
                isArray: false,
                params: {
                    url: 'saveFlowCellEdit'
                }
            },

            saveMapping: {
                method: 'POST',
                isArray: false,
                params: {
                    url: 'saveMapping'
                }
            },

            mapping: {
                method: 'GET',
                isArray: true,
                params: {
                    url: 'mapping'
                }
            },

            justificatives: {
                method: 'GET',
                isArray: true,
                params: {
                    url: 'justificatives'
                }
            },

            saveJustificatives: {
                method: 'POST',
                isArray: false,
                params: {
                    url: 'justificatives'
                }
            },

            deleteJustificatives: {
                method: 'POST',
                isArray: false,
                params: {
                    url: 'deleteJustificatives'
                }
            },

            getFlowsAtMapping:{
                method: 'GET',
                isArray: true,
                params: {
                    url: 'getFlowsAtMapping'
                }
            },

            ProduceCards:{
                method: 'POST',
                isArray: false,
                params: {
                    url: 'ProduceCards'
                }
            },

            ProduceCardsID:{
                method: 'POST',
                isArray: false,
                params: {
                    url: 'ProduceCardsID'
                }
            }, getExtraCards:{
                method: 'GET',
                isArray: true,
                params: {
                    url: 'getExtraCards'
                }
            }, itemDetail:{
                method: 'GET',
                isArray: true,
                params: {
                    url: 'itemDetail'
                }
            }, getItemsAtFlow:{
                method: 'GET',
                isArray: true,
                params: {
                    url: 'getItemsAtFlow'
                }
            },
            montaGraficoFluxo: {
                method: 'GET',
                isArray: false,
                params: {
                    url: 'montaGraficoFluxo'
                }
            }, updateKanbanRange:{
                method: 'POST',
                isArray: false,
                params: {
                    url: 'updateKanbanRange'
                }
            }, createBatchFlowsAtMapping:{
                method: 'POST',
                isArray: false,
                params: {
                    url: 'createBatchFlowsAtMapping'
                }
            }, deactivateFlow:{
                method: 'POST',
                isArray: false,
                params: {
                    url: 'deactivateFlow'
                }
            }, deactivateFlowList:{
                method: 'GET',
                isArray: true,
                params: {
                    url: 'deactivateFlowList'
                }
            }, mapeamentoDoItem: {
                method: 'GET',
                isArray: true,
                params: {
                    url: 'mapeamentoDoItem'
                }
            }, getCellsAtFlow: {
                method: 'GET',
                isArray: true,
                params: {
                    url: 'getCells'
                }
            }, alteraQuantidadeRelac: {
                method: 'POST',
                isArray: false,
                params: {
                    url: 'alteraQuantidadeRelac'
                }
            }, verificaEstrutItemPai: {
                method: 'POST',
                isArray: false,
                params: {
                    url: 'verificaEstrutItemPai'
                }
            }, desativaOrfao: {
                method: 'POST',
                isArray: false,
                params: {
                    url: 'desativaOrfao'
                }
            }, getCellInactiveItem: {
                method: 'GET',
                isArray: true,
                params: {
                    url: 'getCellInactiveItem'
                }
            }, relacItemWhereUse: {
                method: 'GET',
                isArray: true,
                params: {
                    url: 'relacItemWhereUse'
                }
            }
        };

        var factory = factoryResource.loadSpecificResources('/dts/datasul-rest/resources/api/fch/fchkb/fchkbmapping', specificResources);
        angular.extend(factory, kbnGenericFactory);
        angular.extend(factory, kbnGenericCrud);
        angular.extend(factory, typeaheadFactory);
        return factory;
    }
    index.register.factory('kbn.mappingErp.Factory', factorymappingErp);
});

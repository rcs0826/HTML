define([
    'index',
    '/dts/kbn/libs/paper/paper-full.js',
    'ui-file-upload',
    '/dts/kbn/js/directives.js',
    '/dts/kbn/html/flow/flow.supermarket.edit.js',
    '/dts/kbn/html/flow/flow.cell.edit.js',
    '/dts/kbn/js/factories/mappingErp-factories.js',
    '/dts/kbn/js/zoom/item-map.js',
    '/dts/kbn/html/mappingcell/mappingcell.item.edit.js',
    '/dts/kbn/html/flow/flow.cell.item.edit.js',
    '/dts/kbn/html/flow/flow.edit.quantity.js'
    ], function(index) {

        flowViewController.$inject = [
            '$scope',
            'totvs.app-main-view.Service',
            '$stateParams',
            '$state',
            '$resource',
            'kbn.helper.Service',
            '$rootScope',
            'Upload',
            '$location',
            'kbn.supermarket.edit.modal',
            'kbn.cell.edit.modal',
            'kbn.mappingErp.Factory',
            'TOTVSEvent',
            '$timeout',
            'kbn.item.edit.modal',
            'kbn.cell.item.edit.modal',
            'kbn.celllist.edit.modal',
            'kbn.edit.quantity.modal',
            'messageHolder'
        ];

        function flowViewController(
            $scope,
            appViewService,
            $stateParams,
            $state,
            $resource,
            kbnHelper,
            $rootScope,
            $upload,
            $location,
            supermarketModal,
            cellModal,
            factoryMappingErp,
            TOTVSEvent,
            $timeout,
            itemModal,
            modalCellItemEdit,
            modalCellListEdit,
            modalEditQuantity,
            messageHolder
        ){

            var _self = this;
            var firstFlow = true;

            _self.init = function(){
                createTab = appViewService.startView($rootScope.i18n('l-mapping-list'), 'ekanban.mapping.FlowView', flowViewController);

                _self.diagram = {};
                _self.structure = [];
                _self.items = [];
                _self.cells = [];
                _self.structureFuture = [];
                _self.itensPai = [];
                _self.itensPaiFuture = [];
                _self.layout = {
                    type: 'tree',
                    verticalSeparation: 30
                };
                _self.shapes = [];
                _self.connections = [];

                _self.item = $stateParams.id;
                _self.loadMapping();

                factoryMappingErp.itemDetail({num_id_item_det:_self.item},{}, function(result){
                    _self.itemDetail = result[0];
                });

                factoryMappingErp.montaGraficoFluxo({
                    num_id_item_det: _self.item
                }, {}, function(result) {
                    supermarket = _self.drawDiagram(result);
                    
                    if(supermarket){
                        $timeout(function() {
                            _self.diagram.bringIntoView(
                                supermarket
                            );
                        }, 0);
                    };
                });
            };

            _self.loadMapping = function() {
                factoryMappingErp.mapeamentoDoItem({num_id_item_det: _self.item}, {}, function(result){
                    _self.mapping = result[0];
                });
            };

            _self.loadAbaItens = function(){
                if (_self.items.length === 0) {
                    factoryMappingErp.getItemsAtFlow({
                        num_id_item_det: _self.item,
                        log_ativo: _self.itemDetail.log_ativo
                    }, {}, function(result){
                        _self.items = result;
                    });
                }
            };

            _self.loadAbaCelula = function(){
                if (_self.cells.length === 0) {
                    if(_self.itemDetail.log_ativo) 
                        factoryMappingErp.getCellsAtFlow({
                            num_id_item_det: _self.item
                        }, {}, function(result){
                            _self.cells = result;
                        });
                    else if(!_self.itemDetail.log_ativo)
                        factoryMappingErp.getCellInactiveItem({
                            num_id_item_det: _self.item
                        }, {}, function(result){
                            _self.cells = result;
                        });
                }
            };

            _self.retornoZoom = function(itemsToInclud, cell) {
                var items = [];
                if(itemsToInclud.size) items = itemsToInclud.objSelected
                else items = [itemsToInclud];
    
                itemModal.open({
                    mapping: _self.mapping,
                    cell: cell,
                    itemsToInclud: items
                }).then(function(){

                    $state.transitionTo($state.current, {id: _self.item}, {
                        reload: true,
                        inherit: false,
                        notify: true
                    });

                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type:   'info',
                        title:  $rootScope.i18n('l-insert-items'),
                        detail: $rootScope.i18n('l-success-transaction'),
                    });
                });
            };

            _self.quickSearchCell = function(text) {
                _self.quickSearchTextCell = text;
            };

            _self.quickSearchCellClean = function() {
                _self.quickSearchTextCell = "";
            };

            _self.quickSearchItem = function(text) {
                _self.quickSearchTextItem = text;
            };

            _self.quickSearchItemClean = function() {
                _self.quickSearchTextItem = "";
            };

            _self.quickSearchStructure = function(text) {
                _self.quickSearchTextStructure = text;
                _self.structureFuture = _self.structure.filter(quickSearchStructureFuntion);
            };

            _self.quickSearchStructureClean = function() {
                _self.quickSearchStructure("");
            };

            _self.quickSearchGenericFunction = function(list, string) {
                for (var i = 0; i < list.length; ++i) {
                    var l = list[i];
                    if (l.toLowerCase().indexOf(string.toLowerCase()) != -1) return true;
                }
                return false;
            };

            _self.quickSearchItemFunction = function(item) {
                return _self.quickSearchGenericFunction([
                    item.ttItem.cod_chave_erp,
                    item.ttItem.des_item_erp
                ], _self.quickSearchTextItem || "");
            };

            _self.quickSearchCellFunction = function(item) {
                return _self.quickSearchGenericFunction([
                    item.ttCellMestre_DSCellCellMestre.des_cel,
                    item.ttCellMestre_DSCellCellMestre.cod_chave_erp
                ], _self.quickSearchTextCell || "");
            };

            var quickSearchStructureFuntion = function(structure) {
                return _self.quickSearchGenericFunction([
                    structure.codeErpPai,
                    structure.descPai,
                    structure.codErpFilho,
                    structure.descFilho
                ], _self.quickSearchTextStructure || "");
            };

            _self.openModalCell = function(cellMember, itemDetail) {
                var params = {
                    cellMember: cellMember,
                    itemDetail: itemDetail,
                    log_ativo: _self.itemDetail.log_ativo,
                    mapping: _self.mapping
                };

                cellModal.open(params);
            };            

            _self.openModalCellEdit = function(cellMember, itemDetail) {
                var params = {
                    cellMember: cellMember,
                    itemDetail: itemDetail,
                    log_ativo: _self.itemDetail.log_ativo,
                    mapping: _self.mapping
                };

                modalCellListEdit.open(params);
            };

            _self.openModalCellItem = function(idCell) {
                var params = {
                    cellMember: idCell,
                    mapping: _self.mapping
                };
    
                modalCellItemEdit.open(params).then(function(){
                    _self.doSearch();
                });
            };

            _self.GetSupermarket = function(listItems){
                factoryMappingErp.GetSupermarket({num_ids:listItems},{},function(result){
                    if(!result.$hasError){
                        _self.currentSupermarket = result;

                        var params = {
                            model: _self.currentSupermarket,
                            mapping: _self.mapping
                        };

                        supermarketModal.open(params);
                    }

                });
            };

            _self.openModalSupermarket = function(idItemListFirstStock){
                _self.GetSupermarket(idItemListFirstStock.join());
            };

            _self.loadStructure = function(){
                if (_self.structure.length === 0)
                    factoryMappingErp.getDataSetItensEstruct({num_id_item_det_pai: _self.item, log_ativo: true}, {}, _self.loadStructureCallback);
            };

            _self.loadStructureCallback = function(result){
                result = JSON.parse(result.lc_data);

                if(result.dsRelacPaiFilho.tt_kbn_relac){
                    result.dsRelacPaiFilho.tt_kbn_relac.forEach(function(obj){
                        if(obj.tt_kbn_item_det_pai[0].log_ativo &&  obj.tt_kbn_item_det_filho[0].log_ativo){
                            var obj4 = {
                                numIdRelac: obj.num_id_relac,
                                codeErpPai: obj.tt_kbn_item_det_pai[0].cod_chave_erp,
                                descPai: obj.tt_kbn_item_det_pai[0].des_item_erp,
                                refPai: obj.tt_kbn_item_det_pai[0].cod_refer,
                                typePai: obj.tt_kbn_item_det_pai[0].tt_kbn_item_pai[0].log_expedic,
                                qtdPai: obj.qtd_pai,
                                undMedPai: obj.tt_kbn_item_det_pai[0].tt_kbn_item_pai[0].cod_un_med_erp,
                                qtdFilho: obj.qtd_filho,
                                undMedFilho: obj.tt_kbn_item_det_filho[0].tt_kbn_item_filho[0].cod_un_med_erp,
                                itemParentTitle: obj.tt_kbn_item_det_pai[0].cod_chave_erp + " - " + obj.tt_kbn_item_det_pai[0].des_item_erp + (obj.tt_kbn_item_det_pai[0].cod_refer ? " (" + obj.tt_kbn_item_det_pai[0].cod_refer + ")" : '') + (obj.tt_kbn_item_det_pai[0].tt_kbn_item_pai[0].log_expedic ? " (" + $rootScope.i18n('l-expedition') + ") " : " (" + $rootScope.i18n('l-process') + ")")
                                
                            };

                            obj4.codErpFilho = obj.tt_kbn_item_det_filho[0].cod_chave_erp;
                            obj4.descFilho = obj.tt_kbn_item_det_filho[0].des_item_erp;
                            obj4.refFilho = obj.tt_kbn_item_det_filho[0].cod_refer;
                            obj4.itemSonTitle = obj.tt_kbn_item_det_filho[0].cod_chave_erp + " - " + obj.tt_kbn_item_det_filho[0].des_item_erp + (obj.tt_kbn_item_det_filho[0].cod_refer ? " (" + obj.tt_kbn_item_det_filho[0].cod_refer + ")" : '')

                            _self.structure.push(obj4);
                        }
                    });

                    angular.copy(_self.structure,_self.structureFuture);
                }

                if(_self.mapping.idi_status != 3){
                    _self.gridDados.hideColumn(4);
                    _self.gridDados.hideColumn(5);
                }

                _self.quickSearchStructure(_self.quickSearchTextStructure);
            };

            _self.obterAlturaItem = function(){
                if (_self.mapping.idi_status != 3)
                    return {width: '485 px'};
                else
                    return {width: '450 px'};
            }

            var supermarketSvg = 'M0 0 L70 0 L70 200 L0 200 M0 67 L70 67 M0 133 L70 133';

            var squareSvg = 'M 0 0 L 100 0 L 100 100 L 0 100 L 10 100 L 10 90 L 90 90 L 90 10 L 10 10 L 10 100 L 0 100 Z';

            var pulledBySvg = "M230 230 A 45 45, 0, 1, 0, 275 185 L 275 175 L 260 190 L 275 205 L 275 195 A 35 35, 0, 1, 1, 240 230 Z";

            _self.drawDiagram = function(data) {
                var mainSupermarket;
                data.ttSupermercado.forEach(function(supermercado) {
                    var supermarket = graficoSupermercado(supermercado);
                    _self.shapes.push(supermarket);

                    if (mainSupermarket == undefined) {
                        mainSupermarket = supermarket;
                    }
                });

                data.ttQuadro.forEach(function(quadro) {
                    _self.shapes.push(graficoQuadro(quadro));
                });


                data.ttSupermercadoQuadro.forEach(function(supermercadoQuadro) {
                    _self.connections.push(arrowConnection(supermercadoQuadro.num_id_supermercado, supermercadoQuadro.num_id_quadro));
                });

                data.ttQuadroSupermercado.forEach(function(ttQuadroSupermercado) {
                    var tempId = ttQuadroSupermercado.num_id_quadro + "_" + ttQuadroSupermercado.num_id_supermercado;
                    _self.connections.push(pulledByConnection(ttQuadroSupermercado.num_id_quadro, tempId));
                    _self.shapes.push(graficoPuxado(tempId));
                    _self.connections.push(pulledByConnection(tempId, ttQuadroSupermercado.num_id_supermercado));
                });
                return mainSupermarket;
            };

            _self.OnClickDiagram = function(e) {
                var item = e.item.shapeVisual.options;
                var onClick =item.onClick || angular.noop;

                onClick(item);
            };

            var graficoSupermercado = function(supermercado) {
                supermercado.id = supermercado.num_id_supermercado.toString();
                supermercado.path = supermarketSvg;
                supermercado.fill = 'White';
                supermercado.stroke = {
                    color: 'Black'
                };
                supermercado.width = 60;
                supermercado.height = 130;
                supermercado.onClick = function(quadro) {
                    _self.openModalSupermarket(supermercado.ttSupermercadoItem.map(function(item) {
                        return item.num_id_item_det;
                    }), true);
                };
                supermercado.editable = false;

                return new kendo.dataviz.diagram.Shape(supermercado);
            };

            var graficoQuadro = function(quadro) {
                if ((quadro.cod_chave_erp || "").trim() == "")
                    return graficoQuadroExterno(quadro);
                return graficoQuadroInterno(quadro);
            };

            var graficoQuadroInterno = function(quadro) {
                quadro.id = quadro.num_id_quadro.toString();
                quadro.fill = 'White';
                quadro.stroke = {
                    color: 'Black'
                };
                quadro.content = {
                    text: quadro.cod_chave_erp
                };
                quadro.onClick = function(quadro) {
                    _self.openModalCell(quadro.num_id_cel, quadro.num_id_item_det);
                };
                quadro.width = 150;
                quadro.height = 70;
                quadro.editable = false;

                return new kendo.dataviz.diagram.Shape(quadro);
            };

            var graficoQuadroExterno = function(quadro) {
                quadro.id = quadro.num_id_quadro.toString();
                quadro.fill = 'Black';
                quadro.stroke = {
                    color: 'Black'
                };
                quadro.content = {
                    text: 'PE',
                    color: 'White'
                };
                quadro.onClick = function(quadro) {
                    _self.openModalCell(quadro.num_id_cel, quadro.num_id_item_det);
                };
                quadro.width = 150;
                quadro.height = 70;
                quadro.editable = false;

                return new kendo.dataviz.diagram.Shape(quadro);
            };

            var graficoPuxado = function(id) {
                return new kendo.dataviz.diagram.Shape({
                    id: id,
                    path: pulledBySvg,
                    width: 50,
                    height: 50,
                    stroke: [{ fill: "Black" }],
                    fill: "Black",
                    editable: false
                });
            };

            var arrowConnection = function(idFrom, idTo) {
                return {
                    from: idFrom.toString(),
                    to: idTo.toString(),
                    toConnector: 'top',
                    fromConnector: 'bottom',
                    endCap: 'ArrowEnd',
                    stroke: {
                        color: '#000000'
                    }
                };
            };

            var pulledByConnection = function(idFrom, idTo) {
                return {
                    from: idFrom.toString(),
                    to: idTo.toString(),
                    toConnector: 'top',
                    fromConnector: 'bottom',
                    stroke: {
                        color: '#FFFFFF'
                    }
                };
            };

            _self.colorTag = function(item) {
                if (item.log_ativo) return kbnHelper.colorTag(1);
            };

            _self.editItem = function(selected) {
                var params = selected;
                modalEditQuantity
                    .open(params)
                    .then(function(){
                        _self.structure = [];
                        _self.loadStructure();
                    });
            };

            _self.deleteRelac = function(selected) {
                var callback = function(){
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type:   'info',
                        title:  $rootScope.i18n('l-delete-link'),
                        detail: $rootScope.i18n('l-success-transaction'),
                    });

                    _self.structure = [];
                    _self.quickSearchStructureClean();
                    _self.loadStructure();
                }

                messageHolder.showQuestion(
                    $rootScope.i18n("l-delete-link"),
                    $rootScope.i18n("msg-remove-relac-confirmation"),
                    function(answer){
                        if(answer){
                            factoryMappingErp.verificaEstrutItemPai({num_id_relac: selected.numIdRelac}, {}, function(result){
                                if(result.log_orfao){
                                    messageHolder.showQuestion(
                                        $rootScope.i18n("l-delete-link"),
                                        $rootScope.i18n("l-child-item") + " " + selected.itemSonTitle + " " + $rootScope.i18n("msg-child-item-orphan")
                                        + $rootScope.i18n("msg-continue"),
                                        function(answer){
                                            if(answer){
                                                factoryMappingErp.desativaOrfao({num_id_relac: selected.numIdRelac}, {}, function(result){
                                                    if (!result.$hasError)
                                                        callback();
                                                });
                                            }
                                        });
                                } else {
                                    if (!result.$hasError)
                                        callback();
                                }
                            });
                        }
                    });
            };

            _self.quickSearchWhereUseClean = function() {
                _self.quickSearchWhereUse("");
            };

            var quickSearchWhereUseFuntion = function(item) {
                return _self.quickSearchGenericFunction([
                    item.codeErpPai,
                    item.descPai
                ], _self.quickSearchTextWhereUse || "");
            };

            _self.quickSearchWhereUse = function(text) {
                _self.quickSearchTextWhereUse = text;
                _self.itensPaiFuture = _self.itensPai.filter(quickSearchWhereUseFuntion);
            };

            _self.loadWhereUse = function(){
                if (_self.itensPai.length === 0) {
                    factoryMappingErp.relacItemWhereUse({num_id_item_det: _self.item},{}, function(result){
                        _self.itensPai = [];

                        result.forEach(function(obj){
                            var obj2 = {
                                itemParentTitle: obj.tt_item_det_use[0].tt_item_use[0].cod_chave_erp + " - " + obj.tt_item_det_use[0].tt_item_use[0].des_item_erp + (obj.tt_item_det_use[0].tt_item_use[0].cod_refer ? " (" + obj.tt_item_det_use[0].tt_item_use[0].cod_refer + ")" : '') + (obj.tt_item_det_use[0].tt_item_use[0].log_expedic ? " (" + $rootScope.i18n('l-expedition') + ") " : " (" + $rootScope.i18n('l-process') + ")"),
                                codeErpPai: obj.tt_item_det_use[0].tt_item_use[0].cod_chave_erp,
                                descPai: obj.tt_item_det_use[0].tt_item_use[0].des_item_erp,
                                controlado: (obj.tt_item_det_use[0].tt_item_use[0].idi_control_kanban === 1 ? $rootScope.i18n('l-yes') : $rootScope.i18n('l-no')),
                                qtdPai: obj.qtd_pai,
                                qtdFilho: obj.qtd_filho
                            }
                            
                            _self.itensPai.push(obj2);
                        });

                        angular.copy(_self.itensPai,_self.itensPaiFuture);
                    });
                }
            }

            _self.init();
        }

        index.register.controller('ekanban.mapping.FlowView', flowViewController);

    }
);

/* global TOTVSEvent, angular*/
define(['index'], function(index) {
    editordercontroller.$inject = [
        '$scope',
        '$filter',
        '$state',
        '$stateParams',
		'$window',
        '$rootScope',
        '$timeout',
        'dts-utils.message.Service',
        'dts-utils.Resize.Service',
        'totvs.app-main-view.Service',
        'customization.generic.Factory',
        'mpd.fchdis0051.Factory'];
    function editordercontroller(
        $scope,
        $filter,
        $state,
        $stateParams,
		$window,
        $rootScope,
        $timeout,
        messageUtils,
        resizeService,
        appViewService,
        customService,
        fchdis0051) {

        var editController = this;
        var i18n = $filter('i18n');

        editController.orderId           = $stateParams.orderId;
        editController.idiModel          = $stateParams.idiModel;
        editController.nrPedcli          = $stateParams.nrPedcli;
        editController.codEmit           = $stateParams.codEmit;
        editController.loadindfinan      = true;
        editController.loadcodportador   = true;
        editController.ttOrderItemSearch = [];

        // se tem o codEmit na URL é um pedido novo
        editController.newOrder = !!$stateParams.codEmit;

        editController.enabledFields = {};


		editController.expandGroups = i18n('Expandir grupos de informações');
		editController.resumeGroups = i18n('Reduzir grupos de informações');

		editController.allGroupsExpanded = true;

		editController.listGroups = [
			{item:{codeGroup: 1,expanded: true, avalaible: true}},
			{item:{codeGroup: 2,expanded: true, avalaible: true}},
			{item:{codeGroup: 3,expanded: true, avalaible: true}},
			{item:{codeGroup: 4,expanded: true, avalaible: true}},
			{item:{codeGroup: 5,expanded: true, avalaible: true}},
			{item:{codeGroup: 6,expanded: true, avalaible: true}},
			{item:{codeGroup: 7,expanded: true, avalaible: true}},
			{item:{codeGroup: 7,expanded: true, avalaible: true}}];


		$scope.$on("salesorder.pd4000.changeparameters", function (event,data) {
			editController.orderParameters = $scope.orderController.orderParameters;
		});

		$scope.$on("salesorder.pd4000.selectview", function (event,data) {
			if (data == 'pd4000c') {
                editController.setFocus();
            }
		});

        $scope.$on("salesorder.pd4000.loadorder", function (event,data) {
            if (data != "pd4000c") {
                // busca os dados do controller principal
                editController.setHeader(
                    $scope.orderController.order,
                    $scope.orderController.orderVendor
                );

                editController.orderParameters = $scope.orderController.orderParameters

                if (editController.orderParameters.isGrainsActive) {
                    editController.tipoPreco = [
                        {tpPreco: 1, descTpPreco: i18n('Informado')},
                        {tpPreco: 2, descTpPreco: i18n('Dia da Implantação')},
                        {tpPreco: 3, descTpPreco: i18n('Dia do Faturamento')},
                        {tpPreco: 4, descTpPreco: i18n('Preço Flutuante')}
                    ];					
				}

                if ($scope.orderController.pd4000['aba-cabecalho'].fieldEnabled == false)
                    editController.orderDisabled = true;

                if($scope.orderController.disabledOrder > 0)
                    editController.orderDisabled = true;

                editController.setEnabled($scope.orderController.ttVisibleFields);
                editController.isExportOrder = $scope.orderController.enableExportTab;
            }
        })

        editController.setFocus = function() {
            $timeout(function() {
                angular.element('form#pd4000c :input:enabled:not(:button)').first().focus();
            },100);            
        }

        editController.setIndFinan = function(){
            editController.order['nr-ind-finan'] = ''
        }        

        editController.setHeader = function (order, vendor) {
            editController.order = order;
            
            editController.orderVendor = vendor;
            editController.portador = editController.order['cod-portador'];
            editController.indfinan = editController.order['nr-ind-finan'];
            editController.locentr  = editController.order['cod-entrega'];
            editController.oldorder = angular.copy(editController.order);

            if (editController.order['cod-sit-ped'] == 5 || editController.order['cod-sit-ped'] == 6) {
                editController.orderDisabled = true;
            } else {
                editController.orderDisabled = false;
            }
        }

        editController.closeModelView = function (customerId) {
            var url = "/dts/mpd/pd4000/model";
            if (customerId)
                url = url + "/" + customerId
			var views = appViewService.openViews;
			var i, len = views.length, view;

			for (i = 0; i < len; i += 1) {
				if (views[i].url === url) {
					view = views[i];
					break;
				}
			}

            if (!view) {
                for (i = 0; i < len; i += 1) {
                    if (views[i].url.substr(0,19) === "/dts/mpd/pd4000/new") {
                        view = views[i];
                        break;
                    }
                }
            }

			if (view)
				appViewService.removeView(view);

        };

        editController.getHeader = function() {

            if (editController.idiModel == undefined) {
                fchdis0051.getOrderHeader({nrPedido: editController.orderId}, function(data) {
                    customService.callCustomEvent("getOrderHeader", {
                        controller:editController,
						result: data
                    });
                    
                    editController.setHeader(data.ttOrder[0], data.ttOrderVendor[0]);
					editController.groupsHearderWithoutTab();
                });
            } else {
                editController.closeModelView(editController.codEmit);
                var params = {
                    idiModel: editController.idiModel,
                    nrPedido: editController.orderId,
                    nrPedcli: editController.nrPedcli
                };
                if (editController.codEmit) {
                    params.codEmit = editController.codEmit;
                }
                fchdis0051.getNewOrder(params, $scope.newController.orderParameters,
                function(result) {
                    customService.callCustomEvent("getNewOrder", {
                        controller:editController,
                        result: result 
                    });

                    
                    editController.order = result.ttOrder[0];
                    
                    editController.ttOrderItemSearch = result.ttOrderItemSearch;
                    editController.portador = editController.order['cod-portador'];
                    editController.indfinan = editController.order['nr-ind-finan'];
                    editController.locentr  = editController.order['cod-entrega'];
                    editController.setEnabled(result.ttVisibleFields);
                    editController.oldorder = angular.copy(editController.order);
                    editController.orderDisabled = false;

                    if ($scope.newController) { // atualiza o controller pai se houver
                        $scope.newController.order = editController.order;
                    }
                    
                    if ($scope.newController.orderParameters.isGrainsActive) {
                        editController.tipoPreco = [
                            {tpPreco: 1, descTpPreco: i18n('Informado')},
                            {tpPreco: 2, descTpPreco: i18n('Dia da Implantação')},
                            {tpPreco: 3, descTpPreco: i18n('Dia do Faturamento')},
                            {tpPreco: 4, descTpPreco: i18n('Preço Flutuante')}
                        ];					
                    }
                    
					editController.groupsHearderWithoutTab();
                });                

                fchdis0051.getParametersAux({}, function (data) {
                    angular.forEach(data, function(value, key) {
                       if(value["cod-param"] === "funcao-vipal-dt-ent-orig") {
                            editController.funcaoVipalDtEntOrig = value["val-param"];
                       }                          
                    });            
                }
                );
            }
        };

        editController.save = function() {
            messageUtils.question( {
                title: 'Salvar Cabeçalho',
                text: $rootScope.i18n('Confirma salvar o cabeçalho do pedido?'),
                cancelLabel: 'Não',
                confirmLabel: 'Sim',
                callback: function(isPositiveResult) {
                    if (isPositiveResult) {
                        editController.saveOrder();
                    }
                }
            });            
        }

        editController.saveOrder = function() {
			if(editController.order['nome-abrev-tri'] == undefined){
				editController.order['nome-abrev-tri'] = "";
			};

			if(editController.order['nome-tr-red'] == undefined){
				editController.order['nome-tr-red'] = "";
            };
            
            if(editController.order['nome-transp'] == undefined){
				editController.order['nome-transp'] = "";
            };
            
            if (editController.portador) {
                if (editController.portador['cod-portador'] != undefined && editController.portador['cod-portador'] != editController.order['cod-portador']) {
                    editController.order['cod-portador'] = editController.portador['cod-portador']; 
                }
            } else {
                editController.order['cod-portador'] = "";
            }
                       
            fchdis0051.saveOrderHeader(
                {
                    nrPedido: editController.orderId,
                    idiModel: editController.idiModel
                }, {
                    ttOrder: editController.order,
                    ttOrderVendor: editController.orderVendor,
                    ttOrderParameters: editController.orderParameters,
                    ttOrderItemSearch: editController.ttOrderItemSearch
                }, function(result) {

                customService.callCustomEvent("saveOrderHeader", {
                    controller:editController,
                    result: result 
                });

                if (!editController.codEmit) {
                    if (!result.$hasError) {
                        $scope.$emit("salesorder.pd4000.loadorder","pd4000c");
                    }
                } else {
                    if (!result.$hasError) {
                        $state.go(
                            "dts/mpd/pd4000.edit",
                            {orderId: editController.orderId,
                             idiModel: undefined,
                             nrPedcli: undefined,
                             codEmit: undefined
                            },
                            {location: "replace"});
                    }
                }
            });
        };

        this.cancel = function() {
            editController.getHeader();
        }

        this.getEnabledField = function (fieldName) {
            if (editController.orderDisabled) return true;
            if (editController.enabledFields.hasOwnProperty(fieldName))
                return !editController.enabledFields[fieldName];
            return false;
        }

        this.setEnabled = function (ttVisibleFields) {
            for (var i = 0; i < ttVisibleFields.length; i++) {
                editController.enabledFields[ttVisibleFields[i].fieldName] = ttVisibleFields[i].fieldEnabled;
            }
        }

        this.applyLeaveOrder = function(field) {

            // bug no IE, atribui branco no valor do campo.
            if(field == 'cod-entrega'){
                if(editController.order['cod-entrega'] == undefined){                    
                    editController.order['cod-entrega'] = editController.locentr;
                }                
            }

            // bug do canclean, não consegue limpar o campo para em branco.
            if (field == "nr-tabpre" && editController.order[field] == null)
                editController.order[field] = '';

            // bug do zoom
            if (editController.order[field] == undefined) return;

            if (editController.order[field] == editController.oldorder[field]) return;

            if (field == "dt-entrega" && editController.newOrder && editController.funcaoVipalDtEntOrig !== "yes") {
                editController.order['dt-entorig'] = editController.order['dt-entrega'];
                editController.oldorder['dt-entrega'] = editController.order['dt-entrega']
                return
            }

            var action = "Update";
            if (editController.newOrder)
                action = "Add";

            fchdis0051.leaveOrderHeader(
                {
                    nrPedido: editController.orderId,
                    fieldname: field,
                    action: action
                }, {
                    ttOrder: editController.order,
                    ttOrderParameters: editController.orderParameters != undefined ? editController.orderParameters : $scope.newController.orderParameters,
                },
                function(result) {
                    customService.callCustomEvent("leaveOrderHeader", {
                        controller:editController,
                        result: result 
                    });

                    editController.order = result.ttOrder[0];
                    if (editController.portador != undefined && editController.portador.hasOwnProperty("cod-portador")) {
                        editController.portador["modalidade"] = editController.order['modalidade'];
                        editController.portador = editController.portador['cod-portador']                        
                    }
                    else {
                        editController.portador = editController.order['cod-portador'];
                    }
                    editController.order['modalidade'] = editController.order['modalidade'];
                    editController.oldorder = angular.copy(editController.order);
                                                
                    if(field == 'nat-operacao'){
                        for (var i = 0; i < result.ttVisibleFields.length; i++) {
                            if(result.ttVisibleFields[i].fieldName == 'num-pedido-origem' && result.ttVisibleFields[i].fieldEnabled == false){
                                editController.order['num-pedido-origem'] = '';
                            }                
                        }
                    }
                        
                    editController.setEnabled(result.ttVisibleFields);
                }
            );
        };
        
        this.setModalidade = function(){                            
            if(editController.loadcodportador){
                if(editController.portador != undefined){                       
                    editController.order['cod-portador'] = editController.portador['cod-portador'];
                    editController.order['modalidade'] = editController.portador['modalidade'];
                }else{                                    
                    editController.portador = editController.order['cod-portador'];                
                    editController.loadcodportador = false;
                }                
            }                        
        };
                     
        this.getIndFinan = function(){                        
            if(editController.loadindfinan){
                if(editController.order['nr-ind-finan'] == undefined){
                    editController.order['nr-ind-finan'] = editController.indfinan;
                }                
                editController.loadindfinan = false;
            }
        };
		this.openCloseGroups = function(status){

			editController.allGroupsExpanded = status;

			angular.forEach(editController.listGroups, function(value, key) {
				value.item.expanded = status;
			});

			editController.groupsHearderWithoutTab();
		}

		this.groupsHearderWithoutTab = function(){
			if(editController.allGroupsExpanded){
				var panelsGroups = angular.element('.panel-heading').children().children();
				angular.forEach(panelsGroups, function( ela ){
					var a = angular.element(ela);
					a.attr('tabindex', '-1');
				});
			}else{
				var panelsGroups = angular.element('.panel-heading').children().children();
				angular.forEach(panelsGroups, function( ela ){
					var a = angular.element(ela);
					a.attr('tabindex', '0');
				});
			}
			resizeService.resize('.pd4000cabecalho');
		}

        this.destinosMercadoria = [
            {codDesMerc: 1, descDesMerc: i18n('Comércio/Indústria')},
            {codDesMerc: 2, descDesMerc: i18n('Consumo Próprio/Ativo')}
        ];

        this.especiePedido = [
            {espPed: 1, descEspPed: i18n('Pedido Simples')},
            {espPed: 2, descEspPed: i18n('Programação de Entrega')},
            {espPed: 3, descEspPed: i18n('Contrato de Fornecimento')}
        ];

        this.tipoPreco = [
            {tpPreco: 1, descTpPreco: i18n('Informado')},
            {tpPreco: 2, descTpPreco: i18n('Dia da Implantação')},
            {tpPreco: 3, descTpPreco: i18n('Dia do Faturamento')}
        ];

        this.modalidades = [
            {modalidade: 1, descModalidade: i18n('Cb Simples')},
            {modalidade: 2, descModalidade: i18n('Desconto')},
            {modalidade: 3, descModalidade: i18n('Caução')},
            {modalidade: 4, descModalidade: i18n('Judicial')},
            {modalidade: 5, descModalidade: i18n('Repres')},
            {modalidade: 6, descModalidade: i18n('Carteira')},
            {modalidade: 7, descModalidade: i18n('Vendor')},
            {modalidade: 8, descModalidade: i18n('Cheque')},
            {modalidade: 9, descModalidade: i18n('Nota Promissória')},
        ];

        this.tipoCobrancaDespesa = [
            {tipo: 1, descricao: i18n('Primeira Duplicata')},
            {tipo: 2, descricao: i18n('Rateio entre todas')},
            {tipo: 3, descricao: i18n('Rateio entre todas e IPI na 1ª')},
            {tipo: 4, descricao: i18n('Apenas IPI na 1ª e rateio entre as demais')}
        ];

        if (editController.idiModel != undefined) {
            editController.getHeader();
        }

        resizeService.resize('.pd4000cabecalho');

    }

    index.register.controller('salesorder.pd4000.EditController', editordercontroller);

});


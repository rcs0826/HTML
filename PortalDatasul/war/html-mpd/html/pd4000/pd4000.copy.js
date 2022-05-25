/* global angular*/
define(['index'], function(index) {

    copyController.$inject = [
        '$rootScope',
        '$filter',
        '$stateParams',
        '$modal',
        'mpd.fchdis0051.Factory',
        'totvs.app-main-view.Service',
        'customization.generic.Factory',
        'TOTVSEvent'];
    function copyController (
        $rootScope,
        $filter,
        $stateParams,
        $modal,
        fchdis0051,
        appViewService,
        customService,
        TOTVSEvent) {
        
        var copyController = this;

        copyController.copyParams = {
            'i-situacao'       : '1',
            'i-natur-oper'     : '1',
            'l-exp-dt-entrega' : false,
            'i-qtde-item'      : '1',
            'i-origem'         : '1'
        } 

        var i18n = $filter('i18n');
        var currency = $filter('currency');
        var number = $filter('number');

        copyController.orderId = $stateParams.orderId;


        copyController.selectEmitente = function (copy) {
            copy['cod-emitente'] = copy['emitente']['cod-emitente'];
            copy['nome-abrev']   = copy['emitente']['nome-abrev'];

            fchdis0051.changeemitentecopyorder (
                {
                    nrPedido: copyController.orderId
                }, copy,
                function (result) {
                    customService.callCustomEvent("changeEmitenteCopyOrder", {
                        controller:copyController,
                        result: result 
                    });

                    copy['nome-transp'] = result['tt-ped-copia'][0]['nome-transp'];
                    copy['cod-entrega'] = result['tt-ped-copia'][0]['cod-entrega'];
                }
            )

        }
        
        copyController.orderCopies = [];
        
        copyController.newCopy = function () {
            
            copyController.copyResult = [];

            fchdis0051.newcopyorder({nrPedido: copyController.orderId} , function (result) {
                customService.callCustomEvent("newCopyOrder", {
                    controller:copyController,
                    result: result 
                });

                copyController.orderCopies.push(result['tt-ped-copia'][0]);
            });
            
        }

        copyController.removeCopy = function ($index) {
            copyController.orderCopies.splice($index,1);
        }

        copyController.parameters = function () {

			var modalInstance = $modal.open({
			  templateUrl: '/dts/mpd/html/pd4000/pd4000.copy.params.html',
			  controller: 'salesorder.pd4000CopyParams.Controller as copyParamscontroller',
			  size: 'lg',
			  resolve: {
				copyParameters: function() {
                    return copyController.copyParams;
                }
			  }
			});

			modalInstance.result.then(function (data) {
			    copyController.copyParams = data;
			});           

        }

        copyController.updateItems = function () {
			var modalInstance = $modal.open({
			  templateUrl: '/dts/mpd/html/pd4000/pd4000.copy.items.html',
			  controller: 'salesorder.pd4000CopyItems.Controller as copyItemsController',
			  size: 'lg',
			  resolve: {
				copyItems: function() {
                    return copyController.copyItems;
                }
			  }
			});

			modalInstance.result.then(function (data) {
			    copyController.copyItems = data;
			});           
        }

        copyController.executeCopy = function () {

            fchdis0051.copyorder(
                {
                    nrPedido: copyController.orderId
                }, {
                    'tt-copy-params':copyController.copyParams,
                    'tt-ped-copia':copyController.orderCopies, 
                    'tt-item-copia':copyController.copyItems
                } , 
                function (result) {
                    customService.callCustomEvent("copyOrder", {
                        controller:copyController,
                        result: result 
                    });

                    copyController.copyResult = result['tt-pedidos-criados'];

                    if (result['tt-pedidos-criados'].length) {
                        var lista = "";
                        for(var i = 0; i < result['tt-pedidos-criados'].length; i++) {
                            if (i > 0) lista = lista + ", ";
                            lista = lista + result['tt-pedidos-criados'][i].nrPedido;
                        }

                        $rootScope.$broadcast(TOTVSEvent.showNotification, {                                        
                            type: 'info',                    
                            title: i18n('Cópia de Pedidos', [], 'dts/mpd/'),
                            detail: i18n('Os pedidos foram copiados:', [], 'dts/mpd/') + ": " + lista                    
                        });
                        copyController.orderCopies = [];
                    }
                }
            );

        }

        appViewService.startView(i18n('Cópia de Pedido',[],'dts/mpd') + " " + copyController.orderId,'salesorder.pd4000.CopyController', copyController);

        fchdis0051.cancopyorder ({nrPedido: copyController.orderId} , function (result) {
            customService.callCustomEvent("checkCanCopyOrder", {
                controller:copyController,
                result: result 
            });
            
            if (!result.canCopy) {
                var views = appViewService.openViews;

                var i, len = views.length, view;

                for (i = 0; i < len; i += 1) {
                    if (views[i].url === "/dts/mpd/pd4000/" + copyController.orderId + "/copy") {
                        view = views[i];
                        break;
                    }
                }

                if (view)
                    appViewService.removeView(view);
                
            } else {
                fchdis0051.itemcopyorder({nrPedido: copyController.orderId}, copyController.copyParams , function (result) {
                    customService.callCustomEvent("itemCopyOrder", {
                        controller:copyController,
                        result: result 
                    });

                    copyController.copyItems = result['tt-item-copia'];
                });
            }
        });

        
        
    }
    index.register.controller('salesorder.pd4000.CopyController', copyController);

    copyParamscontroller.$inject = ['$modalInstance','copyParameters'];
    function copyParamscontroller ($modalInstance,copyParameters) {
        var copyParamscontroller = this;

        copyParamscontroller.copyParameters = copyParameters;

        copyParamscontroller.confirm = function() {
            $modalInstance.close(copyParamscontroller.copyParameters);
        }

        copyParamscontroller.close = function() {
            $modalInstance.dismiss('cancel');
        }

    }
    index.register.controller('salesorder.pd4000CopyParams.Controller', copyParamscontroller);
    
    copyItemsController.$inject = ['$modalInstance','copyItems'];
    function copyItemsController ($modalInstance,copyItems) {
        var copyItemsController = this;

        for(var i = 0; i < copyItems.length; i++) {
            copyItems[i].$selected = copyItems[i].selecionado;
        }

        copyItemsController.copyItems = copyItems;

        copyItemsController.confirm = function() {
            for(var i = 0; i < copyItemsController.copyItems.length; i++) {
                copyItemsController.copyItems[i].selecionado = copyItemsController.copyItems[i].$selected;
            }
            $modalInstance.close(copyItemsController.copyItems);
        }

        copyItemsController.close = function() {
            $modalInstance.dismiss('cancel');
        }

    }
    index.register.controller('salesorder.pd4000CopyItems.Controller', copyItemsController);

});

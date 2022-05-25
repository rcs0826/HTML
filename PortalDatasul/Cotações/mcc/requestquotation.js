define(['index', 
        'totvs-html-framework',
        '/dts/dts-utils/js/zoom/zoom.js',
        '/dts/dts-utils/js/dbo/dbo.js',       
        '/dts/mcc/js/mcc-utils.js',
        '/dts/custom/mcc/html/requestquotation/modal/requestquotation.vendors.order.crtl.esp.js'	  		
    ],
function(index, custom) {
    mccCustomService.$inject = ['customization.generic.Factory', '$rootScope','TOTVSEvent', '$location', '$state', '$modal'];  
    function mccCustomService(customService, $rootScope, TOTVSEvent, $location, $state, $modal){  
		var paramsAux = "";
        service = {   
		
			customQuotationProcess_edit:function(params, element){
				paramsAux = params;
				
			},
			customQuotationProcess_listOrderLine:function(params, element){
				paramsAux.modal = function (ordem) {  
					var instance = $modal.open({
						templateUrl: '/dts/custom/mcc/html/requestquotation/modal/requestquotation.vendors.order.esp.html',
						controller: 'mcc.modalCtrl as controller',
						backdrop: 'static',
						keyboard: false,
						size: 'lg',
						resolve: { 
							parameters: function () { return ordem; } 
						}
					});
					return instance.result;
				}
				
				
				
				paramsAux.controller.onOrderVendors = function(purchaseOrderNumber){
					parameters = {purchaseOrderNumber : purchaseOrderNumber, //número da ordem
							      suggestVendorRelated : paramsAux.controller.suggestVendorRelated, // paramtetro sugere item x fornec
							      cddSolicit : paramsAux.controller.model.ttQuotationProcess['cdd-solicit']} //número do processo

					paramsAux.modal(parameters).then(function(result) {});
				};	
			},
            rfimcc1000:function(params, element){
                console.info("rfimcc1000 params",params);
                console.info("rfimcc1000 element",element);
            },
        }
        angular.extend(service, customService);
        return service;
    }  
    index.register.factory('custom.dts.mcc.requestquotation', mccCustomService);       
});
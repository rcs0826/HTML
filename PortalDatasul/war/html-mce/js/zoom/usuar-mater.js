define(['index', '/dts/mce/js/mce-utils.js', '/dts/dts-utils/js/zoom/zoom.js', '/dts/dts-utils/js/dts-utils.js'], function (index) {
    /*####################################################################################################
     # ZOOM DA TABELA: usuar-mater
     # SERVICO.......: serviceZoomLocalizacao
     # REGISTRO......: mce.zoom.localizacao
 ####################################################################################################*/
    serviceZoomUsuarMateriais.$inject = ['$timeout', '$totvsresource', 'mce.utils.Service', 'dts-utils.zoom', '$rootScope', 'dts-utils.zoom', 'dts-utils.utils.Service'];

    function serviceZoomUsuarMateriais($timeout, $totvsresource, mceUtils, zoomService, $rootScope, zoomService, dtsUtils) {

        var service = {};

        angular.extend(service, zoomService); // Extende o serviço de zoom padrão

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin627zm/:method//:id');

        service.zoomName = $rootScope.i18n('l-material-user', undefined, 'dts/mce');       

        service.setConfiguration('mce.uauar-mater.zoom');
        
        service.matches = ['cod-usuario','nome-usuar'];  

        service.propertyFields = [

            {
                label: $rootScope.i18n('l-user', undefined, 'dts/mce'),
                property: 'cod-usuario',
                type: 'stringextend',
                default: true,
                maxlength: 20
            },
            {
                label: $rootScope.i18n('l-name', undefined, 'dts/mce'),
                property: 'nome-usuar',
                type: 'stringextend',
                maxlength: 30
            },
            {
                label: $rootScope.i18n('l-requisitor', undefined, 'dts/mce'),
                property: 'usuar-solic',
                propertyList: [{
                        id: true,
                        name: $rootScope.i18n('l-yes', undefined, 'dts/mce'),
                        value: true
                    },
                    {
                        id: false,
                        name: $rootScope.i18n('l-no', undefined, 'dts/mce'),
                        value: false
                    }]
            },
            {
                label: $rootScope.i18n('l-requester', undefined, 'dts/mce'),
                property: 'usuar-requis',
                propertyList: [{
                        id: true,
                        name: $rootScope.i18n('l-yes', undefined, 'dts/mce'),
                        value: true
                    },
                    {
                        id: false,
                        name: $rootScope.i18n('l-no', undefined, 'dts/mce'),
                        value: false
                    }]
            },            
            {
                label: $rootScope.i18n('l-maintenance-requester', undefined, 'dts/mce'),
                property: 'usuar-requis-manut',
                propertyList: [{
                        id: true,
                        name: $rootScope.i18n('l-yes', undefined, 'dts/mce'),
                        value: true
                    },
                    {
                        id: false,
                        name: $rootScope.i18n('l-no', undefined, 'dts/mce'),
                        value: false
                    }]
            }, 
            
            {
                label: $rootScope.i18n('l-buyer', undefined, 'dts/mce'),
                property: 'usuar-comprador',
                propertyList: [{
                        id: true,
                        name: $rootScope.i18n('l-yes', undefined, 'dts/mce'),
                        value: true
                    },
                    {
                        id: false,
                        name: $rootScope.i18n('l-no', undefined, 'dts/mce'),
                        value: false
                    }]
            },
            {
                label: $rootScope.i18n('l-approver', undefined, 'dts/mce'),
                property: 'usuar-aprovador',
                propertyList: [{
                        id: true,
                        name: $rootScope.i18n('l-yes', undefined, 'dts/mce'),
                        value: true
                    },
                    {
                        id: false,
                        name: $rootScope.i18n('l-no', undefined, 'dts/mce'),
                        value: false
                    }]
            }                
         ];


        service.columnDefs = [
            {
                headerName: $rootScope.i18n('l-user'),
                field: 'cod-usuario',
                width: 141,
                minWidth: 141
            },
            {
                headerName: $rootScope.i18n('l-name'),
                field: 'nome-usuar',
                width: 253,
                minWidth: 253
            },
            {
                headerName: $rootScope.i18n('l-requisitor'),
                field: 'usuar-solic', 
                width: 116,
                minWidth: 116,
                valueGetter: 'data["_"]["logUsuarSolic"]'
            }, 
            {
                headerName: $rootScope.i18n('l-requester'),
                field: 'usuar-requis',
                width: 116,
                minWidth: 116,
                valueGetter: 'data["_"]["logUsuarRequis"]'
            },
            {
                headerName: $rootScope.i18n('l-maintenance-requester'),
                field: 'usuar-requis-manut',
                width: 116,
                minWidth: 116,
                valueGetter: 'data["_"]["logUsuarRequisManut"]'
            },      
            {
                headerName: $rootScope.i18n('l-buyer'),
                field: 'usuar-comprador',
                width: 116,
                minWidth: 116,
                valueGetter: 'data["_"]["logUsuarCompr"]'
            },
            {
                headerName: $rootScope.i18n('l-approver'),
                field: 'usuar-aprovador',
                width: 116,
                minWidth: 116,
                valueGetter: 'data["_"]["logUsuarAprov"]'
            },                       
            {
                headerName: $rootScope.i18n('l-purchase-solicit-limit'),
                field: 'lim-solic',
                width: 157,
                minWidth: 157,
                valueGetter: function(param){ return mceUtils.formatDecimal(param.data['lim-solic'],2)}
            },
            {
                headerName: $rootScope.i18n('l-maintenance-requester-limit'),
                field: 'lim-requis-manut',
                width: 150,
                minWidth: 150,
                valueGetter: function(param){ return mceUtils.formatDecimal(param.data['lim-requis-manut'],2)}
            },
            {
                headerName: $rootScope.i18n('l-request-limit'),
                field: 'lim-requis',
                width: 135,
                minWidth: 135,
                valueGetter: function(param){ return mceUtils.formatDecimal(param.data['lim-requis'],2)}
            },
            {
                headerName: $rootScope.i18n('l-currency'),
                field: 'mo-codigo',
                width: 116,
                minWidth: 116,
                valueGetter: 'data["_"]["descMoeda"]'
            }
        ];


        service.getObjectFromValue = function (value, init) {

            if (!value) return undefined;

            return this.resource.TOTVSGet({
                id: value
            }, undefined, {
                noErrorMessage: true
            }, true);
        };

        service.comparator = function (item1, item2) {
            return ((item1['cod-usuar'] === item2['cod-usuar']));
        };


        /* Select - usuarMaterialList: Array de objetos da diretiva select
                    serviceZoomUsuarMateriais: Função padrao para retorno dos objetos no Select com base do valor
                                               informado em tela */
        service.usuarMaterialList = [];
        service.getUsuarMaterial = function (value, init) {
            
            var _service = this;
            var parameters = {};
            var queryproperties = {};

           
            queryproperties.where = "cod-usuario BEGINS '" + value + "' OR nome-usuar MATCHES '*" + value +"*'";
            queryproperties.fields = "cod-usuario,nome-usuar";
          
            return this.resource.TOTVSQuery(queryproperties, function (result) {
                service.usuarMaterialList = result;
            }, {
                noErrorMessage: true,
                noCount: true
            }, true);
        };

        return service;

    }

    index.register.service('mce.material-usuar-1.zoom', serviceZoomUsuarMateriais);
 	index.register.service('mce.material-usuar-2.zoom', serviceZoomUsuarMateriais);	
 	index.register.service('mce.material-usuar-3.zoom', serviceZoomUsuarMateriais);		
});
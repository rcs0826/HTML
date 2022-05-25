/*jslint indent: 4, maxerr: 50 */
/*global define, angular */
define(['index', '/dts/dts-utils/js/zoom/zoom.js', '/dts/dts-utils/js/dts-utils.js'], function(index) {

    'use strict';

    /*####################################################################################################
     # Database: emsfin
     # Table...: regra_extrat_bcio
     # Service.: serviceRuleBankStmnt
     # Register: cmg.regra-extrat-bcio.zoom
     ####################################################################################################*/
    function serviceRuleBankStmnt($timeout, $totvsresource, $rootScope, zoomService, dtsUtils) {

        var service = {};

        angular.extend(service, zoomService);

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/prgfin/cmg/cmg910wl/:method//:user//:id');
        service.zoomName = $rootScope.i18n('l-rule-bank-statement', undefined, 'dts/cmg');
        service.setConfiguration('cmg.regra-extrat-bcio.zoom');
        service.propertyFields = [
        {
            label: $rootScope.i18n('l-id', undefined, 'dts/cmg'),
            property: 'num_id_regra_extrat',
            type: 'integer'
        }, {
            label: $rootScope.i18n('l-description', undefined, 'dts/cmg'),
            property: 'des_regra_extrat',
            type: 'stringextend',
            'default': true
        }];
        service.columnDefs = [
        {
            headerName: $rootScope.i18n('l-id', undefined, 'dts/cmg'),
            field: 'num_id_regra_extrat',
            width: 100,
            minWidth: 100
        }, {
            headerName: $rootScope.i18n('l-description', undefined, 'dts/cmg'),
            field: 'des_regra_extrat',
            width: 100,
            minWidth: 100
        }
        ];
        service.comparator = function(item1, item2) {
            return ( item1.num_id_regra_extrat === item2.num_id_regra_extrat) ;
        }
        ;
        service.getObjectFromValue = function(value, init) {

            if (angular.isObject(value)) {
                value = value.num_id_regra_extrat;
            }

            if (value === undefined) {
                value = "";
            }

            return this.resource.TOTVSGet({
                user: $rootScope.currentuser.login,
                id: value
            }, {}, function(result) {}, {});

        }
        ;

        /* Select - selectResultList...: Array de objetos da diretiva select
                    getSelectResultList: Função padrao para retorno dos objetos no Select com base do valor
                                         informado em tela */
        service.selectResultList = [];
        service.getSelectResultList = function(value, init, callback) {

            var thisSelect = this
              , parameters = {}
              , queryproperties = {};

            parameters.init = init;
            parameters.disclaimers = [];
            parameters.disclaimers.push({
                property: "cod_usuario",
                type: "stringextend",
                extend: 1,
                value: $rootScope.currentuser.login
            });
            parameters.disclaimers.push({
                property: "num_id_regra_extrat",
                type: "integer",
                value: value
            });

            queryproperties = dtsUtils.mountQueryProperties({
                parameters: parameters,
                columnDefs: this.columnDefs,
                propertyFields: this.propertyFields
            });

            return this.resource.TOTVSQuery(queryproperties, function(result) {
                thisSelect.selectResultList = result;
                if (callback && angular.isFunction(callback)) {
                    callback(result);
                }
            }, {
                noErrorMessage: true
            }, true);
        }
        ;

        return service;

    }

    serviceRuleBankStmnt.$inject = ['$timeout', '$totvsresource', '$rootScope', 'dts-utils.zoom', 'dts-utils.utils.Service'];

    index.register.service('cmg.regra-extrat-bcio.zoom', serviceRuleBankStmnt);

});

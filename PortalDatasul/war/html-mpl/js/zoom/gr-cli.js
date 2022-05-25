define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {

    /*####################################################################################################
    # Database: mgind
    # Table...: gr-cli
    # Service.: serviceGrupoClienteZoom
    # Register: mpd.gr-cli.zoom
    ####################################################################################################*/

    serviceGrupoClienteZoom.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
    function serviceGrupoClienteZoom($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils) {

        var scopeService = this;

        var service = {};
        angular.extend(service, zoomService);

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/adbo/boad129a/:method/:id', {}, {});
        service.zoomName = "l-customer-group";
        service.configuration = false;

        service.propertyFields = [
            {label: 'l-customer-group', property: 'cod-gr-cli', type:'integerrange', default: true},
            {label: 'l-description', property: 'descricao', type:'string'},
            {label: 'l-category', property: 'categoria', type:'string'},
            {label: 'l-permission', property: 'permissao', type:'string'},
            {label: 'l-pay-cond', property: 'cod-cond-pag', type:'integerrange'},
            {label: 'l-prod-line', property: 'linha-produt', type:'string'},
            {label: 'l-delay-days', property: 'nr-dias-atraso', type:'integerrange'},
            {label: 'l-nature', property: 'natureza', type:'integerrange'},
            {label: 'l-bearer', property: 'portador', type:'integerrange'},
            {label: 'l-default-carrier', property: 'cod-transp', type:'integerrange'},
            {label: 'l-price-table', property: 'nr-tabpre', type:'string'},
            {label: 'l-tp-revenue-expense', property: 'tp-rec-desp', type:'integerrange'},
            {label: 'l-pay-cond', property: 'cod-cond-pag', type:'integerrange'}];

        service.columnDefs = [
            {headerName: $rootScope.i18n('l-customer-group', undefined, 'dts/mpl'), field: 'cod-gr-cli'},
            {headerName: $rootScope.i18n('l-description', undefined, 'dts/mpl'), field: 'descricao'},
            {headerName: $rootScope.i18n('l-category', undefined, 'dts/mpl'), field: 'categoria'},
            {headerName: $rootScope.i18n('l-permission', undefined, 'dts/mpl'), field: 'permissao'},
            {headerName: $rootScope.i18n('l-pay-cond', undefined, 'dts/mpl'), field: 'cod-cond-pag'},
            {headerName: $rootScope.i18n('l-prod-line', undefined, 'dts/mpl'), field: 'linha-produt'},
            {headerName: $rootScope.i18n('l-delay-days', undefined, 'dts/mpl'), field: 'nr-dias-atraso'},
            {headerName: $rootScope.i18n('l-nature', undefined, 'dts/mpl'), field: 'natureza'},
            {headerName: $rootScope.i18n('l-bearer', undefined, 'dts/mpl'), field: 'portador'},
            {headerName: $rootScope.i18n('l-carrier', undefined, 'dts/mpl'), field: 'cod-transp'},
            {headerName: $rootScope.i18n('l-price-table', undefined, 'dts/mpl'), field: 'nr-tabpre'},
            {headerName: $rootScope.i18n('l-price-type', undefined, 'dts/mpl'), field: 'tp-rec-desp'},
            {headerName: $rootScope.i18n('l-pay-cond', undefined, 'dts/mpl'), field: 'cod-cond-pag'}];

        service.getObjectFromValue =  function (value) {
            return this.resource.TOTVSGet({
                id: value
            }, undefined, {
                noErrorMessage: true
            }, true);
        };

        service.comparator = function(item1, item2) {
            return (item1.id === item2.id);
        };

        service.groupList = [];
        service.getGroup = function (value) {

            var _service = this;
            var parameters = {};
            var queryproperties = {};

            if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
                parameters.disclaimers = [];

            parameters.disclaimers.push({
                property: "cod-gr-cli",
                type: "integer",
                value: value
            });

            queryproperties = dtsUtils.mountQueryProperties({
                parameters: parameters,
                columnDefs: this.columnDefs,
                propertyFields: this.propertyFields
            });

            return this.resource.TOTVSQuery(queryproperties, function (result) {
                service.groupList = result;
            }, {
                noErrorMessage: true,
                noCount: true
            }, true);

        };

        return service;

    }
    index.register.service('mpd.gr-cli.zoom', serviceGrupoClienteZoom);

});

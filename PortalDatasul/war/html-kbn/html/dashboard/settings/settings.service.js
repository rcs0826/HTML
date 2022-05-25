define([
    'index',
    '/dts/kbn/js/directives.js',
    '/dts/kbn/js/factories/kbn-factories.js',
    '/dts/kbn/js/legend.js',
    '/dts/kbn/js/enumkbn.js',
        '/dts/kbn/js/helpers.js'
],
function(index) {
    dashboardSettingsService.$inject = [
        '$rootScope',
        'kbn.data.Factory',
        'kbn.legend',
        '$filter',
        'enumkbn',
        'kbn.helper.Service',
        'TOTVSEvent'
    ];
    function dashboardSettingsService(
        $rootScope,
        dataFactory,
        legendService,
        $filter,
        enumkbn,
        kbnHelper,
        TOTVSEvent
    ) {
        var _self = this;

        var init = function init() {
            _self.settings = dataFactory.getDashboardSettings();
            if (_self.settings.dateRange.isToday) {
                _self.updateDate(_self.settings.dateRange);
                dataFactory.setDashboardSettings(_self.settings);
            }

            if (!_self.settings.bloqFila        || _self.settings.bloqFila == undefined         &&
                !_self.settings.bloqProducao    || _self.settings.bloqProducao == undefined     &&
                !_self.settings.bloqTransporte  || _self.settings.bloqTransporte == undefined   &&
                !_self.settings.ajusteSaldo     || _self.settings.ajusteSaldo == undefined      &&
                !_self.settings.emissaoExtra    || _self.settings.emissaoExtra == undefined) {

                    _self.settings.bloqFila = true;
                    _self.settings.bloqProducao= true;
                    _self.settings.bloqTransporte = true;
                    _self.settings.ajusteSaldo = true;
                    _self.settings.emissaoExtra = true;

                    dataFactory.setDashboardSettings(_self.settings);
            }
            
            _self.messageToShow = {};
        };

        _self.updateDate = function updateDate(date) {
            var end = new Date();
            var start = new Date(end - (date.end - date.start));

            date.end = end.getTime();
            date.start = start.getTime();
        };

        _self.isToday = function isToday(date) {
            var today = new Date();
            if (today.getDate() != date.getDate()) return false;
            if (today.getMonth() != date.getMonth()) return false;
            if (today.getYear() != date.getYear()) return false;
            return true;
        };

        _self.apply = function apply(settings) {
            settings.dateRange.isToday = _self.isToday(new Date(settings.dateRange.end));
            angular.copy(settings, _self.settings);
            $rootScope.$broadcast('dashboardSettingsApplied', _self.settings);
            dataFactory.setDashboardSettings(_self.settings);
        };

        _self.settingsToDisclaimer = function() {
            var disclaimers = [];
            disclaimers.push({
                property: 'establishment',
                value: _self.settings.establishment.cod_estab_erp,
                hide: true,
                title: $rootScope.i18n('l-site', [], 'dts/kbn') + ": " + _self.settings.establishment.cod_estab_erp
            });
            itemType = {
                property: 'itemType',
                value: JSON.parse(_self.settings.itemExpedited),
                title: _self.getItemTypeTitle(_self.settings.itemExpedited)
            };

            if(itemType.value == enumkbn.itemType.both){
                itemType.hide = true;
            }

            disclaimers.push(itemType);

            disclaimers.push({
                property: 'startDate',
                value: _self.settings.dateRange.start,
                title: $rootScope.i18n('l-initial-date', [], 'dts/kbn') + ": " + $filter('date')(_self.settings.dateRange.start, 'shortDate'),
                fixed: true
            });
            disclaimers.push({
                property: 'endDate',
                value: _self.settings.dateRange.end,
                title: $rootScope.i18n('l-final-date', [], 'dts/kbn') + ": " + $filter('date')(_self.settings.dateRange.end, 'shortDate'),
                fixed: true
            });
            if (_self.settings.classifierSelected == undefined) _self.settings.classifierSelected = [];
            disclaimers.push({
                property: "classifier",
                title: $rootScope.i18n('l-classifier') + ': ' + kbnHelper.countClassifiers(_self.settings.classifierSelected) + ' ' + $rootScope.i18n('l-selecteds'),
                value: _self.settings.classifierSelected,
                fixed: true
            });
            return disclaimers;
        };

        _self.getItemTypeTitle = function(itemType) {
            if (itemType == enumkbn.itemType.final) return $rootScope.i18n('l-flow-expedition', [], 'dts/kbn');
            if (itemType == enumkbn.itemType.process) return $rootScope.i18n('l-flow-process', [], 'dts/kbn');
            return $rootScope.i18n('l-both', [], 'dts/kbn');
        };
            
        _self.hasEstab = function(){
            var retorno = _self.settings.establishment && _self.settings.establishment.num_id_estab > 0;
            
            if(!retorno && _self.messageToShow.title == undefined){
                _self.messageToShow.title = $rootScope.i18n('l-parameters-error', [], 'dts/kbn');
                _self.messageToShow.help = $rootScope.i18n("l-select-establishment", [], 'dts/kbn');
                _self.messageToShow.size = 'md';

                $rootScope.$broadcast(TOTVSEvent.showMessage, _self.messageToShow);
            }
            return retorno;
        };

        init();
    }

    index.register.service('kbn.dashboard.settings.service', dashboardSettingsService);
});

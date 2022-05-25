/*global angular */
define(['index'], function (index) {

    mftHelper.$inject = ['$filter'];

    function mftHelper($filter) {
        return {

            addFilter: function (property, value, title, type, hide) {
                var filter = {
                    'property': property,
                    'value': value,
                    'type': type ? type : 'string',
                    'hide': hide === true
                };

                switch (type) {
                    case 'date':
                        filter.title = title + ': ' + $filter('date')(value, 'shortDate');
                        break;
                    case 'boolean':
                        filter.title = title;
                        break;
                    default:
                        filter.title = title + ': ' + value;
                        break;
                }
                return filter;
            },

            parseDisclaimersToFilter: function (disclaimers) {
                disclaimers = disclaimers || [];
                var filters = {};
                disclaimers.forEach(function (disclaimer) {
                    filters[disclaimer.property] = disclaimer.value;
                });
                return filters;
            },

            parseDisclaimersToParameters: function (disclaimers) {
                disclaimers = disclaimers || [];
                var options = {
                    properties: [],
                    values: []
                };
                disclaimers.forEach(function (filter) {
                    if (filter.property) {
                        options.properties.push(filter.property);
                        switch (filter.type) {
                            case 'date':
                                options.values.push($filter('date')(filter.value, 'shortDate'));
                                break;
                            default:
                                options.values.push(filter.value);
                                break;
                        }
                    }
                });
                return options;
            }
        };
    }
    index.register.service('mft.helper', mftHelper);
});
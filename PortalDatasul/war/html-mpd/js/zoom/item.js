define(['index'], function(index) {
    
    // **************************************************************************************
    // *** SERVICE ZOOM
    // **************************************************************************************
    
    /*Zoom de Clientes*/    
    serviceItemZoom.$inject = ['$timeout', '$totvsresource'];

    function serviceItemZoom($timeout, $totvsresource){

	var service = {
            resource: $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin172html/:itemCode'),
            zoomName: 'l-cod-item',
            propertyFields : [
                {label: 'l-cod-item',       property: 'it-codigo', default: true},
                {label: 'l-descricao',      property: 'desc-item'},
                {label: 'l-un',             property: 'un'},
                {label: 'l-ge-codigo',      property: 'ge-codigo'},
                {label: 'l-fm-codigo',      property: 'fm-codigo'},
            ],
            tableHeader    : [
                {label: 'l-cod-item',       property: 'it-codigo'},
                {label: 'l-descricao',      property: 'desc-item'},
                {label: 'l-un',             property: 'un'},
                {label: 'l-ge-codigo',      property: 'ge-codigo'},
                {label: 'l-fm-codigo',      property: 'fm-codigo'},                
            ],

            getObjectFromValue: function (value) {
                    return this.resource.TOTVSGet({id: value}, undefined , {noErrorMessage: true}, true);
            },

            applyFilter: function (parameters) {
                var that = this;

                var field = parameters.selectedFilter.property;
                var value = parameters.selectedFilterValue;

                if (value === undefined) value = "";

                var queryproperties = {};

		queryproperties.property.push(field);
		queryproperties.value.push("*" + value + "*");

                //queryproperties.value = "*" + value + "*";

                if (parameters.more) 
                        queryproperties.start = this.zoomResultList.length + 1;
                else
                        that.zoomResultList = [];					

                return this.resource.TOTVSQuery(queryproperties, function (result) {
                        that.zoomResultList = that.zoomResultList.concat(result);
                        $timeout(function () {
                                that.resultTotal = result[0].$length;
                        }, 0);
                });				
            }
	};

	return service;
    }

    index.register.service('mpd.item.Zoom', serviceItemZoom);    
    
});
define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {
		
	/*####################################################################################################
    # Database: mgdis
    # Table...: portal-configur-clien
    # Service.: serviceEmitente
    # Register: mpd.tb-preco.zoom
    ####################################################################################################*/

	/*Zoom de Modelo do Portal*/    
    servicePortalModelZoom.$inject = ['$timeout', '$totvsresource'];
    function servicePortalModelZoom($timeout, $totvsresource) {
        
        var service = {
            resource: $totvsresource.REST('/dts/datasul-rest/resources/dbo/dibo/bodi00707/:method/:idiSeq/:idiModel'),
            zoomName: 'l-portal-model',
            propertyFields : [
                {label: 'l-cod-modelo', property: 'idi-model', default: true},
                {label: 'l-nom-model',  property: 'nom-model'}
            ],
            tableHeader    : [
                {label: 'l-cod-modelo', property: 'idi-model'},
                {label: 'l-nom-model',  property: 'nom-model'}
            ],
            
            getObjectFromValue: function (value,init){
                if (value === "" || value === undefined || value === null) return;
                if (init === "" || init === undefined || init === null) return;
                return this.resource.TOTVSGet({idiSeq: init, idiModel: value}, undefined, {noErrorMessage: true});
            },
            applyFilter: function(parameters){
                
                var that = this;
                var field = parameters.selectedFilter.property;
                var value = parameters.selectedFilterValue;
                
                if (value === undefined) value = "";
                
                var queryproperties = {};
                queryproperties.property = [];
				queryproperties.value = [];
                
                if (parameters.init === "" || parameters.init === undefined || parameters.init === null) return;
                
                if (parameters.init) {
                    queryproperties.property.push('idi-seq');
					queryproperties.value.push(parameters.init);
				}
                
                if (parameters.isSelectValue) {
                    queryproperties.id = value;
					queryproperties.method = 'search';
					queryproperties.searchfields = 'idi-model,nom-model';
				
				} else {
					if(value){
                        if (field === "idi-model"){
                            queryproperties.property.push(field);
                            queryproperties.value.push(value);
                        } else {
                            queryproperties.property.push(field);
                            queryproperties.value.push("*" + value + "*");                            
                        }
					}
				}
                
                if (parameters.more) 
					queryproperties.start = this.zoomResultList.length;
				else
					that.zoomResultList = [];
                
                return this.resource.TOTVSQuery(queryproperties, function (result) {
                    if (!parameters.more) that.zoomResultList = [];
                    
                    that.zoomResultList = that.zoomResultList.concat(result);
					$timeout(function () {
                        
                        if (result.length > 0)                            
                            that.resultTotal = result[0].$length;
					}, 0);
				}, {noErrorMessage:true}, true);
            }
        };
        return service;
    }
	index.register.service('mpd.portalModel.Zoom',    servicePortalModelZoom);
	
});
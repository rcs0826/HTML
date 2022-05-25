define(['index'], function(index) {
    
    // **************************************************************************************
    // *** SERVICE ZOOM
    // **************************************************************************************

    /*Zoom de motivo de Reativacao*/    
    serviceZoomMotivoReativacao.$inject = ['$timeout', '$totvsresource'];

    function serviceZoomMotivoReativacao($timeout, $totvsresource){

	var service = {
            resource: $totvsresource.REST('/dts/datasul-rest/resources/dbo/dibo/bodi332/:codMotivo/:indTpTrans'),
            zoomName: 'l-cod-motivo',
            propertyFields: [
                {label: 'l-cod-motivo', property: 'cod-motivo', default: true},    
                {label: 'l-descricao', property: 'descricao'},
                {label: 'l-narrativa', property: 'narrativa'},
            ],
            tableHeader: [
                {label: 'l-cod-motivo', property: 'cod-motivo'},
                {label: 'l-descricao', property: 'descricao'},
                {label: 'l-narrativa', property: 'narrativa'}
            ],
            
            getObjectFromValue: function (value) {
                if (value)
                    return this.resource.TOTVSGet({codMotivo: value, indTpTrans: 3}, undefined , {noErrorMessage: true}, true);
            },

            applyFilter: function (parameters) {
                var that = this;

                var field = parameters.selectedFilter.property;
                var value = parameters.selectedFilterValue;

                if (value === undefined) value = "";

                var queryproperties = {};
                queryproperties.property = [];
                queryproperties.value = [];

                if (parameters.isSelectValue) {
                    queryproperties.id = value;
                    queryproperties.method = 'search';
                    queryproperties.searchfields = 'cod-motivo, descricao';	
                }else{                                
                    if(value){
                        queryproperties.property.push(field);

                        if (field == 'cod-motivo') {
                            queryproperties.value.push(value);                    
                        } else {
                            queryproperties.value.push("*" + value + "*");                    
                        }
                    }
                }

                //Define apenas motivo de Reativacao
                queryproperties.property.push('ind-tp-trans');
                queryproperties.value.push('3');

                if (parameters.more) 
                    queryproperties.start = this.zoomResultList.length;
                else
                    that.zoomResultList = [];					

                return this.resource.TOTVSQuery(queryproperties, function (result) {
                        if((queryproperties.start == undefined)&&(that.zoomResultList.length == 10)) return;
                        that.zoomResultList = that.zoomResultList.concat(result);
                        $timeout(function () {
                                that.resultTotal = result[0].$length;
                        }, 0);
                },{noErrorMessage: true}, true);						
            }
	};

	return service;
    }

    index.register.service('mpd.motivoReativacao.Zoom', serviceZoomMotivoReativacao);



});
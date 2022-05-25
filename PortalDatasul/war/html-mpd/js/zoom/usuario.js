define(['index'], function(index) {
    
    // ***************************************************************************************
    // ****************************** SERVICE ZOOM *******************************************
    // ***************************************************************************************

    /*Zoom de motivo de cancelamento*/    
    serviceZoomUsuario.$inject = ['$timeout', '$totvsresource', '$rootScope'];

    function serviceZoomUsuario($timeout, $totvsresource, $rootScope){

	var service = {
            resource: $totvsresource.REST('/dts/datasul-rest/resources/dbo/fnbo/bofn017/:method/:id/:cod_usuario'),            
            zoomName: $rootScope.i18n('l-cod-usuario', undefined, 'dts/mpd'),
            propertyFields: [
                {label: $rootScope.i18n('l-cod-usuario', undefined, 'dts/mpd'), property: 'cod_usuario', default: true},    
                {label: $rootScope.i18n('l-nom-usuario', undefined, 'dts/mpd'), property: 'nom_usuario'},
            ],
            tableHeader: [
                {label: $rootScope.i18n('l-cod-usuario', undefined, 'dts/mpd'), property: 'cod_usuario'},    
                {label: $rootScope.i18n('l-nom-usuario', undefined, 'dts/mpd'), property: 'nom_usuario'},
            ],
            
            getObjectFromValue: function (value) {
                if(value){    
                    return this.resource.TOTVSGet({cod_usuario: value}, undefined , {noErrorMessage: true}, true);
                }
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
                    queryproperties.searchfields = 'cod_usuario, nom_usuario';	
                }else{                                 
                    if(value){
                        queryproperties.property.push(field);

                        if (field == 'cod_usuario') {
                            queryproperties.value.push(value);                    
                        } else {
                            queryproperties.value.push("*" + value + "*");                    
                        }
                    }  
                }
                
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

    index.register.service('mpd.usuario.Zoom', serviceZoomUsuario);



});

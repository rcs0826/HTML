define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {
		
	/*####################################################################################################
    # Database: mgdis
    # Table...: portal-configur-clien
    # Service.: serviceEmitente
    # Register: mpd.tb-preco.zoom
    ####################################################################################################*/

	/*Zoom de Configura��o de Clientes e Representantes*/    
    serviceConfigClienRepZoom.$inject = ['$timeout', '$totvsresource', '$rootScope'];
    function serviceConfigClienRepZoom($timeout, $totvsresource, $rootScope) {
        
        var service = {
            resource: $totvsresource.REST('/dts/datasul-rest/resources/dbo/dibo/bodi00706/:method/:id', {fields: "idi-seq,cdn-clien,cdn-grp-clien,cdn-repres,idi-clien-repres"}, {}),
            zoomName: 'l-portal-config-clien-rep',
            propertyFields : [],
            tableHeader    : [],
            
            getObjectFromValue: function (value,init){
                
                if (value === "" || value === undefined || value === null) return;
                    
                if (init.indexOf(value) != -1)
                    return this.resource.TOTVSGet({id: value}, undefined, {noErrorMessage: true},true);                
            },
            applyFilter: function(parameters){
                
                var that = this;
                var field = parameters.selectedFilter.property;
                var value = parameters.selectedFilterValue;
				var strQuery = "";
				var strQueryZoom = "";
				
				if (value === undefined) value = "";
                
                var queryproperties = {};
                queryproperties.property = [];
				queryproperties.value = [];
				
				if (parameters.init != null || parameters.init != undefined) {
                    
					/*Cliente*/					
					if (parameters.init == 1) {
						
						service.propertyFields= [];
						service.tableHeader = [];
						
						/*Monta os filtros e colunas*/
						service.propertyFields.push(
							{label: 'l-sequencia',     property: 'idi-seq', default: true},
							{label: 'l-cdn-clien',     property: 'cdn-clien'},
							{label: 'l-cdn-grp-clien', property: 'cdn-grp-clien'}
						);
						service.tableHeader.push (
							{label: 'l-sequencia',     property: 'idi-seq'},
							{label: 'l-cdn-clien',     property: 'cdn-clien'},
							{label: 'l-cdn-grp-clien', property: 'cdn-grp-clien'}								
						);
												
						/*Busca todos os clientes, clientes e grupo de clientes*/
						if (parameters.selectedFilterValue === "") {
							strQuery += "    ((portal-configur-clien.cdn-clien        = ? or portal-configur-clien.cdn-clien        = -1) " +
										" AND (portal-configur-clien.cdn-grp-clien    = ? or portal-configur-clien.cdn-grp-clien    = -1) " +
										" AND (portal-configur-clien.cdn-repres       = ? or portal-configur-clien.cdn-repres       = -1) " +
										" AND (portal-configur-clien.idi-clien-repres = 0 or portal-configur-clien.idi-clien-repres = 1)) " +
										"  OR (portal-configur-clien.cdn-clien > 0) " +
										"  OR (portal-configur-clien.cdn-grp-clien > 0)";
						}
					
						/*Filtra todos os clientes, clientes e grupo de clientes*/
						if (parameters.selectedFilterValue !== "") {
							strQuery += "     (portal-configur-clien.cdn-repres       = ? or portal-configur-clien.cdn-repres       = -1 " +
										" AND  portal-configur-clien.idi-clien-repres = 0 or portal-configur-clien.idi-clien-repres = 1) " +
										" AND (portal-configur-clien.cdn-clien      = " + parameters.selectedFilterValue +
										"  OR  portal-configur-clien.cdn-grp-clien  = " + parameters.selectedFilterValue +
										"  OR  portal-configur-clien.idi-seq        = " + parameters.selectedFilterValue + ")";
									
						}
					} else if (parameters.init == 2) { /*Representante*/
						
						service.propertyFields= [];
						service.tableHeader = [];
						
						/*Monta os filtros e colunas*/						
						service.propertyFields.push(
							{label: 'l-sequencia',     property: 'idi-seq', default: true},
							{label: 'l-cdn-repres',    property: 'cdn-repres'}
						);
						service.tableHeader.push (
							{label: 'l-sequencia',     property: 'idi-seq'},
							{label: 'l-cdn-repres',    property: 'cdn-repres'}
						);
												
						/*Busca por todos os representantes e representates*/
						if (parameters.selectedFilterValue === "") {
							strQuery += "    ((portal-configur-clien.cdn-clien        = ? or portal-configur-clien.cdn-clien        = -1) " +
										" AND (portal-configur-clien.cdn-grp-clien    = ? or portal-configur-clien.cdn-grp-clien    = -1) " +
										" AND (portal-configur-clien.cdn-repres       = ? or portal-configur-clien.cdn-repres       = -1) " +
										" AND (portal-configur-clien.idi-clien-repres = 0 or portal-configur-clien.idi-clien-repres = 2)) " +
										"  OR (portal-configur-clien.cdn-repres > 0) ";
										
						}
						
						/*Filtra por todos os representantes e representates*/
						if (parameters.selectedFilterValue !== "") {
							strQuery += "     (portal-configur-clien.cdn-clien        = ? or portal-configur-clien.cdn-repres       = -1 " +
										" AND  portal-configur-clien.idi-clien-repres = 0 or portal-configur-clien.idi-clien-repres =  2 " +
										" AND  portal-configur-clien.cdn-grp-clien    = ? or portal-configur-clien.cdn-grp-clien    = -1) " +
										" AND (portal-configur-clien.cdn-repres      = " + parameters.selectedFilterValue +
										"  OR  portal-configur-clien.idi-seq         = " + parameters.selectedFilterValue + ")";
						}
					}
				}
				
				if (parameters.isSelectValue) {
					/*Zomm no campo*/
					queryproperties.where = [];
					queryproperties.where.push(strQuery);
				
				} else {					
					/*Zoom Modal*/
					
					/*Usado algum filtro do zoom*/
					if (parameters.disclaimers) {
					
						angular.forEach(parameters.disclaimers, function (disclaimer, key) { 
							if (disclaimer.value) {
			
								/*Cliente*/
								if (parameters.init && parameters.init == 1) {
								
									strQueryZoom += "    (portal-configur-clien.cdn-repres  = ? or portal-configur-clien.cdn-repres       = -1 " +
												" AND portal-configur-clien.idi-clien-repres = 0 or portal-configur-clien.idi-clien-repres = 1) " +
												" AND portal-configur-clien." + disclaimer.property + " = " + disclaimer.value;
												
								} else if (parameters.init && parameters.init == 2) { /*Representante*/
								
									strQueryZoom += "    (portal-configur-clien.cdn-clien  = ? or portal-configur-clien.cdn-clien       = -1 " +
												" AND portal-configur-clien.idi-clien-repres = 0 or portal-configur-clien.idi-clien-repres = 2) " +
												" AND portal-configur-clien." + disclaimer.property + " = " + disclaimer.value;
								}
								
								queryproperties.where = [];
								queryproperties.where.push(strQueryZoom);

							} else {
								
								/*Carrega todos os Clientes*/								
								if (parameters.init && parameters.init == 1) {
									strQueryZoom += "    ((portal-configur-clien.cdn-clien        = ? or portal-configur-clien.cdn-clien        = -1) " +
												" AND (portal-configur-clien.cdn-grp-clien    = ? or portal-configur-clien.cdn-grp-clien    = -1) " +
												" AND (portal-configur-clien.cdn-repres       = ? or portal-configur-clien.cdn-repres       = -1) " +
												" AND (portal-configur-clien.idi-clien-repres = 0 or portal-configur-clien.idi-clien-repres = 1)) " +
												"  OR (portal-configur-clien.cdn-clien > 0) " +
												"  OR (portal-configur-clien.cdn-grp-clien > 0)";
								} else if (parameters.init && parameters.init == 2) { /*Carrega todos os representantes*/
									strQueryZoom += "    ((portal-configur-clien.cdn-clien        = ? or portal-configur-clien.cdn-clien        = -1) " +
											" AND (portal-configur-clien.cdn-grp-clien    = ? or portal-configur-clien.cdn-grp-clien    = -1) " +
											" AND (portal-configur-clien.cdn-repres       = ? or portal-configur-clien.cdn-repres       = -1) " +
											" AND (portal-configur-clien.idi-clien-repres = 0 or portal-configur-clien.idi-clien-repres = 2)) " +
											"  OR (portal-configur-clien.cdn-repres > 0) ";
								}
								
								queryproperties.where = [];
								queryproperties.where.push(strQueryZoom);
							}
						});
					} else { /*Carrega todos os dados quando abre o zoom*/
						
						/*Cliente*/
						if (parameters.init && parameters.init == 1) {
							strQueryZoom += "    ((portal-configur-clien.cdn-clien        = ? or portal-configur-clien.cdn-clien        = -1) " +
										" AND (portal-configur-clien.cdn-grp-clien    = ? or portal-configur-clien.cdn-grp-clien    = -1) " +
										" AND (portal-configur-clien.cdn-repres       = ? or portal-configur-clien.cdn-repres       = -1) " +
										" AND (portal-configur-clien.idi-clien-repres = 0 or portal-configur-clien.idi-clien-repres = 1)) " +
										"  OR (portal-configur-clien.cdn-clien > 0) " +
										"  OR (portal-configur-clien.cdn-grp-clien > 0)";
						} else if (parameters.init && parameters.init == 2) { /*Representante*/
							strQueryZoom += "    ((portal-configur-clien.cdn-clien        = ? or portal-configur-clien.cdn-clien        = -1) " +
									" AND (portal-configur-clien.cdn-grp-clien    = ? or portal-configur-clien.cdn-grp-clien    = -1) " +
									" AND (portal-configur-clien.cdn-repres       = ? or portal-configur-clien.cdn-repres       = -1) " +
									" AND (portal-configur-clien.idi-clien-repres = 0 or portal-configur-clien.idi-clien-repres = 2)) " +
									"  OR (portal-configur-clien.cdn-repres > 0) ";
						}
						
						queryproperties.where = [];
						queryproperties.where.push(strQueryZoom);
					}
				}
				               
                if (parameters.more) 
					queryproperties.start = this.zoomResultList.length;
				else
					that.zoomResultList = [];
                
                return this.resource.TOTVSQuery(queryproperties, function (result) {
                    
                    if (!parameters.more) that.zoomResultList = [];
                    
                    angular.forEach(result, function(portalConfigurClien){
						
						//Altera a label do campo, concatenando o c�digo com a descri��o                        
                        if (portalConfigurClien['cdn-clien'] != undefined && portalConfigurClien['cdn-clien'] != 0) {
                            portalConfigurClien['cdn-clien'] = portalConfigurClien['cdn-clien'] + ' - ' + portalConfigurClien['_']
                            ['desc-clien'];
                            portalConfigurClien['descricao'] = portalConfigurClien['cdn-clien'];
                        } else {
                            portalConfigurClien['cdn-clien'] = "";
                        }
                        
                        if (portalConfigurClien['cdn-grp-clien'] != undefined && portalConfigurClien['cdn-grp-clien'] != 0) {
                            portalConfigurClien['cdn-grp-clien'] = portalConfigurClien['cdn-grp-clien'] + ' - ' + portalConfigurClien['_']['desc-grp-clien'];
                            portalConfigurClien['descricao'] = portalConfigurClien['cdn-grp-clien'];
                        } else {
                            portalConfigurClien['cdn-grp-clien'] = "";
                        }
                        
                        if (portalConfigurClien['cdn-repres'] != undefined && portalConfigurClien['cdn-repres'] != 0) {
                            portalConfigurClien['cdn-repres'] = portalConfigurClien['cdn-repres'] + ' - ' + portalConfigurClien['_']['desc-repres'];
                            portalConfigurClien['descricao'] = portalConfigurClien['cdn-repres'];
                        } else {
                            portalConfigurClien['cdn-repres'] = "";
                        }
			
                        if(portalConfigurClien['descricao'] === undefined) {
                             if (portalConfigurClien['idi-clien-repres'] === 1){
                                portalConfigurClien['descricao'] = $rootScope.i18n('l-todos-clientes');
								portalConfigurClien['cdn-clien'] = $rootScope.i18n('l-todos-clientes');
                            } else {
                                portalConfigurClien['descricao'] = $rootScope.i18n('l-todos-repres');
								portalConfigurClien['cdn-repres'] = $rootScope.i18n('l-todos-repres');
                            }
                        }
                    });                    
                        
                    that.zoomResultList = that.zoomResultList.concat(result);
					$timeout(function () {
                        
                        if (result.length > 0)                            
                            that.resultTotal = result[0].$length;
					}, 0);
				}, {noErrorMessage:true});
            }
        };
        return service;
    }
	index.register.service('mpd.configClienRep.Zoom', serviceConfigClienRepZoom);
	
});
define(['index'], function(index) {
        
 	serviceLegend.$inject = ['$rootScope'];
	function serviceLegend($rootScope) {
		return {
			situation : {
				NAME : function (id) {

					var sentence = '';

					switch(id) {
						case 1:
							sentence = 'l-active';
							break;
						case 2:
							sentence = 'l-obsolete-automatic-orders';
							break;
						case 3:
							sentence = 'l-obsolete-all-orders';
							break;
						case 4:
							sentence = 'l-totally-obsolete';
							break;                            
						default:
							sentence = '';
					}
					return $rootScope.i18n(sentence);
				}
			},
            obtainmentWay: {
				NAME : function (id) {
                    
                    

					var sentence = '';

					switch(id) {
						case 1:
							sentence = 'l-bought';
							break;
						case 2:
							sentence = 'l-manufactured-singular';
							break;					                       
						default:
							sentence = '';
					}
					return $rootScope.i18n(sentence);
				}
			},
            inventoryControlType : {
				NAME : function (id) {

					var sentence = '';

					switch(id) {
						case 1:
							sentence = 'l-serial';
							break;
						case 2:
							sentence = 'l-qty-ctrl';
							break;
						case 3:
							sentence = 'l-lot-serial';
							break;
						case 4:
							sentence = 'l-reference';
							break;                            
						default:
							sentence = '';
					}
					return $rootScope.i18n(sentence);
				}
			},
            securityInventoryType: {
				NAME : function (id) {

					var sentence = '';

					switch(id) {
						case 1:
							sentence = 'l-quantity';
							break;
						case 2:
							sentence = 'l-time-2';
							break;					                       
						default:
							sentence = '';
					}
					return $rootScope.i18n(sentence);
				}
			},
            logical: {
				NAME : function (id) {

					var sentence = '';

					switch(id) {
						case true:
							sentence = 'l-yes';
							break;
						case false:
							sentence = 'l-no';
							break;					                       
						default:
							sentence = '';
					}
					return $rootScope.i18n(sentence);
				}
			} ,
            warehouseType: {
				NAME : function (id) {

					var sentence = '';

					switch(id) {
						case 1:
							sentence = 'l-inner';
							break;
						case 2:
							sentence = 'l-outer';
							break;					                       
						default:
							sentence = '';
					}
					return $rootScope.i18n(sentence);
				}
			},
            documentClass:{
                NAME : function (id) {
                    
                    var sentence = '';
                    
                    switch (id) {
                        case 1:
                            sentence = 'l-aca';
                            break;
                        case 2:
                            sentence = 'l-act';
                            break;
                        case 3:
                            sentence = 'l-nu1';
                            break;
                        case 4:
                            sentence = 'l-dd';
                            break;
                        case 5:
                            sentence = 'l-dev';
                            break;
                        case 6:
                            sentence = 'l-div';
                            break;
                        case 7:
                            sentence = 'l-drm';
                            break;
                        case 8:
                            sentence = 'l-eac';
                            break;
                        case 9:
                            sentence = 'l-egf';
                            break;
                        case 10:
                            sentence = 'l-bem';
                            break;
                        case 11:
                            sentence = 'l-epr';
                            break;
                        case 12:
                            sentence = 'l-nu3';
                            break;
                        case 13:
                            sentence = 'l-nu4';
                            break;
                        case 14:
                            sentence = 'l-icm';
                            break;
                        case 15:
                            sentence = 'l-inv';
                            break;
                        case 16:
                            sentence = 'l-ipl';
                            break;
                        case 17:
                            sentence = 'l-mob';
                            break;
                        case 18:
                            sentence = 'l-nc';
                            break;
                        case 19:
                            sentence = 'l-nf';
                            break;
                        case 20:
                            sentence = 'l-nfd';
                            break;
                        case 21:
                            sentence = 'l-nfe';
                            break;
                        case 22:
                            sentence = 'l-nfs';
                            break;
                        case 23:
                            sentence = 'l-nft';
                            break;
                        case 24:
                            sentence = 'l-nu5';
                            break;
                        case 25:
                            sentence = 'l-ref';
                            break;
                        case 26:
                            sentence = 'l-rcs';
                            break;
                        case 27:
                            sentence = 'l-rdd';
                            break;
                        case 28:
                            sentence = 'l-req';
                            break;
                        case 29:
                            sentence = 'l-rfs';
                            break;
                        case 30:
                            sentence = 'l-rm';
                            break;
                        case 31:
                            sentence = 'l-rrq';
                            break;
                        case 32:
                            sentence = 'l-str';
                            break;
                        case 33:
                            sentence = 'l-tra';
                            break;
                        case 34:
                            sentence = 'l-zzz';
                            break;
                        case 35:
                            sentence = 'l-sob';
                            break;
                        case 36:
                            sentence = 'l-edd';
                            break;
                        case 37:
                            sentence = 'l-var';
                            break;
                        case 38:
                            sentence = 'l-rop';
                            break;
                    }
                    return $rootScope.i18n(sentence);
                }                
            } ,
            documentType: {
				NAME : function (id) {

					var sentence = '';

					switch(id) {
						case 1:
							sentence = 'l-document-in';
							break;
						case 2:
							sentence = 'l-document-out';
							break;					                       
						default:
							sentence = '';
					}
					return $rootScope.i18n(sentence);
				}
			} ,
            averageType: {
				NAME : function (id) {

                    var sentence = '';

					switch(id) {
						case '1':
							sentence = 'l-monthly';
							break;
						case '2':
							sentence = 'l-online';
							break;					                       
						default:
							sentence = '';
					}
                    
                    return $rootScope.i18n(sentence);
				}
			} ,
		};
	}
    index.register.service('mce.zoom.serviceLegend', serviceLegend);  

});
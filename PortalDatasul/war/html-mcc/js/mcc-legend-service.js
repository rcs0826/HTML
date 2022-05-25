define(['index'], function(index) {
        
 	serviceLegend.$inject = ['$rootScope'];
	function serviceLegend($rootScope) {
		return {
			requestStatus : {
				NAME : function (id) {

					var sentence = '';

					switch(id) {
						case 1:
							sentence = 'l-open';
							break;
						case 2:
							sentence = 'l-closed';
							break;
						case 3:
							sentence = 'l-incomplete';
							break;
						case 4:
							sentence = 'l-with-order';
							break;                            
						default:
							sentence = '';
					}
					return $rootScope.i18n(sentence, [], 'dts/mcc');
				}
			},
			requestState : {
				NAME : function (id) {
					var sentence = '';

					switch(id) {
						case 1:
							sentence = 'l-yes';
							break;						                 
						default:
							sentence = 'l-no';
					}
					return $rootScope.i18n(sentence, [], 'dts/mcc');
				}
			},      
            requestType : {
				NAME : function (id) {

					var sentence = '';

					switch(id) {
						case 1:
							sentence = 'l-inventory-request';
							break;	
						case 2:
							sentence = 'l-purchase-request';
							break;	 
						case 3:
							sentence = 'l-quotation-request';
							break;	    
						default:
							sentence = '';
					}
					return $rootScope.i18n(sentence, [], 'dts/mcc');
				}
			},
            expenseOrIncome: {
                NAME: function(id) {
                    var sentence = '';
                    switch (id) {
                        case 1:
                            sentence = 'l-income';
                        break;
                        case 2:
                            sentence = 'l-expense';
                        break;
                    }
                    return $rootScope.i18n(sentence, [], 'dts/mcc');
                }
            },
            boolean: {
                NAME: function(id) {
                    if(id) {
                        return $rootScope.i18n('l-yes', [], 'dts/mcc');
                    } else {
                        return $rootScope.i18n('l-no', [], 'dts/mcc');
                    }
                }
            },
            contractItemStatus: {
                NAME: function (id) {
                    var sentence = '';
                    switch (id) {
                        case 1:
                            sentence = 'l-not-issued';
                        break;
                        case 2:
                            sentence = 'l-issued';
                        break;
                        case 3:
                            sentence = 'l-canceled';
                        break;
                        case 4:
                            sentence = 'l-processed';
                        break;
                    }
                    return $rootScope.i18n(sentence, [], 'dts/mcc');
                }
            },
            purchaseTypes: {
                NAME: function (id) {
                    var sentence = '';
                    switch (id) {
                        case 1:
                            sentence = 'l-purchase';
                        break;
                        case 2:
                            sentence = 'l-service';
                        break;
                        case 3:
                            sentence = 'l-subcontracting';
                        break;
                        
                    }
                    return $rootScope.i18n(sentence, [], 'dts/mcc');
                }
            },
            icmsTypes: {
                NAME: function (id) {
                    var sentence = '';
                    switch (id) {
                        case 1:
                            sentence = 'l-usage';
                        break;
                        case 2:
                            sentence = 'l-industrialization';
                        break;
                    }
                    return $rootScope.i18n(sentence, [], 'dts/mcc');
                }
            },
            approvalPriorities: {
                NAME: function (id) {
                    var sentence = '';
                    switch (id) {
                        case 3:
                            sentence = 'l-low';
                        break;
                        case 2:
                            sentence = 'l-medium';
                        break;
                        case 1:
                            sentence = 'l-high';
                        break;
                        case 0:
                            sentence = 'l-very-high';
                        break;
                    }
                    return $rootScope.i18n(sentence, [], 'dts/mcc');
                }
            },
            purchaseRequisitionStatus : {
                NAME : function (id) {

                    var sentence = '';

                    switch(id) {
                        case 1:
                            sentence = 'l-not-confirmed';
                            break;
                        case 2:
                            sentence = 'l-confirmed-gen';
                            break;
                        case 3:
                            sentence = 'l-quoted';
                            break;
                        case 4:
                            sentence = 'l-deleted';
                            break;    
                        case 5:
                            sentence = 'l-in-quotation';
                            break;   
                        case 6:
                            sentence = 'l-received';
                            break;                           
                        default:
                            sentence = '';
                    }
                    return $rootScope.i18n(sentence, [], 'dts/mcc');
                }
            },
            referencePriceType : {
                NAME : function (id) {

                    var sentence = '';

                    switch(id) {
                        case 1:
                            sentence = 'l-last-purchase';
                            break;
                        case 2:
                            sentence = 'l-base-price';
                            break;
                        case 3:
                            sentence = 'l-base-table';
                            break;
                        default:
                            sentence = '';
                    }
                    return $rootScope.i18n(sentence, [], 'dts/mcc');
                },
                ID : function (sentence){
                    var id = 0;
                    switch(sentence) {
                        case $rootScope.i18n('l-last-purchase', [], 'dts/mcc'):
                            id = 1;
                            break;
                        case $rootScope.i18n('l-base-price', [], 'dts/mcc'):
                            id = 2;
                            break;
                        case $rootScope.i18n('l-base-table', [], 'dts/mcc'):
                            id = 3;
                            break;
                        default:
                            id = 0;
                    }
                    return id;
                }
            },
            suggestedValueType : {
                NAME : function (id) {

                    var sentence = '';

                    switch(id) {
                        case 1:
                            sentence = 'l-total-value';
                            break;
                        case 2:
                            sentence = 'l-average-payment-period';
                            break;
                        case 3:
                            sentence = 'l-final-unit-price';
                            break;
                        default:
                            sentence = 'l-total-value';
                    }
                    return $rootScope.i18n(sentence, [], 'dts/mcc');
                },
                ID : function (sentence){
                    var id = 0;
                    switch(sentence) {
                        case $rootScope.i18n('l-total-value', [], 'dts/mcc'):
                            id = 1;
                            break;
                        case $rootScope.i18n('l-average-payment-period', [], 'dts/mcc'):
                            id = 2;
                            break;
                        case $rootScope.i18n('l-final-unit-price', [], 'dts/mcc'):
                            id = 3;
                            break;
                        default:
                            id = 1;
                    }
                    return id;
                }
            }
		};
	}
    index.register.service('mcc.zoom.serviceLegend', serviceLegend);  
});

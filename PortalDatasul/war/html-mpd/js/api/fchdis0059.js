define(['index',
        'less!/dts/mpd/assets/css/deliverywindows.less'
       ], function(index) {
    // *************************************************************************************
    // *** FACTORIES
    // *************************************************************************************
    deliverywindowsFactory.$inject = ['$totvsresource'];
    function deliverywindowsFactory($totvsresource) {
         
        var specificResources = {
            'getDeliveryWindowsItemCust': {
                method: 'GET',
                isArray: true,
                params: {},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0059/deliverywindowsitemcust'
            },
            'postNewDeliveryWindow': {
                method: 'POST',
                isArray: false,
                params: {},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0059/newdeliverywindow'
            },
            'putDeliveryWindow': {
                method: 'PUT',
                isArray: false,
                params: {},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0059/editdeliverywindow'
            },
            'deleteDeliveryWindow':	{
				method: 'DELETE',
				isArray: false,
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0059/deldeliverywindow/:idiSeq',
                params: {idiSeq: '@idiSeq'},
            },
            
			'getParameters': {
				method: 'GET',
				isArray: false,
				params: {},
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0059/getParameters'
			}
        }
       
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0059', {}, specificResources);
         
        return factory;
    }
         
    index.register.factory('mpd.deliverywindows.Factory', deliverywindowsFactory);
   
    
});
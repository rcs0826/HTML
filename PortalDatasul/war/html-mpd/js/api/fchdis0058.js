define(['index'], function(index) {
    // *************************************************************************************
    // *** FACTORIES
    // *************************************************************************************
	paramEmail.$inject = ['$totvsresource'];
	function paramEmail($totvsresource) {
         
		var specificResources = {

			/*Serviço para retornar parâmetros de configuração de e-mail para notificação de eventos do pedido*/
			'getParamNotifications': {
				method: 'GET',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0058/paramNotifications'
			},

			/*Serviço para gravar parâmetros de configuração de e-mail para notificação de eventos do pedido*/
			'putParamNotifications': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0058/paramNotifications'
			},

			/*Serviço para gravar mensagens e templates de configuração de e-mail para notificação de eventos do pedido*/
			'putMessageNotifications': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0058/putMessageNotifications'
			},

		}

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0058', {}, specificResources);
         
        return factory;
    }

         
	index.register.factory('mpd.fchdis0058.Factory', paramEmail);

});




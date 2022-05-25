define(['index'], function(index) {
    // *************************************************************************************
    // *** API
    // *************************************************************************************
    fchdis0028Factory.$inject = ['$totvsresource'];
    function fchdis0028Factory($totvsresource){
        
        var specificResources = {
			'getFieldsModelVal':	{
				method: 'GET',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0028/getFieldsModelVal/:idiModel/:numSeqItem',
                params: {idiModel: '@idiModel', numSeqItem: '@numSeqItem'}
            },
            'getRef':	{
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0028/verifyRefItem/:itCodigo',
                params: {itCodigo: '@itCodigo'}
            },
            'searchItem':	{
				method: 'PUT',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0028/searchItem/',
            },
            'createRecordInclAdvanItem':	{
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0028/createRecordInclAdvanItem/',
            },
            'deleteRecordInclAdvanItem':	{
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0028/deleteRecordInclAdvanItem/',
            },
            'postPortalRegCopy': {
                method: 'POST',
                isArray: false,
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0028/postPortalRegCopy/:idiPortalConfigurCopy/:idiPortalConfigurNew/:checkItem/:checkCondPagto/:checkTbPreco/:checktpOperacao/:checkCanalVenda',
                params: {idiPortalConfigurCopy: '@idiPortalConfigurCopy', idiPortalConfigurNew: '@idiPortalConfigurNew', checkItem: '@checkItem', checkCondPagto: '@checkCondPagto', checkTbPreco: '@checkTbPreco', checktpOperacao: '@checktpOperacao', checkCanalVenda: '@checkCanalVenda'}
            }
            ,
            'postPortalCamposCopy': {
                method: 'POST',
                isArray: false,
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0028/postPortalCamposCopy/:idiPortalConfigurCopy/:idiPortalConfigurNew',
                params: {idiPortalConfigurCopy: '@idiPortalConfigurCopy', idiPortalConfigurNew: '@idiPortalConfigurNew'}
            },
            'getCondPagto':	{
				method: 'GET',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0028/getCondPagto/:idiSeq/:typeFilter',
                params: {idiSeq: '@idiSeq', typeFilter: '@typeFilter'}
            },
            'postInclExclCondPagto':	{
				method: 'POST',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0028/postInclExclCondPagto/:idiSeq/:typeFilter',
                params: {idiSeq: '@idiSeq', typeFilter: '@typeFilter'}
            },
            'postInclExclTpOperacao':	{
				method: 'POST',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0028/postInclExclTpOperacao/:idiSeq/:typeFilter',
                params: {idiSeq: '@idiSeq', typeFilter: '@typeFilter'}
            },
            'getTbPreco':	{
				method: 'GET',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0028/getTbPreco/:idiSeq/:typeFilter',
                params: {idiSeq: '@idiSeq', typeFilter: '@typeFilter'}
            },
            'getTpOperacao':	{
				method: 'GET',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0028/getTpOperacao/:idiSeq/:typeFilter',
                params: {idiSeq: '@idiSeq', typeFilter: '@typeFilter'}
            },
            'getCanalVenda':	{
				method: 'GET',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0028/getCanalVenda/:idiSeq/:typeFilter',
                params: {idiSeq: '@idiSeq', typeFilter: '@typeFilter'}
            },
            'postInclExclTbPreco':	{
				method: 'POST',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0028/postInclExclTbPreco/:idiSeq/:typeFilter',
                params: {idiSeq: '@idiSeq', typeFilter: '@typeFilter'}
            },
            'postInclExclCanalVenda':	{
				method: 'POST',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0028/postInclExclCanalVenda/:idiSeq/:typeFilter',
                params: {idiSeq: '@idiSeq', typeFilter: '@typeFilter'}
            },
			'getTables':	{
                method: 'GET',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0028/getTables/:idiSeq/:idiTip',
                params: {
                    idiSeq: '@idiSeq',
                    idiTip: '@idiTip'
                }
            },
            'getParametersClientRepConfigurations': {
                method: 'GET',
                isArray: false,
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0028/getParametersClientRepConfigurations/:idiSeq',
                params: {
                    idiSeq: '@idiSeq',
                }
            },
            'getFields':	{
                method: 'GET',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0028/getFields/:idiSeq/:table',
                params: {idiSeq: '@idiSeq', table: '@table', isQuotation: '@isQuotation'}
            },
            'postFields':	{
				method: 'POST',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0028/postFields/:idiSeq',
                params: {idiSeq: '@idiSeq'}
            },
			'getConfigNotif':	{
                method: 'GET',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0028/getConfigNotif/:idiSeq',
                params: {idiSeq: '@idiSeq'}
            },
            'postConfigNotif':	{
                method: 'POST',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0028/postConfigNotif/:idiSeq',
                params: {idiSeq: '@idiSeq'}
            },
			'getUseHTMLNotificationProfile':	{
                method: 'GET',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0028/getUseHTMLNotificationProfile/:idiSeq',
                params: {idiSeq: '@idiSeq'}
            },
			'getFilterConfigClien':	{
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0028/getFilterConfigClien'
            },
            'getFilterPortalModel': {
                method: 'GET',
                isArray: false,
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0028/getFilterPortalModel/:idiSeq',
                params: {idiSeq: '@idiSeq'}
            },
            'postPortalModelCopy': {
                method: 'POST',
                isArray: false,
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0028/postPortalModelCopy/:idiPortalConfigurCopy/:idiPortalConfigurNew/:idiModel',
                params: {idiPortalConfigurCopy: '@idiPortalConfigurCopy', idiPortalConfigurNew: '@idiPortalConfigurNew', idiModel: '@idiModel'}
            },
			'getUserRelated':	{
                method: 'GET',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0028/getUserRelated/:idiSeq/:startAt/:max/:where',
                params: {idiSeq: '@idiSeq', startAt: '@startAt', max: '@max', where: '@where'}
            },
            'postUserRelated':	{
                method: 'POST',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0028/postUserRelated/'
            },
            'putUserRelated':	{
                method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0028/putUserRelated/'
            },
            'deleteUserRelated':	{
                method: 'DELETE',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0028/deleteUserRelated/:codUsuario/:idiDtsul',
                params: {codUsuario: '@codUsuario', idiDtsul: '@idiDtsul'}
            },
            'putBlockUnlockUserRelated':	{
                method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0028/putBlockUnlockUserRelated/'
            },
            'getParameters':	{
                method: 'GET',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0028/getParameters/'
            },            
        };
        
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0028/:method',{}, specificResources);
        
        return factory;
    }

    index.register.factory('mpd.fchdis0028.FactoryApi', fchdis0028Factory);    
});
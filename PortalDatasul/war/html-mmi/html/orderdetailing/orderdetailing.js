define(['index',
        '/dts/mmi/js/dbo/bomn134.js',
        '/dts/mmi/js/dbo/bomn136.js',
        '/dts/mmi/js/dbo/boin390.js',
        '/dts/mmi/js/zoom/equipto.js',
        '/dts/mmi/js/zoom/equipe.js',
        '/dts/mmi/js/zoom/manut.js',
        '/dts/mmi/js/zoom/ord-taref.js',
        '/dts/mmi/js/zoom/tag.js',
        '/dts/mmi/js/zoom/sintoma.js',
        '/dts/mmi/js/zoom/causa-padr.js',
        '/dts/mmi/js/zoom/interv-padr.js',
        '/dts/mmi/js/zoom/projeto.js',
        '/dts/mmi/js/zoom/inspec.js',
        '/dts/mmi/js/zoom/mi-parada.js',
        '/dts/mmi/js/zoom/mi-per-parada.js',
        '/dts/mmi/js/zoom/mnt-planejador.js',
        '/dts/mmi/js/zoom/tipo-manut.js',
        '/dts/mmi/js/zoom/form-lubrif.js',
        '/dts/men/js/zoom/item.js',
        '/dts/men/js/zoom/ref-item.js',
        '/dts/mce/js/zoom/deposito.js',
        '/dts/mce/js/zoom/localizacao.js',
        '/dts/mmi/js/utils/filters.js',
        '/dts/mmi/html/orderdetailing/orderdetailing-detail.js',
        '/dts/mmi/js/api/fch/fchmip/fchmiporder.js',
        '/dts/mmi/js/api/fch/fchmip/fchmiplaborreport.js',
        '/dts/mpo/js/api/fch/fchmip/fchmip0066.js',
        '/dts/mmi/js/zoom/mi-espec.js',
        '/dts/mmi/js/zoom/mi-turno.js',
        '/dts/mmi/js/zoom/mip-tecnica.js',
        '/dts/mmi/js/zoom/plano-orig.js',
        '/dts/mmi/js/zoom/epi.js',
        '/dts/mmi/js/zoom/pend-padrao.js',
        '/dts/mmi/js/zoom/mnt-ficha-metodo.js',
        '/dts/mmi/js/api/fch/fchmip/fchmipparameter.js',
        '/dts/mmi/js/utils/mmi-utils.js'
		], function(index) {

    index.stateProvider
        .state('dts/mmi/orderdetailing', {
            abstract: true,
            template: '<ui-view/>'
        })
        .state('dts/mmi/orderdetailing.start', {
            url:'/dts/mmi/orderdetailing/:id',
            controller:'mmi.orderdetailing.Ctrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mmi/html/orderdetailing/orderdetailing-detail.html'
        })
});

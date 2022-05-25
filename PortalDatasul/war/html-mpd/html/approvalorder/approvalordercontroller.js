define(['index', // index sempre deve ser injetado para permitir o registro dos controllers.
        '/dts/mpd/js/portal-factories.js',
        '/dts/mpd/js/api/fchdis0049.js'                         
       ], function(index) {
            
    index.stateProvider    
    .state('dts/mpd/approvalorder', {                
        abstract: true,
        template: '<ui-view/>' // <ui-view/> é onde os states filhos são renderizados
     })
         
     // definição do state inicial, o state é carregado a partir de sua URL
     .state('dts/mpd/approvalorder.start', {    
         url:'/dts/mpd/approvalorder',
         controller:'mpd.approval-order-list.Control',
         controllerAs: 'controller',
         templateUrl:'/dts/mpd/html/approvalorder/approval-order.list.html'
     })
               
     approvalOrderListController.$inject = ['$location', 'totvs.app-main-view.Service', 'mpd.orderappsummaryapd.Factory', 'userPreference', 'portal.generic.Controller','portal.getUserData.factory', '$filter', '$modal']; 
    
     function approvalOrderListController($location, appViewService, orderApprovalResource, userPreference, genericController, userdata, $filter, $modal) {
         
         var controller = this;
                      
    }
     
    // registrar os controllers no angular
    index.register.controller('mpd.approval-order-list.Control', approvalOrderListController);
   
});
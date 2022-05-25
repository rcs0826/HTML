<totvs-page type="list" totvs-custom-element="customPage">
     
    <totvs-page-navbar>
        <totvs-page-breadcrumb>
            <breadcrumb link="#/">Home</breadcrumb>            
            <breadcrumb>{{'l-retrieve-order-payment-ciashop' | i18n}}</breadcrumb>
        </totvs-page-breadcrumb>         
        <totvs-page-header>
            <totvs-page-header-title title="{{'l-retrieve-order-payment-ciashop' | i18n}}"
                                     total="{{controller.totalRecords}}">
            </totvs-page-header-title>
            <totvs-page-header-operation>         
                <totvs-page-header-operation-filter placeholder="{{ 'l-payment-ciashop' | i18n }}"
                                                    ng-submit="controller.loadData()"
                                                    ng-model="controller.quickSearchText"
                                                    advanced-search="controller.openAdvancedSearch">
                </totvs-page-header-operation-filter>
            </totvs-page-header-operation>
            <totvs-page-disclaimers disclaimer-list="controller.disclaimers"
                                    ng-click="controller.removeDisclaimer">
            </totvs-page-disclaimers>
        </totvs-page-header>     
    </totvs-page-navbar> 
    
    <totvs-page-content>             
        <totvs-list-item ng-repeat="pedpagto in controller.listResult"
                         totvs-custom-element="customListItem"
                         class="tag-{{pedpagto.tag}}">
            <totvs-list-item-header>             
                <totvs-list-item-title link="#/dts/mpd/paymentciashoptransactions/detail/{{controller.getUrlEncode(pedpagto['nome-abrev'])}}/{{controller.getUrlEncode(pedpagto['nr-pedcli'])}}"
                                       title="{{pedpagto['cod-ped-compra']}}">
                </totvs-list-item-title>                             
            </totvs-list-item-header>   
            <totvs-list-item-content>
                <totvs-list-item-info class="col-lg-3 col-md-3 col-sm-3 col-xs-3"
                                      title="{{ 'Nome Abrev' | i18n }}"
                                      value="{{pedpagto['nome-abrev']}}">
                </totvs-list-item-info>
                <totvs-list-item-info class="col-lg-3 col-md-3 col-sm-3 col-xs-4"
                                      title="{{ 'Nr Pedido Cliente' | i18n }}"
                                      value="{{pedpagto['nr-pedcli']}}">
                </totvs-list-item-info>
                <totvs-list-item-info class="col-lg-3 col-md-3 col-sm-3 col-xs-3"
                                      title="{{ 'Estabelecimento' | i18n }}"
                                      value="{{pedpagto['cod-estabel']}}">
                </totvs-list-item-info>
                <totvs-list-item-info class="col-lg-3 col-md-3 col-sm-3 col-xs-3"
                                      title="{{ 'l-idi-tip-mdo' | i18n }}"
                                      value="{{pedpagto['idi-tip-mdo']}}">
                </totvs-list-item-info>
            </totvs-list-item-content>              
        </totvs-list-item>       
        <totvs-list-pagination ng-if="controller.listResult.length < controller.totalRecords && controller.listResult.length"
                               ng-click="controller.loadData(true);">
        </totvs-list-pagination>
    </totvs-page-content>    
            
</totvs-page>

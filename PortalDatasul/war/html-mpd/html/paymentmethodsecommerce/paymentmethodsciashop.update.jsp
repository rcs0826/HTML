<style>

.label-field{
	font-family: 'Arial';
	margin-bottom: 5px;
	font-weight: 200;
	font-size: 12px;
	color: gray;
}

</style>

<div class="modal-header">
	<h3 class="modal-title">{{:: 'l-rel-payment-methods' | i18n : [] : 'dts/mpd' }}</h3>
</div>

<div class="modal-body">
	<div ng-if="controller.addType" class="row">
				<field class="col-lg-4 col-md-4 col-sm-12 col-xs-12"
				type="combo"
				ng-model="controller.payMethod.model.methodId"
				ng-change="controller.selectedMethod(controller.payMethod.model.methodId, controller.estabelecimento, controller.methodType.model.typeId);"
								ng-options="metodo.numId as metodo.metodoPagamento for metodo in controller.payMethod.allPaymentMethods">
								<label>{{ 'l-payment-method' | i18n : [] : 'dts/mpd' }}</label>
						</field>
				<field class="col-lg-4 col-md-4 col-sm-12 col-xs-12"
						type="input"
						ng-model="controller.descMethodPayment"
						ng-disabled="true">
						<label>{{ 'l-descricao' | i18n : [] : 'dts/mpd' }}</label>
				</field>
				<field class="col-lg-4 col-md-4 col-sm-12 col-xs-12"
						type="input"
						ng-model="controller.groupMethodPayment"
						ng-disabled="true">
						<label>{{ 'l-group-relationship' | i18n : [] : 'dts/mpd' }}</label>
				</field>
	</div>
		<div ng-if="controller.editType" class="row">
				<field class="col-lg-4 col-md-4 col-sm-12 col-xs-12"
						type="input"
						ng-model="controller.methodPayment"
						ng-disabled="true">
						<label>{{ 'l-payment-method' | i18n : [] : 'dts/mpd' }}</label>
				</field>
				<field class="col-lg-4 col-md-4 col-sm-12 col-xs-12"
						type="input"
						ng-model="controller.descMethodPayment"
						ng-disabled="true">
						<label>{{ 'l-descricao' | i18n : [] : 'dts/mpd' }}</label>
				</field>
				<field class="col-lg-4 col-md-4 col-sm-12 col-xs-12"
						type="input"
						ng-model="controller.groupMethodPayment"
						ng-disabled="true">
						<label>{{ 'l-group-relationship' | i18n : [] : 'dts/mpd' }}</label>
				</field>
		</div>

	<div class="row" >

				<totvs-field totvs-select
						class="col-lg-8 col-md-8 col-sm-8 col-xs-8"
						label="{{:: 'l-estabel' | i18n : [] : 'dts/mpd'}}"
						ng-model="controller.estabelecimento"
						ng-disabled="controller.desabilitaEstab"
						ng-change="controller.selectedSite(controller.estabelecimento, controller.payMethod.model.methodId, controller.methodType.model.typeId)"
						select-id="cod-estabel"
						select-description="nome"
						select-service="mpd.estabelecSE.select"
						zoom-service="mpd.estabelecSE.zoom">
				</totvs-field>

				<div class="col-lg-4 col-md-4 col-sm-8 col-xs-4" style="padding-top: 30px">
					<div class="btn-group pull-left">
						 <label class="btn btn-default"><input type="checkbox" ng-disabled="controller.disableAllSites" ng-model="controller.allSites" ng-click="controller.activeAllSites(controller.allSites, controller.payMethod.model.methodId, controller.methodType.model.typeId)"  style="margin: 0px 0 0;" ><span> &nbsp; {{ 'l-all-site' | i18n }}</span></label>
					</div>
				</div>

	</div>

	<div class="row">
		<div ng-if="controller.addType">
				<field class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
						type="combo"
						ng-model="controller.methodType.model.typeId"
						ng-change="controller.selectedType(controller.methodType.model.typeId, controller.payMethod.model.methodId, controller.estabelecimento, controller.allSites);"
						ng-options="tipo.typeId as tipo.descType for tipo in controller.methodType.types">
						<label>{{ 'l-type-payment-method' | i18n : [] : 'dts/mpd' }}</label>
				</field>
		</div>
		<div ng-if="controller.editType">
				<field class="col-lg-4 col-md-4 col-sm-12 col-xs-12"
						type="input"
						ng-model="controller.descType"
						ng-disabled="true">
						<label>{{'l-type-payment-method'| i18n : [] : 'dts/mpd' }}</label>
				</field>
		</div>

		<totvs-field totvs-select
				required
				class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
				label="{{:: 'l-especie-payment-method' | i18n : [] : 'dts/mpd'}}"
				ng-model="controller.especieEMS5"
				ng-hide="controller.validTypePaymentMethod"
				select-id="cod_espec_docto"
				select-description="cod_espec_docto"
				select-service="acr.espec-docto-financ-acr.zoom"
				zoom-service="acr.espec-docto-financ-acr.zoom">
		</totvs-field>

		<totvs-field totvs-select
				required
				class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
				label="{{:: 'l-fiscal-series' | i18n : [] : 'dts/utb'}}"
				ng-model="controller.seriesEMS5"
				ng-hide="controller.validTypePaymentMethod"
				select-id="cod_ser_fisc_nota"
				select-description="des_ser_fisc_nota"
				select-service="utb.ser-fisc-nota.zoom"
				zoom-service="utb.ser-fisc-nota.zoom">
		</totvs-field>
		
		<totvs-field totvs-select
				required
				class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
				label="{{:: 'l-carrier' | i18n : [] : 'dts/utb'}}"
				ng-model="controller.portadorEMS5"
				ng-hide="controller.validKey"
				select-id="cod_portador"
				select-description="nom_abrev"
				select-init="controller.initTipoPortador"
				zoom-init="controller.initTipoPortador"
				select-service="utb.portador.zoom"
				zoom-service="utb.portador.zoom">
		</totvs-field>
							
		<totvs-field totvs-select
				required
				class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
				label="{{:: 'l-carteira-payment-method' | i18n : [] : 'dts/mpd'}}"
				ng-model="controller.carteiraEMS5"
				ng-hide="controller.validKey"
				select-id="cod_cart_bcia"
				select-description="des_cart_bcia"
				select-init="controller.initTipoCarteira"
				zoom-init="controller.initTipoCarteira"
				select-service="acr.cart-bcia.zoom"
				zoom-service="acr.cart-bcia.zoom">
		</totvs-field>
		
		<totvs-field totvs-select
				required
				return-object
				class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
				label="{{:: 'l-adm-payment-method' | i18n : [] : 'dts/mpd'}}"
				ng-model="controller.administradoraEMS5"
				ng-change="controller.filledCodBand()"
				ng-hide="controller.cardType"
				select-id="cod_admdra_cartao_cr"
				select-description="nom_abrev"	
				select-service="sco.admdra-cartao-cr.zoom"
				zoom-service="sco.admdra-cartao-cr.zoom">
		</totvs-field>

		 <field class="col-lg-12 col-md-12 col-sm-12 col-xs-12"				
				type="input"
				ng-disabled="true"
				ng-model="controller.bandeira"
				ng-hide="controller.cardType">
			<label>{{:: 'l-bandeira-payment-method' | i18n : [] : 'dts/mpd'}}</label>
		</field>

		<field  type="select2"
				data-ng-model="controller.customer"
				ng-hide="controller.validTypePaymentToCustomer"
				class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
				select-conector="{{'l-customer' | i18n}}"
				select-id="cod-emitente"
				select-description="nome-abrev"
				select-service="mpd.emitente.zoom"
				canclean>
			<zoom zoom-service="mpd.emitente.zoom"></zoom>
			<label>{{ 'l-customer' | i18n }}</label>
 		</field>

		<field  canclean type="select2"
				data-ng-model="controller.representante"
				ng-hide="controller.validKey"
				class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
				select-conector="{{'l-repres' | i18n}}"
				select-id="cod-rep"
				select-description="nome-abrev"
				select-service="mpd.repres.zoom">
			<zoom zoom-service="mpd.repres.zoom"></zoom>
			<label>{{ 'l-repres' | i18n }}</label>
 		</field>

		 <!--
		<totvs-field totvs-select
				class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
				label="{{:: 'l-condicao-pagamento' | i18n : [] : 'dts/mpd'}}"
				ng-model="controller.condicaopagamento"
				ng-hide="controller.validKey"
				select-id="cod-cond-pag"
				select-description="descricao"
				select-service="mpd.cond-pagto.zoom"
				zoom-service="mpd.cond-pagto.zoom">
		</totvs-field>
		-->
	</div>
</div>

<div class="modal-footer">
	<button type="button" class="btn btn-default" ng-click="controller.close();">{{:: 'l-cancel' | i18n : [] : 'dts/mpd'}}</button>
	<button type="button" class="btn btn-primary" ng-click="controller.confirm();" ng-disabled="controller.requireCodEstabel">{{:: 'l-save' | i18n : [] : 'dts/mpd'}}</button>
</div>
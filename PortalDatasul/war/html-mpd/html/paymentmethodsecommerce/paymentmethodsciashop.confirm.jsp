<div class="modal-header">
	<h3 class="modal-title">{{:: 'l-delete-relationship-head' | i18n : [] : 'dts/mpd' }}</h3>
</div>

<div class="modal-body">
	<div class="row">
		</div class="col-md-12">
			<p>{{:: 'l-delete-relationship-body' | i18n : [] : 'dts/mpd' }}</p>
		</div>
	</div>
</div>

<div class="modal-footer">	
	<button type="button" class="btn btn-default" ng-click="relationShipMethodsDeleteController.close();">{{ 'Cancelar' | i18n }}</button>
	<button type="button" class="btn btn-primary" ng-click="relationShipMethodsDeleteController.confirm();">{{ 'Ok' | i18n }}</button>		
</div>

define(
		[
			'index',

			'/dts/mpd/js/portal-factories.js',
			'/dts/mpd/js/mpd-factories.js'
		],
		function(index) {

			scheduleSummaryCtrl.$inject = ['$rootScope', 'salesorder.schedule.Factory', '$modal', '$timeout', '$animate', 'mpd.companyChange.Factory']
			function scheduleSummaryCtrl($rootScope, scheduleFactory, $modal, $timeout, $animate, companyChange) {

				// Busca todas as empresas vinculadas ao usuario logado | M�todo getDataCompany presente na fchdis0035api.js |
				if (companyChange.checkContextData() === false){
					companyChange.getDataCompany(true);
				};

				$timeout(function() {
					return $animate.enabled(false, angular.element("#carousel"));
				});

				var scheduleCtrl = this;
				this.summaryShow = true;
				this.listSize = 4;
				this.lateSchedules = [];
				this.todaySchedules = [];
				this.nextSchedules = [];
				this.selected = 1;


				var today = new Date();
				today.setHours(0,0,0,0);
				var itoday = today.getTime();

				this.loadData = function() {

					scheduleFactory.TOTVSQuery({}, function(data) {
						scheduleCtrl.lateSchedules = [];
						scheduleCtrl.todaySchedules = [];
						scheduleCtrl.nextSchedules = [];

						for (var i = 0; i < data.length; i++) {
							var schedule = data[i];

							var dtagenda = new Date(schedule['dat-agenda']);
							dtagenda.setHours(0,0,0,0);

														if((schedule['dat-visita'] == undefined) || (schedule['dat-visita'] == '')){
															if (dtagenda.getTime() == itoday && scheduleCtrl.todaySchedules.length < scheduleCtrl.listSize)
																	scheduleCtrl.todaySchedules.push(schedule);
															if (dtagenda.getTime() < itoday  && scheduleCtrl.lateSchedules.length < scheduleCtrl.listSize)
																	scheduleCtrl.lateSchedules.push(schedule);
															if (dtagenda.getTime() > itoday  && scheduleCtrl.nextSchedules.length < scheduleCtrl.listSize)
																	scheduleCtrl.nextSchedules.push(schedule);
							}
						}

					}, {noCountRequest: true });

				}

				this.cancelSchedule = function(schedule) {

					var modalInstance = $modal.open({
						templateUrl: '/dts/mpd/html/schedule/schedule-cancel.html',
						controller: 'salesorder.modalScheduleCancel.Controller as controller',
						size: 'lg',
						resolve: {
							modalParams: function () {
								return schedule;
							}
						}
					});

					modalInstance.result.then(
						function (result) {
							scheduleCtrl.loadData();
						}
					);
				};

				this.reschedule = function(schedule) {
					var modalInstance = $modal.open({
						templateUrl: '/dts/mpd/html/schedule/schedule-modify.html',
						controller: 'salesorder.modalScheduleModify.Controller as controller',
						size: 'lg',
						resolve: {
							modalParams: function () {
								return schedule;
							}
						}
					});

					modalInstance.result.then(
						function (result) {
							scheduleCtrl.loadData();
						}
					);
				}

			/* initialize */
			this.loadData();

			/* events */

			// busca os dados novamente quando feita a troca de empresa
			//$rootScope.$$listeners['mpd.selectCompany.event'] = [];
			$rootScope.$on("mpd.selectCompany.event", function (event, currentcompany) {
				scheduleCtrl.loadData();
			});

		}//function scheduleSummaryCtrl(loadedModules, userMessages)

		modalScheduleModifyCtrl.$inject = ['$modalInstance', 'salesorder.schedule.Factory', 'modalParams'];
		function modalScheduleModifyCtrl($modalInstance, scheduleFactory, modalParams) {
			this.item = modalParams;
			if (this.item.hasOwnProperty('$length')) {
				delete this.item.$length;
			}
			this.datAgendaBkp = new Date(modalParams['dat-agenda']).getTime();

			this.confirm = function() {
				if (this.item.hora) {
					if (this.item.hora.indexOf(':') === 1)
			 this.item.hora = "0" + this.item.hora;
					this.item.hora = this.item.hora.replace(":", "");
				}
				scheduleFactory.updateSchedule({cdnEmitente: modalParams['cdn-emitente'], datAgenda: this.datAgendaBkp},
				this.item,
						function(data) {
							$modalInstance.close();
						});
			}

			this.close = function() {
				$modalInstance.dismiss();
			}
		}

		modalScheduleCancelCtrl.$inject = ['$modalInstance', 'salesorder.schedule.Factory', 'modalParams'];
		function modalScheduleCancelCtrl($modalInstance, scheduleFactory, modalParams) {
			this.item = modalParams;
			if (this.item.hasOwnProperty('$length')) {
				delete this.item.$length;
			}
			this.confirm = function() {
				scheduleFactory.deleteSchedule({cdnEmitente: modalParams['cdn-emitente'], datAgenda: modalParams['dat-agenda']},
				function() {
					$modalInstance.close();
				});
			}

			this.close = function() {
				$modalInstance.dismiss();
			}
		}

		index.register.controller('salesorder.dashboard.scheduleSummary.Controller', scheduleSummaryCtrl);
		index.register.controller('salesorder.modalScheduleModify.Controller', modalScheduleModifyCtrl);
		index.register.controller('salesorder.modalScheduleCancel.Controller', modalScheduleCancelCtrl);

	});

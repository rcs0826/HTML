/***************************************
### MPD - Components
***************************************/
define([
	'index',
	'totvs-html-framework',
	'/dts/dts-utils/js/lodash-angular.js',
	'less!/dts/mpd/js/mpd-components/assets/css/mpdZoom.less',
	'/dts/mpd/js/api/fchdis0056.js'
], function (index) {

	'use strict';

	// ########################################################
	// ### MPD - QUICK SEARCH
	// ########################################################

	mpdZoom.$inject = ['$rootScope', '$modal', 'mpd.fchdis0056.Factory', '$timeout',];

	function mpdZoom($rootScope, $modal, fchdis0056, $timeout)  {

		var directive = {
			restrict: 'E',
			bindToController: true,
			template: '<div class="row">' +
					  '	<div class="col-md-12" style="padding-top:8px">' +
					  '		<label class="mpd-zoom-label" for="{{ngProperties.id}}" id="{{ngProperties.id}}"' +
					  ' 		 tooltip="{{ngProperties.label}}"' +
					  '          tooltip-placement="top">{{ngProperties.label}}</label>' +
					  '     <div class="input-group">' +
					  '     	<input type="hidden" autocomplete="off"'  +
					  '                class="form-control"' +
					  '				   ng-model="valueModel"' +
					  '				   placeholder="{{ngProperties.placeholder}}"' +
					  '				   fieldcode="{{ngProperties.placeholder}}"' +
					  '				   fielddescription="{{ngProperties.placeholder}}"' +
					  '				   table="{{ngProperties.placeholder}}"' +
					  '				   database="{{ngProperties.placeholder}}"' +
					  '				   name="{{ngProperties.id}}"' +
					  '				   multiselectable="{{ngProperties.multiselectable}}"' +
					  '				   id="{{ngProperties.id}}">' +
					  '     	<input type="text" autocomplete="off"'  +
					  '                class="form-control"' +
					  '				   ng-model="valueModelWithDescription"' +
					  '				   ng-change="change()"' +
					  '				   ng-blur="blur()"' +
					  '                ng-click="click($event)"' +
					  '                ng-disabled="ngProperties.zoomdisabled"' +
					  '				   placeholder="{{ngProperties.placeholder}}"' +
					  '				   fieldcode="{{ngProperties.placeholder}}"' +
					  '				   fielddescription="{{ngProperties.placeholder}}"' +
					  '				   table="{{ngProperties.placeholder}}"' +
					  '				   database="{{ngProperties.placeholder}}"' +
					  '				   name="{{ngProperties.id}}"' +
					  '				   multiselectable="{{ngProperties.multiselectable}}"' +
					  '				   id="{{ngProperties.id}}">' +
					  '     	<span class="input-group-btn">' +
					  '     		<button ng-disabled="ngProperties.zoomdisabled" tabindex="-1" class="btn btn-default" ng-if="ngProperties.canclean" ng-focus="setFocusInput()" ng-click="clearValueZoom()" type="button"><span class="glyphicon glyphicon-remove"></span></button>' +
					  '     		<button ng-disabled="ngProperties.zoomdisabled" class="btn btn-default" ng-click="openMpdZoom()" type="button"><span class="glyphicon glyphicon-search"></span></button>' +
					  '			</span>' +
					  '     </div>' +
					  ' </div>' +
					  '</div>',
			replace: true,
			scope: {
				placeholder:      		'@',
				fieldcode:        		'@',
				fieldcodelabel:   		'@',
				fielddescription: 		'@',
				table:            		'@',
				database:         		'@',
				multiselectable:  		'@',
				label:            		'@',
				canclean:         		'@',
				disabled: 				'@',
				id:              		'@',
				zoominitfield: 			'=?',
				zoominitvalue: 			'=?',
				valueModel: '=ngModel',
				ngChange: '&',
				ngBlur: '&',
				ngClick: '&',
			},
			link: function (scope, element, attrs) {

				if(scope.canclean != 'true'){
					scope.canclean = undefined;
				}

				if(scope.disabled == 'true'){
					scope.zoomdisabled = true;
				}else{
					scope.zoomdisabled = false;
				}

				if(!scope.fielddescription)
					scope.fielddescription = scope.fieldcode;


				scope.ngProperties = {
					placeholder: scope.placeholder,
					fieldcode: scope.fieldcode,
					fieldcodelabel: scope.fieldcodelabel,
					fielddescription: scope.fielddescription,
					table: scope.table,
					database: scope.database,
					label: scope.label,
					multiselectable: scope.multiselectable,
					canclean: scope.canclean,
					zoomdisabled: scope.zoomdisabled,
					id: scope.id,
					description: '',
					dataZoomDefinitions: []
				};

				scope.params = scope.ngProperties;

				//Controle para não aplicar busca de descrição se for selecionado registro pela modal do zoom
				scope.isSelected = false;

				scope.change = function(){
					scope.valueModel = scope.valueModelWithDescription;
					scope.isSelected = false;
					scope.ngChange();
				}

				scope.blur = function(){
					scope.ngBlur();
				}

				scope.click = function($event){
					$event.currentTarget.setSelectionRange(0, 999);
					scope.ngClick();
				}

				var tempEditedValue = null;
				var canReload = true;

				scope.$watch(function(scope) { return scope.valueModelWithDescription },function(newValue, oldValue) {

					if(newValue != undefined && newValue != null && newValue != "" && newValue != "?"){
						tempEditedValue = newValue;

						$timeout(function () {
							if (newValue == tempEditedValue && canReload) {
								scope.callDelay();
							}
							canReload = true;
						}, 1000);
					}
				});


				scope.callDelay = function () {
					//remove o nome do banco e da tabela separados por & no nome do campo
					var strFieldCodeZoom = scope.ngProperties.fieldcode;
					strFieldCodeZoom = strFieldCodeZoom.split('&');
					strFieldCodeZoom = strFieldCodeZoom[2];

					if(!strFieldCodeZoom){
						strFieldCodeZoom =  scope.ngProperties.fieldcode;
					}

					if(!scope.fielddescription){
						scope.fielddescription =  strFieldCodeZoom;
					}

					//Model recebe valor digitado pelo usuario (neste momento ainda sem descrição)
					//scope.valueModel = scope.valueModelWithDescription;

					if(scope.valueModel){
						fchdis0056.getZoomMpdDescriptionValue({database: scope.ngProperties.database , table: scope.ngProperties.table , fieldcode: strFieldCodeZoom , fielddescription: scope.fielddescription, valuecode: scope.valueModel}, function(result){
							canReload = false;
							if(result.zoomDescriptionValue){
								scope.ngProperties.description = result.zoomDescriptionValue;
								scope.valueModelWithDescription = scope.valueModel + ' - ' + scope.ngProperties.description;
							}
						});
					}
				};


				scope.$watch(function(scope) { return scope.valueModel },function(newValue, oldValue) {
					if(newValue != null && newValue != "" && newValue != undefined && newValue != "?"){

						if(scope.isSelected && scope.ngProperties.description){
							canReload = false;
							scope.valueModelWithDescription = newValue + ' - ' + scope.ngProperties.description;
						}else{

							//remove o nome do banco e da tabela separados por & no nome do campo
							var strFieldCodeZoom = scope.ngProperties.fieldcode;
							strFieldCodeZoom = strFieldCodeZoom.split('&');
							strFieldCodeZoom = strFieldCodeZoom[2];

							if(!strFieldCodeZoom){
								strFieldCodeZoom =  scope.ngProperties.fieldcode;
							}

							if(!scope.fielddescription){
								scope.fielddescription =  strFieldCodeZoom;
							}

							if((scope.isSelected == false) && (newValue == oldValue) && scope.valueModel){
								fchdis0056.getZoomMpdDescriptionValue({database: scope.ngProperties.database , table: scope.ngProperties.table , fieldcode: strFieldCodeZoom , fielddescription: scope.fielddescription, valuecode: scope.valueModel}, function(result){
									canReload = false;
									if(result.zoomDescriptionValue){
										scope.ngProperties.description = result.zoomDescriptionValue;
										scope.valueModelWithDescription = newValue + ' - ' + scope.ngProperties.description;
									}else{
										scope.valueModelWithDescription = newValue;
									}
								});
							}else{
								scope.valueModelWithDescription = newValue;
							}
						}
					}else{
						scope.valueModelWithDescription = newValue;
					}

				});

				scope.clearValueZoom = function(){
					scope.valueModel = "";
					scope.ngProperties.description = "";
					scope.valueModelWithDescription = "";
				}

				scope.setFocusInput = function(){
					element[0].children[0].children[1].children[1].focus();
				}

				scope.openMpdZoom = function () {

					//remove o nome do banco e da tabela separados por & no nome do campo
					var strFieldCodeZoom = scope.ngProperties.fieldcode;
					strFieldCodeZoom = strFieldCodeZoom.split('&');
					strFieldCodeZoom = strFieldCodeZoom[2];

					if(!strFieldCodeZoom){
						strFieldCodeZoom =  scope.ngProperties.fieldcode;
					}

					var labelDescriptionField = "";

					if(scope.ngProperties.fieldcode == (scope.ngProperties.database + "&regra-sugest-nat&nat-export"))
						scope.ngProperties.fieldcode = scope.ngProperties.database + "&regra-sugest-nat&nat-exportacao";

					if(scope.ngProperties.fieldcode == (scope.ngProperties.database + "&classif-fisc&class-fiscal"))
						scope.ngProperties.fieldcode = scope.ngProperties.database + "&classif-fisc&classfiscal";

					if(!scope.fielddescription){
						//scope.fielddescription =  strFieldCodeZoom;

						scope.params.dataZoomDefinitions = [{
																"nom_campo": scope.ngProperties.fieldcode,
																"des_label_campo": scope.ngProperties.fieldcodelabel,
																"largura_campo": "793"
															}];

					}else{
						labelDescriptionField = "Complemento (" + scope.fielddescription + ")";

						scope.params.dataZoomDefinitions = [{
																"nom_campo": scope.ngProperties.fieldcode,
																"des_label_campo": scope.ngProperties.fieldcodelabel,
																"largura_campo": "200"
															},
															{
																"nom_campo": scope.ngProperties.fielddescription,
																"des_label_campo": labelDescriptionField,
																"largura_campo": "593"
															}];
					}

					var modaloptions = {
						controller: 'mpd.mpdzoom.controller as controller',
						size: 'lg',
						templateUrl: '/dts/mpd/js/mpd-components/template/mpdZoom.html',
						scope: scope,
						backdrop: 'static',
						resolve: {
							parameters: function() {
								return scope.params;
							},
							zoomoptions: function () {
								return attrs.zoomService;
							},
							zoomcallback: function () {
								return scope.selectedItemFn;
							},
							zoominit: function () {
								return scope.zoomInitFn;
							},
							zoomid: function () {
								return attrs.zoomId;
							},
							zoommultiple: function () {
								return attrs.hasOwnProperty('zoomMultiple');
							},
							zoomalertmessage: function () {
								return attrs.zoomAlertMessage;
							}
						}
					};

					scope.zoominstance = $modal.open(modaloptions);

					scope.zoominstance.result.then(function (selectedInMpdZoom) {

						scope.selectedInMpdZoom = angular.copy(selectedInMpdZoom);

						scope.isSelected = scope.selectedInMpdZoom['zoomSelected'];

						if(scope.ngProperties.fieldcode == (scope.ngProperties.database + "&regra-sugest-nat&nat-exportacao")){
							scope.valueModel = scope.selectedInMpdZoom['mpdZoomSelectedValues'][0][scope.ngProperties.database + "&regra-sugest-nat&nat-exportacao"];
						}else{
							if(scope.ngProperties.fieldcode == (scope.ngProperties.database + "&classif-fisc&classfiscal")){
								scope.valueModel = scope.selectedInMpdZoom['mpdZoomSelectedValues'][0][scope.ngProperties.database + "&classif-fisc&classfiscal"];
							}else{
								scope.valueModel = scope.selectedInMpdZoom['mpdZoomSelectedValues'][0][scope.fieldcode];
							}
						}

						scope.ngProperties.description = scope.selectedInMpdZoom['mpdZoomSelectedValues'][0][scope.fielddescription];

						scope.setFocusInput();
					});
				};

			}
		}

		return directive;
	}

	index.register.directive('mpdZoom', mpdZoom);


	function mpdListItemAction() {
        return {
            restrict: "E",
            compile: function(e, t) {
                var n, a, i, o, r, l, s, c, d, u = "",
                    p = "",
                    f = "",
                    g = "";
                i = e.children("action").clone() || [], t.$attr.class ? (t.class.indexOf("col-xs") < 0 && (u += " col-xs-2"), t.class.indexOf("col-sm") < 0 && (u += " col-sm-5"), t.class.indexOf("col-md") < 0 && (u += " col-md-5"), t.class.indexOf("col-lg") < 0 && (u += " col-lg-5"), e.removeAttr("class"), u += " " + t.class) : u += "col-lg-5 col-md-5 col-sm-5 col-xs-2";
                if (e.html('<div class="' + u + ' actions-group"><div class="btn-group-sm actions pull-right" role="group" aria-label="item-actions"></div></div>'), s = function(t, e, n) {
                        var a, i, o, r;
                        a = e.attr("class"), i = e.attr("icon"), o = e.attr("link"), r = e.attr("ng-click"), o ? t.attr("href", o) : r && (t.addClass("clickable"), t.attr("ng-click", r)), a && t.addClass(a), i && n && t.children(".glyphicon").addClass(i), n ? t.append("&nbsp;&nbsp;" + e.text()) : t.append(e.text()), angular.forEach($(e).get(0).attributes, function(e) {
                            "link" !== e.name && "class" !== e.name && "ng-click" !== e.name && "icon" !== e.name && t.attr(e.name, e.value)
                        })
                    }, 1 === i.length) r = angular.element('<a role="button" class="btn btn-default"><span class="glyphicon "></span></a>'), s(r, angular.element(i[0]), !0), e.find(".actions").append(r);
                else {
                    for (o = angular.element('<div class="btn-group-sm pull-right" role="group"><a class="btn btn-default dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><span>{{\'mpd-btn-actions\'|i18n}}&nbsp;&nbsp;</span><span class="glyphicon glyphicon-triangle-bottom"></span></a><ul class="dropdown-menu dropdown-menu-right" role="menu"></ul></div>'), angular.isUndefined(t.limitPrimaryAction) && (t.limitPrimaryAction = 2), t.limitPrimaryAction = parseInt(t.limitPrimaryAction, 10), c = o.find("ul"), d = t.limitPrimaryAction + 1 >= i.length, n = 0; n < i.length; n++) a = angular.element(i[n]), r = angular.element('<a role="button" class="btn btn-default hidden-xs" style="margin-right: 5px !important"><span class="glyphicon"></span></a>'), (d || n < t.limitPrimaryAction) && (s(r, a, !0), e.find(".actions").append(r)), l = angular.element("<li><a></a></li>"), s(l.children("a"), a, !1), l.children("a").removeClass(a.attr("class")), n < t.limitPrimaryAction ? l.addClass("visible-xs") : (a.attr("ng-if") ? 0 < p.length ? p += " || (" + a.attr("ng-if") + ")" : p = "(" + a.attr("ng-if") + ")" : p = "(true)", a.attr("ng-show") ? 0 < f.length ? f += " || (" + a.attr("ng-show") + ")" : f = "(" + a.attr("ng-show") + ")" : f = "(true)", a.attr("ng-hide") ? 0 < g.length ? g += " || (" + a.attr("ng-hide") + ")" : g = "(" + a.attr("ng-hide") + ")" : g = "(false)"), c.append(l);
                    p && 0 < p.length && o.attr("ng-if", p), f && 0 < f.length && o.attr("ng-show", f), g && 0 < g.length && o.attr("ng-hide", g), d && o.addClass("visible-xs"), e.find(".actions-group > .actions").append(o)
                }
            }
        }
    }

	index.register.directive('mpdListItemAction', mpdListItemAction);

	/**
	* @name zoomController
	* @object controller
	*/
	mpdZoomController.$inject = [
		'$modalInstance', 'parameters' , '$scope', '$rootScope', '$filter', '$q', '$http', 'mpd.mpdfilterhelper.helper',  'mpd.fchdis0056.Factory', 'TOTVSEvent'
	];

	function mpdZoomController(
		$modalInstance, parameters , $scope, $rootScope, $filter, $q, $http, helper, fchdis0056, TOTVSEvent) {

		var vm = this;
		var i18nFilter = $filter('i18n');

		vm.zoomName = parameters['fieldcodelabel'];
		vm.mpdZoomDataDef = [];
		vm.disclaimers = [];
		vm.mpdZoomDataListCount = 0;

		/**
		 * Seleciona registro
		 * @return object
		 */
		vm.select = function(selectButton){

			if((vm.multiDataSelectedZoomMpd.length < 1) && (selectButton)){
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
				   title: $rootScope.i18n('l-warning'),
				   detail: $rootScope.i18n('Selecione um registro na grade.')
			   });
			}else{
				vm.isSelected = true;

				$modalInstance.close({
					mpdZoomSelectedValues: vm.multiDataSelectedZoomMpd,
					zoomSelected: vm.isSelected
				});
			}
		}

		vm.changeTypeSearch = function(){

			vm.disclaimers.forEach(function(tag) {
				var index = tag.property.indexOf('searchBy');
				if (index >= 0) {
					vm.disclaimers.splice(vm.disclaimers.indexOf(tag), 1);
				}
			});

			vm.disclaimers.push(helper.addFilter("searchBy", vm.selectedOptionSearch , ''));
		}

		//Realiza pesquisa simples por tipo de operação de vendas e natureza de operação
		vm.applySimpleFilter = function(){

			if(vm.searchTerm && vm.searchTerm.trim().length > 0){
				vm.disclaimers.forEach(function(tag) {
					var index = tag.property.indexOf('simpleFilterMpdZoom');
					if (index >= 0) {
						vm.disclaimers.splice(vm.disclaimers.indexOf(tag), 1);
					}
				});

				vm.disclaimers.push(helper.addFilter("simpleFilterMpdZoom", vm.searchTerm , 'Filtro Simples'));
			}else{
				vm.disclaimers.forEach(function(tag) {
					var index = tag.property.indexOf('simpleFilterMpdZoom');
					if (index >= 0) {
						vm.disclaimers.splice(vm.disclaimers.indexOf(tag), 1);
					}
				});
			}

			vm.getMpdZoomData();
		}

		/**
		 * Fecha a modal
		 * @return {}
		 */
		vm.close = function close() {
			$modalInstance.dismiss();
		};


		vm.cleanValue = function(value){
			value = '';
		}


		vm.setFocusInputSearch = function(){
			var elementSearch = document.getElementById('mpd-zoom-search-input');
			var angularEl = angular.element(elementSearch);
			angularEl.focus();
		}


		vm.setSearchOnApply = function(){


		}


		//Definição da grade dinamica para zoom
		vm.getGridOptions = function() {
			vm.deferredZoomMpd = $q.defer();
			vm.getzoomMpdFields();
			return vm.deferredZoomMpd.promise;
		}


		//Retorna a definição dos campos do zoom
		vm.getzoomMpdFields = function(){

				vm.mpdZoomDataDef = parameters.dataZoomDefinitions;

				vm.columnsGridZoomMpd = [];

				angular.forEach(vm.mpdZoomDataDef, function(field, key) {

					var fieldWidth = parseInt(field['largura_campo']);

					vm.columnsGridZoomMpd.push({field: field['nom_campo'], title: field['des_label_campo'], width: fieldWidth, editable:false});
				});

				vm.selectedOptionSearch = vm.mpdZoomDataDef[0]['nom_campo'];

				vm.disclaimers.push(helper.addFilter("databaseMpdZoom", parameters.database , ''));
				vm.disclaimers.push(helper.addFilter("tableMpdZoom", parameters.table , ''));
				vm.disclaimers.push(helper.addFilter("fieldMpdZoom", parameters.fieldcode , ''));
				vm.disclaimers.push(helper.addFilter("descriptionFieldMpdZoom", parameters.fielddescription , ''));
				vm.disclaimers.push(helper.addFilter("searchBy", vm.selectedOptionSearch , ''));

				if($scope.zoominitfield && $scope.zoominitvalue){
					vm.disclaimers.push(helper.addFilter("zoominitfield", $scope.zoominitfield , ''));
					vm.disclaimers.push(helper.addFilter("zoominitvalue", $scope.zoominitvalue , ''));
				}


				if(parameters['multiselectable'] == true){
					vm.selectType = 'multiple';
				}else{
					vm.selectType = 'single';
				}

				vm.optsGridRules = {
					reorderable: true,
					sortable: true,
					selectable: vm.selectType,
					columns: angular.copy(vm.columnsGridZoomMpd)
				};

				//Atualiza a definição das colunas do grid
				vm.deferredZoomMpd.resolve(vm.optsGridRules);

				//Retorna dados para o zoom
				//vm.getMpdZoomData();

		}


		vm.getMpdZoomData = function(isMore) {

			var options, filters = [];

			vm.mpdZoomDataListCount = 0;
			if (!isMore) {
				vm.mpdZoomData = [];
			}

			//Configurações de registros por página (botão carregar mais)
			options = {
				start: vm.mpdZoomData.length,
				max: 10
			};

			// Parâmetros de pesquisa e paginção para a API
			angular.extend(options, helper.parseDisclaimersToParameters(vm.disclaimers));

			//Serviço para retornar os dados da grade do zoom para interface (fch/fchdis/fchdis0056.p)
			fchdis0056.getZoomMpdData(options, function(result) {

				//Total de registros na grade do zoom
				if (result && result[0] && result[0].hasOwnProperty('$length')) {
					vm.mpdZoomDataListCount = result[0].$length;
				}

				angular.forEach(result, function(mpdDataZoom, key) {

					var strMpdDataZom = '{"' + mpdDataZoom['nom_campo'] + '":"' + vm.getUrlEncode(mpdDataZoom['valor_campo']) + '","' + mpdDataZoom['nom_campo_desc'] + '":"' + vm.getUrlEncode(mpdDataZoom['valor_campo_desc']) +  '"}';

					var jsonAux = JSON.parse(strMpdDataZom);

					jsonAux[mpdDataZoom['nom_campo']] = vm.getUrldecode(jsonAux[mpdDataZoom['nom_campo']]);
					jsonAux[mpdDataZoom['nom_campo_desc']] = vm.getUrldecode(jsonAux[mpdDataZoom['nom_campo_desc']])

					vm.mpdZoomData.push(jsonAux);

				});

			});

		}


		vm.getUrlEncode = function(value) {

			if(value != true || value != false){
				value = window.encodeURIComponent(value);
				value = vm.replaceAllString(value, '.', '%2E');
			}

			return value;
		};

		vm.getUrldecode = function(value) {

			if(value != true || value != false){
				value = window.decodeURIComponent(value);
				value = vm.replaceAllString(value, '%2E', '.');
			}

			return value;
		};


		vm.replaceAllString = function(str, find, replace) {
			return str.replace(find, replace);
		}

		//Definição do zoom
		vm.gridOptionsZoomMpd = vm.getGridOptions;
	}

	index.register.controller('mpd.mpdzoom.controller', mpdZoomController);


	// *************************************************************************************
	// *** HELPER
	// *************************************************************************************
	mpdFilterHelper.$inject = ['$filter'];
	function mpdFilterHelper($filter) {
		return {
			/**
			 * Cria um filtro (padrão de um disclaimer).
			 * @param {string} property property do disclaimer
			 * @param {string} value    valor do campo
			 * @param {string} title    título do disclaimer
			 * @param {string} type     tipo de campo (string, boolean, date). default: string
			 * @param {boolean} hide    identifica se o disclaimer deve ficar escondido
			 * @return {Object}         Retorna um disclaimer
			 */
			addFilter: function(property, value, title, type, hide) {
				var filter = {
					'property': property,
					'value': value,
					'type': type ? type : 'string',
					'hide': hide === true
				};

				switch (type) {
					case 'date':
						filter.title = title + ': ' + $filter('date')(value, 'shortDate');
						break;
					case 'boolean':
						filter.title = title;
						break;
					default:
						filter.title = title + ': ' + value;
						break;
				}
				return filter;
			},
			/**
			 * Converte os disclaimers para um objeto contendo os respectivos valores.
			 * @param  {Array}  disclaimers Disclaimers que serão convertidos
			 * @return {Object} Objeto contendo os disclaimers convertidos da seguinte forma: object[disclaimer.property] = disclaimer.value
			 */
			parseDisclaimersToFilter: function(disclaimers) {
				disclaimers = disclaimers || [];
				var filters = {};
				disclaimers.forEach(function(disclaimer) {
					filters[disclaimer.property] = disclaimer.value;
				});
				return filters;
			},
			/**
			 * Transforma os disclaimers em parâmetros para a API
			 * @param  {Array}  disclaimers Disclaimers que serão convertidos em filtros para a API
			 * @return {Object} filtros para a API
			 */
			parseDisclaimersToParameters: function(disclaimers) {
				disclaimers = disclaimers || [];
				var options = {
					properties: [],
					values: []
				};
				disclaimers.forEach(function(filter) {
					if (filter.property) {
						options.properties.push(filter.property);
						switch (filter.type) {
							case 'date':
								options.values.push($filter('date')(filter.value, 'shortDate'));
								break;
							default:
								options.values.push(filter.value);
								break;
						}
					}
				});
				return options;
			}
		};
	}

	index.register.service('mpd.mpdfilterhelper.helper', mpdFilterHelper);

});




/*globals index, define, angular, CRMURL, CRMRestService*/
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factory;

	factory = function ($totvsresource, factoryGeneric, factoryGenericCreateUpdate, $cacheFactory,
						 factoryGenericDetail, factoryGenericDelete, factoryGenericZoom) {

		var factory = $totvsresource.REST(CRMRestService + '1076/:method/:id/:strategy/:goal/:phase/:user/:transition',
										  undefined, factoryGenericCreateUpdate.customActions),
			cache = $cacheFactory('crm.strategy.Cache');

		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericDetail);
		angular.extend(factory, factoryGenericDelete);
		angular.extend(factory, factoryGenericCreateUpdate);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			options.orderBy	= ['num_id'];
			options.asc		= [true];

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		// ESTRATEGIA > FASE
		factory.addStrategyPhase = function (idStrategy, model, callback) {
			return this.DTSPost({ method: 'phase', strategy: idStrategy }, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.updateStrategyPhase = function (idStrategy, idPhase, model, callback) {
			return this.DTSPut({
				method: 'phase',
				strategy: idStrategy,
				phase: idPhase
			}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.deleteStrategyPhase = function (idPhase, callback) {
			return this.TOTVSRemove({ method: 'phase', phase: idPhase }, callback);
		};

		factory.reorderStrategyPhases = function (idPhases, callback) {
			return this.TOTVSUpdate({ method: 'phase_order', phases: idPhases }, { method: 'phase_order' }, callback);
		};

		// ESTRATEGIA > TRANSIÇÃO
		factory.addStrategyTransition = function (idStrategy, model, callback) {
			return this.DTSPost({ method: 'transition', strategy: idStrategy }, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.updateStrategyTransition = function (idStrategy, idTransition, model, callback) {
			return this.DTSPut({
				method: 'transition',
				strategy: idStrategy,
				transition: idTransition
			}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.deleteStrategyTransition = function (idTransition, callback) {
			return this.TOTVSRemove({ method: 'transition', transition: idTransition }, callback);
		};

		// ESTRATEGIA > META
		factory.addStrategyGoal = function (idStrategy, model, callback) {
			return this.DTSPost({ method: 'goal', strategy: idStrategy }, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.updateStrategyGoal = function (idStrategy, idGoal, model, callback) {
			return this.DTSPut({
				method: 'goal',
				strategy: idStrategy,
				goal: idGoal
			}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.deleteStrategyGoal = function (idGoal, callback) {
			return this.TOTVSRemove({ method: 'goal', goal: idGoal }, callback);
		};

		// ESTRATEGIA > META > FASE
		factory.addStrategyGoalPhase = function (idGoal, model, callback) {
			return this.DTSPost({ method: 'goal_phase', goal: idGoal }, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.updateStrategyGoalPhase = function (idGoal, idGoalPhase, model, callback) {
			return this.DTSPut({
				method: 'goal_phase',
				goal: idGoal,
				phase: idGoalPhase
			}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.deleteStrategyGoalPhase = function (idGoalPhase, callback) {
			return this.TOTVSRemove({ method: 'goal_phase', phase: idGoalPhase }, callback);
		};

		// ESTRATEGIA > META > FASE > USUARIO
		factory.addStrategyGoalPhaseUser = function (idGoalPhase, model, callback) {
			return this.DTSPost({ method: 'goal_phase_user', phase: idGoalPhase }, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.updateStrategyGoalPhaseUser = function (idGoalPhase, idGoalPhaseUser, model, callback) {
			return this.DTSPut({
				method: 'goal_phase_user',
				phase: idGoalPhase,
				user: idGoalPhaseUser
			}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.deleteStrategyGoalPhaseUser = function (idGoalPhaseUser, callback) {
			return this.TOTVSRemove({ method: 'goal_phase_user', user: idGoalPhaseUser }, callback);
		};

		factory.getPhasesOmitted = function (strategyId, callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'phasesOmitted-' + (strategyId || 'none'),
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'phasesomitted', strategy: strategyId}, function (data) {
					if (data) { data.reverse(); }
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		return factory;
	};

	factory.$inject = [
		'$totvsresource', 'crm.generic.factory', 'crm.generic.create.update.factory', '$cacheFactory',
		'crm.generic.detail.factory', 'crm.generic.delete.factory', 'crm.generic.zoom.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_estrateg_vda.factory', factory);

});

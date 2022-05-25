/*jslint node: true */
/*jslint plusplus: true*/
'use strict';

// ***************************************
// *** Portal CRM - Utils
// ***************************************

var CRMEvent, CRMRestService, HIERRestService, CRMURL, CRMUtil;

// Eventos
CRMEvent = {

	scopeSaveAccount : 'event:scope:save.crm.account',
	scopeLoadAccount : 'event:scope:load.crm.account',

	scopeSaveCampaign : 'event:scope:save.crm.campaign',
	scopeLoadCampaign : 'event:scope:load.crm.campaign',

	scopeSaveTask : 'event:scope:save.crm.task',
	scopeLoadTask : 'event:scope:load.crm.task',
	scopeLoadTaskIsChild: 'event:scope:load.crm.task.child',
	scopeSaveNextTask : 'event:scope:save.next.crm.task',
	scopeChangeTask : 'event:scope:change.crm.task',

	scopeSaveHistory : 'event:scope:save.crm.history',
	scopeLoadHistory : 'event:scope:load.crm.history',
	scopeSaveHistoryOnExecuteTask : 'event:scope:save.on-execute-task.crm.history',
	scopeSaveHistoryOnEditTask : 'event:scope:save.on-edit-task.crm.history',
	scopeSaveHistoryOnChangeTicketStatus : 'event:scope:save.on-change-ticket-status.crm.history',
	scopeSaveHistoryOnPersistTicket : 'event:scope:save.on-persist-ticket.crm.history',
	scopeSaveHistoryOpportunity : 'event:scope:save.opportunity.crm.history',
	scopeChangeHistory : 'event:scope:change.crm.history',

	scopeSaveOpportunity : 'event:scope:save.crm.opportunity',
	scopeLoadOpportunity : 'event:scope:load.crm.opportunity',
	scopeSaveOpportunityGainLoss : 'event:scope:save.crm.opportunity-gain-loss',
	scopeSaveOpportunityProduct : 'event:scope:save.crm.opportunity-product',
	scopeSaveOpportunitySalesOrder : 'event:scope:save.crm.opportunity-sales-order',
	scopeSaveOpportunityContact : 'event:scope:save.crm.opportunity-contact',

	scopeSaveTicket : 'event:scope:save.crm.ticket',
	scopeLoadTicket : 'event:scope:load.crm.ticket',

	scopeSaveTicketType : 'event:scope:save.crm.ticket-type',
	scopeLoadTicketType : 'event:scope:load.crm.ticket-type',
	scopeSaveSubject    : 'event:scope:save.crm.subject',
	scopeLoadSubject    : 'event:scope:load.crm.subject',

	scopeSaveAccessRestriction : 'event:scope:save.crm.access-restriction',
	scopeLoadAccessRestriction : 'event:scope:load.crm.access-restriction',

	scopeUploadAttachment : 'event:scope:reload.crm.attachment',

	scopeSaveReport : 'event:scope:save.crm.report',
	scopeLoadReport : 'event:scope:load.crm.report',

	scopeDeleteAccountRemoveProcess: 'event:scope:delete.crm.account-remove-process',
	scopeDeleteAttachmentRemoveProcess: 'event:scope:delete.crm.attachment-remove-process',
	scopeDeleteCampaignRemoveProcess: 'event:scope:delete.crm.campaign-remove-process',
	scopeDeleteTargetRemoveProcess: 'event:scope:delete.crm.target-remove-process',
	scopeDeleteHistoryRemoveProcess: 'event:scope:delete.crm.history-remove-process',
	scopeDeleteOpportunityRemoveProcess: 'event:scope:delete.crm.opportunity-remove-process',
	scopeDeleteSegmentationRemoveProcess: 'event:scope:delete.crm.segmentation-remove-process',
	scopeDeleteTaskRemoveProcess: 'event:scope:delete.crm.task-remove-process',
	scopeDeleteTicketRemoveProcess: 'event:scope:delete.crm.ticket-remove-process',

	scopeSaveScript : 'event:scope:save.crm.script',
	scopeLoadScript : 'event:scope:load.crm.script',

	scopeSaveExpense : 'event:scope:save.crm.expense',

	scopeFileSelectAddUpdOpportunity : 'event:scope:fileselect.crm.opportunity',
	scopeFileSelectAddUpdTask : 'event:scope:fileselect.crm.task',
	scopeFileSelectAddUpdHistory : 'event:scope:fileselect.crm.history',
	scopeFileSelectAddUpdTicket : 'event:scope:fileselect.crm.ticket',

	scopeCancelOpenQuotationAndOrderForOpportunity : 'event:scope:save.crm.opportunity-sales-order-cancel',

	scopeLoadTicketFlowStatus : 'event:scope:load.crm.ticket.flow.status',
};

// Servicos
CRMRestService = '/dts/datasul-rest/resources/api/fch/fchcrm/fchcrm';
HIERRestService = '/dts/datasul-rest/resources/api/fch/fchhub/fchhub';

CRMURL = {

	taskService					:	CRMRestService + '1000/',
	campaignService				:	CRMRestService + '1001/',
	userService					:	CRMRestService + '1002/',
	accountService				:	CRMRestService + '1003/',
	preferenceService			:	CRMRestService + '1004/',
	historyService				:	CRMRestService + '1005/',
	ticketService				:	CRMRestService + '1006/',
	opportunityService			:	CRMRestService + '1007/',
	postalcodeService			:	CRMRestService + '1008/',
	attachmentService			:	CRMRestService + '1009/',
	uploadService				:	CRMRestService + '1009/upload/?',
	downloadService				:	CRMRestService + '1009/download/',
	countryService				:	CRMRestService + '1010/',
	federationService			:	CRMRestService + '1011/',
	cityService					:	CRMRestService + '1012/',
	neighborhoodService			:	CRMRestService + '1013/',
	representativeService		:	CRMRestService + '1014/',
	accountRatingService		:	CRMRestService + '1015/',
	sourceService				:	CRMRestService + '1016/',
	regionService				:	CRMRestService + '1017/',
	clientTypeService			:	CRMRestService + '1018/',
	productService				:	CRMRestService + '1019/',
	priceTableService			:	CRMRestService + '1020/',
	tagService					:	CRMRestService + '1021/',
	symptomsService				:	CRMRestService + '1022/',
	styleService				:	CRMRestService + '1023/',
	phoneTypeService			:	CRMRestService + '1024/',
	potentialGroupService		:	CRMRestService + '1025/',
	potentialSubgroupService	:	CRMRestService + '1026/',
	potentialService			:	CRMRestService + '1027/',
	referenceService			:	CRMRestService + '1028/',
	gainLossService				:	CRMRestService + '1029/',
	strongWeakService			:	CRMRestService + '1030/',
	ticketSubjectService		:	CRMRestService + '1031/',
	ticketTypeService			:	CRMRestService + '1032/',
	ticketRatingService			:	CRMRestService + '1033/',
	ticketPriorityService		:	CRMRestService + '1034/',
	ticketOriginService			:	CRMRestService + '1035/',
	ticketFlowService			:	CRMRestService + '1036/',
	clientGroupService			:	CRMRestService + '1037/',
	timeService					:	CRMRestService + '1038/',
	carrierService				:	CRMRestService + '1039/',
	bearerService				:	CRMRestService + '1040/',
	paymentConditionService		:	CRMRestService + '1041/',
	bondTypeService				:	CRMRestService + '1042/',
	departmentService			:	CRMRestService + '1043/',
	decisionLevelService		:	CRMRestService + '1044/',
	accessRestrictionService	:	CRMRestService + '1045/',
	userGroupService			:	CRMRestService + '1046/',
	currencyService				:	CRMRestService + '1047/',
	rangePrfvService			:	CRMRestService + '1048/',
	cfopService                 :	CRMRestService + '1049/',
	emailService                :   CRMRestService + '1050/',
	reportService               :   CRMRestService + '1051/',
	propertiesService           :   CRMRestService + '1052/',
	infoService					:   CRMRestService + '1053/',
	targetService               :   CRMRestService + '1054/',
	segmentationService         :   CRMRestService + '1056/',
	facilitService				:   CRMRestService + '1057/',
	removeProcessService		:   CRMRestService + '1058/',
	//classificationService       :   CRMRestService + '1059/',
	documentTypeService         :   CRMRestService + '1059/',
	layoutService		        :   CRMRestService + '1060/',
	templateService		        :   CRMRestService + '1061/',
	dataSegmentationService		:   CRMRestService + '1062/',
	documentService				:   CRMRestService + '1063/',
	educationalLevelService		:   CRMRestService + '1064/',
	treatmentService			:   CRMRestService + '1065/',
	activityLineService			:   CRMRestService + '1066/',
	maritalStatusService		:   CRMRestService + '1067/',
	scriptService				:   CRMRestService + '1068/',
	loadDataService				:   CRMRestService + '1099/',
};

CRMUtil = {

	/**
	 * @name CRMUtil.isDefined
	 * @kind function
	 *
	 * @description
	 * Determines if a reference is defined.
	 *
	 * @param {*} value reference to check.
	 * @returns {boolean} true if 'value' is defined and not null.
	 */
	isDefined: function (value) {
		return (typeof value !== 'undefined') && (value !== null) && (value !== 'null');
	},

	/**
	 * @name CRMUtil.isUndefined
	 * @kind function
	 *
	 * @description
	 * Determines if a reference is undefined.
	 *
	 * @param {*} value reference to check.
	 * @returns {boolean} true if 'value' is undefined or null.
	 */
	isUndefined: function (value) {
		return (typeof value === 'undefined') || (value === null) || (value === 'null');
	}

};

/**
 * @name Array.prototype.move
 * @kind function
 *
 * @description
 * Change the position of the element inside an array.
 *
 * @param {integer} $from position of the element.
 * @param {integer} $to position of the element.
 * @returns {Array} the array itself.
 */
Array.prototype.move = function ($from, $to) {

	while ($from < 0) {
		$from += this.length;
	}

	while ($to < 0) {
		$to += this.length;
	}

	if ($to >= this.length) {
		var k = $to - this.length;
		while ((k--) + 1) {
			this.push(undefined);
		}
	}

	this.splice($to, 0, this.splice($from, 1)[0]);
};

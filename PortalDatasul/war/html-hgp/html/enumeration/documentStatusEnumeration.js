var DOCUMENT_STATUS_ENUM = {

    GLOSS_PENDING_ANALYSIS : 1,
    PENDING_RELEASE        : 2,
    RELEASED		   : 3,
    PAID		   : 4,
    INVOICED		   : 5,
    PAID_AND_INVOICED      : 6,
    CANCELLED              : 7
};

/* ENUMERATION_VALUES */
DOCUMENT_STATUS_ENUM.ENUMERATION_VALUES = [
    {data:DOCUMENT_STATUS_ENUM.GLOSS_PENDING_ANALYSIS, label:"Pendente Análise de Glosa"},
    {data:DOCUMENT_STATUS_ENUM.PENDING_RELEASE       , label:"Pendente Liberação"},
    {data:DOCUMENT_STATUS_ENUM.RELEASED              , label:"Liberado"},
    {data:DOCUMENT_STATUS_ENUM.PAID                  , label:"Pago"},
    {data:DOCUMENT_STATUS_ENUM.INVOICED              , label:"Faturado"},
    {data:DOCUMENT_STATUS_ENUM.PAID_AND_INVOICED     , label:"Pago e Faturado"},
    {data:DOCUMENT_STATUS_ENUM.CANCELLED             , label:"Cancelado"}
];

DOCUMENT_STATUS_ENUM.VALUES_WITH_ALL_OPTION = [{data:0, label: 'Todos'}].concat(DOCUMENT_STATUS_ENUM.ENUMERATION_VALUES);

//extende AbstractEnumeration para obter algumas funcoes genericas, como getLabelByKey e getIndexByKey
define(['/dts/hgp/html/js/global/enumeration/AbstractEnumeration.js'],function(){
	$.extend( DOCUMENT_STATUS_ENUM, AbstractEnumeration );
});

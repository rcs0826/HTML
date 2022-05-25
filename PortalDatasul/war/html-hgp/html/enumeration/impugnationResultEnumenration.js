var IMPUGNATION_RESULT_ENUM = {
    DEFERIDO                :1,
    PARCIALMENTE_DEFERIDO   :2,
    INDEFERIDO              :3,
};


/* ENUMERATION_VALUES */
IMPUGNATION_RESULT_ENUM.ENUMERATION_VALUES = [
    {data:IMPUGNATION_RESULT_ENUM.DEFERIDO                          , label:"Deferido"},
    {data:IMPUGNATION_RESULT_ENUM.PARCIALMENTE_DEFERIDO             , label:"Parcialmente Deferido"},
    {data:IMPUGNATION_RESULT_ENUM.INDEFERIDO                        , label:"Indeferido"}
];

//extende AbstractEnumeration para obter algumas funcoes genericas, como getLabelByKey e getIndexByKey
define(['/dts/hgp/html/js/global/enumeration/AbstractEnumeration.js'],function(){
	$.extend( IMPUGNATION_RESULT_ENUM, AbstractEnumeration );
});
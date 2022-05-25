var DISEASE_TYPE_ENUM = {

	CHRONIC     : 'C',
	ACUTE       : 'A',
	UNINFORMED  : 'N'
};

/* ENUMERATION_VALUES */
DISEASE_TYPE_ENUM.ENUMERATION_VALUES = [
    {data:DISEASE_TYPE_ENUM.CHRONIC     , label:"C - Crônica"},
    {data:DISEASE_TYPE_ENUM.ACUTE       , label:"A - Aguda"},
    {data:DISEASE_TYPE_ENUM.UNINFORMED  , label:"N - Não Informado"}
];

//extende AbstractEnumeration para obter algumas funcoes genericas, como getLabelByKey e getIndexByKey
define(['/dts/hgp/html/js/global/enumeration/AbstractEnumeration.js'],function(){
    $.extend( DISEASE_TYPE_ENUM, AbstractEnumeration );
});

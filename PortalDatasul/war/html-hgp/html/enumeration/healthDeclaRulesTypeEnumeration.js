var HEALTH_DECLA_RULES_STATUS_ENUM = {
	ACESSO_EMPRESARIAL : 1,
	TOTVS        	   : 2,
	AMBOS  			   : 3
};

/* ENUMERATION_VALUES */
HEALTH_DECLA_RULES_STATUS_ENUM.ENUMERATION_VALUES = [
    {data:HEALTH_DECLA_RULES_STATUS_ENUM.ACESSO_EMPRESARIAL     , label:"Acesso Empresarial"},
    {data:HEALTH_DECLA_RULES_STATUS_ENUM.TOTVS     			    , label:"Produto Padrão"},
    {data:HEALTH_DECLA_RULES_STATUS_ENUM.AMBOS  		        , label:"Ambos"}
];

//extende AbstractEnumeration para obter algumas funcoes genericas, como getLabelByKey e getIndexByKey
define(['/dts/hgp/html/js/global/enumeration/AbstractEnumeration.js'],function(){
    $.extend( HEALTH_DECLA_RULES_STATUS_ENUM, AbstractEnumeration );
});

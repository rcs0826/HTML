var IRRF_INDEX_ENUM = {

    PRINCIPAL_ACCREDITED_ACTS   : 1, //Atos Credenciados Principais
    AUXILIARIES_ACCREDITED_ACTS : 2, //Atos Credenciados Auxiliares
    BOTH                        : 3  //Ambos

};

/* ENUMERATION_VALUES */
IRRF_INDEX_ENUM.ENUMERATION_VALUES = [
    {data:IRRF_INDEX_ENUM.PRINCIPAL_ACCREDITED_ACTS, label:"Atos Credenciados Principais"},       
    {data:IRRF_INDEX_ENUM.AUXILIARIES_ACCREDITED_ACTS, label:"Atos Credenciados Auxiliares"},
    {data:IRRF_INDEX_ENUM.BOTH, label:"Ambos"}

];

//extende AbstractEnumeration para obter algumas funcoes genericas, como getLabelByKey e getIndexByKey
define(['/dts/hgp/html/js/global/enumeration/AbstractEnumeration.js'],function(){
	$.extend( IRRF_INDEX_ENUM, AbstractEnumeration );
});
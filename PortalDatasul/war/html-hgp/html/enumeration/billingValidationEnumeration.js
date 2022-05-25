var BILLING_VALIDATION_ENUM = {
    COBRANCA_CONFORME_CONTRATO          : 0,
    COBRANCA_CUSTO_OPERACIONAL          : 1, 
    DESCONSIDERAR_COBRANCA              : 3, 
    COBERTURA_INTERCAMBIO               : 4, 
    COBRAR_SOMENTE_PARTICIPACAO         : 6, 
    DESCONSIDERAR_COBRANCA_PARTICIPACAO : 7
};

/* ENUMERATION_VALUES */
BILLING_VALIDATION_ENUM.ENUMERATION_VALUES = [
    {data:BILLING_VALIDATION_ENUM.COBRANCA_CONFORME_CONTRATO             , label:"00 - Cobrança Conforme Contrato"},         
    {data:BILLING_VALIDATION_ENUM.COBRANCA_CUSTO_OPERACIONAL             , label:"01 - Cobrança por Custo Operacional"},         
    {data:BILLING_VALIDATION_ENUM.DESCONSIDERAR_COBRANCA                 , label:"03 - Desconsiderar Cobrança"},                                  
    {data:BILLING_VALIDATION_ENUM.COBERTURA_INTERCAMBIO                  , label:"04 - Cobertura por Intercâmbio"},               
    {data:BILLING_VALIDATION_ENUM.COBRAR_SOMENTE_PARTICIPACAO            , label:"06 - Cobrar Somente Participação"},                
    {data:BILLING_VALIDATION_ENUM.DESCONSIDERAR_COBRANCA_PARTICIPACAO    , label:"07 - Desconsiderar Cobrança Participação"}
];

//extende AbstractEnumeration para obter algumas funcoes genericas, como getLabelByKey e getIndexByKey
define(['/dts/hgp/html/js/global/enumeration/AbstractEnumeration.js'],function(){
    $.extend( BILLING_VALIDATION_ENUM, AbstractEnumeration );
});
var PAYMENT_VALIDATION_ENUM = {
    PAGAMENTO_CONFORME_CONTRATO      : 0,
    DESCONSIDERAR_PAGAMENTO          : 1
};

/* ENUMERATION_VALUES */
PAYMENT_VALIDATION_ENUM.ENUMERATION_VALUES = [
    {data:PAYMENT_VALIDATION_ENUM.PAGAMENTO_CONFORME_CONTRATO         , label:"00 - Pagamento Conforme Contrato"},         
    {data:PAYMENT_VALIDATION_ENUM.DESCONSIDERAR_PAGAMENTO             , label:"01 - Desconsiderar Pagamento"}
];

//extende AbstractEnumeration para obter algumas funcoes genericas, como getLabelByKey e getIndexByKey
define(['/dts/hgp/html/js/global/enumeration/AbstractEnumeration.js'],function(){
    $.extend( PAYMENT_VALIDATION_ENUM, AbstractEnumeration );
});
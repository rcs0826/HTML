var GRU_STATUS_ENUM = {
    PENDENTE : 1,
	LIBERADA : 2,
	PAGA     : 3
};

/* ENUMERATION_VALUES */
GRU_STATUS_ENUM.ENUMERATION_VALUES = [
    {data:GRU_STATUS_ENUM.PENDENTE, label:"Pendente" },
    {data:GRU_STATUS_ENUM.LIBERADA, label:"Liberada" },
    {data:GRU_STATUS_ENUM.PAGA    , label:"Paga"     }
];

//extende AbstractEnumeration para obter algumas funcoes genericas, como getLabelByKey e getIndexByKey
define(['/dts/hgp/html/js/global/enumeration/AbstractEnumeration.js'],function(){
	$.extend( GRU_STATUS_ENUM, AbstractEnumeration );
});

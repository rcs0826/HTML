var ATTENDANCE_TYPES_ENUM = {
	BOTH                      : "",
    AIH                       : "AIH",
    APAC                      : "APAC"
    
};


/* ENUMERATION_VALUES */
ATTENDANCE_TYPES_ENUM.ENUMERATION_VALUES = [
    {data:ATTENDANCE_TYPES_ENUM.BOTH              , label:"AMBOS"               },
    {data:ATTENDANCE_TYPES_ENUM.AIH               , label:"AIH"                 },
    {data:ATTENDANCE_TYPES_ENUM.APAC	          , label:"APAC"                }
];

//extende AbstractEnumeration para obter algumas funcoes genericas, como getLabelByKey e getIndexByKey
define(['/dts/hgp/html/js/global/enumeration/AbstractEnumeration.js'],function(){
	$.extend( ATTENDANCE_TYPES_ENUM, AbstractEnumeration );
});

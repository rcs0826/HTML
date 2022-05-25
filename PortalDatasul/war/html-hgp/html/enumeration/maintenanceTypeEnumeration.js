var MAINTENANCE_TYPE_ENUM = {
    LIST_MOVEMENTS                      : 1, 
    OTHER_ACTIONS_MOVEMENTS             : 2, 
    EDIT_MOVEMENT                       : 3,    
};

/* ENUMERATION_VALUES */
MAINTENANCE_TYPE_ENUM.ENUMERATION_VALUES = [
    {data:MAINTENANCE_TYPE_ENUM.LIST_MOVEMENTS                           , label:"01 - Lista de Movimentos"},                           
    {data:MAINTENANCE_TYPE_ENUM.OTHER_ACTIONS_MOVEMENTS                  , label:"02 - Outras Ações Movimentos"},                    
    {data:MAINTENANCE_TYPE_ENUM.EDIT_MOVEMENT                            , label:"03 - Editar Movimento"},                                  
];

//extende AbstractEnumeration para obter algumas funcoes genericas, como getLabelByKey e getIndexByKey
define(['/dts/hgp/html/js/global/enumeration/AbstractEnumeration.js'],function(){
    $.extend( MAINTENANCE_TYPE_ENUM, AbstractEnumeration );
});

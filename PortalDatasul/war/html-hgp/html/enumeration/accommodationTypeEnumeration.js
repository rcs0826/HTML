var ACCOMMODATION_TYPE_ENUM = {
    NONE                                : 0,
    INFIRMARY                           : 1, 
    PARTICULAR_ROOM                     : 2, 
    ICU                                 : 3, 
    INFIRMARY_TWO_BEDS                  : 4, 
    ONE_DAY_CLINIC                      : 5, 
    INTERMEDIATE_UNIT                   : 6, 
    APARTMENT                           : 7, 
    AMBULATORY                          : 8, 
    LUXURY_APARTMENT                    : 11,
    SIMPLE_APARTMENT                    : 12,
    STANDARD_APARTMENT                  : 13,
    SUITE_APARTMENT                     : 14,
    ROOMING_APARTMENT                   : 15,
    NORMAL_NURSERY                      : 21,
    PATHOLOGICAL_PREMATURE_NURSERY      : 22,
    ISOLATED_NURSERY_PATHOLOGICAL       : 23,
    THREE_BEDS_INFIRMARY                : 31,
    FOUR_OR_MORE_BEDS_INFIRMARY         : 32,
    ROOMING_INFIRMARY                   : 33,
    DAY_HOSPITAL                        : 34,
    INSULATION                          : 35,
    COLLECTIVE_ROOM                     : 41,
    PRIVATE_ROOM                        : 42,
    ROOMING_ROOM 	                : 43,
    ADULT_ICU                           : 51,
    PEDIATRIC_ICU                       : 52,
    NEO_NATAL_ICU                       : 53,
    SICU                                : 54,
    CORONARY_CARE_UNIT                  : 55,
    OTHERS                              : 61
};

/* ENUMERATION_VALUES */
ACCOMMODATION_TYPE_ENUM.ENUMERATION_VALUES = [
    {data:ACCOMMODATION_TYPE_ENUM.NONE                                , label:"  "},                                        
    {data:ACCOMMODATION_TYPE_ENUM.INFIRMARY                           , label:"01 - Enfermaria"},                           
    {data:ACCOMMODATION_TYPE_ENUM.PARTICULAR_ROOM                     , label:"02 - Quarto Particular"},                    
    {data:ACCOMMODATION_TYPE_ENUM.ICU                                 , label:"03 - UTI"},                                  
    {data:ACCOMMODATION_TYPE_ENUM.INFIRMARY_TWO_BEDS                  , label:"04 - Enfermaria dois leitos"},               
    {data:ACCOMMODATION_TYPE_ENUM.ONE_DAY_CLINIC                      , label:"05 - One Day clinic"},                       
    {data:ACCOMMODATION_TYPE_ENUM.INTERMEDIATE_UNIT                   , label:"06 - Unidade Intermediaria"},                
    {data:ACCOMMODATION_TYPE_ENUM.APARTMENT                           , label:"07 - Apartamento"},                          
    {data:ACCOMMODATION_TYPE_ENUM.AMBULATORY                          , label:"08 - Ambulatorio"},                          
    {data:ACCOMMODATION_TYPE_ENUM.LUXURY_APARTMENT                    , label:"11 - Apartamento Luxo"},                     
    {data:ACCOMMODATION_TYPE_ENUM.SIMPLE_APARTMENT                    , label:"12 - Apartamento Simples"},                  
    {data:ACCOMMODATION_TYPE_ENUM.STANDARD_APARTMENT                  , label:"13 - Apartamento Standard"},                 
    {data:ACCOMMODATION_TYPE_ENUM.SUITE_APARTMENT                     , label:"14 - Apartamento Suite"},                    
    {data:ACCOMMODATION_TYPE_ENUM.ROOMING_APARTMENT                   , label:"15 - Apartamento com Alojamento Conjunto"},  
    {data:ACCOMMODATION_TYPE_ENUM.NORMAL_NURSERY                      , label:"21 - Bercario Normal"},                      
    {data:ACCOMMODATION_TYPE_ENUM.PATHOLOGICAL_PREMATURE_NURSERY      , label:"22 - Bercario Patologico/Prematuro"},        
    {data:ACCOMMODATION_TYPE_ENUM.ISOLATED_NURSERY_PATHOLOGICAL       , label:"23 - Bercario Patologico com Isolamento"},   
    {data:ACCOMMODATION_TYPE_ENUM.THREE_BEDS_INFIRMARY                , label:"31 - Enfermaria (3 leitos)"},                
    {data:ACCOMMODATION_TYPE_ENUM.FOUR_OR_MORE_BEDS_INFIRMARY         , label:"32 - Enfermaria (4 ou mais leitos)"},        
    {data:ACCOMMODATION_TYPE_ENUM.ROOMING_INFIRMARY                   , label:"33 - Enfermaria com Alojamento Conjunto"},   
    {data:ACCOMMODATION_TYPE_ENUM.DAY_HOSPITAL                        , label:"34 - Hospital Dia"},                         
    {data:ACCOMMODATION_TYPE_ENUM.INSULATION                          , label:"35 - Isolamento"},                           
    {data:ACCOMMODATION_TYPE_ENUM.COLLECTIVE_ROOM                     , label:"41 - Quarto Coletivo (2 leitos)"},           
    {data:ACCOMMODATION_TYPE_ENUM.PRIVATE_ROOM                        , label:"42 - Quarto Privativo"},                     
    {data:ACCOMMODATION_TYPE_ENUM.ROOMING_ROOM                        , label:"43 - Quarto com Alojamento Conjunto"},       
    {data:ACCOMMODATION_TYPE_ENUM.ADULT_ICU                           , label:"51 - UTI Adulto"},                           
    {data:ACCOMMODATION_TYPE_ENUM.PEDIATRIC_ICU                       , label:"52 - UTI Pediatrica"},                       
    {data:ACCOMMODATION_TYPE_ENUM.NEO_NATAL_ICU                       , label:"53 - UTI Neo-Natal"},                        
    {data:ACCOMMODATION_TYPE_ENUM.SICU                                , label:"54 - TSI-Unidade de Terapia Semi-Intensiva"},
    {data:ACCOMMODATION_TYPE_ENUM.CORONARY_CARE_UNIT                  , label:"55 - Unidade Coronariana"},                  
    {data:ACCOMMODATION_TYPE_ENUM.OTHERS                              , label:"61 - Outras Diarias"}
];

//extende AbstractEnumeration para obter algumas funcoes genericas, como getLabelByKey e getIndexByKey
define(['/dts/hgp/html/js/global/enumeration/AbstractEnumeration.js'],function(){
    $.extend( ACCOMMODATION_TYPE_ENUM, AbstractEnumeration );
});

var BACKYARD_TYPE_ENUM = {

    NOT_INFORMED         : 000, //Não informado
    CAMPING              : 645, //Acampamento                       
    ACCESS               : 001, //Acesso                            
    CHUCHYARD            : 002, //Adro                              
    AIRPORT              : 501, //Aeroporto                         
    LANE                 : 004, //Alameda                           
    ELEVATION            : 005, //Alto                              
    FIRST_ELEVATION      : 523, //1º Alto                           
    SECONT_ELEVATION     : 524, //2º Alto                           
    THIRD_ELEVATION      : 525, //3º Alto                           
    FOURTH_ELEVATION     : 526, //4º Alto                           
    FIFTH_ELEVATION      : 527, //5º Alto                           
    AREA                 : 472, //Área                              
    SPECIAL_AREA         : 654, //Área Especial                     
    ARTERIAL             : 465, //Artéria                           
    SHORTCUT             : 007, //Atalho                            
    AVENUE               : 008, //Avenida                           
    BOUNDARY_AVENUE      : 651, //Avenida Contorno                  
    DEPRESSION           : 015, //Baixa                             
    BALLOON              : 470, //Balão                             
    BALNEARY             : 009, //Balneário                         
    ALLEY                : 011, //Beco                              
    FIRST_ALLEY          : 528, //1º Beco                           
    SECOND_ALLEY         : 529, //2º Beco                           
    THIRD_ALLEY          : 530, //3º Beco                           
    FOURTH_ALLEY         : 531, //4º Beco                           
    FIFTH_ALLEY          : 532, //5º Beco                           
    GAZEBO               : 010, //Belvedere                         
    BLOCK                : 012, //Bloco                             
    WOOD                 : 013, //Bosque                            
    BOULEVARD            : 014, //Boulevard                         
    HOLE                 : 496, //Buraco                            
    WHARF                : 016, //Cais                              
    SIDEWALK             : 571, //Calçada                           
    PATH                 : 017, //Caminho                           
    CAMP                 : 023, //Campo                             
    CHANNEL              : 495, //Canal                             
    COUNTRY_HOUSE        : 481, //Chácara                           
    PLATEAU              : 019, //Chapadão                          
    CIRCULAR             : 479, //Circular                          
    SETTLEMENT           : 021, //Colônia                           
    TRANSPORT_SYSTEM     : 503, //Complexo Viário                   
    CONDOMINIUM          : 485, //Condomínio                        
    HOUSING_ESTATE       : 020, //Conjunto                          
    CORRIDOR             : 022, //Corredor                          
    STREAM               : 024, //Córrego                           
    DOWNHILL             : 478, //Descida                           
    DETOUR               : 027, //Desvio                            
    DISTRICT             : 028, //Distrito                          
    UPHILL               : 468, //Elevada                           
    PRIVATE_ENTRANCE     : 573, //Entrada Particular                
    BETWEEN_SQUARE       : 652, //Entre-quadra                      
    STAIRS               : 030, //Escada                            
    ESPLANADE            : 474, //Esplanada                         
    STATION              : 032, //Estação                           
    PARKING              : 564, //Estacionamento                    
    STADIUM              : 033, //Estádio                           
    ESTATE               : 498, //Estância                          
    ROAD                 : 031, //Estrada                           
    MUNICIPAL_ROAD       : 650, //Estrada Municipal                 
    SLUM                 : 036, //Favela                            
    FARM                 : 037, //Fazenda                           
    FAIR                 : 040, //Feira                             
    RAILROAD             : 038, //Ferrovia                          
    FOUNTAIN             : 039, //Fonte                             
    FORT                 : 043, //Forte                             
    GALLERY              : 045, //Galeria                           
    GRANGE               : 046, //Granja                            
    HOUSING              : 486, //Habitacional                      
    ISLAND               : 050, //Ilha                              
    GARDEN               : 052, //Jardim                            
    SMALL_GARDEN         : 473, //Jardinete                         
    SLOPE                : 053, //Ladeira                           
    LAKE                 : 499, //Lago                              
    POND                 : 055, //Lagoa                             
    PUBLIC_SQUARE        : 054, //Largo                             
    ALLOTMENT            : 056, //Loteamento                        
    SMALL_PORT           : 477, //Marina                            
    MODULE               : 497, //Módulo                            
    MOUNT                : 060, //Monte                             
    HILL                 : 059, //Morro                             
    CORE                 : 500, //Núcleo                            
    PARADE               : 067, //Parada                            
    STOPPING_PLACE       : 471, //Paradouro                         
    PARALLEL             : 062, //Paralela                          
    FIRST_PARALLEL       : 533, //1ª Paralela                       
    SECOND_PARALLEL      : 534, //2ª Paralela                       
    THIRD_PARALLEL       : 535, //3ª Paralela                       
    FOURTH_PARALLEL      : 536, //4ª Paralela                       
    FIFTH_PARALLEL       : 537, //5ª Paralela                       
    PARK                 : 072, //Parque                            
    FIRST_PARK           : 549, //1º Parque                         
    SECOND_PARK          : 550, //2º Parque                         
    THIRD_PARK           : 551, //3º Parque                         
    PASSAGE              : 074, //Passagem                          
    SUBTERRANEAN_PASSAGE : 502, //Passagem Subterrânea              
    FOOTBRIDGE           : 073, //Passarela                         
    PROMENADE            : 063, //Passeio                           
    COURTYARD            : 064, //Pátio                             
    POINT                : 483, //Ponta                             
    BRIDGE               : 076, //Ponte                             
    HARBOUR              : 469, //Porto                             
    PLAZA                : 065, //Praça                             
    SPORTS_PLAZA         : 504, //Praça de Esportes                 
    BEACH                : 070, //Praia                             
    EXTENSION            : 071, //Prolongamento                     
    SQUARE               : 077, //Quadra                            
    FARMSTEAD            : 079, //Quinta                            
    FARMSTEADS           : 475, //Quintas                           
    BRANCH_LINE          : 082, //Ramal                             
    RAMP                 : 482, //Rampa                             
    NOOK                 : 087, //Recanto                           
    RESIDENTIAL          : 487, //Residencial                       
    STRAIGHT_LINE        : 089, //Reta                              
    RETREAT              : 088, //Retiro                            
    RETURN               : 091, //Retorno                           
    RING_ROAD            : 569, //Rodo Anel                         
    HIGHWAY              : 090, //Rodovia                           
    ROTATORY             : 506, //Rotatória                         
    STREET_CIRCLE        : 476, //Rotula                            
    STREET               : 081, //Rua                               
    FIRST_STREET         : 552, //1ª Rua                            
    SECOND_STREET        : 553, //2ª Rua                            
    THIRD_STREET         : 554, //3ª Rua                            
    FOURTH_STREET        : 555, //4ª Rua                            
    FIFTH_STREET         : 556, //5ª Rua                            
    SIXTH_STREET         : 557, //6ª Rua                            
    SEVENTH_STREET       : 558, //7ª Rua                            
    EIGHTH_STREET        : 559, //8ª Rua                            
    NINTH_STREET         : 560, //9ª Rua                            
    TENTH_STREET         : 561, //10ª Rua                           
    ELEVENTH_STREET      : 562, //11ª Rua                           
    TWELFTH_STREET       : 563, //12ª Rua                           
    CONNECTION_STREET    : 653, //Rua de Ligação                    
    STREET_WALKING       : 566, //Rua de Pedestre                   
    SERVITUDE            : 094, //Servidão                          
    SECTOR               : 095, //Setor                             
    RANCH                : 092, //Sítio                             
    ACCLIVITY            : 096, //Subida                            
    FIRST_ACCLIVITY      : 538, //1ª Subida                         
    SECOND_ACCLIVITY     : 539, //2ª Subida                         
    THIRD_ACCLIVITY      : 540, //3ª Subida                         
    FOURTH_ACCLIVITY     : 541, //4ª Subida                         
    FIFTH_ACCLIVITY      : 542, //5ª Subida                         
    SIXTH_ACCLIVITY      : 543, //6ª Subida                         
    TERMINAL             : 098, //Terminal                          
    TRAVERSE             : 100, //Travessa                          
    FIRST_TRAVERSE       : 507, //1ª Travessa                       
    SECOND_TRAVERSE      : 508, //2ª Travessa                       
    THIRD_TRAVERSE       : 509, //3ª Travessa                       
    FOURTH_TRAVERSE      : 510, //4ª Travessa                       
    FIFTH_TRAVERSE       : 511, //5ª Travessa                       
    SIXTH_TRAVERSE       : 512, //6ª Travessa                       
    SEVENTH_TRAVERSE     : 513, //7ª Travessa                       
    EIGHTH_TRAVERSE      : 514, //8ª Travessa                       
    NINTH_TRAVERSE       : 515, //9ª Travessa                       
    TENTH_TRAVERSE       : 516, //10ª Travessa                      
    ELEVENTH_TRAVERSE    : 517, //11ª Travessa                      
    TWELFTH_TRAVERSE     : 518, //12ª Travessa                      
    THIRTEENTH_TRAVERSE  : 519, //13ª Travessa                      
    FOURTEENTH_TRAVERSE  : 520, //14ª Travessa                      
    FIFTEENTH_TRAVERSE   : 521, //15ª Travessa                      
    SIXTEENTH_TRAVERSE   : 522, //16ª Travessa                      
    PRIVATE_TRAVERSE     : 570, //Travessa Particular               
    STRECH               : 452, //Trecho                            
    ROUNDABOUT           : 099, //Trevo                             
    TRENCH               : 097, //Trincheira                        
    TUNNEL               : 567, //Túnel                             
    UNIT                 : 480, //Unidade                           
    DITCH                : 565, //Vala                              
    VALLEY               : 106, //Vale                              
    VARIANT              : 568, //Variante                          
    NARROW_WAY           : 453, //Vereda                            
    WAY                  : 101, //Via                               
    ACCESS_WAY           : 572, //Via de Acesso                     
    WALKING_WAY          : 484, //Via de pedestre                   
    UP_WAY               : 505, //Via Elevada                       
    EXPRESS_WAY          : 646, //Via Expressa                      
    VIADUCT              : 103, //Viaduto                           
    NARROW_STREET        : 105, //Viela                             
    VILLAGE              : 104, //Vila                              
    FIRST_VILLAGE        : 544, //1ª Vila                           
    SECOND_VILLAGE       : 545, //2ª Vila                           
    THIRD_VILLAGE        : 546, //3ª Vila                           
    FOURTH_VILLAGE       : 547, //4ª Vila                           
    FIFTH_VILLAGE        : 548, //5ª Vila                           
    ZIGZAG               : 108  //Zigue-zague           
};

/* ENUMERATION_VALUES */
BACKYARD_TYPE_ENUM.ENUMERATION_VALUES = [
    {data:BACKYARD_TYPE_ENUM.NOT_INFORMED, label:"Não informado"},    
    {data:BACKYARD_TYPE_ENUM.CAMPING, label:"Acampamento"},
    {data:BACKYARD_TYPE_ENUM.ACCESS, label:"Acesso"},
    {data:BACKYARD_TYPE_ENUM.CHUCHYARD, label:"Adro"},
    {data:BACKYARD_TYPE_ENUM.AIRPORT, label:"Aeroporto"},
    {data:BACKYARD_TYPE_ENUM.LANE, label:"Alameda"},
    {data:BACKYARD_TYPE_ENUM.ELEVATION, label:"Alto"},
    {data:BACKYARD_TYPE_ENUM.FIRST_ELEVATION, label:"1º Alto"},
    {data:BACKYARD_TYPE_ENUM.SECONT_ELEVATION, label:"2º Alto"},
    {data:BACKYARD_TYPE_ENUM.THIRD_ELEVATION, label:"3º Alto"},
    {data:BACKYARD_TYPE_ENUM.FOURTH_ELEVATION, label:"4º Alto"},
    {data:BACKYARD_TYPE_ENUM.FIFTH_ELEVATION, label:"5º Alto"},
    {data:BACKYARD_TYPE_ENUM.AREA, label:"Área"},
    {data:BACKYARD_TYPE_ENUM.SPECIAL_AREA, label:"Área Especial"},
    {data:BACKYARD_TYPE_ENUM.ARTERIAL, label:"Artéria"},
    {data:BACKYARD_TYPE_ENUM.SHORTCUT, label:"Atalho"},
    {data:BACKYARD_TYPE_ENUM.AVENUE, label:"Avenida"},
    {data:BACKYARD_TYPE_ENUM.BOUNDARY_AVENUE, label:"Avenida Contorno"},
    {data:BACKYARD_TYPE_ENUM.DEPRESSION, label:"Baixa"},
    {data:BACKYARD_TYPE_ENUM.BALLOON, label:"Balão"},
    {data:BACKYARD_TYPE_ENUM.BALNEARY, label:"Balneário"},
    {data:BACKYARD_TYPE_ENUM.ALLEY, label:"Beco"},
    {data:BACKYARD_TYPE_ENUM.FIRST_ALLEY, label:"1º Beco"},
    {data:BACKYARD_TYPE_ENUM.SECOND_ALLEY, label:"2º Beco"},
    {data:BACKYARD_TYPE_ENUM.THIRD_ALLEY, label:"3º Beco"},
    {data:BACKYARD_TYPE_ENUM.FOURTH_ALLEY, label:"4º Beco"},
    {data:BACKYARD_TYPE_ENUM.FIFTH_ALLEY, label:"5º Beco"},
    {data:BACKYARD_TYPE_ENUM.GAZEBO, label:"Belvedere"},
    {data:BACKYARD_TYPE_ENUM.BLOCK, label:"Bloco"},
    {data:BACKYARD_TYPE_ENUM.WOOD, label:"Bosque"},
    {data:BACKYARD_TYPE_ENUM.BOULEVARD, label:"Boulevard"},
    {data:BACKYARD_TYPE_ENUM.HOLE, label:"Buraco"},
    {data:BACKYARD_TYPE_ENUM.WHARF, label:"Cais"},
    {data:BACKYARD_TYPE_ENUM.SIDEWALK, label:"Calçada"},
    {data:BACKYARD_TYPE_ENUM.PATH, label:"Caminho"},
    {data:BACKYARD_TYPE_ENUM.CAMP, label:"Campo"},
    {data:BACKYARD_TYPE_ENUM.CHANNEL, label:"Canal"},
    {data:BACKYARD_TYPE_ENUM.COUNTRY_HOUSE, label:"Chácara"},
    {data:BACKYARD_TYPE_ENUM.PLATEAU, label:"Chapadão"},
    {data:BACKYARD_TYPE_ENUM.CIRCULAR, label:"Circular"},
    {data:BACKYARD_TYPE_ENUM.SETTLEMENT, label:"Colônia"},
    {data:BACKYARD_TYPE_ENUM.TRANSPORT_SYSTEM, label:"Complexo Viário"},
    {data:BACKYARD_TYPE_ENUM.CONDOMINIUM, label:"Condomínio"},
    {data:BACKYARD_TYPE_ENUM.HOUSING_ESTATE, label:"Conjunto"},
    {data:BACKYARD_TYPE_ENUM.CORRIDOR, label:"Corredor"},
    {data:BACKYARD_TYPE_ENUM.STREAM, label:"Córrego"},
    {data:BACKYARD_TYPE_ENUM.DOWNHILL, label:"Descida"},
    {data:BACKYARD_TYPE_ENUM.DETOUR, label:"Desvio"},
    {data:BACKYARD_TYPE_ENUM.DISTRICT, label:"Distrito"},
    {data:BACKYARD_TYPE_ENUM.UPHILL, label:"Elevada"},
    {data:BACKYARD_TYPE_ENUM.PRIVATE_ENTRANCE, label:"Entrada Particular"},
    {data:BACKYARD_TYPE_ENUM.BETWEEN_SQUARE, label:"Entre-quadra"},
    {data:BACKYARD_TYPE_ENUM.STAIRS, label:"Escada"},
    {data:BACKYARD_TYPE_ENUM.ESPLANADE, label:"Esplanada"},
    {data:BACKYARD_TYPE_ENUM.STATION, label:"Estação"},
    {data:BACKYARD_TYPE_ENUM.PARKING, label:"Estacionamento"},
    {data:BACKYARD_TYPE_ENUM.STADIUM, label:"Estádio"},
    {data:BACKYARD_TYPE_ENUM.ESTATE, label:"Estância"},
    {data:BACKYARD_TYPE_ENUM.ROAD, label:"Estrada"},
    {data:BACKYARD_TYPE_ENUM.MUNICIPAL_ROAD, label:"Estrada Municipal"},
    {data:BACKYARD_TYPE_ENUM.SLUM, label:"Favela"},
    {data:BACKYARD_TYPE_ENUM.FARM, label:"Fazenda"},
    {data:BACKYARD_TYPE_ENUM.FAIR, label:"Feira"},
    {data:BACKYARD_TYPE_ENUM.RAILROAD, label:"Ferrovia"},
    {data:BACKYARD_TYPE_ENUM.FOUNTAIN, label:"Fonte"},
    {data:BACKYARD_TYPE_ENUM.FORT, label:"Forte"},
    {data:BACKYARD_TYPE_ENUM.GALLERY, label:"Galeria"},
    {data:BACKYARD_TYPE_ENUM.GRANGE, label:"Granja"},
    {data:BACKYARD_TYPE_ENUM.HOUSING, label:"Habitacional"},
    {data:BACKYARD_TYPE_ENUM.ISLAND, label:"Ilha"},
    {data:BACKYARD_TYPE_ENUM.GARDEN, label:"Jardim"},
    {data:BACKYARD_TYPE_ENUM.SMALL_GARDEN, label:"Jardinete"},
    {data:BACKYARD_TYPE_ENUM.SLOPE, label:"Ladeira"},
    {data:BACKYARD_TYPE_ENUM.LAKE, label:"Lago"},
    {data:BACKYARD_TYPE_ENUM.POND, label:"Lagoa"},
    {data:BACKYARD_TYPE_ENUM.PUBLIC_SQUARE, label:"Largo"},
    {data:BACKYARD_TYPE_ENUM.ALLOTMENT, label:"Loteamento"},
    {data:BACKYARD_TYPE_ENUM.SMALL_PORT, label:"Marina"},
    {data:BACKYARD_TYPE_ENUM.MODULE, label:"Módulo"},
    {data:BACKYARD_TYPE_ENUM.MOUNT, label:"Monte"},
    {data:BACKYARD_TYPE_ENUM.HILL, label:"Morro"},
    {data:BACKYARD_TYPE_ENUM.CORE, label:"Núcleo"},
    {data:BACKYARD_TYPE_ENUM.PARADE, label:"Parada"},
    {data:BACKYARD_TYPE_ENUM.STOPPING_PLACE, label:"Paradouro"},
    {data:BACKYARD_TYPE_ENUM.PARALLEL, label:"Paralela"},
    {data:BACKYARD_TYPE_ENUM.FIRST_PARALLEL, label:"1ª Paralela"},
    {data:BACKYARD_TYPE_ENUM.SECOND_PARALLEL, label:"2ª Paralela"},
    {data:BACKYARD_TYPE_ENUM.THIRD_PARALLEL, label:"3ª Paralela"},
    {data:BACKYARD_TYPE_ENUM.FOURTH_PARALLEL, label:"4ª Paralela"},
    {data:BACKYARD_TYPE_ENUM.FIFTH_PARALLEL, label:"5ª Paralela"},
    {data:BACKYARD_TYPE_ENUM.PARK, label:"Parque"},
    {data:BACKYARD_TYPE_ENUM.FIRST_PARK, label:"1º Parque"},
    {data:BACKYARD_TYPE_ENUM.SECOND_PARK, label:"2º Parque"},
    {data:BACKYARD_TYPE_ENUM.THIRD_PARK, label:"3º Parque"},
    {data:BACKYARD_TYPE_ENUM.PASSAGE, label:"Passagem"},
    {data:BACKYARD_TYPE_ENUM.SUBTERRANEAN_PASSAGE, label:"Passagem Subterrânea"},
    {data:BACKYARD_TYPE_ENUM.FOOTBRIDGE, label:"Passarela"},
    {data:BACKYARD_TYPE_ENUM.PROMENADE, label:"Passeio"},
    {data:BACKYARD_TYPE_ENUM.COURTYARD, label:"Pátio"},
    {data:BACKYARD_TYPE_ENUM.POINT, label:"Ponta"},
    {data:BACKYARD_TYPE_ENUM.BRIDGE, label:"Ponte"},
    {data:BACKYARD_TYPE_ENUM.HARBOUR, label:"Porto"},
    {data:BACKYARD_TYPE_ENUM.PLAZA, label:"Praça"},
    {data:BACKYARD_TYPE_ENUM.SPORTS_PLAZA, label:"Praça de Esportes"},
    {data:BACKYARD_TYPE_ENUM.BEACH, label:"Praia"},
    {data:BACKYARD_TYPE_ENUM.EXTENSION, label:"Prolongamento"},
    {data:BACKYARD_TYPE_ENUM.SQUARE, label:"Quadra"},
    {data:BACKYARD_TYPE_ENUM.FARMSTEAD, label:"Quinta"},
    {data:BACKYARD_TYPE_ENUM.FARMSTEADS, label:"Quintas"},
    {data:BACKYARD_TYPE_ENUM.BRANCH_LINE, label:"Ramal"},
    {data:BACKYARD_TYPE_ENUM.RAMP, label:"Rampa"},
    {data:BACKYARD_TYPE_ENUM.NOOK, label:"Recanto"},
    {data:BACKYARD_TYPE_ENUM.RESIDENTIAL, label:"Residencial"},
    {data:BACKYARD_TYPE_ENUM.STRAIGHT_LINE, label:"Reta"},
    {data:BACKYARD_TYPE_ENUM.RETREAT, label:"Retiro"},
    {data:BACKYARD_TYPE_ENUM.RETURN, label:"Retorno"},
    {data:BACKYARD_TYPE_ENUM.RING_ROAD, label:"Rodo Anel"},
    {data:BACKYARD_TYPE_ENUM.HIGHWAY, label:"Rodovia"},
    {data:BACKYARD_TYPE_ENUM.ROTATORY, label:"Rotatória"},
    {data:BACKYARD_TYPE_ENUM.STREET_CIRCLE, label:"Rotula"},
    {data:BACKYARD_TYPE_ENUM.STREET, label:"Rua"},
    {data:BACKYARD_TYPE_ENUM.FIRST_STREET, label:"1ª Rua"},
    {data:BACKYARD_TYPE_ENUM.SECOND_STREET, label:"2ª Rua"},
    {data:BACKYARD_TYPE_ENUM.THIRD_STREET, label:"3ª Rua"},
    {data:BACKYARD_TYPE_ENUM.FOURTH_STREET, label:"4ª Rua"},
    {data:BACKYARD_TYPE_ENUM.FIFTH_STREET, label:"5ª Rua"},
    {data:BACKYARD_TYPE_ENUM.SIXTH_STREET, label:"6ª Rua"},
    {data:BACKYARD_TYPE_ENUM.SEVENTH_STREET, label:"7ª Rua"},
    {data:BACKYARD_TYPE_ENUM.EIGHTH_STREET, label:"8ª Rua"},
    {data:BACKYARD_TYPE_ENUM.NINTH_STREET, label:"9ª Rua"},
    {data:BACKYARD_TYPE_ENUM.TENTH_STREET, label:"10ª Rua"},
    {data:BACKYARD_TYPE_ENUM.ELEVENTH_STREET, label:"11ª Rua"},
    {data:BACKYARD_TYPE_ENUM.TWELFTH_STREET, label:"12ª Rua"},
    {data:BACKYARD_TYPE_ENUM.CONNECTION_STREET, label:"Rua de Ligação"},
    {data:BACKYARD_TYPE_ENUM.STREET_WALKING, label:"Rua de Pedestre"},
    {data:BACKYARD_TYPE_ENUM.SERVITUDE, label:"Servidão"},
    {data:BACKYARD_TYPE_ENUM.SECTOR, label:"Setor"},
    {data:BACKYARD_TYPE_ENUM.RANCH, label:"Sítio"},
    {data:BACKYARD_TYPE_ENUM.ACCLIVITY, label:"Subida"},
    {data:BACKYARD_TYPE_ENUM.FIRST_ACCLIVITY, label:"1ª Subida"},
    {data:BACKYARD_TYPE_ENUM.SECOND_ACCLIVITY, label:"2ª Subida"},
    {data:BACKYARD_TYPE_ENUM.THIRD_ACCLIVITY, label:"3ª Subida"},
    {data:BACKYARD_TYPE_ENUM.FOURTH_ACCLIVITY, label:"4ª Subida"},
    {data:BACKYARD_TYPE_ENUM.FIFTH_ACCLIVITY, label:"5ª Subida"},
    {data:BACKYARD_TYPE_ENUM.SIXTH_ACCLIVITY, label:"6ª Subida"},
    {data:BACKYARD_TYPE_ENUM.TERMINAL, label:"Terminal"},
    {data:BACKYARD_TYPE_ENUM.TRAVERSE, label:"Travessa"},
    {data:BACKYARD_TYPE_ENUM.FIRST_TRAVERSE, label:"1ª Travessa"},
    {data:BACKYARD_TYPE_ENUM.SECOND_TRAVERSE, label:"2ª Travessa"},
    {data:BACKYARD_TYPE_ENUM.THIRD_TRAVERSE, label:"3ª Travessa"},
    {data:BACKYARD_TYPE_ENUM.FOURTH_TRAVERSE, label:"4ª Travessa"},
    {data:BACKYARD_TYPE_ENUM.FIFTH_TRAVERSE, label:"5ª Travessa"},
    {data:BACKYARD_TYPE_ENUM.SIXTH_TRAVERSE, label:"6ª Travessa"},
    {data:BACKYARD_TYPE_ENUM.SEVENTH_TRAVERSE, label:"7ª Travessa"},
    {data:BACKYARD_TYPE_ENUM.EIGHTH_TRAVERSE, label:"8ª Travessa"},
    {data:BACKYARD_TYPE_ENUM.NINTH_TRAVERSE, label:"9ª Travessa"},
    {data:BACKYARD_TYPE_ENUM.TENTH_TRAVERSE, label:"10ª Travessa"},
    {data:BACKYARD_TYPE_ENUM.ELEVENTH_TRAVERSE, label:"11ª Travessa"},
    {data:BACKYARD_TYPE_ENUM.TWELFTH_TRAVERSE, label:"12ª Travessa"},
    {data:BACKYARD_TYPE_ENUM.THIRTEENTH_TRAVERSE, label:"13ª Travessa"},
    {data:BACKYARD_TYPE_ENUM.FOURTEENTH_TRAVERSE, label:"14ª Travessa"},
    {data:BACKYARD_TYPE_ENUM.FIFTEENTH_TRAVERSE, label:"15ª Travessa"},
    {data:BACKYARD_TYPE_ENUM.SIXTEENTH_TRAVERSE, label:"16ª Travessa"},
    {data:BACKYARD_TYPE_ENUM.PRIVATE_TRAVERSE, label:"Travessa Particular"},
    {data:BACKYARD_TYPE_ENUM.STRECH, label:"Trecho"},
    {data:BACKYARD_TYPE_ENUM.ROUNDABOUT, label:"Trevo"},
    {data:BACKYARD_TYPE_ENUM.TRENCH, label:"Trincheira"},
    {data:BACKYARD_TYPE_ENUM.TUNNEL, label:"Túnel"},
    {data:BACKYARD_TYPE_ENUM.UNIT, label:"Unidade"},
    {data:BACKYARD_TYPE_ENUM.DITCH, label:"Vala"},
    {data:BACKYARD_TYPE_ENUM.VALLEY, label:"Vale"},
    {data:BACKYARD_TYPE_ENUM.VARIANT, label:"Variante"},
    {data:BACKYARD_TYPE_ENUM.NARROW_WAY, label:"Vereda"},
    {data:BACKYARD_TYPE_ENUM.WAY, label:"Via"},
    {data:BACKYARD_TYPE_ENUM.ACCESS_WAY, label:"Via de Acesso"},
    {data:BACKYARD_TYPE_ENUM.WALKING_WAY, label:"Via de pedestre"},
    {data:BACKYARD_TYPE_ENUM.UP_WAY, label:"Via Elevada"},
    {data:BACKYARD_TYPE_ENUM.EXPRESS_WAY, label:"Via Expressa"},
    {data:BACKYARD_TYPE_ENUM.VIADUCT, label:"Viaduto"},
    {data:BACKYARD_TYPE_ENUM.NARROW_STREET, label:"Viela"},
    {data:BACKYARD_TYPE_ENUM.VILLAGE, label:"Vila"},
    {data:BACKYARD_TYPE_ENUM.FIRST_VILLAGE, label:"1ª Vila"},
    {data:BACKYARD_TYPE_ENUM.SECOND_VILLAGE, label:"2ª Vila"},
    {data:BACKYARD_TYPE_ENUM.THIRD_VILLAGE, label:"3ª Vila"},
    {data:BACKYARD_TYPE_ENUM.FOURTH_VILLAGE, label:"4ª Vila"},
    {data:BACKYARD_TYPE_ENUM.FIFTH_VILLAGE, label:"5ª Vila"},
    {data:BACKYARD_TYPE_ENUM.ZIGZAG, label:"Zigue-zague"}

];

//extende AbstractEnumeration para obter algumas funcoes genericas, como getLabelByKey e getIndexByKey
define(['/dts/hgp/html/js/global/enumeration/AbstractEnumeration.js'],function(){
	$.extend( BACKYARD_TYPE_ENUM, AbstractEnumeration );
});
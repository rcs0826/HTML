var tabCondTemp = [{'sigla':'ec','desc':'Encoberto com Chuvas Isoladas'}, {'sigla':'ci','desc':'Chuvas Isoladas'}, {'sigla':'c','desc':'Chuva'}, {'sigla':'in','desc':'Instável'}, {'sigla':'pp','desc':'Poss. de Pancadas de Chuva'}, {'sigla':'cm','desc':'Chuva pela Manhã'}, {'sigla':'cn','desc':'Chuva a Noite'}, {'sigla':'pt','desc':'Pancadas de Chuva a Tarde'}, {'sigla':'pm','desc':'Pancadas de Chuva pela Manhã'}, {'sigla':'np','desc':'Nublado e Pancadas de Chuva'}, {'sigla':'pc','desc':'Pancadas de Chuva'}, {'sigla':'pn','desc':'Parcialmente Nublado'}, {'sigla':'cv','desc':'Chuvisco'}, {'sigla':'ch','desc':'Chuvoso'}, {'sigla':'t','desc':'Tempestade'}, {'sigla':'ps','desc':'Predomínio de Sol'}, {'sigla':'e','desc':'Encoberto'}, {'sigla':'n','desc':'Nublado'}, {'sigla':'cl','desc':'Céu Claro'}, {'sigla':'nv','desc':'Nevoeiro'}, {'sigla':'g','desc':'Geada'}, {'sigla':'ne','desc':'Neve'}, {'sigla':'nd','desc':'Não Definido'}, {'sigla':'pnt','desc':'Pancadas de Chuva a Noite'}, {'sigla':'psc','desc':'Possibilidade de Chuva'},
{'sigla':'pcm','desc':'Possibilidade de Chuva pela Manhã'}, {'sigla':'pct','desc':'Possibilidade de Chuva a Tarde'}, {'sigla':'pcn','desc':'Possibilidade de Chuva a Noite'}, {'sigla':'npt','desc':'Nublado com Pancadas a Tarde'}, {'sigla':'npn','desc':'Nublado com Pancadas a Noite'}, {'sigla':'ncn','desc':'Nublado com Poss. de Chuva a Noite'}, {'sigla':'nct','desc':'Nublado com Poss. de Chuva a Tarde'}, {'sigla':'ncm','desc':'Nubl. c/ Poss. de Chuva pela Manhã'}, {'sigla':'npm','desc':'Nublado com Pancadas pela Manhã'}, {'sigla':'npp','desc':'Nublado com Possibilidade de Chuva'}, {'sigla':'vn','desc':'Variação de Nebulosidade'}, {'sigla':'ct','desc':'Chuva a Tarde'}, {'sigla':'ppn','desc':'Poss. de Panc. de Chuva a Noite'}, {'sigla':'ppt','desc':'Poss. de Panc. de Chuva a Tarde'}, {'sigla':'ppm','desc':'Poss. de Panc. de Chuva pela Manhã'}];

function selDesc(sig){
         var ret = ""; 
         for(var i=0; i<tabCondTemp.length; i++){
                 if(tabCondTemp[i].sigla == sig){
                      ret = tabCondTemp[i].desc; 
                      break;
                 }
         }
         return ret;
};

try{
    xmlhttp = new XMLHttpRequest();
}catch(ee){
    try{
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    }catch(e){
        try{
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }catch(E){
            xmlhttp = false;
        }
    }
}

function pegarCep( CEP ){
    if( CEP.length==0) return false;
    var divCep = document.getElementById('divCep');
    divCep.innerHTML = "Carregando...";
    xmlhttp.open("GET", "/cadastro-sms/br/cep.asp?CEP="+ CEP,true);
    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState==4){
            var resposta = xmlhttp.responseText;
            divCep.innerHTML = resposta;
        }
    }
    xmlhttp.send(null);             
} 
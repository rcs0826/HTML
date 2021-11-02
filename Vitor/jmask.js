
function mask(id, mask)
{
  try
  {
    var campo = document.getElementById(id);
    var result="" , vet= "", cont=0, ascii=0, temp="";
    mask = mask.split( "");
    vet = campo.value.split( "");
    if(vet.length <= mask.length)
    {
      for(var i = 0;i < vet.length;i++)
      {
        if(mask[i + cont] == '0' )
        {
          if(!isNaN(vet[i]))
          {
            result += vet[i];
          }
          else
          {
            result = result.substring(0, vet.length);
          }
        }
        else if (mask[i + cont] == 'X' || mask[i + cont] == 'x')
        {
          ascii = vet[i].charCodeAt(0);
          if( (ascii >= 65 && ascii <=90) || (ascii >= 97 && ascii <= 122) )
          {
            if(mask[i + cont] == 'X' )
            {
              temp = vet[i];
              result += temp.toUpperCase();
            }
            else
            {
              result += vet[i];
            }
          }
          else
          {
            result = result.substring(0, vet.length);
          }
        }
        else if (mask[i + cont] == 'A' || mask[i + cont] == 'a')
        {
          ascii = vet[i].charCodeAt(0);
          if( (ascii >= 65 && ascii <=90) || (ascii >= 97 && ascii <= 122) || (ascii >= 48 && ascii <= 57))
          {
            if(mask[i + cont] == 'A' )
            {
              temp = vet[i];
              result += temp.toUpperCase();
            }
            else
            {
              result += vet[i];
            }
          }
          else
          {
            result = result.substring(0, vet.length);
          }
        }
        else if (mask[i + cont] == vet[i])
        {
          result += mask[i + cont];
        }
        else
        {
          result += mask[i + cont];
          cont ++;
          i--;
        }
      }
      campo.value = result;
    }
    else
    {
      campo.value = campo.value.substring(0, mask.length);
    }
  }
  catch(e)
  {
    console.log( "Erro: " + e.message);
  }
};
function maskMoney(id)
{
  try
  {
    var campo = document.getElementById(id);
    var result="" , vet= "", cont=0, conteiner, block = true, temp="", temp2="";
    vet = campo.value.split( "");
    for(var i = 0;i < vet.length;i++)
    {
      if(!isNaN(vet[i]))
      {
        temp += vet[i];
      }
    }
    conteiner = temp.split("");
    for(var j = conteiner.length;j > 0;j--)
    {
      if(block && cont == 2)
      {
        temp2 += "," + conteiner[j-1];
        block = false;
        cont = 1;
      }
      else if(cont == 3)
      {
        temp2 += "." + conteiner[j-1];
        cont = 1;
      }
      else
      {
        temp2 += conteiner[j-1];
        cont++;
      }
    }
    conteiner = temp2.split("");
    for(var x = conteiner.length;x > 0;x--)
    {
      result += conteiner[x-1];
    }
    campo.value = result;
  }
  catch(e)
  {
    console.log( "Erro: " + e.message);
  }
};

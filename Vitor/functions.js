function jSend()
			{
				var lContinua = true;
				var nCountA   = 0;
				var nLen      = ($("input")).length;
				var nItem     = 0;
				
				var cCondPag  = '';
				var nValUnit  = 0;
				var nAlqIPI   = 0;
				var nAlqICMS  = 0;
				var nPrzEntr  = 0;

				if( confirm('Confirma o envio do formulário?') )
				{
					//VERIFICA SE O FORMULARIO FOI PREENCHIDO ADEQUADAMENTE 
					if (lContinua)
					{
						cCondPag = document.getElementsByName('ACONDPAG');						
						if (cCondPag[0].value == '')
						{
							lContinua = false;
                            cCondPag[0].style = "border-color:red";
							alert('Atenção: Informe a Condição de Pagamento para envio do formulário!');
						}
                        else{
                             cCondPag[0].style = "border-color:#ccc";
                        }
					}

                    var objs = $('[name^="COT"]');
                    console.info("objs.length: "+objs.length);
                    console.info("lContinua: "+lContinua);
					if (lContinua)
					{                console.info("oi");
						for(var x = 0; x < objs.length; x++)
						{
							if (objs[x].value == "" || objs[x].value == "0"){
                               lContinua = false;
                               objs[x].style = "border-color:red";
							}
                            else{                                  
                               objs[x].style = "border-color:#ccc";
                            }
						}
						if (!lContinua)
							alert('Atenção: Verifique o preenchimento das informações dos itens da cotação (Valores, Alíquotas, Prazos de Entrega)');
					}

					// REALIZA O ENVIO DO FORMULARIO 
					if (lContinua)
					{
						document.getElementById("cmdEnviar").style.display="none";
						document.getElementById("cmdLimpar").style.display="none";
						document.getElementById("msgProc").style.display="block";
						document.frmWFCotacao.submit();
					}
				}
			}


			function CalcValores()
			{
				var nCountA   = 0;
				var nLen      = $("[name^='COT.NQTDE.']");
				var nItem     = 0;

				var nQtde     = 0;
				var nValUnit  = 0;
				var nValLiq   = 0;
				var nAlqIPI   = 0;
				var nValIPI   = 0;
				var nAlqICMS  = 0;
				var nValICMS  = 0;

				var nTotLiq   = 0;
				var nTotICMS  = 0;
				var nTotIPI   = 0;
				var nTotBruto = 0;

				for(nCountA = 0; nCountA < nLen.length; nCountA++)
				{
					nItem ++;

					nQtde    = document.getElementsByName('COT.NQTDE.' + nItem);
					nQtde    = parseFloat(nQtde[0].value);
					nQtde    = nQtde.toFixed(4);

					nValUnit = document.getElementsByName('COT.NVALUNIT.' + nItem);
					nValUnit = parseFloat(nValUnit[0].value);
					nValUnit = nValUnit.toFixed(2);

					nAlqIPI  = document.getElementsByName('COT.NALIQIPI.' + nItem);
					nAlqIPI  = parseFloat(nAlqIPI[0].value);
					nAlqIPI  = nAlqIPI.toFixed(2);

					nAlqICMS = document.getElementsByName('COT.NALIQICMS.' + nItem);
					nAlqICMS = parseFloat(nAlqICMS[0].value);
					nAlqICMS = nAlqICMS.toFixed(2);

					nValLiq  = nQtde * nValUnit
					nValLiq  = parseFloat(nValLiq);
					nValLiq  = nValLiq.toFixed(2);

					nValIPI  = ((nValLiq * nAlqIPI) / 100);
					nValIPI  = parseFloat(nValIPI);
					nValIPI  = nValIPI.toFixed(2);					

					nValICMS = ((nValLiq * nAlqICMS) / 100);
					nValICMS = parseFloat(nValICMS);
					nValICMS = nValICMS.toFixed(2);

					nTotLiq   = (parseFloat(nTotLiq) + parseFloat(nValLiq)).toFixed(2);
					nTotICMS  = (parseFloat(nTotICMS) + parseFloat(nValICMS)).toFixed(2);
					nTotIPI   = (parseFloat(nTotIPI) + parseFloat(nValIPI)).toFixed(2);
					nTotBruto = (parseFloat(nTotBruto) + (parseFloat(nValLiq) + parseFloat(nValIPI))).toFixed(2);

					document.getElementsByName('COT.NVALIPI.' + nItem).item(0).value  = isNaN(parseFloat(nValIPI).toFixed(2))?0:(parseFloat(nValIPI).toFixed(2));
					document.getElementsByName('COT.NVALICMS.' + nItem).item(0).value = isNaN(parseFloat(nValICMS).toFixed(2))?0:(parseFloat(nValICMS).toFixed(2));
					document.getElementsByName('COT.NVALTOT.' + nItem).item(0).value  = isNaN((parseFloat(nValLiq) + parseFloat(nValIPI)).toFixed(2))?0:((parseFloat(nValLiq) + parseFloat(nValIPI)).toFixed(2));
                 }

				$("#nTLiq").val((isNaN(parseFloat(nTotLiq).toFixed(2))?0:parseFloat(nTotLiq).toFixed(2)));
				$("#nTICMS").val((isNaN(parseFloat(nTotICMS).toFixed(2))?0:parseFloat(nTotICMS).toFixed(2)));
				$("#nTIPI").val((isNaN(parseFloat(nTotIPI).toFixed(2))?0:parseFloat(nTotIPI).toFixed(2)));
				$("#nTBruto").val((isNaN(parseFloat(nTotBruto).toFixed(2))?0:parseFloat(nTotBruto).toFixed(2)));
                maskMoney("nTLiq"); 
                maskMoney("nTICMS");
                maskMoney("nTIPI");                
                maskMoney("nTBruto");
			}  
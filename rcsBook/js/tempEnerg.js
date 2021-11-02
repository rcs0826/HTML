if (fldvlue.trim() != "") {
			
			if(expreg.contains("demonstrativoMaoDeObra")){
				System.out.println("===>> Variável demonstrativoMaoDeObra");
				System.out.println("===>> "+ newcss.convertStringToRow(fldvlue));
				//System.out.println("===>> align=\"" + newcss.htmlID(fldvlue));
				result = result.replaceAll("aling=\""+expreg+"?", "align=\"" + newcss.htmlID(fldvlue.replace("\r\n", "")));
				
			}
			if(expreg.contains("escopo")){
				result = result.replaceAll("aling=\""+expreg+"?", "align=\"" + newcss.htmlID(fldvlue.replace("\r\n", "")));
				
			}
			
			//result = result.replace(expreg, fldvlue);
			result = result.replace(expreg, fldvlue.replace("\r\n", "<br />"));
		} 
		else {
			result = result.replace(expreg, " ");
		}
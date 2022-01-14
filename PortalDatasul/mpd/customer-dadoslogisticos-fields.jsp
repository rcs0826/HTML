<%@ page import="com.totvs.portal.menu.service.UserService" %>
<%@ page import="com.totvs.portal.menu.model.VisibleFields" %>
<%
	UserService userService = new UserService(request);
	VisibleFields[] visibleFields = userService.getVisibleFields("carteira-cliente-repres-detalhe");
%>                    
	<totvs-page-detail-info-group>Informa&ccedil;&otilde;es Log&iacute;sticas</totvs-page-detail-info-group>
	
	<totvs-page-detail-info class="col-xs-6 col-lg-4" title="Dias da semana em que recebe">{{controller.customerDadosLogisticos[0]['dia-receb']}}</totvs-page-detail-info>				
	<totvs-page-detail-info class="col-xs-6 col-lg-4" title="Per&iacute;odo de recebimento">{{controller.customerDadosLogisticos[0]['periodo-receb']}}</totvs-page-detail-info>				

	<totvs-page-detail-info class="col-xs-6 col-lg-4" title="Recebe paletizado">{{controller.customerDadosLogisticos[0]['recebe-paltizado ']}}</totvs-page-detail-info>				
	<totvs-page-detail-info class="col-xs-6 col-lg-4" title="Qual aloca&ccedil;&atilde;o de carga?">{{controller.customerDadosLogisticos[0]['qual-aloc-carga']}}</totvs-page-detail-info>				

	<totvs-page-detail-info class="col-xs-6 col-lg-4" title="Altura do palete">{{controller.customerDadosLogisticos[0]['altur-palete']}}</totvs-page-detail-info>				
	<totvs-page-detail-info class="col-xs-6 col-lg-4" title="Recebe saldo no per&iacute;odo?">{{controller.customerDadosLogisticos[0]['rec-saldo-periodo']}}</totvs-page-detail-info>				
	
	<totvs-page-detail-info class="col-xs-6 col-lg-4" title="Restri&ccedil;&atilde;o grupo de ve&iacute;vulo">{{controller.customerDadosLogisticos[0]['restr-veiculo']}}</totvs-page-detail-info>				
	<totvs-page-detail-info class="col-xs-6 col-lg-4" title="Recebe em feriados nacionais?">{{controller.customerDadosLogisticos[0]['rec-feriad-nac']}}</totvs-page-detail-info>				
	
	<totvs-page-detail-info class="col-xs-6 col-lg-4" title="Qual?">{{controller.customerDadosLogisticos[0]['qual-veic-restr']}}</totvs-page-detail-info>				
	<totvs-page-detail-info class="col-xs-6 col-lg-4" title="Credenciado Chep">{{controller.customerDadosLogisticos[0]['cred-chep']}}</totvs-page-detail-info>				

	<totvs-page-detail-info class="col-xs-6 col-lg-4" title="Perfil de entrega">{{controller.customerDadosLogisticos[0]['perfil-entrega']}}</totvs-page-detail-info>				
	<totvs-page-detail-info class="col-xs-6 col-lg-4" title="Como ser&aacute; a entrega">{{controller.customerDadosLogisticos[0]['como-sera-entrega']}}</totvs-page-detail-info>				

	<totvs-page-detail-info-group>Condi&ccedil;&otilde;es de Entrega</totvs-page-detail-info-group>
	
	<totvs-page-detail-info class="col-xs-6 col-lg-4" title="Forma de Entrega">{{controller.customerDadosLogisticos[0]['form-entrega']}}</totvs-page-detail-info>				
	<totvs-page-detail-info class="col-xs-6 col-lg-4" title="Exige carga exclusiva">{{controller.customerDadosLogisticos[0]['exige-carega-exclu']}}</totvs-page-detail-info>				
	
	<totvs-page-detail-info class="col-xs-6 col-lg-4" title="% Desconto FOB">{{controller.customerDadosLogisticos[0]['desc-FOB']}}</totvs-page-detail-info>				
	<totvs-page-detail-info class="col-xs-6 col-lg-4" title="Exige Etiqueta?">{{controller.customerDadosLogisticos[0]['exige-etiqueta']}}</totvs-page-detail-info>				
	
	<totvs-page-detail-info class="col-xs-6 col-lg-4" title="Aceita carga misturada c/ outro cliente?">{{controller.customerDadosLogisticos[0]['aceit-carga-mis']}}</totvs-page-detail-info>				
	<totvs-page-detail-info class="col-xs-6 col-lg-4" title="Exige agendamento">{{controller.customerDadosLogisticos[0]['exige-agenda']}}</totvs-page-detail-info>				
	
	<totvs-page-detail-info class="col-xs-6 col-lg-4" title="Necessita de ajudantes?">{{controller.customerDadosLogisticos[0]['necessit-ajud']}}</totvs-page-detail-info>				
	<totvs-page-detail-info class="col-xs-6 col-lg-4" title="Exige hor&aacute;rio de agendamento">{{controller.customerDadosLogisticos[0]['exige-hr-agenda']}}</totvs-page-detail-info>				
	
	<totvs-page-detail-info class="col-xs-6 col-lg-4" title="Qtde de ajudantes necess&aacute;rios">{{controller.customerDadosLogisticos[0]['quant-ajudante']}}</totvs-page-detail-info>				
	<totvs-page-detail-info class="col-xs-6 col-lg-4" title="Exige hor&aacute;rio de agendamento">{{controller.customerDadosLogisticos[0]['exige-dados-nf-agend']}}</totvs-page-detail-info>				
	
	<totvs-page-detail-info class="col-xs-6 col-lg-4" title="Zona de restri&ccedil;&atilde;o de ve&iacute;culo?">{{controller.customerDadosLogisticos[0]['zona-restr-veic']}}</totvs-page-detail-info>				
	<totvs-page-detail-info class="col-xs-6 col-lg-4" title="Capacidade de Volume M&aacute;ximo">{{controller.customerDadosLogisticos[0]['capac-vol-max-receb']}}</totvs-page-detail-info>				
	
	<totvs-page-detail-info class="col-xs-6 col-lg-4" title="Aceita cargas com SKUs misturados">{{controller.customerDadosLogisticos[0]['aceit-Item-mis']}}</totvs-page-detail-info>				
	
	
	
	

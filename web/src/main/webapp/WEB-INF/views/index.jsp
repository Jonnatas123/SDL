<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<script type="text/javascript" src='<c:url value="/static/lib/min/jquery.min.js" /> '></script>
	<script type="text/javascript" src='<c:url value="/static/lib/jquery.toaster.js" /> '></script>
	
	<script type="text/javascript" src='<c:url value="/static/lib/bootstrap-3.3.6/js/bootstrap.min.js" />' ></script>
	<script type="text/javascript" src='<c:url value="/static/lib/ol/v3.18.2-dist/ol.js" />'></script>
	<script type="text/javascript" src='<c:url value="/static/lib/ol/ol-popup.js"/>'></script>
	<script type="text/javascript" src='<c:url value="/static/lib/filestyle/jquery-filestyle.js"/>'></script>
	
	<script type="text/javascript" src='<c:url value="/static/lib/js/mapa.js" />'></script>
	<script type="text/javascript" src='<c:url value="/static/lib/js/model.js" />'></script>
	<script type="text/javascript" src='<c:url value="/static/lib/js/view.js"/>'></script>
	<script type="text/javascript" src='<c:url value="/static/lib/js/controller.js"/>'></script>
	
	<script type="text/javascript" src='<c:url value="/static/lib/js/menu.js"/>'></script>

	<!-- importação de css -->
	<link type="text/css" rel="stylesheet" href='<c:url value="/static/lib/bootstrap-3.3.6/css/bootstrap.min.css" />'>
	<link type="text/css" rel="stylesheet" href='<c:url value="/static/lib/ol/v3.18.2-dist/ol.css"/>'>
	<link type="text/css" rel="stylesheet" href='<c:url value="/static/lib/filestyle/jquery-filestyle.css"/>'>
	<link type="text/css" rel="stylesheet" href='<c:url value="/static/lib/css/style.css"/>'>
	<link type="text/css" rel="stylesheet" href='<c:url value="/static/lib/css/menu.css"/>'>
	
	<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title></title>
</head>
<body>	
	<%@include  file="/WEB-INF/static/menu.html" %>
	
	<div id="preparando">
		<div class="conteudo">
			<img alt="" src='<c:url value="/static/lib/img/simova_loading_white.gif"/>' />
			<p>Aguarde...</p>
		</div>
	</div>
	
	<div id="map" class="map">
	</div>
	<div class="sdlControls ol-unselectable ol-control">
		<button>
			<span class="glyphicon glyphicon-pencil btnPintar" aria-hidden="true"></span>
		</button>
		<button>
			<span class="glyphicon glyphicon-hand-up btnVisuDetal" aria-hidden="true"></span>
		</button>
		<button id="btnRemoveFeatureId" style="display: none">
			<span class="glyphicon glyphicon-remove btnRemoveFeature"></span>
		</button>
	</div>
	

	<%@include  file="/WEB-INF/static/modalSalvar.html" %>
	<%@include  file="/WEB-INF/static/modalAutomatic.html" %>
	
	<script type="text/javascript">
		$(function() {
			$('.dropdown-toggle').dropdown();
			var idLocal = <c:out value="${local['id']}"></c:out>;
			var areas = [];
			<c:forEach items="${local['areasLocal'] }" var="area">
				codAreaLocal = '<c:out value="${area.codigo }"></c:out>';
				descAreaLocal = '<c:out value="${area.descricao }"></c:out>';
				areas.push(new AreaLocal(null, codAreaLocal, descAreaLocal));
			</c:forEach>
		
			var local = new Local(idLocal, null, null, null, areas);
			
			//Set Objeto Usuario

			var id = <c:out value="${usuario['id']}"></c:out>;
			var isAdm = <c:out value="${usuario['isAdm']}"></c:out>
			var usuario = new Usuario(id, null, null, isAdm);
			
			var model = new Model();
			view = new View(model, {
				'modificar': $('.btnModify'),
				'paintManual' : $('.btnPintar'),
				'removeFeatureId' : $('#btnRemoveFeatureId'),
				'removeFeature': $('.btnRemoveFeature'),
				'painelPrerando' : $('#preparando'),
				'usuario' : $('#usuario'),
				'buscarArea' : $('#buscaArea'),
				'visualizarDeta' : $('.btnVisuDetal'),
 				'modalAutomatic' : {
					'this' : $('#btnModal'),
					'verticeAdd': $('#btnModal #btnAddVert'),
					'next' : $('#savePaint'),
					'import': $('#btnModal input:file'),
					'formModal': $('#btnModal #formModal'),
					'gifLoad' : $('#btnModal .loadFile'),
					'plusInfo' : {
						'this' : $('#btnModal .plusInfo'),
						'erroCampos' : $('#btnModal .plusInfo .erroCampos'),
						'arrayIncorreto' : $('#btnModal .plusInfo .arrayIncorreto'),
						'arrayIncorretoImpt' : $('#btnModal .plusInfo .arrayIncorretoImpt'),
						'arrayInc' : $('#btnModal .plusInfo .arrayInc')
					},
				},
				'modalSalvar' : {
					'this' : $('#formSalvar'),
					'formModal': $('#formSalvar #formModalSalvar'),
					'plusInfo' : {
						'this' : $('#formSalvar .plusInfo'),
						'erroCampos': $('#formSalvar .plusInfo .erroCampos'),
						'falhaSalvar' : $('#formSalvar .plusInfo .falhaSalvar'),
					},
					'btnSave' : $('#formSalvar #save')
				},
				'modalLogOperacoes' : {
					'this' : $('#modalLogOperacoes'),
				}
			}, usuario, local);
			var controller = new Controller(model, view);
			view.show();
		});
	</script>
	
</body>
</html>
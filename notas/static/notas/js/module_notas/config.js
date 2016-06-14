/*
* Controllers configuration
*/
/*angular.module("notas.config",[])
.constant('config',{
    chart_lines:'#f5f5f5',
    primary_color:'#009688',
    secondary_color:'#FF5252',
    danger_color:'#C62828',
    color_warning:'#F2B53F'
});*/

window.assistant.app.constant('_', window._);

window.assistant.app.run(['$rootScope', '$resource', function($rootScope,$resource){
	$rootScope._ = window._; 
	/* Aqui se filtra y setea la sede e institucion */	
	$rootScope.institucion_id = angular.element('body').data('institucion-id');
	$rootScope.sede_id = angular.element('body').data('sede-id');
	$rootScope.token_ui = angular.element('body').data('token-ui');
	$rootScope.abc = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

	$rootScope.meses = [
		{id: 1, nombre: "enero"},
		{id: 2, nombre: "febrero"},
		{id: 3, nombre: "marzo"},
		{id: 4, nombre: "abril"},
		{id: 5, nombre: "mayo"},
		{id: 6, nombre: "junio"},
		{id: 7, nombre: "julio"},
		{id: 8, nombre: "agosto"},
		{id: 9, nombre: "setiembre"},
		{id: 10, nombre: "octubre"},
		{id: 11, nombre: "noviembre"},
		{id: 12, nombre: "diciembre"}
	];
	
}]);
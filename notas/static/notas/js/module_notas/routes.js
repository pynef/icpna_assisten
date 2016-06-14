'use strict';
//http://127.0.0.1:8080/static/notas/js/module_notas/app.js
//console.log(window.assistant.settings['path']);
window.assistant.app.config(['$stateProvider',
	function($stateProvider){
		$stateProvider
			.state('index', {
				url: '',
				views: {
					'content':{
						templateUrl: window.assistant.settings['path'] + 'views/index.html',
						controller: 'indexCtrl',
					},
				}
			})
			.state('index.detail', {
				url: '/detalle/:cursoId/:ofertaId/:calendarioId',
				views: {
					'contentDetail':{
						templateUrl: window.assistant.settings['path'] + 'views/detalle.html',
						controller: 'detailCtrl',
					},
				}
			})			
		
}]);
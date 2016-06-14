/*
 module_configuracion
 */
'use strict';

nconfApp.config(['$stateProvider',
	function($stateProvider){
		$stateProvider
			.state('home',{
				url: '',
				views: {
					'content':{
						templateUrl: '/static/configuracion/js/module_configuracion/views/home.html',
						controller: 'HomeCtrl',
					}
				}
			})
			.state('home.anual',{
				url: '/anual',
				views: {
					'anualContent':{
						templateUrl: '/static/configuracion/js/module_configuracion/views/anual.html',
						controller: 'AnualCtrl',
					}
				}
			})
			.state('home.mensual',{
				url: '/mensual',
				views: {
					'anualContent':{
						templateUrl: '/static/configuracion/js/module_configuracion/views/mensual.html',
						controller: 'MensualCtrl',
					}
				}
			})
			.state('home.mensual.detalles',{
				url: '/detalles/:tipo/:id',
				views: {
					'detallesContent':{
						templateUrl: '/static/configuracion/js/module_configuracion/views/detalles_mensual.html',
						controller: 'detallesMensualCtrl',
					}
				}
			})
			.state('home.mensual.modificar',{
				url: '/modificar/:tipo/:mes/:id',
				views: {
					'detallesContent':{
						templateUrl: '/static/configuracion/js/module_configuracion/views/modificar_mensual.html',
						controller: 'modificarMensualCtrl',
					}
				}
			})
			.state('home.mensual.trasladar',{
				url: '/trasladar/:tipo/:id',
				views: {
					'detallesContent':{
						templateUrl: '/static/configuracion/js/module_configuracion/views/trasladar_mensual.html',
						controller: 'trasladarMensualCtrl',
					}
				}
			})
	}]);

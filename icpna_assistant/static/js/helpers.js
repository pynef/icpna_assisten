angular.module('ryHelpers', [])
.factory('$helpers', 
	['$http', function($http) {
	var doRequest = function(method, module, path, params) {
		if ( method == 'GET' ) {
			return $http({
				method: method,
				url: module + path,
				params: params
			});
		} else if ( method == 'POST' ) {
			return $http({
				method: method,
				url: module + path,
				data: params,
				/*transformRequest: function(obj) {
					var str = [];
					for(var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
					return str.join("&");
				},*/
				/*headers: {'Content-Type': 'application/x-www-form-urlencoded'}*/
			});
		} else if ( method == 'PUT' ) {
			return $http({
				method: method,
				url: module + path,
				data: params,
				/*transformRequest: function(obj) {
					var str = [];
					for(var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
					return str.join("&");
				},*/
				/*headers: {'Content-Type': 'application/x-www-form-urlencoded'}*/
			});
		}
	}
	return {
		error: function(err) {
			alertify.set('notifier','position', 'bottom-left'); 

			if ( err && err.data && err.data.Message ) {
				// alert(err.data.Message);
				alertify.notify(err.data.Message, 'success hidden-print', 10, function(){ });
			} else if ( err && err.Message ) {
				// alert(err.Message);
				alertify.notify(err.Message, 'custom hidden-print', 10, function(){ });
			} else if( err && err.msg && err.type == 'w' ){
				alertify.warning(err.msg);  
			} else if ( err && err.msg ) {
				// alert(err.msg);
				alertify.notify(err.msg, 'success hidden-print', 10, function(){ });
			} else {
				// alert("Oops! Tu solicitud no se completó correctamente.");
				alertify.warning("Oops! Tu solicitud no se completó correctamente.");  
			}
		},
		getter: function(module, path, params) {
			//var module = ;
			return doRequest('GET', '/', path, params);
		},
		setter: function(module, path, params) {
			//var module = ;
			return doRequest('POST', '/', path, params);
		},
		put: function(module, path, params) {
			//var module = ;
			return doRequest('PUT', '/', path, params);
		},
		schema: function(fields) {
			//fields.csrfmiddlewaretoken = window.ALPACANOW.helpers.token();
			return {
				'restore': function() {
					this.fields = angular.copy(this.backup);
				},
				'match': function(data) {
					for(var o in data) {
						this.fields[o] = data[o];
						this.backup[o] = data[o];
					}
				},
				'matchTo': function(data, to) {
					for(var o in data) {
						to[o] = data[o];
					}
				},
				'fields': fields,
				'backup': angular.copy(fields),
				'status': {'code': undefined, 'msg': undefined, 'visible': false}, 
			};
		},		
		authorize: {
			analize: function(tabla, crud) {   
				var ICPNA = window.ICPNA||undefined;
				if ( ICPNA && ICPNA['current'] && ICPNA['current'].permissions ) {
					// console.log(tabla);
					var retorno = undefined;
					switch (crud) {
						case "c":
							retorno = _.findWhere(ICPNA['current'].permissions, { tabla: tabla, 'c': true });
							break;
						case "r":
							retorno = _.findWhere(ICPNA['current'].permissions, { tabla: tabla, 'r': true });
							break;
						case "u":
							retorno = _.findWhere(ICPNA['current'].permissions, { tabla: tabla, 'u': true });
							break;
						case "d":
							retorno = _.findWhere(ICPNA['current'].permissions, { tabla: tabla, 'd': true });
							break;
					}
					return retorno?true:false;
				} else {
					return false;
				}
			}
		}
	};
}])
.directive('ryHelpersAuth', ['$helpers', function($helpers){
	return {
		restrict: 'A',
		link: function($scope, element, attrs) {
			if ( !$helpers.authorize.analize(attrs['ryTable'], attrs['ryCrud']) ) {
				var padre = element.parent();

				// Si asignamos el atributo de Message y la asignacion del permiso es True
				// eliminara el elemento y en el padre mostrara el Mensaje que asignamos.
				if( attrs['ryMessage'] !== undefined ){ 
					element.remove();
					padre.append("<strong class='col-sm-12 pull-left'>"+attrs['ryMessage']+"</strong>");
				}
				else {
					element.remove();
				}

				/*
				if ( attrs['ryThen'] !== undefined ) {
					if ( attrs['ryThen'] == 'remove' ) {
						element.remove();
					}
				} else if( attrs['ryMessage'] !== undefined ){ 
					padre.append("<strong class='col-sm-12 pull-left'>"+attrs['ryMessage']+"</strong>");
				} else {
					element.remove();
				}
				*/
			}
		}
	};
}])
.directive('ryUbigeoDistrito',['$rootScope', 'UbigeoService', 
	function ($rootScope, UbigeoService) {
	return {
		restrict: 'EA',
		require: 'ngModel',
		template: '<option ng-repeat="item in distritos" value="{{ item.id }}">{{ item.nombre }}</option>',
		scope:{},
		link: function(scope, element, attrs, ngModelController){
			ngModelController.$formatters.unshift(function (valueFromModel) { 
				if(valueFromModel){
					console.log("yes");
					var dep_id = valueFromModel.substr(0,2);
					var prov_id = valueFromModel.substr(2,2);
					var dist_id = valueFromModel.substr(4,2).trim();
					UbigeoService.distritos({idDepartamento: dep_id, idProvincia: prov_id})
						.$promise.then(
							function(data){
								scope.distritos = data;
								$timeout(function(){
									ngModelController.$modelValue = valueFromModel;
								}, 500);
								console.log("===|", ngModelController);
							},
							function(error){
							}
					);
				}
		});
	  }
	}
}])
.directive('ryHumanSubmit',['$timeout', '_', function($timeout, _) {
	return {
		link: function(scope, element, attrs, ngModelController){
			var btnSubmitList = [];
			
			_.each(element.find("button[type=submit]"), function(el){
				var $el = angular.element(el);
				$el.data('text', $el.text());
				btnSubmitList.push($el);
			});
			element.on("submit", function($event){
				_.each(btnSubmitList, function($el){
					$el.prop("disabled", true).text("Sending...");
				});
				if ( attrs.ryHumanSubmit != undefined ) {
					scope[attrs.ryHumanSubmit]($event);
				}
				$timeout(function(){
					_.each(btnSubmitList, function($el){
						$el.prop("disabled", false).text($el.data('text'));
					});
				}, 2000);
			});
		}
	}
}])
.directive('ryLoad', [function(){
	return {
		template: '<div class="text-center"><img src="/Content/res/loader_dots_black.gif"></div>',
		link: function(scope){
		}
	}
}])
.directive('ryViewLoader', function(){
	return {
		restrict: 'A',
		//scope: {},
		link: function (scope, element) {
			scope.$on('$stateChangeStart', function (e, toState) {
				if (element.parents('[ui-view]').length === toState.name.split('.').length - 1) {
					element.html('<div class="text-center"><img src="/Content/res/loader_dots_black.gif"></div>');
					//console.log("nop");
				}
			});

			scope.$on('$viewContentLoaded', function () {
				//console.log("step 2");
				//element.removeClass('loading-state');
			});
		}
	};
})
.filter('capitalize', function() {
	return function(input) {
		return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
	}
})
.filter('mesToString', function() {
	return function(mes) {
		if ( mes == "1" || mes == 1 ) {
			return "Enero";
		} else if ( mes == "2" || mes == 2 ) {
			return "Febrero";
		} else if ( mes == "3" || mes == 3 ) {
			return "Marzo";
		} else if ( mes == "4" || mes == 4 ) {
			return "Abril";
		} else if ( mes == "5" || mes == 5 ) {
			return "Mayo";
		} else if ( mes == "6" || mes == 6 ) {
			return "Junio";
		} else if ( mes == "7" || mes == 7 ) {
			return "Julio";
		} else if ( mes == "8" || mes == 8 ) {
			return "Agosto";
		} else if ( mes == "9" || mes == 9 ) {
			return "Septiembre";
		} else if ( mes == "10" || mes == 10 ) {
			return "Octubre";
		} else if ( mes == "11" || mes == 11 ) {
			return "Noviembre";
		} else if ( mes == "12" || mes == 12 ) {
			return "Diciembre";
		} else {
			return "Desconocido";
		}
	};
})
.filter('turnoToString', function() {
	return function(turno) {
		return turno==="M"?"Mañana":turno==="T"?"Tarde":turno==="N"?"Noche":turno==="D"?"Todo el día":"Desconocido";
	};
})
.filter('diaToString', function() {
	return function(dia) {
		return (dia==="1" || dia===1)?"Lunes":(dia==="2"||dia===2)?"Martes":(dia==="3"||dia===3)?"Miercoles":(dia==="4"||dia===4)?"Jueves":(dia==="5"||dia===5)?"Viernes":(dia==="6"||dia===6)?"Sabado":(dia==="7"||dia===7)?"Domingo":"Desconocido";
	};
})
.filter('translateMes', function() {
	return function(mes) {
		if ( mes == "January" ) {
			return "Enero";
		} else if ( mes == "February" ) {
			return "Febrero";
		} else if ( mes == "March" ) {
			return "Marzo";
		} else if ( mes == "April" ) {
			return "Abril";
		} else if ( mes == "May" ) {
			return "Mayo";
		} else if ( mes == "June" ) {
			return "Junio";
		} else if ( mes == "July" ) {
			return "Julio";
		} else if ( mes == "August" ) {
			return "Agosto";
		} else if ( mes == "September" ) {
			return "Septiembre";
		} else if ( mes == "October" ) {
			return "Octubre";
		} else if ( mes == "November" ) {
			return "Noviembre";
		} else if ( mes == "December" ) {
			return "Diciembre";
		} else {
			return "Desconocido";
		}
	};
});
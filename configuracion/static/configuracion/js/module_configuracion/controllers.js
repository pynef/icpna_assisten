/*
 module_configuracion
 */
'use strict';

nconfApp
.controller('HomeCtrl',
    ['$scope','$state', '$helpers', 
    function($scope, $state, $helpers){
        // $scope.titulo = "Title";
        // $scope.all = window.assistant.data;
        // console.log($scope.all);
    }
])
.controller("NavCtrl", 
    ["$scope",
    function ($scope) { 

        $scope.toggleAlternativeMenu = function(){
            $('body .page-wrapper').toggleClass('nav-style--alternative');
        };

    }
])
.controller('HomeFabCtrl', function($scope) {
  $scope.demo = {
      isOpen: false,
      selectedMode: 'md-scale',
      selectedDirection: 'right'
  };
})
.controller('MenuRightCtrl', function($scope) {
  $scope.demo = {
      isOpen: false,
      selectedMode: 'md-scale',
      selectedDirection: 'left'
  };
})
.controller("AnualCtrl", 
    ["$q", "$helpers", "$scope", "$http", "programaService", "nivelService", "configuracionService", 
    function ($q, $helpers, $scope, $http, programaService, nivelService, configuracionService) {

        $scope.Initializing = function (inst, sede, token)
        {
            // Obtención de la fecha actual

            var d = Date.now();
            var fecha_hora_hoy = new Date(d);

            // Scopes para el año actual y nota máxima por defecto

            $scope.anio_config = fecha_hora_hoy.getFullYear();
            $scope.nota_config = 20;

            // Scopes para iniciar los selects en --SELECCIONE

            $scope.idPrograma = 0;
            $scope.idNivel = 0;
            $scope.componente_symbol = 0;
            $scope.componentes = [];

            // Consulta de programas por institución y sede
            
            var deferred = $q.defer();

            programaService.get({inst: inst, sede: sede, token: token},
                    function (res)
                    {
                        deferred.resolve(res);
                        $scope.programas = deferred.promise.$$state.value;
                    },
                    function (err)
                    {
                        deferred.reject("Error: Status request" + status);
                    }
                );

        }               

        // Función que retorna los niveles al cambiar de programa

        $scope.cambioPrograma = function(inst, sede, idPrograma, token)
        {
            $scope.idNivel = 0;

            // Consulta de niveles por institución, sede y programa

            var deferred = $q.defer();

            nivelService.get({inst: inst, sede: sede, programa: idPrograma, token: token},
                    function (res)
                    {
                        deferred.resolve(res);
                        $scope.niveles = deferred.promise.$$state.value;
                    },
                    function (err)
                    {
                        deferred.reject("Error: Status request" + status);
                    }
                );
        };

        // Función que retorna la configuración anual establecida al cambiar de nivel

        $scope.estadoBusqueda = 0;
        $scope.cambioNivel = function(inst, sede, idNivel, anio, token)
        {
            // $scope.nota_config = 10;
            $scope.calif_config = '';

            // Consulta de configuración anual por institución, sede, nivel y año

            var deferred = $q.defer();

            configuracionService.anual({inst: inst, sede: sede, nivel: idNivel, anio: anio, token: token},
                    function (res)
                    {
                        deferred.resolve(res);
                        var config = deferred.promise.$$state.value;
                        
                        // $scope.abierto = config.estado;

                        if(config.id == undefined){
                            $scope.abierto = 1;
                            $scope.crearComponente = 0; 
                        }else{
                            $scope.abierto = config.estado;
                            $scope.crearComponente = 1; 
                        }


                        $scope.config = config.id;
                        $scope.nota_config = config.nota_max;
                        $scope.calif_config = config.calificacion;

                        $scope.estadoBusqueda = 1;

                    },
                    function (err)
                    {
                        deferred.reject("Error: Status request" + status);
                    }
                );

            // Consulta de componentes anual por institución, sede, nivel y año

            var deferred1 = $q.defer();

            configuracionService.componentes(
                {
                    inst: inst,
                    sede: sede, 
                    nivel: idNivel, 
                    anio: anio, 
                    token: token
                },
                    function (res)
                    {
                        deferred1.resolve(res);
                        $scope.componentes = deferred1.promise.$$state.value; 

                        $scope.nuevoItemStatus = [];
                        // $scope.items = [];

                        $scope.conteo = 0;
                        for (var i = 0; i < $scope.componentes.length; i++)
                        {
                            for (var j = 0; j < $scope.componentes[i].items_c.length; j++)
                            {
                                $scope.conteo = $scope.conteo + $scope.componentes[i].items_c[j].rango_max;
                            }
                        }
                        // console.log($scope.conteo);
                        

                        if($scope.componentes.length > 0){
                            $helpers.error({"msg":"Componentes cargados."});
                        }else{
                            $helpers.error({"msg":"No se encuentran componentes."});
                        }

                    },
                    function (err)
                    {
                        deferred1.reject("Error: Status request" + status);
                    }
                );         
        };

        $scope.EstablecerConfiguracion = function (inst, sede, id_prog, niv_id, anio, nota, calif, user, token)
        {
            var config_anual = {
                'institucion_id': inst, 
                'sede_id': sede, 
                'programa_id': parseInt(id_prog), 
                'nivel_id': parseInt(niv_id), 
                'anio': anio, 
                'nota_max': parseInt(nota), 
                'calificacion': calif, 
                'user': user,
                'token': token
            };
            console.log(config_anual);

            
            configuracionService.reg_config($.param(config_anual))
                .$promise.then(
                    function (data)
                    {
                        $helpers.error({'msg': 'Configuración registrada satisfactoriamente'});
                        $scope.config = data.id;
                    },
                    function (error)
                    {
                        $helpers.error({'msg': 'No se pudo registrar la configuración'});
                    }
                );           
        };

        $scope.nuevoComponente = function(){
            $scope.nuevoComponenteStatus = 1;
            $scope.id = 0;
            $scope.accion = 'guardar';
            $scope.openComponenteStatus = 0;
        };
        $scope.cancelarComponente = function(){
            $scope.nuevoComponenteStatus = 0;
            $scope.componente_name = '';
            $scope.componente_symbol = '0';
        };
        $scope.guardarComponente = function(id, inst, sede, niv_id, config, name, abrev, anio, token, accion){
            $scope.nuevoComponenteStatus = 0;

            var componente_anual = {
                'id': id,
                'institucion_id': inst, 
                'sede_id': sede, 
                'config_id': config, 
                'nombre': name, 
                'simbolo': abrev,
                'token': token
            }

            if (accion == 'guardar')
            {
                configuracionService.reg_componente($.param(componente_anual))
                    .$promise.then(
                        function (data)
                        {
                            $helpers.error({'msg': 'Componente registrado satisfactoriamente'});
                            $scope.componentes.push(data);
                        },
                        function (error)
                        {
                            $helpers.error({'msg': 'No se pudo registrar el componente'});
                        }
                    );
            }
            else if (accion == 'editar')
            {
                configuracionService.act_componente($.param(componente_anual))
                    .$promise.then(
                        function (data)
                        {
                            console.log(data);
                            _.extend(_.findWhere($scope.componentes, { id: data.modelo.id }), data.modelo);

                            $helpers.error({'msg': 'Componente actualizado satisfactoriamente'});
                            //$scope.componentes.push(data);
                        },
                        function (error)
                        {
                            $helpers.error({'msg': 'No se pudo actualizar el componente'});
                        }
                    );
            }        

            $scope.componente_name = '';
            $scope.componente_symbol = '0';
        };

        $scope.editaComponente = function(component)
        {
            $scope.nuevoComponenteStatus = 1;
            $scope.componente_name = component.nombre;
            $scope.componente_symbol = component.simbolo;
            $scope.id = component.id;
            $scope.accion = 'editar';
        }

        $scope.eliminaComponente = function(component, token)
        {
            if (confirm('¿Está seguro de eliminar este componente y todos sus items?'))
            {
                $scope.componentes = _.without( $scope.componentes, _.findWhere($scope.componentes, {id: component.id}));
            }
        }

        $scope.openComponente = function(){
            $scope.nuevoComponenteStatus = 0;
        };
        $scope.nuevoItem = function(x){
            $scope.nuevoItemStatus[x] = true;
        };
        $scope.guardarItem = function(x, inst, sede, comp, name, desc, rmin, rmax, user, token){
            $scope.nuevoItemStatus[x] = false;

            if (desc == undefined)
            {
                desc = '';
            };

            /*console.log($scope.calif_config);
            return;*/

            if(rmax == 0 && $scope.calif_config == "NUMÉRICA" ){
                alert("El valor debe ser numero y superior a cero.");
                return;
            };

            if( (parseInt($scope.conteo) + parseInt(rmax)) > parseInt($scope.nota_config) && $scope.calif_config == "NUMÉRICA" ){
                alert("El valor de Rango debe ser inferior.");
                return;
            };

            var item_anual = {
                'institucion_id': inst,
                'sede_id': sede,
                'componente_id': comp,
                'nombre': name,
                'descripcion': desc,
                'rango_min': rmin,
                'rango_max': rmax,
                'user': user,
                'token': token
            };

            $helpers.error({'msg': 'Se esta creando el componente, espere un momento.'});

            // configuracionService.reg_item(item_anual) 
            configuracionService.reg_item($.param(item_anual))
                .$promise.then(
                    function (data)
                    {
                        $scope.conteo = $scope.conteo + parseInt(rmax);
                        $scope.real = _.findWhere($scope.componentes, {id: parseInt(comp)}); 
                        // console.log($scope.real);

                        if( $scope.real.items_c == null ){
                            $scope.real.items_c = {};
                        }

                        $scope.real.items_c.push(data.MODEL);
                        $helpers.error({'msg': 'Item registrado satisfactoriamente.'});
                    },
                    function (error)
                    {
                        $helpers.error({'msg': 'No se pudo registrar el item'});
                    }
                );
        };
        $scope.cancelarItem = function(x){
            $scope.nuevoItemStatus[x] = false;
        };

        /*
        $scope.buscarComponente = function(){
            $scope.buscarComponenteStatus = 1;
        };
        */

    }
])
.controller("MensualCtrl", 
    ["$q", "$scope", "$http", "$helpers", "programaService", "nivelService", "cursoService", "procesaInfoService",
    function ($q, $scope, $http, $helpers, programaService, nivelService, cursoService, procesaInfoService) {

        $scope.Initializing = function (inst, sede, token){
            var d = Date.now();
            var fecha_hora_hoy = new Date(d);

            $scope.anio_config = fecha_hora_hoy.getFullYear();

            $scope.meses = [{id: 1, nombre: "enero"}, {id: 2, nombre: "febrero"}, {id: 3, nombre: "marzo"}, {id: 4, nombre: "abril"}, {id: 5, nombre: "mayo"}, {id: 6, nombre: "junio"},
              {id: 7, nombre: "julio"}, {id: 8, nombre: "agosto"}, {id: 9, nombre: "setiembre"}, {id: 10, nombre: "octubre"}, {id: 11, nombre: "noviembre"}, {id: 12, nombre: "diciembre"}
            ];

            $scope.idPrograma = 0;
            $scope.idNivel = 0;
            $scope.mes_config = 0;

            var deferred = $q.defer();

            programaService.get({inst: inst, sede: sede, token: token},
                    function (res)
                    {
                        deferred.resolve(res);
                        $scope.programas = deferred.promise.$$state.value;
                    },
                    function (err)
                    {
                        deferred.reject("Error: Status request" + status);
                    }
                );            
        }        

        $scope.cambioPrograma = function(inst, sede, idPrograma, token){
            var deferred = $q.defer();

            nivelService.get({inst: inst, sede: sede, programa: idPrograma, token: token},
                    function (res)
                    {
                        deferred.resolve(res);
                        $scope.niveles = deferred.promise.$$state.value;
                    },
                    function (err)
                    {
                        deferred.reject("Error: Status request" + status);
                    }
                );
        };

        $scope.cambioNivel = function (inst, sede, idPrograma, idNivel, anio, mes, token){
            var deferred = $q.defer();

            procesaInfoService.get({inst: inst, sede: sede, nivel: idNivel, programa: idPrograma, anio:anio, mes:mes, token: token},
                    function (res)
                    {
                        deferred.resolve(res); 
                        $scope.recData_mensaje = res.mensaje;
                        $scope.listaGrupos = res.data;
                    },
                    function (err)
                    {
                        deferred.reject("Error: Status request" + status);
                    }
                );
        };

        $scope.verDetalles = function(tipo, id){
            console.log(tipo);
            console.log(id);
        };

        $scope.nuevoComponente = function(){
            $scope.nuevoComponenteStatus = 1;
            $scope.openComponenteStatus = 0;
        };
        $scope.cancelarComponente = function(){
            $scope.nuevoComponenteStatus = 0; 
        };
        $scope.guardarComponente = function(){
            $scope.nuevoComponenteStatus = 0; 
        };
        $scope.openComponente = function(){
            $scope.openComponenteStatus = 1;
            $scope.nuevoComponenteStatus = 0;
        };

        $scope.buscarComponente = function(){
            $scope.buscarComponenteStatus = 1;
        };

    }
])
.controller("detallesMensualCtrl",
    ["$q", "$scope", "$rootScope", "$state", "$http", "$helpers", "configuracionService",
    function($q, $scope, $rootScope, $state, $http, $helpers, configuracionService){ 
 
        configuracionService.consultarComponentes(
                {
                    inst: $rootScope.institucion_id,
                    sede: $rootScope.sede_id, 
                    tipo: $state.params.tipo, 
                    id: $state.params.id, 
                    consulta: "ConsultarComponentes"+$state.params.tipo, 
                    token: $rootScope.token_ui
                }
            )
            .$promise.then(
                function(data){
                    console.log(data);
                    $scope.componentes = data.componentes;
                },
                function(error){
                    console.log(error);
                }
            );
 
    }
])
.controller("modificarMensualCtrl",
    ["$q", "$scope", "$rootScope", "$state", "$http", "$helpers", "$window","componenteConfServ", "creaGrupo",
    function($q, $scope, $rootScope, $state, $http, $helpers, $window, componenteConfServ, creaGrupo){ 
    
        componenteConfServ.GetDataModificarGrupo(
            {
                consulta: 'GetDataModificarGrupo'+$state.params.tipo,
                id:$state.params.id, 
                mes:$state.params.mes, 
                token: $rootScope.token_ui
            })
            .$promise.then(
                function(data){ 
                    $scope.mensaje = data.mensaje; 
                    $scope.componentes = data.componentes; 
                    $scope.configuracion = data.configuracion; 
                    $scope.nota_maxima = data.configuracion.nota_max; 
                    $scope.cursos = data.cursos; 

                },
                function(error){
                    console.log(error);
                }
            );

        $scope.abc = $rootScope.abc;
        $scope.meses = $rootScope.meses; 

        $scope.cambia = function(id,estado){

            if(estado){ 
              var elemento = _.findWhere($scope.cursos, {id: id});
              elemento.estado = false; 
            }
            else{ 
              var elemento = _.findWhere($scope.cursos, {id: id});
              elemento.estado = true; 
            }             
        };

        $scope.irCrear = function(){
            $scope.vistaCrearComponente = 1;
            $scope.btnGuardar = 1;
            $scope.btnEditar = 0;
            $scope.componente = {};
        };

        $scope.cerrarCrear = function(){
            $scope.btnGuardar = 0;
            $scope.btnEditar = 0;
            $scope.vistaCrearComponente = 0;
        };

        $scope.agregaComponente = function(componente){ 
            componente.items_c = [];
            $scope.componentes.push(componente);
            $scope.vistaCrearComponente = 0;
        };

        $scope.irEditarComponente = function(componente){
            $scope.btnGuardar = 0;
            $scope.btnEditar = 1;
            $scope.back_componente = angular.copy(componente);
            $scope.componente = angular.copy(componente);
            $scope.vistaCrearComponente = 1;
        };

        $scope.editaComponente = function(componente){
            console.log(componente);
            _.extend(_.findWhere($scope.componentes, { nombre: $scope.back_componente.nombre }), componente);
            $scope.vistaCrearComponente = 0;
        };

        $scope.eliminaComponente = function(componente){   
            $scope.componentes = _.without($scope.componentes, _.findWhere($scope.componentes, {nombre: componente.nombre}));
        };

        /* ITEMS */
        $scope.irCrearItem = function(posicion){
            $scope.posicionCompItem = posicion;
            $scope.item = {};
            $scope.vistaCrearItem = 1;
            $scope.btnAgregaItem = 1;
            $scope.btnEditaItem = 0;
        };

        $scope.cerrarItem = function(){
            $scope.vistaCrearItem = 0;
        };

        $scope.agregaItem = function(item){
            $scope.componentes[$scope.posicionCompItem].items_c.push(item);
            $scope.vistaCrearItem = 0;
        };

        $scope.editaItem = function(item){
            $scope.btnEditaItem = 1;
            $scope.btnAgregaItem = 0;
        };

        /* Terminar Proceso */
        $scope.terminarProceso = function(){

            var datas = {};
            datas.configuracion = $scope.configuracion;
            datas.cursos = _.where($scope.cursos, {estado:true});
            datas.componentes = $scope.componentes;

            var envio = {}
            envio.data = JSON.stringify(datas); 
            envio.token = $rootScope.token_ui;

            creaGrupo.crear_grupo($.param(envio))
                .$promise.then(
                    function(data){
                        $helpers.error({"msg":"Guardado con exito."});
                        setTimeout(function(){
                            $helpers.error({"msg":"Se RECARGARA AUTOMATICAMENTE"});
                            // $state.go("home.mensual");
                            $window.location.reload();
                        }, 3000);
                    },
                    function(error){
                        console.log(error);
                    }
                );

        };

        $scope.cancelarProceso = function(){ 
            $state.go("home.mensual");
        };

    }
])
.controller("trasladarMensualCtrl",
    ["$q", "$scope", "$rootScope", "$state", "$http", "$helpers",
    function($q, $scope, $rootScope, $state, $http, $helpers){ 
  
    }
]);

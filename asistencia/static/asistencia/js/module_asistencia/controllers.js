/*
 Application controllers
 Main controllers for the app
 */

window.assistant.app
    .controller("indexCtrl", 
        ["$q", "$scope", "$helpers", "docenteService", 
        function ($q, $scope, $helpers, docenteService) {
            
            // Scopes para mostrar el día, mes y año de la fecha que se ingresa al módulo asistencia

            var d = Date.now();
            var fecha_hora_hoy = new Date(d);

            var meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
              "julio", "agosto", "setiembre", "octubre", "noviembre", "diciembre"
            ];

            $scope.dia = fecha_hora_hoy.getDate();
            $scope.mes = meses[fecha_hora_hoy.getMonth()];
            $scope.anio = fecha_hora_hoy.getFullYear();

            // Scope que activa la selección del menú asistencia en el nav

            $scope.nav_asistencia = 'active';

            // Función que consulta los cursos que dicta un docente

            $scope.CargandoCursos = function (inst, sede, user_id, token)
            {
                var deferred = $q.defer();

                docenteService.cursos({inst: inst, sede: sede, user_id: user_id, token: token},
                        function (res)
                        {
                            deferred.resolve(res);
                            $scope.cursos = deferred.promise.$$state.value;
                        },
                        function (err)
                        {
                            deferred.reject("Error: Status request" + status);
                        }
                    );
            }
        }
    ])
    .controller("detailCtrl", 
        ["$q", "$helpers", "$scope", "$stateParams", "cursoService", "asistenciaService", 
        function ($q, $helpers, $scope, $stateParams, cursoService, asistenciaService) {

            $scope.Initializing = function (inst, sede, token)
            {
                // Scope que activa la selección del menú asistencia en el nav

                $scope.nav_asistencia = 'active';


                // Scopes en forma de matrices que almacenan la cantidad de clicks y los colores
                
                $scope.n_clicks = [];
                $scope.color_sin_registro = [];

                for (var i = 0; i < 50; i ++)
                {
                    var colors = [];
                    var clicks = [];

                    for (var j = 0; j < 50; j ++)
                    {
                        colors.push('label bg-gray');
                        clicks.push(0);                    
                    }
                    $scope.color_sin_registro.push(colors);
                    $scope.n_clicks.push(clicks);
                }

                // Consulta de los dias de clase de un curso perteneciente a una determinada oferta académica

                var deferred = $q.defer();

                cursoService.clases({inst: inst, sede: sede, oferta: $stateParams.ofertaId, token: token},
                        function (res)
                        {
                            deferred.resolve(res);
                            $scope.dias = deferred.promise.$$state.value;
                            $scope.number = $scope.dias.length;

                            for (var i = 0; i < $scope.number; i ++)
                            {
                                $scope.dias[i].fecha = new Date(parseInt($scope.dias[i].fecha.substr(6)));
                            }

                            // Consulta de los alumnos matriculados en un curso perteneciente a una determinada oferta académica

                            var deferred1 = $q.defer();

                            cursoService.alumnos({inst: inst, sede: sede, curso: $stateParams.cursoId, oferta: $stateParams.ofertaId, token: token},
                                    function (res)
                                    {
                                        deferred1.resolve(res);
                                        $scope.alumnos = deferred1.promise.$$state.value;

                                        // Consulta de la asistencia de los alumnos matriculados en un curso perteneciente a una determinada oferta académica

                                        var deferred2 = $q.defer();

                                        cursoService.asistencias({inst: inst, sede: sede, curso: $stateParams.cursoId, oferta: $stateParams.ofertaId, token: token},
                                                function (res)
                                                {
                                                    deferred2.resolve(res);
                                                    var asistencias = deferred2.promise.$$state.value;

                                                    for (var i = 0; i < asistencias.length; i ++)
                                                    {                        
                                                        $scope.PintaAsistencia(asistencias[i].matricula_id, asistencias[i].dia_calendario, asistencias[i].tipo);
                                                    }
                                                },
                                                function (err)
                                                {
                                                    deferred2.reject("Error: Status request" + status);
                                                }
                                            );
                                    },
                                    function (err)
                                    {
                                        deferred1.reject("Error: Status request" + status);
                                    }
                                );
                        },
                        function (err)
                        {
                            deferred.reject("Error: Status request" + status);
                        }                        
                    );
            }          

            // Función que retorna un arreglo de números desde 0 hasta parámetro - 1

            $scope.getNumber = function (num)
            {
                return new Array(num);
            }

            // Función para pintar la asistencia ya registrada de un alumno

            $scope.PintaAsistencia = function (mat, dia, tipo)
            {
                var l = $scope.alumnos.length;
                var x;

                for (var i = 0; i < l; i ++)
                {
                    if ($scope.alumnos[i].matricula == mat)
                    {
                        x = i;break;
                    }
                }

                var l = $scope.dias.length;
                var y;

                for (var i = 0; i < l; i ++)
                {
                    if ($scope.dias[i].id == dia)
                    {
                        y = i;break;
                    }
                }

                switch (tipo)
                {
                    case 1: $scope.color_sin_registro[x][y] = 'label bg-success';$scope.n_clicks[x][y] = 1;break;
                    case 2: $scope.color_sin_registro[x][y] = 'label bg-danger';$scope.n_clicks[x][y] = 2;break;
                    case 3: $scope.color_sin_registro[x][y] = 'label bg-info';$scope.n_clicks[x][y] = 3;break;
                    case 4: $scope.color_sin_registro[x][y] = 'label bg-accent';$scope.n_clicks[x][y] = 4;break;
                }
            }

            /* 
                Función para registrar la asistencia de un alumno cambiando el color con cada click (1° click: verde, 
                    2° click: rojo, 3° clik: celeste, 4° click: ambar)
            */

            $scope.CambiaColor = function (x, y, inst, sede, mat, dia, user, token)
            {
                var color;
                $scope.n_clicks[x][y] ++;

                if ($scope.n_clicks[x][y] % 4 == 0)
                {
                    color = 'label bg-accent';
                    $scope.n_clicks[x][y] = 4;
                }
                else if ($scope.n_clicks[x][y] % 4 == 1)
                {
                    color = 'label bg-success';
                }
                else if ($scope.n_clicks[x][y] % 4 == 2)
                {
                    color = 'label bg-danger';
                    $scope.n_clicks[x][y] = 2;
                }
                else
                {
                    color = 'label bg-info';
                    $scope.n_clicks[x][y] = 3;
                }

                $scope.color_sin_registro[x][y] = color;                

                var asistencia = {'institucion_id': inst, 'sede_id': sede, 'matricula_id': mat, 'tipo': $scope.n_clicks[x][y], 'dia_calendario': dia, 'user': user, 'token': token}

                if ($scope.n_clicks[x][y] == 1)
                {
                    asistenciaService.registro($.param(asistencia))
                        .$promise.then(
                            function (data)
                            {
                                // $helpers.error({'msg': 'Asistencia registrada satisfactoriamente'});
                            },
                            function (error)
                            {
                                $helpers.error({'msg': 'No se pudo registrar la asistencia'});
                            }
                        );
                }
                else
                {
                    if ($scope.n_clicks[x][y] % 4 == 1)
                    {
                        $scope.n_clicks[x][y] = 1;
                    }

                    var deferred = $q.defer();
                    
                    asistenciaService.consulta({inst: asistencia.institucion_id, sede: asistencia.sede_id, matricula: asistencia.matricula_id, dia: asistencia.dia_calendario, user: user, token: token},
                        function (res)
                        {
                            deferred.resolve(res);
                            var data = deferred.promise.$$state.value;
                            asistencia = {'id': data.id, 'institucion_id': data.institucion_id, 'sede_id': data.sede_id, 'matricula_id': data.matricula_id, 'tipo': $scope.n_clicks[x][y], 'dia_calendario': data.dia_calendario, 'token': token}

                            asistenciaService.actualizacion($.param(asistencia))
                                .$promise.then(
                                    function (dat)
                                    {
                                        // $helpers.error({'msg': 'Asistencia actualizada satisfactoriamente'});
                                    },
                                    function (error)
                                    {
                                        $helpers.error({'msg': 'No se pudo actualizar la asistencia'});
                                    }
                                );

                        },
                        function (err)
                        {
                            deferred.reject("Error: Status request" + status);
                        }
                    );          
                }

            }
        }
    ])
    .controller("AdminAppCtrl", 
        ["$scope", "$location",
        function ($scope, $location) {
            $scope.checkIfOwnPage = function () {
            return _.contains(
                [
                    "/404", 
                    "/pages/500",
                    "/pages/login",
                    "/pages/signin",
                    "/pages/signin1",
                    "/pages/signin2",
                    "/pages/signup",
                    "/pages/signup1",
                    "/pages/signup2",
                    "/pages/forgot",
                    "/pages/lock-screen"
                ], $location.path());
            };

        $scope.info = {
            theme_name: "Kimono",
            user_name: "John Doe"
            };
        }
    ])
    .controller("NavCtrl", 
        ["$scope",
        function ($scope) {
            $scope.navInfo = {
                tasks_number: 5,
                widgets_number: 13
            };

            $scope.toggleAlternativeMenu = function(){
                $('body .page-wrapper').toggleClass('nav-style--alternative');
            };

        }
    ])
    .controller("AsistenciaCtrl", 
        ["$scope",
        function ($scope) {
            
            
        }
    ]);
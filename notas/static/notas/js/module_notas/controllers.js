/*
 Application controllers
 Main controllers for the app
 */

window.assistant.app
    .controller("indexCtrl", 
        ["$q", "$scope", "$http", "$helpers", "docenteService", 
        function ($q, $scope, $http, $helpers, docenteService) {

            var d = Date.now();
            var fecha_hora_hoy = new Date(d);

            var meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
              "julio", "agosto", "setiembre", "octubre", "noviembre", "diciembre"
            ];

            $scope.dia = fecha_hora_hoy.getDate();
            $scope.mes = meses[fecha_hora_hoy.getMonth()];
            $scope.anio = fecha_hora_hoy.getFullYear();

            $scope.nav_notas = 'active';

            $scope.CargandoCursos = function (inst, sede, user_id, token)
            {
                // $http.jsonp('http://localhost:57395/Docente/Cursos/?institucion_id=' + inst + '&sede_id=' + sede + '&user_id=' + user_id + '&callback=JSON_CALLBACK').
                // success(function(data) {
                //     $scope.cursos = data;                    
                // }).
                // error(function (data) {
                    
                // });

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
        ["$q", "$scope", "$http", "$stateParams", "$helpers", "cursoService", "notaService", 
        function ($q, $scope, $http, $stateParams, $helpers, cursoService, notaService) {

            $scope.Initializing = function (inst, sede, token)
            {

                $scope.nav_notas = 'active';            
                //$scope.titulo_curso_horario = titulo;

                $scope.nota_componente = 0;

                $scope.rango_calif = function (min, max)
                {
                    var rango = [];
                    for (var i = min; i <= max; i++)
                    {
                        rango.push(i);
                    }

                    return rango;
                }

                $scope.nota_componente = [];
                //$scope.nota_item = [];
                $scope.score = [];
                $scope.total = [];

                for (var i = 0; i < 50; i ++)
                {
                    var grades_student = [];
                    //var grades_student1 = [];
                    $scope.score.push(0);
                    $scope.total.push(0);

                    for (var j = 0; j < 50; j ++)
                    {
                        var grades_component = [];
                        //var grades_item = [];

                        /*for (var k = 0; k < 50; k ++)
                        {
                            grades_item.push(0);
                        }*/

                        grades_component.push(0);
                        grades_student.push(grades_component);
                        //grades_student1.push(grades_item);
                    }

                    $scope.nota_componente.push(grades_student);
                    //$scope.nota_item.push(grades_student1);
                }

                var deferred = $q.defer();

                cursoService.alumnos(
                    {
                        inst: inst, sede: sede, curso: $stateParams.cursoId, 
                        oferta: $stateParams.ofertaId, token: token
                    },
                        function (res)
                        {
                            deferred.resolve(res);
                            $scope.alumnos = deferred.promise.$$state.value;                        
                        },
                        function (err)
                        {
                            deferred.reject("Error: Status request" + status);
                        }
                    );

                var deferred1 = $q.defer();

                cursoService.componentes(
                    {
                        inst: inst, sede: sede, curso: $stateParams.cursoId, 
                        calendario: $stateParams.calendarioId, token: token
                    },
                        function (res)
                        {
                            deferred1.resolve(res);
                            $scope.componentes = deferred1.promise.$$state.value;                        
                        },
                        function (err)
                        {
                            deferred1.reject("Error: Status request" + status);
                        }
                    );

            }

            $scope.RegistraNota = function (inst, sede, mat, item, nota, user, x, y, z, token)
            {
                var nota_x_item = {'institucion_id': inst, 'sede_id': sede, 'matricula_id': mat, 'item_id': item, 'nota': nota, 'user': user};

                $scope.nota_componente[x][y][0] += parseInt(nota);

                $scope.score[x] += parseInt(nota);

                if ($scope.score[x] <= 6)
                {
                    $scope.total[x] = 40 + 4 * $scope.score[x];
                }
                else
                {
                    switch ($scope.score[x])
                    {
                        case 7:  $scope.total[x] = 66 ;break;
                        case 8:  $scope.total[x] = 68 ;break;
                        case 9:  $scope.total[x] = 70 ;break;
                        case 10: $scope.total[x] = 72 ;break;
                        case 11: $scope.total[x] = 74 ;break;
                        case 12: $scope.total[x] = 76 ;break;
                        case 13: $scope.total[x] = 78 ;break;
                        case 14: $scope.total[x] = 80 ;break;
                        case 15: $scope.total[x] = 84 ;break;
                        case 16: $scope.total[x] = 88 ;break;
                        case 17: $scope.total[x] = 91 ;break;
                        case 18: $scope.total[x] = 94 ;break;
                        case 19: $scope.total[x] = 97 ;break;
                        case 20: $scope.total[x] = 100;break;
                    }
                }

                console.log('(' + x + ', ' + y + ', ' + z + ')');

                /*$http.post('http://localhost:57395/Nota/Registro', $.param(nota_x_item), {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).
                success(function(data) {
                    $helpers.error({'msg': 'Nota fue registrada satisfactoriamente'});
                }).
                error(function (data) {
                    $helpers.error({'msg': 'No se pudo registrar la nota'});
                });*/
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
    .controller("NotasCtrl", 
        ["$scope",
        function ($scope) {
            // $scope.nav_notas = 'active';
            // $scope.appear = true;

            // $scope.ColocaTitulo = function (titulo)
            // {
            //     $scope.appear = true;
            //     $scope.titulo_curso_horario = titulo;
            // }
        }
    ]);
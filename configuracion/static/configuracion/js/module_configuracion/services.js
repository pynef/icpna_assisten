'use strict'

nconfApp.factory('programaService',['$resource', 
    function ($resource)
    {
        return $resource('http://localhost:57395/Configuracion/Programas/?institucion_id=:inst&sede_id=:sede', {},
        {
            'get': 
            { 
                method: 'GET',
                params: 
                {
                    inst: '@inst',
                    sede: '@sede'
                },
                headers: 
                { 
                    'Content-Type': 'application/x-javascript'
                }, 
                isArray: true 
            },
        });
    }
]);

nconfApp.factory('nivelService',['$resource', 
    function ($resource)
    {
        return $resource('http://localhost:57395/Configuracion/Niveles/?institucion_id=:inst&sede_id=:sede&programa_id=:programa', {},
        {
            'get': 
            { 
                method: 'GET', 
                params: 
                {
                    inst: '@inst', 
                    sede: '@sede', 
                    programa: '@programa'
                }, 
                headers: 
                { 
                    'Content-Type': 'application/x-javascript'
                },
                isArray: true 
            },
        });
    }
]);

nconfApp.factory('cursoService',['$resource', 
    function ($resource)
    {
        return $resource('http://localhost:57395/Configuracion/Cursos/?institucion_id=:inst&sede_id=:sede&nivel_id=:nivel', {},
        {
            'get': 
            { 
                method: 'GET', 
                params: 
                {
                    inst: '@inst', 
                    sede: '@sede', 
                    nivel: '@nivel'
                }, 
                headers: 
                { 
                    'Content-Type': 'application/x-javascript'
                },
                isArray: true 
            },
        });
    }
]);

nconfApp.factory('procesaInfoService',['$resource', 
    function ($resource)
    {
        return $resource('http://localhost:57395/Configuracion/ProcesaInfo/?institucion_id=:inst&sede_id=:sede&nivel_id=:nivel&programa_id=:programa&anio=:anio&mes=:mes', {},
        {
            'get': 
            { 
                method: 'GET', 
                params: 
                {
                    inst: '@inst', 
                    sede: '@sede', 
                    nivel: '@nivel',
                    programa: '@programa',
                    anio: '@anio',
                    mes: '@mes'
                }, 
                headers: 
                { 
                    'Content-Type': 'application/x-javascript'
                } 
            },
        });
    }
]);

nconfApp.factory('configuracionService',['$resource', 
    function ($resource)
    {
        return $resource('http://localhost:57395/Configuracion/:consulta/:registro/?institucion_id=:inst&sede_id=:sede&nivel_id=:nivel&anio=:anio&componente_id=:componente', {},
        {
            'anual': 
            {   
                method: 'GET', 
                params: 
                {   
                    consulta: 'ConsultaConfiguracion', 
                    inst: '@inst', 
                    sede: '@sede', 
                    nivel: '@nivel', 
                    anio: '@anio'
                },
                headers: 
                { 
                    'Content-Type': 'application/x-javascript'
                }
            },

            'componentes': 
            {   
                method: 'GET', 
                params: 
                {   
                    consulta: 'ConsultaComponenteAnual', 
                    inst: '@inst', 
                    sede: '@sede', 
                    nivel: '@nivel', 
                    anio: '@anio'
                }, 
                headers: 
                { 
                    'Content-Type': 'application/x-javascript'
                },
                isArray: true 
            },

            'consultarComponentes': 
            {   
                method: 'GET', 
                params: 
                {   
                    consulta: '@consulta', 
                    inst: '@inst', 
                    sede: '@sede', 
                    tipo: '@tipo', 
                    id: '@id'
                }, 
                headers: 
                { 
                    'Content-Type': 'application/x-javascript'
                }
            },

            'items': 
            {   
                method: 'GET', 
                params: 
                {   
                    consulta: 'ConsultaItemAnual', 
                    inst: '@inst', 
                    sede: '@sede', 
                    componente: '@componente'
                },
                headers: 
                { 
                    'Content-Type': 'application/x-javascript'
                },
                isArray: true 
            },

            'reg_componente':
            {    
                method: 'POST',
                params:
                {   
                    registro: 'RegistroComponente'
                }, 
                headers:
                {   
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            },

            'act_componente':
            {    
                method: 'POST',
                params:
                {   
                    registro: 'ActualizaComponente'
                }, 
                headers:
                {   
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            },

            'del_componente':
            {    
                method: 'POST',
                params:
                {   
                    registro: 'EliminaComponente'
                }, 
                headers:
                {   
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            },

            'reg_config':
            {   
                method: 'POST', 
                params:
                {  
                    registro: 'RegistroConfiguracionAnual'
                },
                headers:
                {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            },

            'reg_item':
            { 
                method: 'POST',  
                params:
                {
                    registro: 'RegistroItem'
                }, 
                headers:
                {
                    'Content-Type': 'application/x-www-form-urlencoded'
                } 
            },
        });
    }
]);


nconfApp.factory('componenteConfServ',['$resource',
    function ($resource)
    {
        return $resource('http://localhost:57395/Configuracion/:consulta/?id=:id&mes=:mes', {},
        {
            'GetDataModificarGrupo':
            {
                method: 'GET',
                params:
                { 
                    id: '@id',
                    mes: '@mes'
                },
                headers:
                {
                    'Content-Type': 'application/x-javascript'
                }
            }
        });
    }
]);

nconfApp.factory('creaGrupo',['$resource',
    function ($resource)
    {
        return $resource('http://localhost:57395/Configuracion/:consulta', {},
        {
            'crear_grupo':
            {
                method: 'POST',
                params:
                { 
                    consulta: 'CreaGrupo' 
                },
                headers:
                {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        });
    }
]);

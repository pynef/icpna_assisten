'use strict'

window.assistant.app.factory('docenteService',['$resource', 
    function ($resource)
    {
        return $resource('http://localhost:57395/Docente/Cursos/?institucion_id=:inst&sede_id=:sede&user_id=:user_id', {},
        {
            'cursos':
            {   method: 'GET',
                params:
                {   
                    inst: '@inst', 
                    sede: '@sede', 
                    user_id: '@user_id'
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

window.assistant.app.factory('cursoService',['$resource', 
    function ($resource)
    {
        return $resource('http://localhost:57395/Curso/:dias/:alumnos/:asistencia/?institucion_id=:inst&sede_id=:sede&oferta_id=:oferta&curso_id=:curso', {},
        {
            'clases':
            {   
                method: 'GET', 
                params:
                {   
                    inst: '@inst', 
                    sede: '@sede', 
                    dias: 'DiasClase', 
                    oferta: '@oferta'
                },
                headers: 
                { 
                    'Content-Type': 'application/x-javascript'
                },
                isArray: true
            },

            'alumnos':
            {   
                method: 'GET',
                params:
                {   
                    inst: '@inst', 
                    sede: '@sede', 
                    alumnos: 'AlumnosMatriculados', 
                    curso: '@curso', 
                    oferta: '@oferta'
                }, 
                headers: 
                { 
                    'Content-Type': 'application/x-javascript'
                },
                isArray: true 
            },

            'asistencias':
            {   
                method: 'GET', 
                params:
                {   
                    inst: '@inst',
                    sede: '@sede',
                    asistencia: 'Asistencia',
                    curso: '@curso',
                    oferta: '@oferta'
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

window.assistant.app.factory('asistenciaService',['$resource', 
    function ($resource)
    {
        return $resource('http://localhost:57395/Asistencia/:consulta/:registro/:actualizacion/?institucion_id=:inst&sede_id=:sede&matricula=:matricula&dia=:dia', {},
        {
            'consulta':
            { 
                method: 'GET', 
                params:
                {   
                    consulta: 'Consulta',
                    inst: '@inst',
                    sede: '@sede',
                    matricula: '@matricula',
                    dia: '@dia'
                }
            },

            'registro':
            {   
                method: 'POST',
                params:
                {
                    registro: 'Registro'
                },
                headers:
                {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            },

            'actualizacion':
            {
                method: 'POST',
                params:
                {   
                    actualizacion: 'Actualizacion'
                },
                headers:
                {   
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            },
        });
    }
]);
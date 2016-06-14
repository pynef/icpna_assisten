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
        return $resource('http://localhost:57395/Curso/:alumnos/:componentes/?institucion_id=:inst&sede_id=:sede&oferta_id=:oferta&calendario_academico_id=:calendario&curso_id=:curso', {},
        {
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

            'componentes':
            {   
                method: 'GET',
                params:
                {   
                    inst: '@inst',
                    sede: '@sede',
                    componentes: 'Componentes',
                    calendario: '@calendario',
                    curso: '@curso'
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

window.assistant.app.factory('notaService',['$resource', 
    function ($resource)
    {
        return $resource('http://localhost:57395/Nota/:consulta/:registro/:actualizacion/?institucion_id=:inst&sede_id=:sede&matricula=:matricula&dia=:dia&callback=JSON_CALLBACK', {},
        {
            'consulta':      { method: 'JSONP', params: {consulta: 'Consulta', inst: '@inst', sede: '@sede', matricula: '@matricula', item: '@dia'} },
            'registro':      { method: 'POST',  params: {registro: 'Registro'}          , headers: {'Content-Type': 'application/x-www-form-urlencoded'} },            
        });
    }
]);
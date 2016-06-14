/*var demo = angular.module("asistencia",[
    "ngRoute",  
    "ngMaterial",
    "asistencia.controllers", 
    "asistencia.directives" 
]);*/
window.assistant.settings['path'] = window.assistant.settings['static'] + 'asistencia/js/module_asistencia/';
window.assistant.app = angular.module("asistencia",[
    'ui.router',
    "ngMaterial",
    'ngResource',
    'ryHelpers',
]);
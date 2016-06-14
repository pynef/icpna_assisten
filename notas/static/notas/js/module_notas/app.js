window.assistant.settings['path'] = window.assistant.settings['static'] + 'notas/js/module_notas/';
window.assistant.app = angular.module("notas",[
    'ui.router',
    "ngMaterial",
    'ryHelpers',
    'ngResource',
    //"notas.controllers", 
    //"notas.directives" 
]);
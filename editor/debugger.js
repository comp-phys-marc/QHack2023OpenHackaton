/**
 * Created by marcusedwards on 2017-12-07.
 */

const codeDebugger = $('#code-debugger');

(function(){
    var oldLog = console.log;
    console.log = function (message) {
        codeDebugger.append(document.createTextNode(message + '\n'));
        oldLog.apply(console, arguments);
    };
})();

$(document).ready(function(){
    $('#clear-output').on('click', function(){
        codeDebugger.text("");
    });
});
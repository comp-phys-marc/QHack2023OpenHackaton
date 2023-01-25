const editor = $('#code-editor');
const codeDebugger = $('#code-debugger');

$(document).ready(function(){
    $('#run-code').on('click', function(){
        codeDebugger.text("");
        try {
            eval(editor.text());
        } catch (e) {
            alert(e.message);
            if (e instanceof SyntaxError) {
                console.log("Code contains a syntax error: " + e.message);
            }
        }
    });
});
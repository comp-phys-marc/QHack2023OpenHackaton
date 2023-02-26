const blackbird = require('blackbird-ts');
const editor = $('#code-editor');
const codeDebugger = $('#code-debugger');

function remoteExecute(text) {
    $('#load-text').text(text);
    $('#loading-div').show();
    $.post('https://120.0.0.1:5432/' + $('#request-text').val(),  // TODO: replace with query to simulationservice
        {
            _api_key: '$2y$10$5a1NNdQKUuQyvMwxf.KC0.RLf60fwaPR/v0/raLyGrnoHCjdckfE2'
        })
        .done(function (data) {
            alert(data.message);
            $('#sfdev-container').append("<div class='widget-wrapper'>" + data.widget + "</div>");
            $('#loading-div').hide();
        })
        .fail(function(data){
            if(data.hasOwnProperty('message')){
                alert(data.message);
            }
            $('#loading-div').hide();
        })
        .always(function(){
            $('#loading-div').hide();
        });
}

$(document).ready(function(){
    $('#run-code').on('click', function(){
        codeDebugger.text("");
        let blackbirdBlocks = {};
        let javascriptBlocks = {};
        try {
            const parse = blackbird.parseString;
            let blackbirdBlock = "\n";
            let javascriptBlock = "\n";
            for (let line of editor.text().split("\n")) {
                if (line == "" && blackbirdBlock != "\n") {
                    blackbirdBlocks[Object.keys(blackbirdBlocks).length] = blackbirdBlock;
                    blackbirdBlock = "\n";
                } else if (line == "" && javascriptBlock != "\n") {
                    blackbirdBlocks[Object.keys(javascriptBlocks).length] = javascriptBlock;
                    blackbirdBlock = "\n";
                }
                let blackbirdLine = parse(line);
                if (blackbirdLine != []) {  // TODO: verify 
                    blackbirdBlock += blackbirdLine + "\n";
                } else {
                    javascriptBlock += line + "\n";
                }
            }
        } catch (e) {
            alert(e.message);
            if (e instanceof SyntaxError) {
                console.log("Code contains a syntax error: " + e.message);
            }
        }

        // TODO: execute the JS and the BlackBird asynchronously
        

    });
});
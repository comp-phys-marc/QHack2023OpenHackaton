const editor = $('#code-editor');
const codeDebugger = $('#code-debugger');

function remoteExecute(block, callback, failCallback) {
    $.post('http://127.0.0.1:5000/simulate',
        {
            code: block
        })
        .done(function (data) {
            alert(JSON.stringify(data, null, 4));
            // $('#sfdev-container').append("<div class='widget-wrapper'>" + syntaxHighlight(JSON.stringify(data, undefined, 4)) + "</div>");
            callback(data);
        })
        .fail(function(data){
            // if(data.hasOwnProperty('error')){
            //     alert(JSON.stringify(data.error, null, 4));
            // }
            failCallback(data);
        }
    );
}

$(document).ready(function(){
    $('#run-code').on('click', function(){
        codeDebugger.text("");

        let blackbirdBlocks = {};
        let javascriptBlocks = {};
        
        blackBirdBlockFound = false;

        let blackbirdBlock = [];
        let javascriptBlock = [];
        for (let line of editor.text().split("\n")) {
            if (line == "" && blackbirdBlock != []) {
                blackbirdBlocks[Object.keys(blackbirdBlocks).length] = blackbirdBlock;
                blackbirdBlock = [];
                blackBirdBlockFound = true;
            } else if (line == "" && javascriptBlock != []) {
                javascriptBlocks[Object.keys(javascriptBlocks).length] = javascriptBlock;
                javascriptBlock = [];
            }

            // Assume a blackbird block followed by a JS block for the demo
            if (blackBirdBlockFound) {
                javascriptBlock.push(line);
            } else {
                blackbirdBlock.push(line);
            }
        }

        for (let blockId of Object.keys(blackbirdBlocks)) {
            alert("Simulating: \n" + blackbirdBlocks[blockId]);
            remoteExecute(blackbirdBlocks[blockId], function(data) {
                if (data.status == 200) {
                    codeDebugger.text(codeDebugger.text() + JSON.stringify(data, null, 4) + "\n\n");
                }
            });
        }

        try {
            for (let blockId of Object.keys(javascriptBlocks)) {
                alert("Evaluating: " + javascriptBlocks[blockId]);
                let res = eval(javascriptBlocks[blockId]);
                codeDebugger.text(codeDebugger.text() + res + "\n\n");
            }
        } catch (e) {
            alert(e.message);
            if (e instanceof SyntaxError) {
                console.log("Code contains a syntax error: " + e.message);
            }
        }
    });
});
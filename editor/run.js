const blackbird = require('blackbird-ts');
const editor = $('#code-editor');
const codeDebugger = $('#code-debugger');

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function remoteExecute(block) {
    $('#loading-div').show();
    $.post('https://120.0.0.1:5000/simulate',
        {
            code: block
        })
        .done(function (data) {
            $('#sfdev-container').append("<div class='widget-wrapper'>" + syntaxHighlight(JSON.stringify(data, undefined, 4)) + "</div>");
        })
        .fail(function(data){
            if(data.hasOwnProperty('error')){
                alert(data.error);
            }
        }
    );
}

$(document).ready(function(){
    $('#run-code').on('click', function(){
        codeDebugger.text("");
        let blackbirdBlocks = {};
        let javascriptBlocks = {};
        try {
            const parse = blackbird.parseString;
            let blackbirdBlock = [];
            let javascriptBlock = [];
            for (let line of editor.text().split("\n")) {
                if (line == "" && blackbirdBlock != []) {
                    blackbirdBlocks[Object.keys(blackbirdBlocks).length] = blackbirdBlock;
                    blackbirdBlock = [];
                } else if (line == "" && javascriptBlock != []) {
                    javascriptBlocks[Object.keys(javascriptBlocks).length] = javascriptBlock;
                    javascriptBlock = [];
                }
                try {
                    let blackbirdLine = parse(line);
                    blackbirdBlock += [blackbirdLine];
                }
                catch {
                    javascriptBlock += [line];
                }
            }
        } catch (e) {
            alert(e.message);
            if (e instanceof SyntaxError) {
                console.log("Code contains a syntax error: " + e.message);
            }
        }

        for (let blockId of Object.keys(blackbirdBlocks)) {
            remoteExecute(blackbirdBlocks[blockId]);
        }

        for (let blockId of Object.keys(javascriptBlocks)) {
            let res = eval(javascriptBlocks[blockId]);
            codeDebugger.text(res);
        }
    });
});
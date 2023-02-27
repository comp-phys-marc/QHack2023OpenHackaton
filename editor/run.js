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

function remoteExecute(block, callback, failCallback) {
    alert("remote execute");
    $('#loading-div').show();
    $.post('http://127.0.0.1:5000/simulate',
        {
            code: block
        })
        .done(function (data) {
            alert(JSON.stringify(data, null, 4));
            $('#sfdev-container').append("<div class='widget-wrapper'>" + syntaxHighlight(JSON.stringify(data, undefined, 4)) + "</div>");
            callback(data);
            $('#loading-div').hide();
        })
        .fail(function(data){
            alert(JSON.stringify(data, null, 4));
            if(data.hasOwnProperty('error')){
                alert(JSON.stringify(data.error, null, 4));
            }
            failCallback(data);
            $('#loading-div').hide();
        }
    );
}

$(document).ready(function(){
    alert("ready");
    $('#run-code').on('click', function(){
        alert("running...");
        codeDebugger.text("");
        let blackbirdBlocks = {};
        let javascriptBlocks = {};
        try {
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
                // Try to execute the line as BlackBird
                remoteExecute([line], function(data) {
                    blackbirdBlock += [blackbirdLine];
                }, function(data) {
                    // If we can't, we'll try to execute it as JavaScript
                    if ("is not a valid Blackbird symbol" in data.error || data.status == 400) {
                        javascriptBlock += [line];
                    }
                });
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
            codeDebugger.text(codeDebugger.text() + res + "\n\n");
        }
    });
});
const shell = require('electron').shell;
const os = require('os');
const {dialog} = require('electron').remote;
const fs = require('fs');
const fileManagerBtn = document.getElementById('open-file-manager');
const debuggerSaveBtn = document.getElementById('save-output');
const codeSaveBtn = document.getElementById('save-file');
const codeSaveAsBtn = document.getElementById('save-as-file');
const editor = document.getElementById('code-editor');
const codeDebugger =  document.getElementById('code-debugger');

let file = "";

fileManagerBtn.addEventListener('click', function (event) {
    dialog.showOpenDialog((fileNames) => {
        // fileNames is an array that contains all the selected
        if(fileNames == undefined){
            alert("No file selected");
            return;
        }

        file = fileNames[0];

        fs.readFile(file, 'utf-8', (err, data) => {
            if(err){
                alert("An error ocurred reading the file :" + err.message);
                return;
            }
            let i = 0;
            let lines = data.split('\n');

            while(editor.firstChild) {
                editor.removeChild(editor.firstChild);
            }

            for(i=0;i<lines.length;i++){
                let line = document.createTextNode(lines[i] + '\n');
                editor.appendChild(line);
            }

            $('.result').html($('#code-editor').text());
            hljs.highlightBlock($('.result')[0],'  ', false);
        });
    });
});

debuggerSaveBtn.addEventListener('click', function (event) {

    let content = codeDebugger.innerHTML;

    dialog.showSaveDialog((fileName) => {
        if (fileName === undefined)
        {
            alert("Couldn't save the file");
            return;
        }

        // fileName is a string that contains the path and filename created in the save file dialog.
        fs.writeFile(fileName, content, (err) => {
            if(err){
                alert("An error ocurred creating the file " + err.message)
            }

            alert("The file has been succesfully saved");
        });
    });
});

codeSaveBtn.addEventListener('click', function (event) {

    let content = editor.innerHTML;

    if(file.length > 0){
        fs.writeFile(file, content, (err) => {
            if (err) {
                alert("An error ocurred updating the file" + err.message);
                return;
            }

            alert("The file has been succesfully saved");
        });
    }
    else{
        dialog.showSaveDialog((fileName) => {
            if (fileName === undefined)
        {
            alert("Couldn't save the file");
            return;
        }

        // fileName is a string that contains the path and filename created in the save file dialog.
        fs.writeFile(fileName, content, (err) => {
            if(err){
                alert("An error ocurred creating the file " + err.message)
            }

            alert("The file has been succesfully saved");
    });
    });
    }
});

codeSaveAsBtn.addEventListener('click', function (event) {

    let content = editor.innerHTML;


    dialog.showSaveDialog((fileName) => {
        if (fileName === undefined)
    {
        alert("Couldn't save the file");
        return;
    }

    // fileName is a string that contains the path and filename created in the save file dialog.
    fs.writeFile(fileName, content, (err) => {
        if(err){
            alert("An error ocurred creating the file " + err.message)
        }

        alert("The file has been succesfully saved");
    });
    });
});
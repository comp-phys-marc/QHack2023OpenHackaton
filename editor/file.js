const shell = require('electron').shell;
const os = require('os');
const {dialog} = require('electron').remote;
const fs = require('fs');
const fileManagerBtn = document.getElementById('open-file-manager');
const editor = document.getElementById('code-editor');

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
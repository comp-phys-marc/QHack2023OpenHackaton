/**
 * Created by marcusedwards on 2017-12-08.
 */
var command = false;

$('#code-editor')[0].addEventListener("paste", function(e) {

    e.preventDefault();
    var text = e.clipboardData.getData("text/plain");
    document.execCommand("insertHTML", false, text);
    $('.result').html(this.innerText);
    hljs.highlightBlock($('.result')[0], '  ', false);
});

$(document).ready(function() {
    $('.result').html($('#code-editor').text());
    hljs.highlightBlock($('.result')[0],'  ', false);
    $(document).on('keydown', '#code-editor', function(event){
        var keyCode = event.keyCode || event.which;
        if(keyCode == 9){
            event.preventDefault();
            document.execCommand('InsertHTML', false, '\t');
            $('.result').html(this.innerText);
            hljs.highlightBlock($('.result')[0], '  ', false);
        }
    });
    $(document).on('keyup', '#code-editor', function() {
        var keyCode = event.keyCode || event.which;
        console.log(keyCode);
        if(keyCode != 9) {
            $('.result').html(this.innerText);
            hljs.highlightBlock($('.result')[0], '  ', false);
        }
    });
    $('.result').css({
        position: "absolute",
        top: $('#code-editor').position().top + "px",
        left: ($('#code-editor').position().left)+ "px",
        width: $('.editor').width() + 40
    }).show();
    (function() {
        var target = $(".result");
        $(".editor").scroll(function() {
            target.prop("scrollTop", this.scrollTop)
                .prop("scrollLeft", this.scrollLeft);
        });
    })();
});
$(window).resize(function(){
    $('.result').css({
        position: "absolute",
        top: $('#code-editor').position().top + "px",
        left: ($('#code-editor').position().left)+ "px",
        width: $('.editor').width() + 40
    });
});
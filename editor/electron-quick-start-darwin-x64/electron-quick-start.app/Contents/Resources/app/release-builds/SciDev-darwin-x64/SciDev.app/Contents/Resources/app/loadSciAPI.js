/**
 * Created by marcusedwards on 2017-12-07.
 */

$(document).ready(function(){
    $('#request-button').on('click', function(){
        $('#loading-div').show();
        $.post('https://sfdev.herokuapp.com/request/' + $('#request-text').val(),
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
    });
});


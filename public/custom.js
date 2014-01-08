var es = new EventSource('/chat-stream');


es.onmessage = function(e){
    var chat = $("#chat");
    var content = $('<p>');
    content.append(e.data);
    chat.append(content);
    chat.append(content);
    var height = $("#chat").children().length;
    $("#chat").scrollTop(height * 1000);
};

//$("#chat-submit").live("submit", function(e){
$("#chat-submit").submit(function(e){
    var messages_box = $("#message");
    
        $.post('/chat', {
            message: $('#message').val()
        });
        messages_box.val('');
        messages_box.focus();

    e.preventDefault();
});


var user_source = new EventSource('/chat-users');

user_source.onmessage = function(e){
    var users_div = $("#users");
    
    users_div.empty();
    var list = $("<ul id='tipo-lista'>");
    var privis = $("#privados");

    users_div.append(list);
    
    names = JSON.parse(e.data);
    
    for (var i = 0; i < names.num; i++) {
        list.append( $("<li class='usuario-lista' id='u-" + names.users[i] + "'  >").text(names.users[i]) );
    }
    list.on("click", "li", function(){                
            //alert("click en:"+$(this).attr("id") );
            var destinatario = $(this).attr("id").substring(2);
            var interior = '<div class="privado-interior"> <div class="privado-mensajes"></div><div class="privado-formulario"><form id="form-'+ destinatario +'"><input type="text" id="msg-'+ destinatario +'" class="message"/><input class="i-button" type="submit"/></form></div>   </div>';
            var ejem = $('<div class="privado" title='+$(this).attr("id").substring(2) +' id =v-'+ $(this).attr("id").substring(2) +' >').append(interior);

            privis.append( ejem );
            ejem.dialog();
            $("#form-"+ destinatario +"").submit(function(e){
                var messages_box = $("#msg-"+ destinatario +"");
                
                    $.post('/chat', {
                        message: $("#msg-"+ destinatario +"").val()
                    });
                    messages_box.val('');
                    messages_box.focus();

                e.preventDefault();
            });

    });
    
    /*privis.on("click", ".privado", function() {
        $(this).dialog();
    });*/

};
    

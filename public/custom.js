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
            //var interior = '<div class="privado-interior"> <div class="privado-mensajes"></div>   </div>';
            var ejem = $('<div class="privado" title='+$(this).attr("id").substring(2) +' id =v-'+ $(this).attr("id").substring(2) +' >').append("<p>Esto es un privado<p>");

            privis.append( ejem );
            ejem.dialog();

    });
    
    /*privis.on("click", ".privado", function() {
        $(this).dialog();
    });*/

};
    

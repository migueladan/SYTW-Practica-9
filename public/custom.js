var es = new EventSource('/chat-stream');


es.onmessage = function(e){
    
    var chat = $("#chat");
    var contenido = e.data;
    //si es un mensaje privado, mandarlo al privado (si esta creado, sino crear y mandarlo)
    var primer = e.data.substring(0,1);
    if (primer == "*") {

        var parts = e.data.split(" ");
        var el_origen = ""+parts[1];
        var el_destino = ""+parts[2];
        el_destino = el_destino.substring(1);
        var el_mensaje = el_origen + ": ";
        for (var i = 3; i < parts.length; i++) {
            el_mensaje = el_mensaje + parts[i] + " ";
        }
        contenido = el_mensaje;
        console.log("---")
        console.log(el_destino);
        console.log("---")
        if ((el_destino.length > 0) && (el_origen.length > 0)) {
            if (origen == el_origen) {
                chat = $("#pm-"+ el_destino)
            }
            else {
                if ( $("#pm-"+ el_destino).length == 0 && $("#pm-"+ el_origen).length == 0 ) {
                //crear la ventana
                var privis = $("#privados");
                var destinatario = el_origen;
                var interior = '<div class="privado-interior"> <div class="privado-mensajes" id="pm-'+ destinatario +'"></div><div class="privado-formulario"><form id="form-'+ destinatario +'"><input type="text" id="msg-'+ destinatario +'" class="message"/><input class="i-button" type="submit"/></form></div>   </div>';
                var ejem = $('<div class="privado" title='+destinatario +' id =v-'+ destinatario +' >').append(interior);

                privis.append( ejem );
                ejem.dialog();
                $("#form-"+ destinatario +"").submit(function(e){
                    var messages_box = $("#msg-"+ destinatario +"");
                    
                        $.post('/chat', {
                            message: "/" + destinatario + " " + $("#msg-"+ destinatario +"").val()
                        });
                        messages_box.val('');
                        messages_box.focus();

                    e.preventDefault();
                });

                //******************
                    chat = $("#pm-"+ el_origen)
                }
                else {
                    

                    chat = $("#pm-"+ el_origen)
                }
            }
         }
    }

    //---------------------------------------------------------------------------------------
    var content = $('<p>');
    content.append(contenido);
    chat.append(content);
    chat.append(content);
    //var height = $("#chat").children().length;
    //$("#chat").scrollTop(height * 1000);
    var height = chat.children().length;
    chat.scrollTop(height * 1000);
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
            if ($("#pm-"+ destinatario).length == 0) {
                
                var interior = '<div class="privado-interior"> <div class="privado-mensajes" id="pm-'+ destinatario +'"></div><div class="privado-formulario"><form id="form-'+ destinatario +'"><input type="text" id="msg-'+ destinatario +'" class="message"/><input class="i-button" type="submit"/></form></div>   </div>';
                var ejem = $('<div class="privado" title='+$(this).attr("id").substring(2) +' id =v-'+ $(this).attr("id").substring(2) +' >').append(interior);

                privis.append( ejem );
                ejem.dialog();
                $("#form-"+ destinatario +"").submit(function(e){
                    var messages_box = $("#msg-"+ destinatario +"");
                    
                        $.post('/chat', {
                            message: "/" + destinatario + " " + $("#msg-"+ destinatario +"").val()
                        });
                        messages_box.val('');
                        messages_box.focus();

                    e.preventDefault();
                });
            }

    });
    
    /*privis.on("click", ".privado", function() {
        $(this).dialog();
    });*/

};
    

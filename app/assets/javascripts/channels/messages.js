
// this might not work due to turbolinks
$(document).ready(function() {
  setupChatroomChannels();
  submitNewMessage();
});

// Note defined global variable item_search_key in application.html.erb
function setupChatroomChannels() {
  var domain = window.location.origin;
  var chatroomEnpoint = domain + "/api/v1/chatrooms?api_key="+item_search_key;
  $.getJSON(chatroomEnpoint, function(data) {
    data.forEach(function(chatroom) {
      App['room' + chatroom.id ] = App.cable.subscriptions.create({
        channel: 'MessagesChannel',
        room: chatroom.id},
        {
          received: function(data) {
            var payload = JSON.parse(data.message)
            $("#messages").append(payload["user"] + ": " + payload["message"] + "<br>");
            $("#messages").scrollTop($('#messages')[0].scrollHeight);
          }
        });
      })
    })
}


function submitNewMessage() {
  $('textarea#chat_message_body').keydown(function(event) {
    if (event.keyCode === 13) {
        var msg = event.target.value
        var chatroomId = $("#chat_message_chatroom_id").val();
        App['room' + chatroomId].send({message: msg})
        $('[data-textarea="message"]').val("")
        return false;
     }
  });
}

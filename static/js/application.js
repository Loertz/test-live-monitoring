// Support TLS-specific URLs, when appropriate.
if (window.location.protocol == "https:") {
  var ws_scheme = "wss://";
} else {
  var ws_scheme = "ws://"
};

var initial=false;
var inbox = new ReconnectingWebSocket(ws_scheme + location.host + "/receive");
/*var outbox = new ReconnectingWebSocket(ws_scheme + location.host + "/submit");*/
inbox.onmessage = function(message) {
  var data = JSON.parse(message.data);
  if (!initial) {
      data.forEach(function create(val) {

        var node = document.createElement("div");
        node.setAttribute("class","floating-box");
        node.id = "div"+val.n;

        var resd = document.createElement('h2');
        resd.innerHTML = val.name;

        var cha = document.createElement('h3');
        cha.innerHTML = "Chambre :  n°" + val.n;

        var dur = document.createElement('h4');
        dur.innerHTML = "Durée de l'activitée : " + val.tempdemarche
        dur.id = val.n;


        node.appendChild(resd);
        node.appendChild(cha);
        node.appendChild(dur);

        monitoring.appendChild(node);

      });

     console.log(initial);
      initial=true;
      console.log(initial);

      console.log('update');
      console.log(message.data);

      data.forEach(function creat( val) {

          if (val.acti == "") {

              document.getElementById(val.n).innerHTML ="Durée de l'activitée : " + val.tempdemarche
              document.getElementById("div"+val.n).style.display = "none";
              /*document.getElementById("div"+val.n).style.backgroundColor = "rgb(63, 63, 78)"*/
          }

          else if (val.acti =="1") {
              document.getElementById(val.n).innerHTML ="Durée de l'activitée : " + val.tempdemarche
                /*bleu :#1D7FB2; vert : #8C8910; rouge : #CA1725; gris :rgb(63, 63, 78);*/
                if (val.lastEvent == "BEDROOM") {
                  document.getElementById("div"+val.n).style.backgroundColor = "#8C8910"
                   }
                else if (val.lastEvent == "BATHROOM") {
                  document.getElementById("div"+val.n).style.backgroundColor ="#1D7FB2"
                }
                else if (val.lastEvent == "FALL") {
                  document.getElementById("div"+val.n).style.backgroundColor = "#CA1725"
                }
                else {
                  /*document.getElementById("div"+val.n).style.backgroundColor = "rgb(63, 63, 78)"*/
                }
                document.getElementById("div"+val.n).style.display = "inline";
            }

          else {
              document.getElementById(val.n).innerHTML ="Durée de l'activitée : " + val.tempdemarche
                /*bleu :#1D7FB2; vert : #8C8910; rouge : #CA1725; gris :rgb(63, 63, 78);*/
                if (val.lastEvent == "BEDROOM") {
                  document.getElementById("div"+val.n).style.backgroundColor = "#8C8910"
                }
                else if (val.lastEvent == "BATHROOM") {
                  document.getElementById("div"+val.n).style.backgroundColor = "#1D7FB2"
                }
                else if (val.lastEvent == "FALL") {
                  document.getElementById("div"+val.n).style.backgroundColor = "#CA1725"
                }
                else {
                  /*document.getElementById("div"+val.n).style.backgroundColor = "rgb(63, 63, 78)"*/
                };
          };

      });
  };

};



  /*
  $("#chat-text").append("<div class='panel panel-default'><div class='panel-heading'>" + $('<span/>').text(data.handle).html() + "</div><div class='panel-body'>" + $('<span/>').text(data.text).html() + "</div></div>");
  $("#chat-text").stop().animate({
    scrollTop: $('#chat-text')[0].scrollHeight
  }, 800);*/


inbox.onclose = function(){
    console.log('inbox closed');
    this.inbox = new WebSocket(inbox.url);

};

/*outbox.onclose = function(){
    console.log('outbox closed');
    this.outbox = new WebSocket(outbox.url);
};

$("#input-form").on("submit", function(event) {
  event.preventDefault();
  var handle = $("#input-handle")[0].value;
  var text   = $("#input-text")[0].value;
  outbox.send(JSON.stringify({ handle: handle, text: text }));
  $("#input-text")[0].value = "";
});*/

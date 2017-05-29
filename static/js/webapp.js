$("#log-screen").click(function openNav() {
  $("#mySidenav").style.width = "100%";
  var on = true;
  /*    document.getElementById("main").style.marginLeft = "100%";*/
});

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
$("#acti-screen").click(function closeNav() {
  if (on) {
    $("#mySidenav").style.width = "20%";
    var on = false;
    /*    $("#main").style.marginRight= "20%"; */
  };
});



function initiate(data) {
  data.forEach(function create(val) {

    var box = document.createElement("div");
    box.setAttribute("class", "floating-box");
    box.id = "room-" + val.n.toString();

    var info = document.createElement("div");
    info.setAttribute("class", "nom");
    info.appendChild(val.name + "\n" + "Chambre :" + val.n.toString());

    var icon = new Image(20, 20);
    icon.src = 'static/image/bedroom.png';


    var dur = document.createElement('p');
    dur.innerText = val.tmc;
    dur.id = "tmc-" + val.n;


    box.appendChild(info,icon, dur);
    monitoring.appendChild(box);

  });
};


function update_css(data) {
  data.forEach(function creat(val) {
    if (val.acti == "") {

      $("#tmc-" + val.n).innerText = "0";
      $("#room-" + val.n.toString() ).toggle(display);
      /*$("room-"+val.n.toString()).style.backgroundColor = "#f2f2f2"*/
    }
    else {
      $("#tmc-" + val.n).innerText = val.tmc;
      /*bleu :#1D7FB2; vert : #8C8910; rouge : #CA1725; gris :#f2f2f2;*/
      if (val.lastEvent == "BEDROOM") {
/*        $("#room-" + val.n.toString() ).style.backgroundColor = "#f2f2f2";*/
        $("#room-" + val.n.toString() ).attr("src",'static/image/bedroom.png');
      }
      else if (val.lastEvent == "BATHROOM") {
/*        $("#room-" + val.n.toString() ).style.backgroundColor = "#1D7FB2";*/
        $("#room-" + val.n.toString() ).attr("src", 'static/image/shower.svg');
      }
      else if (val.lastEvent == "FALL") {
        $("#room-" + val.n.toString() ).style.backgroundColor = "#CA1725";
      }
      else {
        /*$("room-"+val.n.toString() ).style.backgroundColor = "#f2f2f2"*/
      };
      $("#room-" + val.n.toString() ).style.display = "show";
    };
  });
};

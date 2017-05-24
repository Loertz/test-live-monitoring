$("#journal").click(function openNav() {
    $.("#mySidenav").style.width = "100%";
    var on = true;
/*    document.getElementById("main").style.marginLeft = "100%";*/
});

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
$("#journal").click(function closeNav() {
  if (on) {
      $.("#mySidenav").style.width = "20%";
      var on = false:
  /*    $.("#main").style.marginRight= "20%"; */
  };
});


function initiate (data) {
  data.forEach(function create(val) {

    var box = document.createElement("div");
    box.setAttribute("class","floating-box");
    box.id = "div"+val.n;

    var resd = document.createElement('h5');
    resd.innerText = val.name + "Chambre :  n°" + val.n;

    var dur = document.createElement('h6');

    dur.innerText = val.tmc;
    dur.id = val.n;


    box.appendChild(resd,dur);
    monitoring.appendChild(box);

  });
};


function update_css(data)
{data.forEach(function creat( val) {
      if (val.acti == "") {

          $.(val.n).innerText = val.tmc;
          $.("div"+val.n).style.display = "none";
          /*$.("#div"+val.n).style.backgroundColor = "#f2f2f2"*/
      }

      else {
        $.(val.n).innerText = val.tmc;
            /*bleu :#1D7FB2; vert : #8C8910; rouge : #CA1725; gris :#f2f2f2;*/
            if (val.lastEvent == "BEDROOM") {
              $.("#div"+val.n).style.backgroundColor = #f2f2f2;
            }
            else if (val.lastEvent == "BATHROOM") {
              $.("#"+"div"+string(val.n)).style.backgroundColor = "#1D7FB2";
            }
            else if (val.lastEvent == "FALL") {
              $.("#div"+val.n).style.backgroundColor = "#CA1725";
            }
            else {
              /*$.("#div"+val.n).style.backgroundColor = "#f2f2f2"*/
            };
        $.("#div"+val.n).style.display = "show";
      };
  });
};

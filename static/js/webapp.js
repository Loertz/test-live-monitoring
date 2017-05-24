function openNav() {
    document.getElementById("mySidenav").style.width = "100%";
    var on = true;
/*    document.getElementById("main").style.marginLeft = "100%";*/
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
  if (on) {
      document.getElementById("mySidenav").style.width = "20%";
      var on = false:
  /*    document.getElementById("main").style.marginRight= "20%"; */
  };
}


function initiate (data) {
  data.forEach(function create(val) {

    var node = document.createElement("div");
    node.setAttribute("class","floating-box");
    node.id = "div"+val.n;

    var resd = document.createElement('h5');
    resd.innerText = val.name + "Chambre :  n°" + val.n;

    var dur = document.createElement('h6');

    dur.innerText = val.tmc;
    dur.id = val.n;

    node.appendChild(resd);
    node.appendChild(dur);
    monitoring.appendChild(node);

  });
};


function update_css(data)
{data.forEach(function creat( val) {
      if (val.acti == "") {

          document.getElementById(val.n).innerText = val.tmc;
          document.getElementById("div"+val.n).style.display = "none";
          /*document.getElementById("div"+val.n).style.backgroundColor = "rgb(63, 63, 78)"*/
      }

      else {
        document.getElementById(val.n).innerText = val.tmc;
            /*bleu :#1D7FB2; vert : #8C8910; rouge : #CA1725; gris :rgb(63, 63, 78);*/
            if (val.lastEvent == "BEDROOM") {
              $.("#div"+val.n).style.backgroundColor = rgb(63, 63, 78);
            }
            else if (val.lastEvent == "BATHROOM") {
              $.("#"+"div"+string(val.n)).style.backgroundColor = "#1D7FB2";
            }
            else if (val.lastEvent == "FALL") {
              $.("#div"+val.n).style.backgroundColor = "#CA1725";
            }
            else {
              /*document.getElementById("div"+val.n).style.backgroundColor = "rgb(63, 63, 78)"*/
            };
        $.("#div"+val.n).style.display = "show";
      };
  });
};

function openNav() {
    document.getElementById("mySidenav").style.width = "100%";
/*    document.getElementById("main").style.marginLeft = "100%";*/
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "20%";
/*    document.getElementById("main").style.marginRight= "20%";*/
}


function initiate (data) {
  data.forEach(function create(val) {

    var node = document.createElement("div");
    node.setAttribute("class","floating-box");
    node.id = "div"+val.n;

    var resd = document.createElement('h5');
    resd.innerHTML = val.name +"\n" + "Chambre :  n°" + val.n;

    var dur = document.createElement('h6');

    dur.innerHTML = val.tmc
    dur.id = val.n;

    node.appendChild(resd);
    node.appendChild(dur);

    monitoring.appendChild(node);

  });
};


function update_css(data)
{data.forEach(function creat( val) {
      if (val.acti == "") {

          document.getElementById(val.n).innerHTML = val.tmc
          document.getElementById("div"+val.n).style.display = "none";
          /*document.getElementById("div"+val.n).style.backgroundColor = "rgb(63, 63, 78)"*/
      }

      else if (val.acti =="1") {
          document.getElementById(val.n).innerHTML = val.tmc
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
            document.getElementById("div"+val.n).style.display = "block";
        }

      else {
          document.getElementById(val.n).innerHTML = val.tmc
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

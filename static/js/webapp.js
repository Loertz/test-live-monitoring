$("#log-screen").click(function openNav() {
    $("#mySidenav").width("100%");
    var on = true;
    /*    document.getElementById("main").style.marginLeft = "100%";*/
});

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
$("#acti-screen").click(function closeNav() {
    if (on) {
        $("#mySidenav").width("20%");
        var on = false;
        /*    $("#main").style.marginRight= "20%"; */
    };
});

function changeImage(id, a) {
    document.getElementById(id).src = a;
};

function changeText(id,t) {
    document.getElementById(id).innerText = t;
}



function initiate(data) {
    data.forEach(function create(val) {

        var box = document.createElement("div");
        box.setAttribute("class", "floating-box");
        box.id = "room-" + val.n.toString();

        var info = document.createElement("div");
        info.setAttribute("class", "nom");
        info.innerText = val.name + "\n" + "Chambre : " + val.n.toString();

        var icon = new Image(40, 40);
        icon.setAttribute("src", "static/image/bedroom.png");
        icon.setAttribute("style","right:0")
        icon.id = "icon-" + val.n.toString();

        var dur = document.createElement("div");
        dur.setAttribute("class", "contenu");
        dur.innerText = val.tmc.toString();
        dur.id = "tmc-" + val.n.toString();


        box.appendChild(info);
        box.appendChild(icon);
        box.appendChild(dur);
        box.style.display = "flex";
        monitoring.appendChild(box);

    });
};


function update_css(data) {
    data.forEach(function creat(val) {
        if (val.acti == "") {
            changeText("tmc-"+val.n.toString(),"0")
/*            $("#tmc-" + val.n.toString()).innerText = "0";*/
            $("#room-" + val.n.toString()).toggle(false);
            /*$("room-"+val.n.toString()).style.backgroundColor = "#f2f2f2"*/
        } else {
            $("#room-" + val.n.toString()).toggle(true);
            changeText("tmc-"+val.n.toString(),val.tmc)
            // $("#tmc-" + val.n.toString()).innerText = val.tmc;
            /*bleu :#1D7FB2; vert : #8C8910; rouge : #CA1725; gris :#f2f2f2;*/

            if (val.lastEvent == "BEDROOM") {
                    /* $("#room-" + val.n.toString() ).style.backgroundColor = "#f2f2f2";*/
                changeImage("icon-" + val.n.toString(), "static/image/bedroom.png")

            } else if (val.lastEvent == "BATHROOM") {
                /*$("#room-" + val.n.toString() ).style.backgroundColor = "#1D7FB2";*/
                changeImage("icon-" + val.n.toString(), "static/image/shower.svg")
            } else if (val.lastEvent == "FALL") {
                /*        $("#room-" + val.n.toString() ).style.backgroundColor = "#CA1725";*/
            } else {
                /*$("room-"+val.n.toString() ).style.backgroundColor = "#f2f2f2"*/
            };
        };
    });
};

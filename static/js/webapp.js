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

function changeImage(id, a) {
    $(id).src = a;
};

function initiate(data) {
    data.forEach(function create(val) {

        var box = document.createElement("div");
        box.setAttribute("class", "floating-box");
        box.id = "room-" + val.n.toString();

        var info = document.createElement("div");
        info.setAttribute("class", "nom");
        info.innerText = val.name + "\n" + "Chambre : " + val.n.toString();

        var icon = new Image(20, 20);
        icon.setAttribute("src", "static/image/bedroom.png");
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

            $("#tmc-" + val.n.toString()).innerText = "0";
            $("#room-" + val.n.toString()).toggle(display);
            /*$("room-"+val.n.toString()).style.backgroundColor = "#f2f2f2"*/
        } else {
            $("#tmc-" + val.n.toString()).innerText = val.tmc.toString();
            /*bleu :#1D7FB2; vert : #8C8910; rouge : #CA1725; gris :#f2f2f2;*/
            if (val.lastEvent == "BEDROOM") {
                console.log(val.tmc)
                    /* $("#room-" + val.n.toString() ).style.backgroundColor = "#f2f2f2";*/
                changeImage("#icon-" + val.n.toString(), "static/image/bedroom.png")

            } else if (val.lastEvent == "BATHROOM") {
                /*$("#room-" + val.n.toString() ).style.backgroundColor = "#1D7FB2";*/
                changeImage("#icon-" + val.n.toString(), "static/image/shower.svg")
            } else if (val.lastEvent == "FALL") {
                /*        $("#room-" + val.n.toString() ).style.backgroundColor = "#CA1725";*/
            } else {
                /*$("room-"+val.n.toString() ).style.backgroundColor = "#f2f2f2"*/
            };
        };
    });
};

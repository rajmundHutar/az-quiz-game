//G_RIGHT a G_LEFT jsou promene pro los
var G_RIGHT = 0;
var G_LEFT = 0;

var G_COLOR = new Array();
G_COLOR[0] = "";
G_COLOR[1] = "";

var G_NAME = new Array();
G_NAME[0] = "";
G_NAME[1] = "";

var G_LOS = false;
var G_SHAPES = new Array("rect", "hex", "tria", "koso", "circ");
var G_TIMER = false;
var G_TIMER_WIN = false;
var G_SELECTED_NUM = false;

var G_KEY_1 = 16; //16 = levy shift
var G_KEY_2 = 107; //107 = plus na num klavesnici, 8 = backspace

var neigh = Array();
neigh[1] = Array(2, 3);
neigh[2] = Array(1, 3, 4, 5);
neigh[3] = Array(1, 2, 5, 6);
neigh[4] = Array(2, 5, 7, 8);
neigh[5] = Array(2, 3, 4, 6, 8, 9);
neigh[6] = Array(3, 5, 9, 10);
neigh[7] = Array(4, 8, 11, 12);
neigh[8] = Array(4, 5, 7, 9, 12, 13);
neigh[9] = Array(5, 6, 8, 10, 13, 14);
neigh[10] = Array(6, 9, 14, 15);
neigh[11] = Array(7, 12, 16, 17);
neigh[12] = Array(7, 8, 11, 13, 17, 18);
neigh[13] = Array(8, 9, 12, 14, 18, 19);
neigh[14] = Array(9, 10, 13, 15, 19, 20);
neigh[15] = Array(10, 14, 20, 21);
neigh[16] = Array(11, 17, 22, 23);
neigh[17] = Array(11, 12, 16, 18, 23, 24);
neigh[18] = Array(12, 13, 17, 19, 24, 25);
neigh[19] = Array(13, 14, 18, 20, 25, 26);
neigh[20] = Array(14, 15, 19, 21, 26, 27);
neigh[21] = Array(15, 20, 27, 28);
neigh[22] = Array(16, 23);
neigh[23] = Array(16, 17, 22, 24);
neigh[24] = Array(17, 18, 23, 25);
neigh[25] = Array(18, 19, 24, 26);
neigh[26] = Array(19, 20, 25, 27);
neigh[27] = Array(20, 21, 26);
neigh[28] = Array(21, 27);

var side = Array();
side[0] = Array(1, 2, 4, 7, 11, 16, 22);
side[1] = Array(1, 3, 6, 10, 15, 21, 28);
side[2] = Array(22, 23, 24, 25, 26, 27, 28);

var done = Array(false, false, false);

var visited = Array();
var toVisit = Array();
var blink = true;
function startPrimGraph(num, color) {
    clearInterval(G_TIMER_WIN);
    visited = Array();
    toVisit = Array();
    done = Array(false, false, false);
    primGraph(num, color);
    if (done[0] && done[1] && done[2]) {
        G_TIMER_WIN = setInterval(function () {
            if (blink) {
                $("img." + color).attr("src", "./obr/hex/hex_grey.png");
                blink = false;
            }
            else {
                $("img." + color).attr("src", "./obr/hex/hex_" + color + ".png");
                blink = true;
            }
        }, 200);
    }
}


function primGraph(pos, color) {
    pos = parseFloat(pos);
    visited.push(pos);
    if (side[0].indexOf(pos) != -1) {
        done[0] = true;
    }
    if (side[1].indexOf(pos) != -1) {
        done[1] = true;
    }
    if (side[2].indexOf(pos) != -1) {
        done[2] = true;
    }
    for (var i = 0; i < neigh[pos].length; i++) {
        var new_neigh = neigh[pos][i];
        if (toVisit.indexOf(new_neigh) == -1 && visited.indexOf(new_neigh) < 0) {
            var src = $("img[id=img_" + new_neigh + "]").attr("src");
            if (src.indexOf(color) != -1) {
                toVisit.push(parseFloat(new_neigh));
            }
        }
    }
    if (toVisit.length > 0) {
        var next_neigh = toVisit.pop();
        primGraph(next_neigh, color);
    }
}

$(document).ready(function () {
    $("div.dialog").hide();

    //UVODNI ANIMACE
    $("#napoveda").hide();
    $(".color_select").hide();
    $("#vyber_barev").hide();
    $("#uvod").delay(2000).fadeOut(1000);
    $("#vyber_barev").delay(2500).fadeIn(1000);
    $(".screen#los").hide();

    /*$(document).bind("contextmenu",function(e){
     return false;
     }); */

    /*Překryvani cisel na hraci plose*/
    $("DIV.number").hover(function () {
        $(this).css("cursor", "hand");
        var arr = $(this).attr("id").split("_");
        var image = $("img[id=img_" + arr[1] + "]").attr("src");
        if (image == "./obr/hex/hex_grey.png") {
            $("img[id=img_" + arr[1] + "]").attr("src", "./obr/hex/hex_hover.png");
        }
    }, function () {
        var arr = $(this).attr("id").split("_");
        var image = $("img[id=img_" + arr[1] + "]").attr("src");
        if (image == "./obr/hex/hex_hover.png") {
            $("img[id=img_" + arr[1] + "]").attr("src", "./obr/hex/hex_grey.png");
        }
    });

    /*Vyber otazky*/
    $("DIV.number").click(function (event) {
        var poz_top = 10;
        var poz_left = 10;
        event.preventDefault();
        G_SELECTED_NUM = $(this).attr("id").split("_")[1];
        poz_top = event.pageY + 20;
        poz_left = event.pageX - ($('.color_select').width() / 2);
        $('.color_select').css("position", "absolute");
        $('.color_select').css({top: poz_top, left: poz_left}).fadeIn(500);
    });

    $(".color_select img").hover(function () {
        $(this).css("cursor", "pointer");
    }, function () {
        $(this).css("cursor", "normal");
    }).click(function () {
        var idcko = $(this).attr("id");

        $("img[id=img_" + G_SELECTED_NUM + "]").removeClass(G_COLOR[1]).removeClass(G_COLOR[0]);

        if (idcko == "tym0") {
            $("img[id=img_" + G_SELECTED_NUM + "]").attr("src", "./obr/hex/hex_" + G_COLOR[0] + ".png").addClass(G_COLOR[0]);
            startPrimGraph(G_SELECTED_NUM, G_COLOR[0]);
        }
        else if (idcko == "tym1") {
            $("img[id=img_" + G_SELECTED_NUM + "]").attr("src", "./obr/hex/hex_" + G_COLOR[1] + ".png").addClass(G_COLOR[1]);
            startPrimGraph(G_SELECTED_NUM, G_COLOR[1]);
        }
        else if (idcko == "dark") {
            $("img[id=img_" + G_SELECTED_NUM + "]").attr("src", "./obr/hex/hex_dark.png");
        }
        else if (idcko == "empty") {
            $("img[id=img_" + G_SELECTED_NUM + "]").attr("src", "./obr/hex/hex_grey.png");
        }
        else if (idcko == "butt_los") {
            if ($(".screen#los").is(":hidden")) {
                while (G_LEFT == G_RIGHT)
                    startLos();
                $(".screen#los").fadeIn(500);
                G_LOS = true;
                G_TIMER = setInterval("startLos()", 700);
            }
        }
        $('.color_select').fadeOut(500);
    });

    /*LOSOVANI*/
    $(document).keydown(function (e) {
        if (G_LOS) {
            if (e.keyCode == G_KEY_1 || e.keyCode == G_KEY_2) {
                clearTimeout(G_TIMER);
                e.preventDefault();
                if (G_LEFT == G_RIGHT) {
                    if (e.keyCode == G_KEY_1) {
                        $("#los_leva").html("<img src=\"./obr/" + G_SHAPES[G_LEFT] + "/" + G_SHAPES[G_LEFT] + "_" + G_COLOR[0] + ".png\">");
                    }
                    else if (e.keyCode == G_KEY_2) {
                        $("#los_prava").html("<img src=\"./obr/" + G_SHAPES[G_RIGHT] + "/" + G_SHAPES[G_RIGHT] + "_" + G_COLOR[1] + ".png\">");
                    }
                }
                else {
                    if (e.keyCode == G_KEY_1) {
                        $("#los_prava").html("<img src=\"./obr/" + G_SHAPES[G_RIGHT] + "/" + G_SHAPES[G_RIGHT] + "_" + G_COLOR[1] + ".png\">");
                    }
                    else if (e.keyCode == G_KEY_2) {
                        $("#los_leva").html("<img src=\"./obr/" + G_SHAPES[G_LEFT] + "/" + G_SHAPES[G_LEFT] + "_" + G_COLOR[0] + ".png\">");
                    }
                }
                $(".screen#los").delay(2000).fadeOut(500, function () {
                    $('.color_select').fadeIn(500);
                    startLos();
                });
            }
            G_LOS = false;
        }
    });


    /*Zacatek hry*/
    $("input#play").click(function () {
        var tym = new Array();
        tym[1] = $("input.tymy[name=tym1]").val();
        tym[2] = $("input.tymy[name=tym2]").val();
        tym[3] = $("input.tymy[name=tym3]").val();
        tym[4] = $("input.tymy[name=tym4]").val();

        var count = 0;
        if (tym[1] != "")
            count++;
        if (tym[2] != "")
            count++;
        if (tym[3] != "")
            count++;
        if (tym[4] != "")
            count++;
        if (count < 2) {
            alert("Málo týmů. Zadej jména dvou týmů.");
        }
        else if (count > 2) {
            alert("Moc týmů. Zadej jména dvou týmů.");
        }
        else {
            for (var i = 1; i <= 4; i++) {
                if (G_COLOR[0] == "" && G_COLOR[1] != "" && tym[i] != "") {
                    G_COLOR[0] = $("input.tymy[name=tym" + i + "]").attr("data-color");
                    G_NAME[0] = $("input.tymy[name=tym" + i + "]").val();
                }
                if (G_COLOR[1] == "" && tym[i] != "") {
                    G_COLOR[1] = $("input.tymy[name=tym" + i + "]").attr("data-color");
                    G_NAME[1] = $("input.tymy[name=tym" + i + "]").val();
                }
            }
            $("#vyber_barev").fadeOut(500);

            $("img#img_tym_right").attr("src", "./obr/hex/hex_" + G_COLOR[1] + ".png");
            $("img#img_tym_left").attr("src", "./obr/hex/hex_" + G_COLOR[0] + ".png");
            $("div.playground #tym_right span").html(G_NAME[1]);
            $("div.playground #tym_left span").html(G_NAME[0]);

            $("div.color_select img#tym0").attr("src", "./obr/hex/hex_" + G_COLOR[0] + ".png");
            $("div.color_select img#tym1").attr("src", "./obr/hex/hex_" + G_COLOR[1] + ".png");

            $("div.playground .team").fadeIn(500);
        }
    });
    $("div#vyber_barev input.napoveda_button").click(function () {
        $("#vyber_barev").fadeOut(500);
        $("#napoveda").fadeIn(500);
    });
    $("div#napoveda input.napoveda_button").click(function () {
        $("#vyber_barev").fadeIn(500);
        $("#napoveda").fadeOut(500);
    });
});

/*generovani nahodnych obrazku*/
function startLos() {
    var max = 4, min = 0;
    G_LEFT = Math.floor(Math.random() * (max - min + 1)) + min;
    G_RIGHT = 4 - Math.floor(Math.random() * (max - min + 1)) + min;
    $("#los_leva").html("<img src=\"./obr/" + G_SHAPES[G_LEFT] + "/" + G_SHAPES[G_LEFT] + "_grey.png\">");
    $("#los_prava").html("<img src=\"./obr/" + G_SHAPES[G_RIGHT] + "/" + G_SHAPES[G_RIGHT] + "_grey.png\">");
}

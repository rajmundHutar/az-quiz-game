var AzQuizGame = {
    players: [
        {
            name: "",
            color: "grey"
        },
        {
            name: "",
            color: "grey"
        }
    ],
    settings: {
        selectedNum: 0,
        gameStarted: false,
        lottery: {
            isRunning: false,
            left: "",
            right: "",
            shapes: ["rect", "hex", "tria", "koso", "circ"],
            interval: null,
            keyCodeLeft: 16,
            keyCodeRight: 107 || 8 //8 is backspace
        },
        endGame: {
            side: [
                [1, 2, 4, 7, 11, 16, 22],
                [1, 3, 6, 10, 15, 21, 28],
                [22, 23, 24, 25, 26, 27, 28]
            ],
            done: [false, false, false],
            visited: [],
            toVisit: [],
            blink: true,
            timerWin: null
        }
    },
    neighbors: [
        [],
        [2, 3],
        [1, 3, 4, 5],
        [1, 2, 5, 6],
        [2, 5, 7, 8],
        [2, 3, 4, 6, 8, 9],
        [3, 5, 9, 10],
        [4, 8, 11, 12],
        [4, 5, 7, 9, 12, 13],
        [5, 6, 8, 10, 13, 14],
        [6, 9, 14, 15],
        [7, 12, 16, 17],
        [7, 8, 11, 13, 17, 18],
        [8, 9, 12, 14, 18, 19],
        [9, 10, 13, 15, 19, 20],
        [10, 14, 20, 21],
        [11, 17, 22, 23],
        [11, 12, 16, 18, 23, 24],
        [12, 13, 17, 19, 24, 25],
        [13, 14, 18, 20, 25, 26],
        [14, 15, 19, 21, 26, 27],
        [15, 20, 27, 28],
        [16, 23],
        [16, 17, 22, 24],
        [17, 18, 23, 25],
        [18, 19, 24, 26],
        [19, 20, 25, 27],
        [20, 21, 26],
        [21, 27]
    ]
};

AzQuizGame.start = function () {
    //Starting animation
    $("#help, #lottery, #color_select").hide();

    $("#uvod").delay(2000).fadeOut(1000);
    //$("#uvod").hide();

    this.applyColors();

    this.bind();
};

AzQuizGame.applyColors = function () {
    var rmClasses = "blue_hex yellow_hex grey_hex green_hex red_hex";
    $("#img_tym_left").removeClass(rmClasses).addClass(this.players[0].color + "_hex");
    $("#img_tym_right").removeClass(rmClasses).addClass(this.players[1].color + "_hex");

    $("#tym0").removeClass(rmClasses).addClass(this.players[0].color + "_hex");
    $("#tym1").removeClass(rmClasses).addClass(this.players[1].color + "_hex");
};

AzQuizGame.bind = function () {
    var numbers = document.getElementsByClassName("number");
    for (var i = 0; i < numbers.length; i++) {
        numbers[i].addEventListener("click", function (event) {
            AzQuizGame.selectHex(event);
        });
    }

    var colors = document.getElementsByClassName("colors");
    for (var j = 0; j < colors.length; j++) {
        colors[j].addEventListener("click", function (event) {
            AzQuizGame.selectColor(AzQuizGame.settings.selectedNum, event.toElement.id);
        });
    }

    document.addEventListener("keydown", function (e) {
        if (AzQuizGame.settings.lottery.isRunning) {
            if (e.keyCode == AzQuizGame.settings.lottery.keyCodeLeft || e.keyCode == AzQuizGame.settings.lottery.keyCodeRight) {
                e.preventDefault();
                AzQuizGame.lotteryKeyboardClick(e.keyCode);
            }
        }
    });

    document.getElementById("img_tym_left").addEventListener("click", function () {
        AzQuizGame.changePlayerColor(0);
    });
    document.getElementById("img_tym_right").addEventListener("click", function () {
        AzQuizGame.changePlayerColor(1);
    });
    document.getElementById("name_tym_left").addEventListener("keyup", function (ele) {
        AzQuizGame.changePlayerName(0, ele.target.innerText);
    });
    document.getElementById("name_tym_right").addEventListener("keyup", function (ele) {
        AzQuizGame.changePlayerName(1, ele.target.innerText);
    });

    document.getElementById("help_button").addEventListener("click", function () {
        $("#help").fadeIn(500);
    });

    document.getElementById("close_help_button").addEventListener("click", function () {
        $("#help").fadeOut(500);
    });
};

AzQuizGame.selectHex = function (event) {
    if (!this.checkSetup()) {
        return;
    }
    this.settings.selectedNum = event.toElement.id.split("_")[1];
    var colorSelect = $('#color_select');
    colorSelect.css({
        top: event.pageY + 20,
        left: event.pageX - (colorSelect.width() / 2)
    }).fadeIn(200);
};

AzQuizGame.checkSetup = function () {
    if (this.players[0].color === "grey" || this.players[1].color === "grey") {
        alert("Vyber barvu týmům / hráčům");
        return false;
    }
    if (this.players[0].color === this.players[1].color) {
        alert("Vyber rozdílnou barvu týmům / hráčům");
        return false;
    }
    if (this.players[0].name == "" || this.players[1].name == "") {
        alert("Nastav jména týmů / hráčů");
        return false;
    }
    this.settings.gameStarted = true;
    return true;
};

AzQuizGame.changePlayerColor = function (player) {
    if (!this.settings.gameStarted) {
        var currentColor = this.players[player].color;
        var newColor;
        switch (currentColor) {
            case "blue":
                newColor = "red";
                break;
            case "red":
                newColor = "green";
                break;
            case "green":
                newColor = "yellow";
                break;
            default:
                newColor = "blue";
        }
        this.players[player].color = newColor;

        this.applyColors();
    }
};

AzQuizGame.changePlayerName = function (player, name) {
    this.players[player].name = name;
};

AzQuizGame.selectColor = function (id, action) {
    var $div = $("#div_" + id);
    $div.removeClass(this.players[0].color + "_hex " + this.players[1].color + "_hex dark_hex");

    if (action == "tym0") {
        $div.addClass(this.players[0].color + "_hex");
        this.startPrimGraph(id, this.players[0].color);
    }
    else if (action == "tym1") {
        $div.addClass(this.players[1].color + "_hex");
        this.startPrimGraph(id, this.players[1].color);
    }
    else if (action == "dark") {
        $div.addClass("dark_hex");
    }
    else if (action == "butt_los") {
        this.startLottery();
    }
    $('#color_select').fadeOut(500);
};


AzQuizGame.startLottery = function () {
    this.settings.lottery.isRunning = true;
    $("#lottery").fadeIn(500);
    AzQuizGame.lottery();
    this.settings.lottery.interval = setInterval(function () {
        AzQuizGame.lottery();
    }, 700);
};

AzQuizGame.lottery = function () {
    var max = 4, min = 0;
    this.settings.lottery.left = Math.floor(Math.random() * (max - min + 1)) + min;
    this.settings.lottery.right = 4 - Math.floor(Math.random() * (max - min + 1)) + min;
    $("#los_leva").html("<img src=\"./obr/" + this.settings.lottery.shapes[this.settings.lottery.left] + "/" + this.settings.lottery.shapes[this.settings.lottery.left] + "_grey.png\">");
    $("#los_prava").html("<img src=\"./obr/" + this.settings.lottery.shapes[this.settings.lottery.right] + "/" + this.settings.lottery.shapes[this.settings.lottery.right] + "_grey.png\">");
};

AzQuizGame.lotteryKeyboardClick = function (keyCode) {
    this.settings.lottery.isRunning = false;
    clearInterval(this.settings.lottery.interval);

    if (this.settings.lottery.left == this.settings.lottery.right) {
        if (keyCode == this.settings.lottery.keyCodeLeft) {
            $("#los_leva").html("<img src=\"./obr/" + this.settings.lottery.shapes[this.settings.lottery.left] + "/" + this.settings.lottery.shapes[this.settings.lottery.left] + "_" + this.players[0].color + ".png\">");
            this.selectColor(this.settings.selectedNum, "tym0");
        }
        else if (keyCode == this.settings.lottery.keyCodeRight) {
            $("#los_prava").html("<img src=\"./obr/" + this.settings.lottery.shapes[this.settings.lottery.right] + "/" + this.settings.lottery.shapes[this.settings.lottery.right] + "_" + this.players[1].color + ".png\">");
            this.selectColor(this.settings.selectedNum, "tym1");
        }
    }
    else {
        if (keyCode == this.settings.lottery.keyCodeLeft) {
            $("#los_prava").html("<img src=\"./obr/" + this.settings.lottery.shapes[this.settings.lottery.right] + "/" + this.settings.lottery.shapes[this.settings.lottery.right] + "_" + this.players[1].color + ".png\">");
            this.selectColor(this.settings.selectedNum, "tym1");
        }
        else if (keyCode == this.settings.lottery.keyCodeRight) {
            $("#los_leva").html("<img src=\"./obr/" + this.settings.lottery.shapes[this.settings.lottery.left] + "/" + this.settings.lottery.shapes[this.settings.lottery.left] + "_" + this.players[0].color + ".png\">");
            this.selectColor(this.settings.selectedNum, "tym0");
        }
    }

    $("#lottery").delay(1000).fadeOut(500);
};

AzQuizGame.startPrimGraph = function (num, color) {
    this.settings.endGame.done = [false, false, false];
    this.settings.endGame.visited = [];
    this.settings.endGame.toVisit = [];
    clearInterval(this.settings.endGame.timerWin);

    this.primGraph(num, color);

    if (this.settings.endGame.done[0] && this.settings.endGame.done[1] && this.settings.endGame.done[2]) {
        this.endGame(color);
    }
};

AzQuizGame.endGame = function (winColor) {
    if (this.players[0].color === winColor) {
        alert("Vyhrál tým " + this.players[0].name);
    } else if (this.players[1].color === winColor) {
        alert("Vyhrál tým " + this.players[1].name);
    }
    var list = document.getElementsByClassName(winColor + "_hex");
    var winningIds = [];
    for (var i = 0; i < list.length; i++) {
        if (list[i].id.slice(0, 4) == "div_") {
            winningIds.push("#" + list[i].id);
        }
    }

    this.settings.endGame.timerWin = setInterval(function () {
        if (AzQuizGame.settings.endGame.blink) {
            $(winningIds.join(", ")).removeClass(winColor + "_hex");
            AzQuizGame.settings.endGame.blink = false;
        }
        else {
            $(winningIds.join(", ")).addClass(winColor + "_hex");
            AzQuizGame.settings.endGame.blink = true;
        }
    }, 200);
};


AzQuizGame.primGraph = function (pos, color) {
    pos = parseFloat(pos);
    this.settings.endGame.visited.push(pos);
    if (this.settings.endGame.side[0].indexOf(pos) != -1) {
        this.settings.endGame.done[0] = true;
    }
    if (this.settings.endGame.side[1].indexOf(pos) != -1) {
        this.settings.endGame.done[1] = true;
    }
    if (this.settings.endGame.side[2].indexOf(pos) != -1) {
        this.settings.endGame.done[2] = true;
    }
    for (var i = 0; i < this.neighbors[pos].length; i++) {
        var new_neigh = this.neighbors[pos][i];
        if (this.settings.endGame.toVisit.indexOf(new_neigh) == -1 && this.settings.endGame.visited.indexOf(new_neigh) < 0) {
            var src = $("div#div_" + new_neigh).attr("class");
            if (src.indexOf(color) != -1) {
                this.settings.endGame.toVisit.push(parseFloat(new_neigh));
            }
        }
    }
    if (this.settings.endGame.toVisit.length > 0) {
        var next_neigh = this.settings.endGame.toVisit.pop();
        this.primGraph(next_neigh, color);
    }
};

AzQuizGame.start();
var typeList = ["Bug", "Dark", "Dragon", "Electric", "Fairy", "Fighting", "Fire", "Flying",
    "Ghost", "Grass", "Ground", "Ice", "Normal", "Poison", "Psychic", "Rock", "Steel", "Water"];
var natureList = {
    Hardy: {
        atk: 1,
        def: 1
    },
    lonely: {
        atk: 1.1,
        def: .9
    },
    brave: {
        atk: 1.1,
        spe: 0.9
    },
    adamant: {
        atk: 1.1,
        spa: 0.9
    },
    naughty: {
        atk: 1.1,
        spd: 0.9
    },
    docile: {
        def: 1,
        atk: 1
    },
    bold: {
        def: 1.1,
        atk: 0.9
    },
    relaxed: {
        def: 1.1,
        spe: 0.9
    },
    impish: {
        def: 1.1,
        spa: 0.9
    },
    lax: {
        def: 1.1,
        spd: 0.9
    },
    serious: {
        spe: 1,
        atk: 1
    },
    timid: {
        spe: 1.1,
        atk: 0.9
    },
    hasty: {
        spe: 1.1,
        def: 0.9
    },
    jolly: {
        spe: 1.1,
        spa: 0.9
    },
    naive: {
        spe: 1.1,
        spd: 0.9
    },
    bashful: {
        spa: 1,
        atk: 1
    },
    modest: {
        spa: 1.1,
        atk: 0.9
    },
    mild: {
        spa: 1.1,
        def: 0.9
    },
    quiet: {
        spa: 1.1,
        spe: 0.9
    },
    rash: {
        spa: 1.1,
        spd: 0.9
    },
    quirky: {
        spd: 1,
        atk: 1
    },
    calm: {
        spd: 1.1,
        atk: 0.9
    },
    gentle: {
        spd: 1.1,
        def: 0.9
    },
    sassy: {
        spd: 1.1,
        spe: 0.9
    },
    careful: {
        spd: 1.1,
        spa: 0.9
    }
};

var teamWeaknesses = {
    Bug: 0,
    Dark: 0,
    Dragon: 0,
    Electric: 0,
    Fairy: 0,
    Fighting: 0,
    Fire: 0,
    Flying: 0,
    Ghost: 0,
    Grass: 0,
    Ground: 0,
    Ice: 0,
    Normal: 0,
    Poison: 0,
    Psychic: 0,
    Rock: 0,
    Steel: 0,
    Water: 0
};
var team = [];

var neutral = 0;
var weak = 1;
var resist = 2;
var immune = 3;

function modifiersChecked() {
    var checkbox = document.getElementById("baseOnlyCheckbox");
    checkbox.checked = !checkbox.checked;
}

function parseInput() {
    var input = document.getElementById("team-input").value;
    resetWeaknessTable();
    resetTypeCoverageTable();
    team = [];

    var mons = input.split("\n\n");
    for (var i = 0; i < mons.length; i++) {
        if (mons[i].length > 2) {
            team[i] = parsePokemon(mons[i]);
        }
    }
    if (team.length > 6) {
        alert("Too many pokemon");
        return;
    }
    for (var j = 0; j < team.length; j++) {
        if (j === 0) {
            setWeaknesses(team[j].weaknesses, true);
        } else {
            setWeaknesses(team[j].weaknesses, false);
        }
    }
    populateWeaknessTable();
    populateTypeCoverageTable();
    populateOverview();
    populateStatTable();
}

function parsePokemon(raw) {
    var lines = raw.split("\n");
    var offset = 0;

    var name = lines[0];
    if (name.indexOf("(") > -1) {
        name = name.substring(name.indexOf("(") + 1, name.indexOf(")")).toLowerCase().replaceAll("-", "");
    } else {
        name = lines[0].substring(0, lines[0].indexOf(" ")).toLowerCase().replaceAll("-", "");
    }
    var types = dex[name].types;
    var weaknesses = getPokemonWeaknesses(name);
    var item = lines[0].substring(lines[0].indexOf("@") + 2, lines[0].length);
    var ability = lines[1].substring(lines[1].indexOf(" ") + 1, lines[1].length);

    var level = 0;
    if (lines[2].indexOf("/") < 0) {
        level = lines[2].substring(lines[2].indexOf(" ") + 1);
        offset++;
    } else {
        level = 100;
    }

    var evs = parseEVs(lines[2 + offset].substring(lines[2 + offset].indexOf(" ") + 1).split(" / "));
    var nature = lines[3 + offset].substring(0, lines[3 + offset].indexOf(" "));

    var ivs;
    if (lines[4 + offset].indexOf("-") < 0) {
        ivs = parseIVs(lines[4 + offset].substring(lines[4 + offset].indexOf(" ") + 1).split(" / "));
        offset++;
    } else {
        ivs = {
            hp: 31,
            atk: 31,
            def: 31,
            spa: 31,
            spd: 31,
            spe: 31
        };
    }

    var move1 = lines[4 + offset].substring(lines[4 + offset].indexOf("-") + 1, lines[4 + offset].length);
    var move2 = lines[5 + offset].substring(lines[5 + offset].indexOf("-") + 1, lines[5 + offset].length);
    var move3 = lines[6 + offset].substring(lines[6 + offset].indexOf("-") + 1, lines[6 + offset].length);
    var move4 = lines[7 + offset].substring(lines[7 + offset].indexOf("-") + 1, lines[7 + offset].length);

    return {
        name: name,
        level: level,
        types: types,
        weaknesses: weaknesses,
        item: item,
        ability: ability,
        nature: nature,
        evs: evs,
        ivs: ivs,
        move1: move1,
        move2: move2,
        move3: move3,
        move4: move4
    }
}

function parseEVs(rawEVs) {
    var outputEVs = {
        hp: 0,
        atk: 0,
        def: 0,
        spa: 0,
        spd: 0,
        spe: 0
    };

    for (var index in rawEVs) {
        var string = rawEVs[index].toLowerCase();

        if (string.indexOf("hp") > -1) {
            outputEVs.hp = parseInt(string.substring(0, string.indexOf(" ")));
        } else if (string.indexOf("atk") > -1) {
            outputEVs.atk = parseInt(string.substring(0, string.indexOf(" ")));
        } else if (string.indexOf("def") > -1) {
            outputEVs.def = parseInt(string.substring(0, string.indexOf(" ")));
        } else if (string.indexOf("spa") > -1) {
            outputEVs.spa = parseInt(string.substring(0, string.indexOf(" ")));
        } else if (string.indexOf("spd") > -1) {
            outputEVs.spd = parseInt(string.substring(0, string.indexOf(" ")));
        } else if (string.indexOf("spe") > -1) {
            outputEVs.spe = parseInt(string.substring(0, string.indexOf(" ")));
        }
    }

    return outputEVs;
}

function parseIVs(rawIVs) {
    var outputIVs = {
        hp: 0,
        atk: 0,
        def: 0,
        spa: 0,
        spd: 0,
        spe: 0
    };

    for (var index in rawIVs) {
        var string = rawIVs[index].toLowerCase();

        if (string.indexOf("hp") > -1) {
            outputIVs.hp = parseInt(string.substring(0, string.indexOf(" ")));
        } else if (string.indexOf("atk") > -1) {
            outputIVs.atk = parseInt(string.substring(0, string.indexOf(" ")));
        } else if (string.indexOf("def") > -1) {
            outputIVs.def = parseInt(string.substring(0, string.indexOf(" ")));
        } else if (string.indexOf("spa") > -1) {
            outputIVs.spa = parseInt(string.substring(0, string.indexOf(" ")));
        } else if (string.indexOf("spd") > -1) {
            outputIVs.spd = parseInt(string.substring(0, string.indexOf(" ")));
        } else if (string.indexOf("spe") > -1) {
            outputIVs.spe = parseInt(string.substring(0, string.indexOf(" ")));
        }
    }
    return outputIVs;
}

function calcStat(pokemon, stat, ev, iv) {
    var b = dex[pokemon.name].baseStats[stat];
    var i = iv;
    var e = ev;
    var l = pokemon.level;
    var n = 1;

    var nature = natureList[pokemon.nature.toLowerCase()];
    if (nature.hasOwnProperty(stat)) {
        n = nature[stat];
    }

    if (stat === "hp") {
        return Math.floor((2 * b + i + e) * l / 100 + l + 10);
    } else {
        return Math.floor(Math.floor((2 * b + i + e) * l / 100 + 5) * n);
    }
}

function getPokemonWeaknesses(pokemonName) {
    var mon = dex[pokemonName];
    var pokemonWeakness = {
        Bug: 0,
        Dark: 0,
        Dragon: 0,
        Electric: 0,
        Fairy: 0,
        Fighting: 0,
        Fire: 0,
        Flying: 0,
        Ghost: 0,
        Grass: 0,
        Ground: 0,
        Ice: 0,
        Normal: 0,
        Poison: 0,
        Psychic: 0,
        Rock: 0,
        Steel: 0,
        Water: 0
    };

    var type1Chart = typeMatchups[mon.types[0]].damageTaken;
    for (var type1 in type1Chart) {
        if (type1Chart.hasOwnProperty(type1)) {
            if (pokemonWeakness.hasOwnProperty(type1)) {
                var effectiveness = type1Chart[type1];
                if (effectiveness === neutral) {
                    pokemonWeakness[type1] = 1;
                } else if (effectiveness === weak) {
                    pokemonWeakness[type1] = 2;
                } else if (effectiveness === resist) {
                    pokemonWeakness[type1] = -2;
                } else if (effectiveness === immune) {
                    pokemonWeakness[type1] = 0;
                }
            }
        }
    }

    if (mon.types.length > 1) {
        var type2Chart = typeMatchups[mon.types[1]].damageTaken;
        for (var type2 in type2Chart) {
            if (type2Chart.hasOwnProperty(type2)) {
                if (pokemonWeakness.hasOwnProperty(type2)) {
                    var effectiveness2 = type2Chart[type2];
                    if (effectiveness2 === weak) {
                        if (pokemonWeakness[type2] !== 0) {
                            if (pokemonWeakness[type2] + 2 === 0) {
                                pokemonWeakness[type2] = 1;
                            } else if (pokemonWeakness[type2] + 2 === 3) {
                                pokemonWeakness[type2] = 2
                            } else {
                                pokemonWeakness[type2] += 2;
                            }
                        }
                    } else if (effectiveness2 === resist) {
                        if (pokemonWeakness[type2] !== 0) {
                            if (pokemonWeakness[type2] - 2 === 0) {
                                pokemonWeakness[type2] = 1;
                            } else if (pokemonWeakness[type2] - 2 === -1) {
                                pokemonWeakness[type2] = -2
                            } else {
                                pokemonWeakness[type2] -= 2;
                            }
                        }
                    } else if (effectiveness2 === immune) {
                        pokemonWeakness[type2] = 0;
                    }
                }
            }
        }
    }

    return pokemonWeakness;
}

function setWeaknesses(matchups, reset) {
    if (reset) {
        for (var type in teamWeaknesses) {
            if (teamWeaknesses.hasOwnProperty(type)) {
                if (matchups.hasOwnProperty(type)) {
                    teamWeaknesses[type] = matchups[type];
                }
            }
        }
    } else {
        for (var addType in teamWeaknesses) {
            if (teamWeaknesses.hasOwnProperty(addType)) {
                if (matchups.hasOwnProperty(addType)) {
                    var base = teamWeaknesses[addType];
                    var add = matchups[addType];

                    if (base !== 0 && base !== 1 && add !== 1) {
                        if (add === 0) {
                            teamWeaknesses[addType] = 0;
                        } else if (base + add === 0) {
                            teamWeaknesses[addType] = 1;
                        } else if (base + add === 3) {
                            teamWeaknesses[addType] = 2;
                        } else if (base + add === -1) {
                            teamWeaknesses[addType] = -2;
                        } else {
                            teamWeaknesses[addType] = base + add;
                        }
                    } else if (base === 1) {
                        teamWeaknesses[addType] = add;
                    } else if (add === 1) {
                        teamWeaknesses[addType] = base;
                    }
                }
            }
        }
    }
}

function resetWeaknessTable() {
    for (var i = 0; i < team.length; i++) {
        var pos = i + 1;
        var pokemon = team[i];
        document.getElementById("mon" + pos + "Label").innerHTML = "";
        for (var type in pokemon.weaknesses) {
            if (pokemon.weaknesses.hasOwnProperty(type)) {
                document.getElementById(type.toLowerCase()).children[pos].innerHTML = "";
            }
        }
    }
}

function populateWeaknessTable() {
    for (var i = 0; i < team.length; i++) {
        var pos = i + 1;
        var pokemon = team[i];
        document.getElementById("mon" + pos + "Label").innerHTML = dex[pokemon.name].species;

        for (var type in pokemon.weaknesses) {
            if (pokemon.weaknesses.hasOwnProperty(type)) {
                document.getElementById(type.toLowerCase()).children[pos].innerHTML = getLabel(pokemon.weaknesses[type]);
            }
        }
    }
    for (var totalType in teamWeaknesses) {
        if (pokemon.weaknesses.hasOwnProperty(totalType)) {
            document.getElementById(totalType.toLowerCase()).children[7].innerHTML = getLabel(teamWeaknesses[totalType]);
        }
    }
}

function populateOverview() {
    var sixResist = 0;
    var eightResist = 0;
    var fourResist = 0;
    var twoResist = 0;

    var sixWeak = 0;
    var eightWeak = 0;
    var fourWeak = 0;
    var twoWeak = 0;

    var immune = 0;

    for (var type in teamWeaknesses) {
        var weakness = teamWeaknesses[type];
        if (weakness < 0) {
            if (weakness <= -16) {
                sixResist++;
            } else if (weakness <= -8) {
                eightResist++;
            } else if (weakness <= -4) {
                fourResist++;
            } else if (weakness <= -2) {
                twoResist++;
            }
        } else if (weakness > 0) {
            if (weakness >= 16) {
                sixWeak++;
            } else if (weakness >= 8) {
                eightWeak++;
            } else if (weakness >= 4) {
                fourWeak++;
            } else if (weakness >= 2) {
                twoWeak++;
            }
        } else {
            immune++;
        }
    }

    document.getElementById("16xResist").innerHTML = sixResist.toString();
    document.getElementById("8xResist").innerHTML = eightResist.toString();
    document.getElementById("4xResist").innerHTML = fourResist.toString();
    document.getElementById("2xResist").innerHTML = twoResist.toString();

    document.getElementById("16xWeak").innerHTML = sixWeak.toString();
    document.getElementById("8xWeak").innerHTML = eightWeak.toString();
    document.getElementById("4xWeak").innerHTML = fourWeak.toString();
    document.getElementById("2xWeak").innerHTML = twoWeak.toString();

    document.getElementById("immune").innerHTML = immune.toString();
}

function populateStatTable() {
    var evIvMod = document.getElementById("evIvModCheckbox");
    var baseOnly = document.getElementById("baseOnlyCheckbox");
    var table = document.getElementById("statTableBody");

    table.innerHTML = "";

    var index = 0;

    var hpTotal = 0;
    var atkTotal = 0;
    var defTotal = 0;
    var spaTotal = 0;
    var spdTotal = 0;
    var speTotal = 0;
    var bstTotal = 0;

    for (var mon in team) {
        var row = table.insertRow(index);
        if (index % 2 === 0) {
            row.style.backgroundColor = "#f2f2f2";
        }
        index++;

        var basicMon = team[mon];
        var evs = basicMon.evs;
        var ivs = basicMon.ivs;
        var fullMon = dex[team[mon].name];
        var baseStats = fullMon.baseStats;

        var actualHp = 0;
        var actualAtk = 0;
        var actualDef = 0;
        var actualSpa = 0;
        var actualSpd = 0;
        var actualSpe = 0;

        row.insertCell(0).innerHTML = fullMon.species;
        if (!evIvMod.checked) { //Don't apply EV/IV modifiers
            if (baseOnly.checked) {
                row.insertCell(1).innerHTML = baseStats.hp;
                row.insertCell(2).innerHTML = baseStats.atk;
                row.insertCell(3).innerHTML = baseStats.def;
                row.insertCell(4).innerHTML = baseStats.spa;
                row.insertCell(5).innerHTML = baseStats.spd;
                row.insertCell(6).innerHTML = baseStats.spe;

                hpTotal += baseStats.hp;
                atkTotal += baseStats.atk;
                defTotal += baseStats.def;
                spaTotal += baseStats.spa;
                spdTotal += baseStats.spd;
                speTotal += baseStats.spe;
            } else {
                actualHp = calcStat(basicMon, "hp", 0, 0);
                actualAtk = calcStat(basicMon, "atk", 0, 0);
                actualDef = calcStat(basicMon, "def", 0, 0);
                actualSpa = calcStat(basicMon, "spa", 0, 0);
                actualSpd = calcStat(basicMon, "spd", 0, 0);
                actualSpe = calcStat(basicMon, "spe", 0, 0);

                row.insertCell(1).innerHTML = actualHp.toString();
                row.insertCell(2).innerHTML = actualAtk.toString();
                row.insertCell(3).innerHTML = actualDef.toString();
                row.insertCell(4).innerHTML = actualSpa.toString();
                row.insertCell(5).innerHTML = actualSpd.toString();
                row.insertCell(6).innerHTML = actualSpe.toString();

                hpTotal += actualHp;
                atkTotal += actualAtk;
                defTotal += actualDef;
                spaTotal += actualSpa;
                spdTotal += actualSpd;
                speTotal += actualSpe;
            }
        } else {
            actualHp = calcStat(basicMon, "hp", evs.hp / 4, ivs.hp);
            actualAtk = calcStat(basicMon, "atk", evs.atk / 4, ivs.atk);
            actualDef = calcStat(basicMon, "def", evs.def / 4, ivs.def);
            actualSpa = calcStat(basicMon, "spa", evs.spa / 4, ivs.spa);
            actualSpd = calcStat(basicMon, "spd", evs.spd / 4, ivs.spd);
            actualSpe = calcStat(basicMon, "spe", evs.spe / 4, ivs.spe);

            row.insertCell(1).innerHTML = actualHp.toString();
            row.insertCell(2).innerHTML = actualAtk.toString();
            row.insertCell(3).innerHTML = actualDef.toString();
            row.insertCell(4).innerHTML = actualSpa.toString();
            row.insertCell(5).innerHTML = actualSpd.toString();
            row.insertCell(6).innerHTML = actualSpe.toString();

            hpTotal += actualHp;
            atkTotal += actualAtk;
            defTotal += actualDef;
            spaTotal += actualSpa;
            spdTotal += actualSpd;
            speTotal += actualSpe;
        }

        var bst = 0;
        for (var stat in fullMon.baseStats) {
            bst += baseStats[stat];
        }
        row.insertCell(7).innerHTML = bst.toString();
        bstTotal += bst;
    }

    var averageRow = table.insertRow(index);
    if (index % 2 === 0) {
        averageRow.style.backgroundColor = "#f2f2f2";
    }
    var averageLabel = averageRow.insertCell(0);
    averageLabel.innerHTML = "Averages:";
    averageLabel.style.fontWeight = "Bold";

    averageRow.insertCell(1).innerHTML = Math.floor((hpTotal / team.length)).toString();
    averageRow.insertCell(2).innerHTML = Math.floor((atkTotal / team.length)).toString();
    averageRow.insertCell(3).innerHTML = Math.floor((defTotal / team.length)).toString();
    averageRow.insertCell(4).innerHTML = Math.floor((spaTotal / team.length)).toString();
    averageRow.insertCell(5).innerHTML = Math.floor((spdTotal / team.length)).toString();
    averageRow.insertCell(6).innerHTML = Math.floor((speTotal / team.length)).toString();
    averageRow.insertCell(7).innerHTML = Math.floor((bstTotal / team.length)).toString();

    index++;

    var totalRow = table.insertRow(index);
    if (index % 2 === 0) {
        totalRow.style.backgroundColor = "#f2f2f2";
    }
    var totalLabel = totalRow.insertCell(0);
    totalLabel.innerHTML = "Totals:";
    totalLabel.style.fontWeight = "Bold";

    totalRow.insertCell(1).innerHTML = (hpTotal).toString();
    totalRow.insertCell(2).innerHTML = (atkTotal).toString();
    totalRow.insertCell(3).innerHTML = (defTotal).toString();
    totalRow.insertCell(4).innerHTML = (spaTotal).toString();
    totalRow.insertCell(5).innerHTML = (spdTotal).toString();
    totalRow.insertCell(6).innerHTML = (speTotal).toString();
    totalRow.insertCell(7).innerHTML = (bstTotal).toString();
}

function resetTypeCoverageTable() {
    var types = document.getElementsByClassName("material-icons");
    for (var element in types) {
        if (types.hasOwnProperty(element)) {
            types[element].innerHTML = "cancel";
            types[element].style.color = "red";
        }
    }
}

function populateTypeCoverageTable() {
    var hasMoveType = {
        Bug: false,
        Dark: false,
        Dragon: false,
        Electric: false,
        Fairy: false,
        Fighting: false,
        Fire: false,
        Flying: false,
        Ghost: false,
        Grass: false,
        Ground: false,
        Ice: false,
        Normal: false,
        Poison: false,
        Psychic: false,
        Rock: false,
        Steel: false,
        Water: false
    };
    for (var pokemon in team) {
        if (team.hasOwnProperty(pokemon)) {
            var move1Name = team[pokemon].move1.toLowerCase().replaceAll("-", "").replaceAll(" ", "");
            var move1 = movedex[move1Name];
            if (move1.basePower !== 0) {
                hasMoveType[move1.type] = true;
            }
            var move2Name = team[pokemon].move2.toLowerCase().replaceAll("-", "").replaceAll(" ", "");
            var move2 = movedex[move2Name];
            if (move2.basePower !== 0) {
                hasMoveType[move2.type] = true;
            }
            var move3Name = team[pokemon].move3.toLowerCase().replaceAll("-", "").replaceAll(" ", "");
            var move3 = movedex[move3Name];
            if (move3.basePower !== 0) {
                hasMoveType[move3.type] = true;
            }
            var move4Name = team[pokemon].move4.toLowerCase().replaceAll("-", "").replaceAll(" ", "");
            var move4 = movedex[move4Name];
            if (move4.basePower !== 0) {
                hasMoveType[move4.type] = true;
            }
        }
    }
    for (var type in typeList) {
        var weaknessList = weaknesses[typeList[type]];
        for (var currTypeWeakness in weaknessList) {
            if (weaknessList[currTypeWeakness]) {
                if (hasMoveType[currTypeWeakness]) {
                    setTypeCoverage(typeList[type]);
                }
            }
        }
    }
}

function setTypeCoverage(type) {
    var span = document.getElementById(type.toLowerCase() + "Coverage");
    span.innerHTML = "check circle";
    span.style.color = "green";
}

function getLabel(number) {
    if (number === 0) {
        return "Immune"
    } else if (number === 1) {
        return "Neutral"
    } else if (number > 0) {
        return number + "x Weak"
    } else if (number < 0) {
        return -number + "x Resist"
    }
}

//Thanks Stack Overflow
String.prototype.replaceAll = function (search, replace) {
    if (replace === undefined) {
        return this.toString();
    }

    return this.replace(new RegExp('[' + search + ']', 'g'), replace);
};
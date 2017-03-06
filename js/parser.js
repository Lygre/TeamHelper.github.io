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

function parseInput() {
    var input = document.getElementById("team-input").value;
    resetWeaknessTable();
    team = [];

    var mons = input.split("\n\n");
    for (var i = 0; i < mons.length; i++) {
        if (mons[i].length > 2) {
            team[i] = parsePokemon(mons[i]);
        }
    }
    for (var j = 0; j < team.length; j++) {
        if (j === 0) {
            setWeaknesses(team[j].weaknesses, true);
        } else {
            setWeaknesses(team[j].weaknesses, false);
        }
    }
    populateWeaknessTable();
}

function parsePokemon(raw) {
    var lines = raw.split("\n");

    var name = lines[0].substring(0, lines[0].indexOf(" ")).toLowerCase().replace("-", "");
    var types = dex[name].types;
    var weaknesses = getPokemonWeaknesses(name);
    var object = lines[0].substring(lines[0].indexOf("@") + 2, lines[0].length);
    var ability = lines[1].substring(lines[1].indexOf(" "), lines[1].length);
    var move1 = lines[4].substring(lines[4].indexOf("-") + 1, lines[4].length);
    var move2 = lines[5].substring(lines[5].indexOf("-") + 1, lines[5].length);
    var move3 = lines[6].substring(lines[6].indexOf("-") + 1, lines[6].length);
    var move4 = lines[7].substring(lines[7].indexOf("-") + 1, lines[7].length);

    return {
        name: name,
        types: types,
        weaknesses: weaknesses,
        object: object,
        ability: ability,
        move1: move1,
        move2: move2,
        move3: move3,
        move4: move4
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

    var type1Chart = typechart[mon.types[0]].damageTaken;
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
        var type2Chart = typechart[mon.types[1]].damageTaken;
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

function populateWeaknessTable() {
    for (var i = 0; i < team.length; i++) {
        var pos = i + 1;
        var pokemon = team[i];
        // console.log(pokemon.name);
        document.getElementById("mon" + pos + "Label").innerHTML = dex[pokemon.name].species;

        for (var type in pokemon.weaknesses) {
            if (pokemon.weaknesses.hasOwnProperty(type)) {
                document.getElementById(type.toLowerCase()).children[pos].innerHTML = pokemon.weaknesses[type].toString();
            }
        }
    }
    for (var totalType in teamWeaknesses) {
        if (pokemon.weaknesses.hasOwnProperty(totalType)) {
            document.getElementById(totalType.toLowerCase()).children[7].innerHTML = teamWeaknesses[totalType].toString();
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
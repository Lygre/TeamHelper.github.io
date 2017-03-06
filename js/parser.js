var weaknesses = {
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

    var mons = input.split("\n\n");
    for (var i = 0; i < mons.length; i++) {
        if (mons[i].length > 2) {
            team[i] = parsePokemon(mons[i]);
        }
    }
    for (var j = 0; j < team.length; j++) {
        if (j === 0) {
            setWeaknesses(team[j].name, true);
        } else {
            setWeaknesses(team[j].name, false);
        }
    }
    console.log(weaknesses);
}

function parsePokemon(raw) {
    var lines = raw.split("\n");

    var name = lines[0].substring(0, lines[0].indexOf(" ")).toLowerCase().replace("-", "");
    var object = lines[0].substring(lines[0].indexOf("@") + 2, lines[0].length);
    var ability = lines[1].substring(lines[1].indexOf(" "), lines[1].length);
    var move1 = lines[4].substring(lines[4].indexOf("-") + 1, lines[4].length);
    var move2 = lines[5].substring(lines[5].indexOf("-") + 1, lines[5].length);
    var move3 = lines[6].substring(lines[6].indexOf("-") + 1, lines[6].length);
    var move4 = lines[7].substring(lines[7].indexOf("-") + 1, lines[7].length);

    return {
        name: name,
        object: object,
        ability: ability,
        move1: move1,
        move2: move2,
        move3: move3,
        move4: move4
    }
}

function setWeaknesses(pokemonName, reset) {
    var mon = dex[pokemonName];
    var typeCharts = [];
    typeCharts[0] = typechart[mon.types[0]].damageTaken;
    if (mon.types.length > 1) {
        typeCharts[1] = typechart[mon.types[1]].damageTaken;
    }
    convertWeaknesses(typeCharts, reset);
}

function convertWeaknesses(typeCharts, reset) {
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
    var type1Chart = typeCharts[0];
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
    if (typeCharts.length > 1) {
        var type2Chart = typeCharts[1];
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

    if (reset) {
        for (var type in weaknesses) {
            if (weaknesses.hasOwnProperty(type)) {
                if (pokemonWeakness.hasOwnProperty(type)) {
                    weaknesses[type] = pokemonWeakness[type];
                }
            }
        }
    } else {
        for (var addType in weaknesses) {
            if (weaknesses.hasOwnProperty(addType)) {
                if (pokemonWeakness.hasOwnProperty(addType)) {
                    var base = weaknesses[addType];
                    var add = pokemonWeakness[addType];

                    if (base !== 0 && base !== 1 && add !== 1) {
                        if (add === 0) {
                            weaknesses[addType] = 0;
                        } else if (base + add === 0) {
                            weaknesses[addType] = 1;
                        } else if (base + add === 3) {
                            weaknesses[addType] = 2;
                        } else if (base + add === -1) {
                            weaknesses[addType] = -2;
                        } else {
                            weaknesses[addType] = base + add;
                        }
                    } else if (base === 1) {
                        weaknesses[addType] = add;
                    } else if (add === 1) {
                        weaknesses[addType] = base;
                    }
                }
            }
        }
    }
}

/*
 Bug: -2
 Dark: 2
 Fairy: 2
 Fighting: 0
 Fire: 4
 Flying: 4
 Ghost: 0
 Grass: -2
 Ground: -2
 Ice: -2
 Normal: 0
 Poison: -4
 Psychic: 1
 Rock: 4
 Steel: 4
 Water: 2
 */
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
var team = []


var neutral = 0;
var weak = 1;
var resist = 2;
var immune = 3;

function parseInput() {
    var team = document.getElementById("team-input").value;
    var mons = team.split("\n\n");
    console.log(mons[0]);
    for(var pokemon in mons) {
        parsePokemon(pokemon);
    }
    // setWeaknesses(name, true);
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

function setWeaknesses(pokemon, reset) {
    var mon = dex[pokemon];
    convertWeaknesses(typechart[mon.types[0]].damageTaken, reset);
    if (mon.types.length > 1) {
        convertWeaknesses(typechart[mon.types[1]].damageTaken, reset);
    }
}

function convertWeaknesses(typeChart, reset) {
    if (reset) {
        for (var type in typeChart) {
            if (typeChart.hasOwnProperty(type) && weaknesses.hasOwnProperty(type)) {
                var effectiveness = typeChart[type];
                if (effectiveness === neutral) {
                    weaknesses[type] = 1;
                } else if (effectiveness === weak) {
                    weaknesses[type] = 2;
                } else if (effectiveness === resist) {
                    weaknesses[type] = -2;
                } else if (effectiveness === immune) {
                    weaknesses[type] = 0;
                }
            }
        }
    } else {
        for (var type in typeChart) {
            if (typeChart.hasOwnProperty(type) && weaknesses.hasOwnProperty(type)) {
                var effectiveness = typeChart[type];
                if (weaknesses[type] === 1) {
                    if (effectiveness === weak) {
                        weaknesses[type] = 2;
                    } else if (effectiveness === resist) {
                        weaknesses[type] = -2;
                    }
                } else if (effectiveness === weak) {
                    if (weaknesses[type] + 2 === 0) {
                        weaknesses[type] = 1;
                    } else {
                        weaknesses[type] += 2;
                    }
                } else if (effectiveness === resist) {
                    if (weaknesses[type] - 2 === 0) {
                        weaknesses[type] = 1;
                    } else {
                        weaknesses[type] -= 2;
                    }
                } else if (effectiveness === immune) {
                    weaknesses[type] = 0;
                }
            }
        }
    }
}
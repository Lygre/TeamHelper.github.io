function pokemon(name, item, ability, evs, nature, moveset) {
    this.name = name;
    this.item = item;
    this.ability = ability;
    this.evs = evs;
    this.nature = nature;
    this.moveset = moveset;
}

function parseInput() {

}

function getJson() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "Your Rest URL Here", false);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
    var response = JSON.parse(xhttp.responseText);
}
let nouns = [
    "Levure", 
    "Étang", 
    "Cactus", 
    "Trombone", 
    "Image", 
    "Canari", 
    "Ensemble", 
    "Nuit", 
    "Canard"
];

let adjectives = [
    "inaccessible",
    "peinard",
    "typique",
    "nocturne",
    "intense",
    "simple",
    "nostalgique",
    "conforme",
    "politique"
];

function randomSentence() {
    let randIndexNouns = Math.floor(Math.random() * nouns.length);
    let randIndexAdj = Math.floor(Math.random() * adjectives.length);
    let randomNoun = nouns[randIndexNouns];
    let randomAdjective = adjectives[randIndexAdj];
    let result = randomNoun + " " + randomAdjective;
    return result;
}

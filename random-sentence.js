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
    let randIndex = Math.floor(Math.random() * nouns.length);
    let randomNoun = nouns[randIndex];
    let randomAdjective = adjectives[randIndex];
    let result = randomNoun + " " + randomAdjective;
    return result;
}

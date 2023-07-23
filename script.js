const poster = document.getElementById('poster'); 
const editContent = document.getElementById('edit-content');
const templateBlockTxt = document.getElementById('js-template--block-text');
const templateEditTxt = document.getElementById('js-template--edit-text');
const templateBlockImg = document.getElementById('js-template--block-image');
const templateEditImg = document.getElementById('js-template--edit-image');
const previewBtn = document.getElementById('preview');
const gridBtn = document.getElementById('grid-btn');
const addTxtBtn = document.getElementById('add-text'); 
const addImgBtn = document.getElementById('fileInput');
const generatePatternBtn = document.getElementById('generate-pattern-btn'); 
const grid = document.getElementById('grid');
const generativeBackground = document.getElementById('generative-background'); 
let blockCounter = 0;

const cssEditor = document.getElementById('editCss');
const progressionBar = document.getElementById('progression');

// console.log(getComputedStyle(poster));

// launch init fuction
init();

async function init(){
  return new Promise((resolve) => {
    document.body.addEventListener('keyup', handleKeyUp);
    document.body.addEventListener('change', handleChange);
    previewBtn.addEventListener('click', tooglePreview);
    gridBtn.addEventListener('click', toogleGrid);
    addTxtBtn.addEventListener('click', addNewBlock);
    addImgBtn.addEventListener('change', addNewImage);
    generatePatternBtn.addEventListener('click', addBackgroundPattern);
    document.body.addEventListener('click', handleClick);

    // add css to the css panel
    cssEditor.value = jsonToCss(cssJson);

    console.log('Welcome to TAC');
    resolve('init-done');
  })
}

// ---- Events ------
// Attach event listeners using event delegation for click
function handleClick(e) {
  let target = e.target;
  // Supprimer un block
  if (target.classList.contains('delete-btn')) {
    deleteBlock(e);
  }
};

function handleKeyUp(e){
  let target = e.target;
  // edition des blocs
  if (target.classList.contains('changeTxt') || target.classList.contains('topPos') || target.classList.contains('leftPos') || target.classList.contains('textColor') || target.classList.contains('textSize') || target.classList.contains('zIndex') || target.classList.contains('backgroundColor') || target.classList.contains('textWidth') || target.classList.contains('monochromeImage')) {
      editBlock('.edit', 'data-id', target);
  }
  // edition du background
  if(target.classList.contains('backgroundColorPage') || target.classList.contains('pattern-text') || 
    target.classList.contains('pattern-text-color') ||
    target.classList.contains('pattern-text-size')){
    editBackground(target);
  }
  // edition de l'éditeur css 
  if(target.id == "editCss"){
    const cssEditorVal = cssEditor.value;
    const cssJson = cssToJson(cssEditorVal);
    const cssJsonString = JSON.stringify(cssJson, null, 2);
    applyCssFromJson(cssJson);
    updateProgressBar(cssJsonString); 
  }
}

function handleChange(e){
  let target = e.target;
  if (target.classList.contains('fonts')) {
    editBlock('.edit', 'data-id', target);
  }
}

// ---- Functions ------
// Fonction affichage Preview mode 
function tooglePreview(e){
  const btn = e.target;
  console.log('preview mode');
  if (btn.classList.contains('active')) {
    btn.classList.remove('active');
    document.body.classList.remove('preview-mode');
  }
  else{
    btn.classList.add('active');
    document.body.classList.add('preview-mode');
  }
}

// Fonction affichage de la grille 
function toogleGrid(e){
  const btn = e.target;
  console.log('grid mode');
  if (btn.classList.contains('active')) {
    btn.classList.remove('active');
    grid.classList.remove('active');
  }
  else{
    btn.classList.add('active');
     grid.classList.add('active');
  }
}

// Fonction ajouter un nouveau block 
function addNewBlock(e){
  console.log('Add New Block');
  addBlock()
  .then(({ block, edit, id }) => {
    poster.appendChild(block);
    editContent.appendChild(edit);
  })
  .catch(error => {
    console.error('An error occurred:', error);
  });
}

// Fonction d'ajout d'un block texte
function addBlock() {
  return new Promise((resolve, reject) => {
    blockCounter++;
    let blockId = 'block-' + blockCounter;

    // Ajouter un block texte dans le poster
    let newTxtBlock = templateBlockTxt.cloneNode(true);
    newTxtBlock.id = blockId;
    let blockTitle = newTxtBlock.querySelector('.info');
    blockTitle.innerHTML = '#' + blockId;
    let blockContent = newTxtBlock.querySelector('.block-inner');
    let sentence = randomSentence();
    blockContent.innerHTML = sentence;

    // Ajouter les options de ce bloc texte dans le ui-panel
    let newEditTxt = templateEditTxt.cloneNode(true);
    newEditTxt.id = '';
    newEditTxt.setAttribute('data-id', blockId);
    let newEditTxtTitle = newEditTxt.querySelector('h2');
    newEditTxtTitle.innerHTML = '#' + blockId;;
    let textarea = newEditTxt.querySelector('.changeTxt');
    textarea.value = sentence;

    // Resolve the promise with both the block and edit elements
    resolve({ block: newTxtBlock, edit: newEditTxt, id: blockId });
  });
}

// Fonction de suppession d'un block texte
function deleteBlock(e) {
  return new Promise((resolve, reject) => {
    let blockParent = e.target.parentNode;
    let blockId = blockParent.getAttribute('data-id');
    let blockToDel = document.getElementById(blockId);
    blockToDel.remove();
    blockParent.remove();
    // Resolve the promise
    resolve();
  });
}

// Fonction ajouter un nouveau block Image
function addNewImage(e){
  console.log(e.target.files);
  if (e.target.files.length) {
    // start file reader
    const reader = new FileReader();
    reader.onload = (e)=> {
      if(e.target.result){
        // create new image
        blockCounter++;
        let blockId = 'block-' + blockCounter;

        // Ajouter un block image dans le poster
        let newImgBlock = templateBlockImg.cloneNode(true);
        newImgBlock.id = blockId;
        let blockTitle = newImgBlock.querySelector('.info');
        blockTitle.innerHTML = '#' + blockId;
        let blockContentImg = newImgBlock.querySelector('img');
        blockContentImg.src = e.target.result
        // append new image
        poster.appendChild(newImgBlock);

        // Ajouter les options de ce bloc image dans le ui-panel
        let newEditImg = templateEditImg.cloneNode(true);
        newEditImg.id = '';
        newEditImg.setAttribute('data-id', blockId);
        let newEditImgTitle = newEditImg.querySelector('h2');
        newEditImgTitle.innerHTML = '#' + blockId;
        editContent.appendChild(newEditImg);
      }
    };
    reader.readAsDataURL(e.target.files[0]);

  }
}

// Fonction d'édition du background 
function editBackground(target) {
  return new Promise((resolve, reject) => {
    let value = target.value;
    // Changer la couleur du fond
    if (target.classList.contains('backgroundColorPage')) {
      poster.style.backgroundColor = value;
      updateCss(cssJson, "#poster", "background", value);
      cssEditor.value = jsonToCss(cssJson);
      // possible d'ajouter un check erro
        // const changed = updateCss(cssJson, "#poster", "background", value);
        // if (changed) {
        //   console.log("Property changed successfully!");
        //   console.log(jsonToCss(cssJson));
        // } else {
        //   console.log("Property not found or JSON structure not valid.");
        // }
    }

    if(target.classList.contains('pattern-text') || 
    target.classList.contains('pattern-text-color') ||
    target.classList.contains('pattern-text-size')){
      let patternText = document.querySelector('.pattern-text').value;
      let patternTextColor = document.querySelector('.pattern-text-color').value;
      let patternTextColorClean = patternTextColor.replace('#', '');
      let patternTextSize = document.querySelector('.pattern-text-size').value;
      let backgroundPatternCSS = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='65px' width='65px'><text x='30' y='40' fill='"+patternTextColorClean+"' font-size='"+patternTextSize+"'>"+patternText+"</text></svg>";
      // console.log(backgroundPatternCSS,  poster.style);
      poster.style.backgroundImage = `url("`+backgroundPatternCSS+`")`;
    }
  });
}

// Fonction d'édition d'un block texte ?
function editBlock(el, attr, target) {
  return new Promise((resolve, reject) => {
    let value = target.value;
    let blockParent;
    let blockId;

    let blockToChange
    if(el != null){
      blockParent = target.closest(el);
    }
    if(attr != null && blockParent != null){
      blockId = blockParent.getAttribute(attr);
      blockToChange = document.getElementById(blockId);
    }
    // Changer le contenu texte
    if (target.classList.contains('changeTxt')) {
      blockToChange = document.getElementById(blockId).querySelector('.block-inner');
      blockToChange.innerHTML = value;
    }
    // Changer la position top et let
    if (target.classList.contains('topPos')) {
      blockToChange.style.top = value + "cm";
    }
    if (target.classList.contains('leftPos')) {
      blockToChange.style.left = value + "cm";
    }

    // Changer la font
    if (target.classList.contains('fonts')) {
      blockToChange.style.fontFamily = value;
    }

    // Changer la couleur
    if (target.classList.contains('textColor')) {
      blockToChange.style.color = value;
    }
    // Changer la taille du texte
    if (target.classList.contains('textSize')) {
      blockToChange.style.fontSize = value + "pt";
    }
    // Changer le z-index du texte
    if (target.classList.contains('zIndex')) {
      blockToChange.style.zIndex = value;
    }
    // Changer la couleur de fond du texte
    if (target.classList.contains('backgroundColor')) {
      blockToChange.style.backgroundColor = value;
    }
    // Changer la largeur du texte
    if (target.classList.contains('textWidth')) {
      blockToChange.style.width = value + "cm";
    }

    // ---- IMAGE -----
    // Image monochrome
    if (target.classList.contains('monochromeImage')) {
      blockToChange.style.background = value;
      let blockImgToChange = blockToChange.querySelector('img');
      blockImgToChange.style.filter = "grayscale(1) contraste(1.5)";
      blockImgToChange.style.mixBlendMode = "screen";
    }

    // Resolve the promise
    resolve();
  });
}

// Fonction qui récupère les infos pour le background pattern et qui génère un pattern
function addBackgroundPattern(){
  let shapes = [];
  let colors = [];
  const circlesCheck = document.getElementById('circles');
  const rectanglesCheck = document.getElementById('rectangles');
  const color1 = document.getElementById('pattern-color-1').value;
  const color2 = document.getElementById('pattern-color-2').value;
  const patternNumber = document.getElementById('pattern-number').value;
  const patternMinWidth = document.getElementById('pattern-min-width').value;
  const patternMaxWidth = document.getElementById('pattern-max-width').value;
  const patternMinHeight = document.getElementById('pattern-min-height').value;
  const patternMaxHeight = document.getElementById('pattern-max-height').value;

  if(circlesCheck.checked){
    shapes.push('circle');
  }
  if(rectanglesCheck.checked){
    shapes.push('rectangle');
  }
  colors.push(color1);
  colors.push(color2);

  generatePattern(colors, shapes, patternNumber, patternMinWidth, patternMaxWidth, patternMinHeight, patternMaxHeight);
}

// Fonction de génération d'un motif en fond
function generatePattern(colorsArr, shapesArr, number, minW, maxW, minH, maxH) {
  // console.log(colorsArr, shapesArr, number, minW, maxW, minH, maxH);
  // const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  // const colors = ['magenta', '#000'];
  // const shapes = ['circle', 'rectangle'];
  const colors = colorsArr;
  const shapes = shapesArr;

  // vider le background
  generativeBackground.innerHTML = "";

  for (let i = 0; i < number; i++) {
    const shape = document.createElement('div');
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    const width = Math.floor(Math.random() * parseFloat(maxW)) + parseFloat(minW);
    const height = Math.floor(Math.random() * parseFloat(maxH)) + parseFloat(minH);
    // console.log(width, height);

    shape.classList.add('shape');
    shape.style.backgroundColor = randomColor;

    if (randomShape === 'circle') {
      shape.classList.add('circle');
    } else {
      shape.classList.add('rectangle');
    }

    shape.style.width = width + 'cm';
    shape.style.height = height + 'cm';
    // console.log(shape);
    generativeBackground.appendChild(shape);
  }
}


// Fonction update CSS du gui-panel vers l'editeur css
function updateCss(jsonObj, elementId, propertyName, newValue) {
  // Check if the JSON object contains an "elements" property and it is an array
  if (jsonObj.hasOwnProperty('elements') && Array.isArray(jsonObj.elements)) {
    const elements = jsonObj.elements;

    // Loop through all elements
    for (const elementObj of elements) {
      // Check if the element object contains an "id" property and a "properties" property
      if (elementObj.hasOwnProperty('id') && elementObj.hasOwnProperty('properties')) {
        const id = elementObj.id;
        const properties = elementObj.properties;

        // Check if the element ID matches the target ID
        if (id === elementId) {
          // Change the property if it exists in the properties object
          if (properties.hasOwnProperty(propertyName)) {
            properties[propertyName] = newValue;
            return true; // Property changed successfully
          }
        }
      }
    }
  }

  return false; // Property not found or JSON structure not valid
}

// convert json object to css
function jsonToCss(jsonObj) {
  let cssText = '';

  // Check if the JSON object contains an "elements" property and it is an array
  if (jsonObj.hasOwnProperty('elements') && Array.isArray(jsonObj.elements)) {
    const elements = jsonObj.elements;

    // Loop through all elements
    for (const elementObj of elements) {
      // Check if the element object contains an "id" property and a "properties" property
      if (elementObj.hasOwnProperty('id') && elementObj.hasOwnProperty('properties')) {
        const elementId = elementObj.id;
        const properties = elementObj.properties;

        // Loop through all properties and add them to the CSS string
        cssText += `${elementId} {\n`;
        for (const prop in properties) {
          if (properties.hasOwnProperty(prop)) {
            const value = properties[prop];
            cssText += `${prop}: ${value};\n`;
          }
        }
        cssText += "}\n\n";
      }
    }
  }

  return cssText;
}


// convert css text to json
function cssToJson(cssString) {
  const cssJson = { elements: [] };
  const cssRules = cssString.split('}');

  for (const rule of cssRules) {
    const trimmedRule = rule.trim();
    if (trimmedRule.length > 0) {
      const parts = trimmedRule.split('{');
      if (parts.length === 2) {
        const selector = parts[0].trim();
        const properties = parts[1].trim().split(';').filter(Boolean);

        const elementObj = { id: selector, properties: {} };
        for (const prop of properties) {
          const [property, value] = prop.split(':').map(item => item.trim());
          elementObj.properties[property] = value;
        }

        cssJson.elements.push(elementObj);
      }
    }
  }

  return cssJson;
}

// apply css to an element from json 
function applyCssToElement(element, cssProperties) {
  for (const prop in cssProperties) {
    if (cssProperties.hasOwnProperty(prop)) {
      element.style[prop] = cssProperties[prop];
    }
  }
}

// Function to apply CSS to the elements based on the JSON representation
function applyCssFromJson(cssJson) {
  if (cssJson.hasOwnProperty('elements') && Array.isArray(cssJson.elements)) {
    const elements = cssJson.elements;
    for (const elementObj of elements) {
      const selector = elementObj.id;
      const properties = elementObj.properties;
      // Get the element based on the selector (ID or class)
      const elementsToStyle = document.querySelectorAll(selector);

      // Apply the styles to all matching elements
      for (const element of elementsToStyle) {
        applyCssToElement(element, properties);
        updateUiPanelValue(selector, properties);
      }
    }
  }
}

// Function to update values in fields in panel 
function updateUiPanelValue(id, properties){
  // console.log(id, properties);
  if(id == "#poster"){
    let backgroundVal = properties["background"];
    let backgroundColorField = document.querySelector('.backgroundColorPage');
    backgroundColorField.value = backgroundVal;
  }
}

// function to update progression bar
function updateProgressBar(jsonString) {
  const lines = jsonString.split('\n');
  const nbOfLines = lines.length;
  progressionBar.style.width = (nbOfLines * 4) + "px";
  console.log(nbOfLines + "px");
}


const poster = document.getElementById('poster'); 
const editContent = document.getElementById('edit-content');
const templateBlockTxt = document.getElementById('js-template--block-text');
const templateEditTxt = document.getElementById('js-template--edit-text');
const templateBlockImg = document.getElementById('js-template--block-image');
const templateEditImg = document.getElementById('js-template--edit-image');
const previewBtn = document.getElementById('preview');
const addTxtBtn = document.getElementById('add-text'); 
const addImgBtn = document.getElementById('fileInput'); 
let blockCounter = 0;

// launch init fuction
init();

async function init(){
  return new Promise((resolve) => {
    document.body.addEventListener('keyup', handleKeyUp);
    document.body.addEventListener('change', handleChange);
    previewBtn.addEventListener('click', tooglePreview);
    addTxtBtn.addEventListener('click', addNewBlock);
    addImgBtn.addEventListener('change', addNewImage);
    document.body.addEventListener('click', handleClick);

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
  // En cours d'écriture !!!!
  if(target.classList.contains('backgroundColorPage') || target.classList.contains('pattern-text') || 
    target.classList.contains('pattern-text-color') ||
    target.classList.contains('pattern-text-size')){
    editBackground(target);
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
    }

    // En cours d'édition
    if(target.classList.contains('pattern-text') || 
    target.classList.contains('pattern-text-color') ||
    target.classList.contains('pattern-text-size')){
      let patternText = document.querySelector('.pattern-text').value;
      let patternTextColor = document.querySelector('.pattern-text-color').value;
      let patternTextColorClean = patternTextColor.replace('#', '');
      let patternTextSize = document.querySelector('.pattern-text-size').value;
      let backgroundPatternCSS = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='65px' width='65px'><text x='30' y='40' fill='"+patternTextColorClean+"' font-size='"+patternTextSize+"'>"+patternText+"</text></svg>";
      // console.log(backgroundPatternCSS,  poster.style);
      poster.style.backgroundImage = `url("`+backgroundPatternCSS+`")`;;
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

generatePattern();

// Fonction de génération d'un motif en fond
function generatePattern() {
  // const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  const colors = ['magenta', '#000'];
  const shapes = ['circle', 'rectangle'];

  for (let i = 0; i < 200; i++) {
    const shape = document.createElement('div');
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    const width = Math.floor(Math.random() * 50) + 20;
    const height = Math.floor(Math.random() * 220) + 50;

    shape.classList.add('shape');
    shape.style.backgroundColor = randomColor;

    if (randomShape === 'circle') {
      shape.classList.add('circle');
    } else {
      shape.classList.add('rectangle');
    }

    shape.style.width = width + 'px';
    shape.style.height = height + 'px';

    poster.appendChild(shape);
  }
}

// ----- OLD CODE ------

// color picker init
$('#imageColor').simpleColor({
  boxWidth: "30px",
  boxHeight: "30px",
  cellWidth: 12,
  cellHeight: 12,
  columns:13
});

$('#imageColorAfter').simpleColor({
  boxWidth: "30px",
  boxHeight: "30px",
  cellWidth: 12,
  cellHeight: 12,
  columns:13
});

$('#textColor').simpleColor({
  boxWidth: "30px",
  boxHeight: "30px",
  cellWidth: 12,
  cellHeight: 12,
  columns:13
});

$('#shapeColor').simpleColor({
  boxWidth: "30px",
  boxHeight: "30px",
  cellWidth: 12,
  cellHeight: 12,
  columns:13
});

$("#iconText").keyup(function(){
  var textToAdd = $("#iconText").val();
  $("#textResult").html(textToAdd);
});


$('#fonts').on('change', function(){
  var fontChoosen = $(this).val();
  $("#textResult").css('font-family', fontChoosen);
}); 

$('#textSize').on('change', function(){
  var size = $(this).val() * 5;
  $("#textResult").css('font-size', size+"px");
});

$('#textOpacity').on('change', function(){
  var opacity = $(this).val();
  $("#textResult").css('opacity', opacity);
});

$('#shapeColor').on('change', function(){
  var shapeColor = $('#shapeColor').val();
  $("#textResult").css('background', shapeColor);
}); 

$('#addShape').on('change', function(){
  var shapeChoosen = $(this).val();
  var shapeColor = $('#shapeColor').val();
  if(shapeChoosen == "square"){
    $("#textResult").css({
      'background' : shapeColor,
      'padding' : "calc(20px * 5)",
      'border-radius' : "0px"  
    });
  }
  else if(shapeChoosen == "rounded"){
    $("#textResult").css({
      'background' : shapeColor,
      'padding' : "calc(20px * 5)", 
      'border-radius' : "20px" 
    });
  }
  else if(shapeChoosen == "circle"){
    $("#textResult").css({
      'background' : shapeColor,
      'padding' : "calc(30px * 5) calc(30px * 5)", 
      'border-radius' : "50%" 
    });
  }
  else{
    $("#textResult").css({
      'background' : 'transparent',
      'padding' : "0px", 
      'border-radius' : "0" 
    });
  }
  
}); 


$('#clearBtn').on('click', function(){
  location.reload(true);
});



// upload image and crop
// vars
let result = document.getElementById('imageResult'),
save = document.querySelector('.crop'),
img,
cropper = '';

// on change show image with crop options
// $('#fileInput').on('change', (e) => {
//   if (e.target.files.length) {
//     // start file reader
//     const reader = new FileReader();
//     reader.onload = (e)=> {
//       if(e.target.result){
//         // create new image
//         img = document.createElement('img');
//         img.id = 'image';
//         img.src = e.target.result
//         // clean result before
//         result.innerHTML = '';
//         // append new image
//         result.appendChild(img);
//         // show save btn and options
//         save.classList.remove('hide');
//         // options.classList.remove('hide');
//         // init cropper
//         cropper = new Cropper(img, {
//           aspectRatio: 1 / 1
//         });
//       }
//     };
//     reader.readAsDataURL(e.target.files[0]);
//   }
// });

$('#imageColor').on('change', function(){
  var colorBefore = $("#imageColor").val();
  myFunction_set("--color-before", colorBefore);
});

$('#imageColorAfter').on('change', function(){
  var colorAfter = $("#imageColorAfter").val();
  myFunction_set("--color-after", colorAfter);
});

$('#textColor').on('change', function(){
  var textColor = $("#textColor").val();
  $("#textResult").css("color", textColor);
});

function myFunction_set(varName, value) {
  var r = document.querySelector(':root');
  // Set the value of variable to another value 
  r.style.setProperty(varName, value);
}






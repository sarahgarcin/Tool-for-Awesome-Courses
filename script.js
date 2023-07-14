const poster = document.getElementById('poster'); 
const editContent = document.getElementById('edit-content');
const templateBlockTxt = document.getElementById('js-template--block-text');
const templateEditTxt = document.getElementById('js-template--edit-text');
const previewBtn = document.getElementById('preview');
const addTxtBtn = document.getElementById('add-text'); 
let blockCounter = 0;

// launch init fuction
init();

async function init(){
  return new Promise((resolve) => {
    document.body.addEventListener('keyup', handleKeyUp);
    previewBtn.addEventListener('click', tooglePreview);
    addTxtBtn.addEventListener('click', addNewBlock);
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
  if (target.classList.contains('changeTxt') || target.classList.contains('topPos') || target.classList.contains('leftPos') || target.classList.contains('textColor') || target.classList.contains('textSize')) {
      editBlock(event, '.edit', 'data-id', target);
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
  .then(({ block, edit }) => {
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
    let textarea = newEditTxt.querySelector('textarea');
    textarea.value = sentence;

    // Resolve the promise with both the block and edit elements
    resolve({ block: newTxtBlock, edit: newEditTxt });
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

// Fonction d'édition d'un block texte ?
function editBlock(event, el, attr, target) {
  return new Promise((resolve, reject) => {
    let value = target.value;
    let blockParent = target.closest(el);
    let blockId = blockParent.getAttribute(attr);
    let blockToChange = document.getElementById(blockId);
    
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
    // Changer la couleur
    if (target.classList.contains('textColor')) {
      blockToChange.style.color = value;
    }
    // Changer la taille du texte
    if (target.classList.contains('textSize')) {
      blockToChange.style.fontSize = value + "pt";
    }

    // Resolve the promise
    resolve();
  });
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
$('#fileInput').on('change', (e) => {
  if (e.target.files.length) {
    // start file reader
    const reader = new FileReader();
    reader.onload = (e)=> {
      if(e.target.result){
        // create new image
        img = document.createElement('img');
        img.id = 'image';
        img.src = e.target.result
        // clean result before
        result.innerHTML = '';
        // append new image
        result.appendChild(img);
        // show save btn and options
        save.classList.remove('hide');
        // options.classList.remove('hide');
        // init cropper
        cropper = new Cropper(img, {
          aspectRatio: 1 / 1
        });
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  }
});

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






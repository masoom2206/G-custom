/**
 * @file kaboodleUndoRedo.js
 **/
var undoBtn = redoBtn = undo_caption = redo_caption = '';
var _configUndoRedo = {
  canvasState             : [],
  currentStateIndex       : -1,
  undoStatus              : false,
  redoStatus              : false,
  undoFinishedStatus      : 1,
  redoFinishedStatus      : 1,
  updatedProperty         : '',
  updatedPropertyValue    : '',
};

setTimeout(function() {
  undoBtn = jQuery('#undo');
  undo_caption = jQuery('#undo_caption');
  redoBtn = jQuery('#redo');
  redo_caption = jQuery('#redo_caption'); 
}, 3500);
/**
 * KeyDown action for CTRL+z or CTRL+Y
 */
document.onkeydown = function(e) {
  var key;
  if(window.e){
    key = window.e.keyCode;
  }
  else {
    key = e.keyCode;
  }
  switch(key){
    case 90: // redo/undo Ctrl+Z and Ctrl+Shift+Z
      if((e.ctrlKey || e.metaKey) && !e.shiftKey){  //Undo  Ctrl+Z
        undo();
      }
      else if((e.ctrlKey || e.metaKey) && e.shiftKey){ // Redo  Ctrl+Shift+Z
        redo();
      }
    break;
    case 122: // redo/undo Ctrl+z and Ctrl+Shift+z
      if((e.ctrlKey || e.metaKey) && !e.shiftKey){  //Undo  Ctrl+z
        undo();
      }
      else if((e.ctrlKey || e.metaKey) && e.shiftKey){ // Redo  Ctrl+Shift+z
        redo();
      }
    break;
    case 89: // redo/undo Ctrl+Y and Ctrl+Shift+Y
      if((e.ctrlKey || e.metaKey) && !e.shiftKey){  //Undo  Ctrl+Y
        redo();
      }
      else if((e.ctrlKey || e.metaKey) && e.shiftKey){ // Redo  Ctrl+Shift+Y
        undo();
      }
    break;
    case 121: // redo/undo Ctrl+y and Ctrl+Shift+y
      if((e.ctrlKey || e.metaKey) && !e.shiftKey){  //Undo  Ctrl+y
        redo();
      }
      else if((e.ctrlKey || e.metaKey) && e.shiftKey){ // Redo  Ctrl+Shift+y
        undo();
      }
    break;
  }
};
/**
 * Call function updateCanvasState()
 * on object modified.
 */
/*canvas.on('object:modified', function(){
  updateCanvasState();
  console.log('Updated');
});*/
/**
 * Callback function updateCanvasState();
 * Object added/modified callback function for undo/redo canvasState update
 */
function updateCanvasState(){
  //console.log("updateCanvasState");
  if((_configUndoRedo.undoStatus == false && _configUndoRedo.redoStatus == false)){
    var jsonData = canvas.toJSON();
    var canvasAsJson = JSON.stringify(jsonData);
    if(_configUndoRedo.currentStateIndex < _configUndoRedo.canvasState.length-1){
      var indexToBeInserted = _configUndoRedo.currentStateIndex+1;
      _configUndoRedo.canvasState[indexToBeInserted] = canvasAsJson;
      var numberOfElementsToRetain = indexToBeInserted+1;
      _configUndoRedo.canvasState = _configUndoRedo.canvasState.splice(0,numberOfElementsToRetain);
    }
    else {
      _configUndoRedo.canvasState.push(canvasAsJson);
      _configUndoRedo.canvasState = _configUndoRedo.canvasState.filter(function(item, pos){
        return _configUndoRedo.canvasState.indexOf(item)== pos; 
      });
    }
    _configUndoRedo.currentStateIndex = _configUndoRedo.canvasState.length-1;
    /*if((_configUndoRedo.currentStateIndex == _configUndoRedo.canvasState.length-1) && _configUndoRedo.currentStateIndex != -1){
      undoBtn.prop('disabled', false);
      undo_caption.parent('.g-menu-item').removeClass('g-disabled');
      redoBtn.prop('disabled', true);
      redo_caption.parent('.g-menu-item').addClass('g-disabled');
    }*/
  }
}
/**
 * Callback function undo();
 * for ctrl+z action
 */
function undo(){
  if(_configUndoRedo.undoFinishedStatus){
    //console.log("undo 1");
    if(_configUndoRedo.currentStateIndex == -1){
      //console.log("undo 2");
      _configUndoRedo.undoStatus = false;
    }
    else{
      //console.log("undo 3");
      if (_configUndoRedo.canvasState.length >= 1) {
        //console.log("undo 4");
        _configUndoRedo.undoFinishedStatus = 0;
        if(_configUndoRedo.currentStateIndex != 0){
          //console.log("undo 5");
          _configUndoRedo.undoStatus = true;
          canvas.loadFromJSON(_configUndoRedo.canvasState[_configUndoRedo.currentStateIndex-1],function(){
            //console.log("undo 6");
            var jsonData = JSON.parse(_configUndoRedo.canvasState[_configUndoRedo.currentStateIndex-1]);
            var prevjsonData = JSON.parse(_configUndoRedo.canvasState[_configUndoRedo.currentStateIndex]);
            var currentState = jsonData.objects[jsonData.objects.length - 1];
            var previousState = prevjsonData.objects[prevjsonData.objects.length - 1];
            //console.log(previousState.id+ ' =undo= ' +currentState.id);
            if(previousState == 'undefined' || currentState == 'undefined'){return;}
            /*if(previousState.id !== currentState.id){
              jQuery('#layers #'+previousState.id).remove();
            }*/
            canvas.renderAll();
            _configUndoRedo.undoStatus = false;
            _configUndoRedo.currentStateIndex -= 1;
            undoBtn.prop('disabled', false);
            undo_caption.parent('.g-menu-item').removeClass('g-disabled');
            redoBtn.prop('disabled', false);
            redo_caption.parent('.g-menu-item').removeClass('g-disabled');
            _configUndoRedo.undoFinishedStatus = 1;
          });
          //activePageObj = canvas.getItemById(activePage);
        }
        else if(_configUndoRedo.currentStateIndex == 0){
          //console.log("undo 7");
          //remove last layer of undo object
          /*if(canvas._objects.length == 1){
            //console.log("undo 8");
            jQuery('#layers .layer-row').remove();
          }*/
          _configUndoRedo.undoFinishedStatus = 1;
          undoBtn.prop('disabled', true);
          undo_caption.parent('.g-menu-item').addClass('g-disabled');
          redoBtn.prop('disabled', false);
          redo_caption.parent('.g-menu-item').removeClass('g-disabled');
          _configUndoRedo.currentStateIndex -= 1;
        }
      }
    }
  }
}
/**
 * Callback function redo()
 * for ctrl+y action
 */  
function redo(){
  if(_configUndoRedo.redoFinishedStatus){
    if((_configUndoRedo.currentStateIndex == _configUndoRedo.canvasState.length-1) && _configUndoRedo.currentStateIndex != -1){
      //_configUndoRedo.redoButton.disabled= "disabled";
      redoBtn.prop('disabled', true);
      redo_caption.parent('.g-menu-item').addClass('g-disabled');
    }
    else {
      if (_configUndoRedo.canvasState.length > _configUndoRedo.currentStateIndex && _configUndoRedo.canvasState.length != 0){
        _configUndoRedo.redoFinishedStatus = 0;
        _configUndoRedo.redoStatus = true;
        canvas.loadFromJSON(_configUndoRedo.canvasState[_configUndoRedo.currentStateIndex+1],function(){
          canvas.renderAll();
          _configUndoRedo.redoStatus = false;
          _configUndoRedo.currentStateIndex += 1;
          if(_configUndoRedo.currentStateIndex != -1){
            undoBtn.prop('disabled', false);
            undo_caption.parent('.g-menu-item').removeClass('g-disabled');
          }
          _configUndoRedo.redoFinishedStatus = 1;
          if((_configUndoRedo.currentStateIndex == _configUndoRedo.canvasState.length-1) && _configUndoRedo.currentStateIndex != -1){
            redoBtn.prop('disabled', true);
            redo_caption.parent('.g-menu-item').addClass('g-disabled');
          }
          if(_configUndoRedo.currentStateIndex == (_configUndoRedo.canvasState.length - 1)){return;}
          var jsonData = JSON.parse(_configUndoRedo.canvasState[_configUndoRedo.currentStateIndex]);
          var prevjsonData = JSON.parse(_configUndoRedo.canvasState[_configUndoRedo.currentStateIndex]);
          var currentState = jsonData.objects[jsonData.objects.length-1];
          var previousState = prevjsonData.objects[prevjsonData.objects.length-1];
          /*if(previousState.id == currentState.id){
            if(jQuery('#layers #'+currentState.id).length == 0){
              redoing = true;
              add_layer(currentState.id, currentState.name, currentState.type, activePage, currentState.layerGroup, currentState.layerIndexing);
              redoing = false;
            }
          }*/
        });
      }
    }
  }
}

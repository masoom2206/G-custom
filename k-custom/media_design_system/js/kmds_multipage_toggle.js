/**
 * Multipage Toggle
 */

function deactivatePage(){
	PageSelection = false;

  var labels = canvas.getItemsByType('text', true);
	labels.forEach(function(l) {
		l.set('activeflag', false);
		l.set('selectable', false);
		l.set('hasControls', false);
		l.set('hasBorders', false);
		l.set('fill', '#000');
	});
  var objs = canvas.getItemsByType('page', false);
  objs.forEach(function(o) {
    if(o.type !== 'text' && o.type !== 'line'){
      o.set({
        hasBorders: true,
        hasControls: true,
        borderColor: '#2880E6'
      });
    }
    canvas.renderAll();
  });
}
 
function activatePage(pid, label){
	PageSelection = true;
	var labels = canvas.getItemsByType('text', true);
	labels.forEach(function(l) {
		if(l.id == label){
			l.set('selectable', false);
			l.set('hasControls', false);
			l.set('hasBorders', false);
			l.set('activeflag', true);
			l.set('fill', '#2880E6');
		} else {
			l.set('selectable', false);
			l.set('hasControls', false);
			l.set('hasBorders', false);
			l.set('activeflag', false);
			l.set('fill', '#000');
		}
	});
  
  var allObj = canvas.getItemsByPage(pid);
  var gpage = new fabric.ActiveSelection(allObj, {
    canvas: canvas,
    page: pid,
  });
  canvas.setActiveObject(gpage);
  canvas.renderAll();

  gpage.set({
    selectable: true,
    hasRotatingPoint: false,
    showactiveSelectionBorder: false,
  });
  
  var objs = canvas.getActiveObject()._objects;
  objs.forEach(function(o) {
    o.set({
      hasBorders: false,
    });
    canvas.renderAll();
  });
}

function setActivePagePosition(ActivePage){
	//set active page poosition
	var zoom = 2;
	canvas.setZoom(1);
	var vpw = canvas.width / zoom;
	var vph = canvas.height / zoom;
	var object = canvas.getItemById(ActivePage);
	var xi = (object.left - vpw / 2);  // x is the location where the top left of the viewport should be
	var yi = (object.top - vph / 2);  // y idem
	canvas.absolutePan({x:xi-62, y:yi-80});
	addrulernew(xi, yi);
}

function groupPages(){
	var num = n = fp_left = oddfp_top = evenfp_top = '';
  var firstpage = $('.page-row:first-child').attr('id'); //true or false
  var ActivePage = $('.page-row.g-active').attr('id');
	var apo = canvas.getItemById(ActivePage);
	var pages = canvas.getItemsByType('page', true);
	var counter = 0;
	pages.map((p, pk) => { 
		counter++;
		var allObj = canvas.getItemsByPage(p.id);
		var name = $('#'+p.id+' .page-title').text();
    var gpage = new fabric.ActiveSelection(allObj, {
      canvas: canvas,
			gleft: p.left,
			gtop: p.top,
			page: p.id,
			name: name,
			counter: counter,
    });
    canvas.setActiveObject(gpage);
		
		if(gpage.page == firstpage){
			fp_left = gpage.gleft;
			oddfp_top = gpage.gtop;
			evenfp_top = gpage.gtop;
		}
		
		var n = gpage.counter;
		if(n % 2 == 0) {
			var num = 'even';
		} else {
			var num = 'odd';
		}
		
		if(gpage.page == firstpage) {
			// do nothing for active page position
		} else if(gpage.page !== firstpage){
			if(num == 'odd') { // 1, 3 , 5 , 7 , 9
				//set left position for all odds except 1
				var g_left = fp_left - (p.width/2);
				gpage.set('left', parseInt(g_left));	
				p.set('pagegroupLeft', parseInt(g_left));
				//set top position for all odds except 1
				var g_top = oddfp_top + p.height - (p.width/3);
				gpage.set('top', parseInt(g_top));
				oddfp_top = g_top + p.width/2;
				p.set('pagegroupTop', parseInt(g_top));
			} else if( num == 'even'){ // 2, 4, 6 , 8 , 10
				var evenLeft =  parseInt(fp_left + p.width) - (p.width/3);
				gpage.set('left', parseInt(evenLeft));
				p.set('pagegroupLeft', evenLeft);
				if(n !== 2){ // do not set top for second page
					var eveng_top = evenfp_top + p.height - (p.width/3);
					gpage.set('top', parseInt(eveng_top));
					evenfp_top = eveng_top + p.width/2;
					p.set('pagegroupTop', eveng_top);
				}
			}
		} 
		
		//creating page labels
    var pagename = gpage.name;
    var arrl = [];
    var labelid = '';
    arrl = pagename.split(' ');
    for (var i = 0; i<=arrl.length; i++) {
      var labelid = arrl.join("").toLowerCase();
    }
    var pt = canvas.getItemById(labelid);
    if(pt) { 
      pt.set('left', gpage.left);
      pt.set('top', gpage.top - 25);
      pt.set('visibility', true);
      pt.set('opacity', 1);
      canvas.renderAll();
    } else {
      var pageLabel = new fabric.Text(pagename, {
        fontSize: 12,
        fontFamily: 'Lato',
        left: gpage.left,
        top: gpage.top - 25,
        page: gpage.page,
        id: labelid,
        name: 'pagelabel',
        activeflag: false,
        hoverCursor: "default",
        originX: 'left',
        originY: 'top',
        fill: '#000',
        selectable: false,
        hasControls: false,
        hasBorders: false,
      });
      canvas.add(pageLabel);
      canvas.renderAll();
    }
    canvas.discardActiveObject();
		canvas.renderAll();
	});
	//fit canvas to active page position
	setActivePagePosition(ActivePage);
} 
 
function TogglePages(action){
	var ActivePage = $('.page-row.g-active').attr('id');
	var apo = canvas.getItemById(ActivePage);
	var allpObj = canvas.getItemsByType('page' ,true);

	if(action == 'active'){
		multipageToggle = true;
		//pages set visibility
		var pages = canvas.getItemsByType('page', true);
		pages.forEach(function(p) {
      //set visibility true for all pages 
      p.set({
        visibility: true,
        opacity: 1
      });
    });
		//make visible all objects of pages 
		var objs = canvas.getItemsByType('page', false);
		objs.forEach(function(o) {
      if(o.type !== 'text' && o.type !== 'line'){
        o.set('selectable', true);
        o.set('hasControls', true);
        o.set('hasBorders', true);
        o.set('visibility', true);
        o.set('opacity', 1);
      }
		});
		canvas.renderAll();
		
		//make pages to activeSelection
		groupPages();
		
	} else if(action == 'inactive'){
		
		var allpages = canvas.getItemsByType('page', true);
		allpages.map((p, pk) => { 
			var allObj = canvas.getItemsByPage(p.id);
      p.set('left', p.actualLeft);
      p.set('top', p.actualTop);
      //console.log(p.left);
      //console.log(p.top);
			allObj.forEach(function(ob){
				if(ob.type !== 'page'){ //set left top for objects
          ob.set({
						left: ob.actualLeft,
						top: ob.actualTop,
					});
        /* alert(p.pagegroupTop +'-'+ p.actualTop);
        alert(p.pagegroupLeft +'-'+ p.actualLeft);
          var topdiff = p.pagegroupTop - p.actualTop;
					var leftdiff = p.pagegroupLeft - p.actualLeft;
          alert(ob.left+ ' = ' +leftdiff);
          alert(ob.top+' = '+topdiff);
					ob.set({
						left: ob.left - p.actualLeft,
						top: ob.top - p.actualTop,
					});
          console.log('left - '+ob.left);
          console.log('top - '+ob.top); */
				}
				canvas.renderAll();
			});
			var name = $('#'+p.id+' .page-title').text();
			var gpage = new fabric.ActiveSelection(allObj, {
				canvas: canvas,
				page: p.id,
				left: p.actualLeft,
				top: p.actualTop,
			});
			canvas.setActiveObject(gpage);
			canvas.discardActiveObject().renderAll(); 
		});
		
		//fit canvas to active page position
		setActivePagePosition(ActivePage);
		
		//reset page labels flags and objects properties
    deactivatePage();
		
		multipageToggle = false;
    var labels = canvas.getItemsByType('text', true);
    labels.forEach(function(l) {
      l.set('selectable', false);
      l.set('hasControls', false);
      l.set('hasBorders', false);
      l.set('visibility', false);
      l.set('opacity', 0);
    });

		var pages = canvas.getItemsByType('page', true);
		pages.forEach(function(p) {
      if(p.id == ActivePage){
        //set visibility true for active page 
        p.set({
          visibility: true,
          opacity: 1,
        });
      } else {
        //set visibility false for inactive page 
        p.set({
          visibility: false,
          opacity: 0,
        });
      }
    });
    
		var objs = canvas.getItemsByType('page', false);
		objs.forEach(function(o) {
      if(o.type !== 'text' && o.type !== 'line') {
				if(o.page == ActivePage){ //make visible active page objects
					o.set('selectable', true);
					o.set('hasControls', true);
					o.set('hasBorders', true);
					o.set('visibility', true);
					o.set('opacity', 1);
				} else { //make invisible all inactive page objects 
					o.set('selectable', false);
					o.set('hasControls', false);
					o.set('hasBorders', false);
					o.set('visibility', false);
					o.set('opacity', 0);
				}
			}
		});
		canvas.renderAll();
	}
}
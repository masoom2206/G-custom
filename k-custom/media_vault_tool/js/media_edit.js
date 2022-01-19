jQuery( document ).ready(function() {
  jQuery('.favolink').click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    var mid = e.target.id;          
    jQuery.ajax({
      url: "/update-media-favorite",
      data:{"mid":mid},
      type: "POST",
      success:function(result){
        location.reload();        
      }
    });
  });
	
	var u = window.location.href;
	var t = u.split('/');
	var f = u.split('#');
	if(t[3] && t[4] && t[3] == 'media' && t[4] == 'kit'){
		var ch = jQuery('#node-media-kit-edit-form #edit-cancel').attr('href');
		ch = ch.split('#')[0];
		if(typeof f[1] !== 'undefined'){
			jQuery('#node-media-kit-edit-form #edit-cancel').attr('href', ch+'#'+f[1]);			
		}
		history.pushState('', '', [f[0]])
	}
});
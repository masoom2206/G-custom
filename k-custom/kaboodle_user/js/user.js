jQuery(document).ready(function() {
  // jQuery UI Dialog    
  jQuery('div#status-dialog').dialog({
    autoOpen: false,
    width: 500,
    modal: true,
    resizable: false,
  });
  
  jQuery('form#user-form').submit(function(e){
    if(jQuery('input#edit-field-teams-option-value').prop('checked')){
      // personal contact form
      if(jQuery('input#edit-contact--2').prop('checked') == false){
        jQuery('#status-d-content').html('If you wish to participate in teams please also select the \'Personal contact form\' checkbox.');
        jQuery( "#status-dialog" ).dialog( "option", "buttons", {  
          "Cancel": function() { jQuery(this).dialog("close"); }
        });
        jQuery('#status-dialog').dialog('open');
        return false;
      }
      
      // city & state
      if(jQuery('select#edit-field-address-0-address-country-code--2').val() == ''){
        jQuery('#status-d-content').html('If you wish to participate in teams, please enter values in both the "City" and "State" fields.');
        jQuery( "#status-dialog" ).dialog( "option", "buttons", {  
          "Cancel": function() { jQuery(this).dialog("close"); }
        });
        jQuery('#status-dialog').dialog('open');
        return false;
      }else{
        if(jQuery('input#edit-field-address-0-address-locality').val() == '' || jQuery('select#edit-field-address-0-address-administrative-area').val() == ''){
          jQuery('#status-d-content').html('If you wish to participate in teams, please enter values in both the "City" and "State" fields.');
          jQuery( "#status-dialog" ).dialog( "option", "buttons", {  
            "Cancel": function() { jQuery(this).dialog("close"); }
          });
          jQuery('#status-dialog').dialog('open');
          return false;
        }
      }
    }
  });
  
  jQuery('div.form-item-field-teams-option-value').click(function(e){
    var team = jQuery(this).find('input#edit-field-teams-option-value').attr('team');
    var uid = jQuery(this).find('input#edit-field-teams-option-value').attr('uid');
    if(team == 1){
      jQuery('#status-d-content').html('You currently own one or more teams. If you no longer wish to participate in teams you must first delete your teams.');
      jQuery( "#status-dialog" ).dialog( "option", "buttons", { 
        "My Teams": function() {
          window.location.href = '/my-account/'+uid+'/teams';
        }, 
        "Cancel": function() { jQuery(this).dialog("close"); }
      });
      jQuery('#status-dialog').dialog('open');
    }else if(team == 2){
      jQuery('#status-d-content').html('You are currently a member of one or more other users\' teams. If you no longer wish to participate in teams you must first leave these teams.');
      jQuery( "#status-dialog" ).dialog( "option", "buttons", { 
        "My Teams": function() { 
          window.location.href = '/my-account/'+uid+'/teams'; 
        },
        "Cancel": function() { jQuery(this).dialog("close"); }       
      });
      jQuery('#status-dialog').dialog('open');
    }else{
      
    }
  });
});



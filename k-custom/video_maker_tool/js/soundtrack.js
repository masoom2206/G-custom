function soundtrackHtml(data, callback){
	jQuery('#properties-soundtrack-content-section .sound-track').html('');
	jQuery('#properties-soundtrack-content-section .sound-track').html('<div class="sound-track-wrapper row"><div class="audio-name col-md-6">'+data.audioname+'</div><div class="audio-duration col-md-6 text-align-right">Duration: '+data.duration+'</div><div class="duration-box" style="display: flex;padding: 11px;"><div class="w-100"><input type="checkbox" checked="checked" name="loop_sound" id="loop-sound" value="1"> Loop</div></div><div class="soundwave" style="width: 100%;display: block;"><div id="waveform" style="width: 100%;display: block;"></div><div class="audiocontrols p-3 pagination"><span style="cursor:pointer" class="btn btn-primary" onclick="soundwavetogglePlay()"><i class="fa fa-play"></i>Play / <i class="fa fa-pause"></i>Pause</span></div></div><div class="range-volume-control" style="border-top: 1px solid #d9d9d9; "><div class="volume-icon"><i class="fa fa-volume-up"></i></div><div class="volume-range-wrap-sound range-wrap range-volume"><input type="range" id="volume-sound" name="volume-sound" data-default="100" min="0" max="100" value="100" step="1" class="range"><output class="bubble"></output></div></div><div class="remove-soundtrack-button w-100"><span style="cursor:pointer" class="btn btn-primary rmv-soundtrack float-right">Remove Soundtrack</span></div><div class="hidden-rawdata-sound d-none"><textarea id="soundtrack-data" name="soundtrack-data" rows="4"></textarea></div></div>');
	
	var wavesurfer = WaveSurfer.create({
		container: document.querySelector('#waveform'),
		backend: 'MediaElement',
		height:100
	});
	//wavesurfer.load('https://dev.kaboodlemedia.com/system/files/user-files/2019-05/1/master/audio/b-1.mp3');
	wavesurfer.load(data.audiosrc);
	jQuery('#waveform audio').attr('id','soundwaveaudio');
	
	  const allVolumeRanges = document.querySelectorAll("div.volume-range-wrap-sound");
	  allVolumeRanges.forEach(wrap => {
		const range = wrap.querySelector("input.range");
		const bubble = wrap.querySelector("output.bubble");
		range.addEventListener("input", () => {
		  setBubble(range, bubble, 'volume');
		});
	  });
	  var updatedData = {};
	  updatedData.audioname = data.audioname
	  updatedData.duration = data.duration;
	  updatedData.audiosrc = data.audiosrc; 
	  updatedData.mid = data.mid;
	  jQuery('#soundtrack-data').val(JSON.stringify(data));
	  jQuery( ".sound-track-wrapper #first-sound" ).prop( "checked", data.fadeIn );
	  jQuery( ".sound-track-wrapper #last-sound" ).prop( "checked", data.fadeout );
	  jQuery( ".sound-track-wrapper #loop-sound" ).prop( "checked", data.loop );

	  jQuery('#properties-soundtrack-content-section').on('input', '#volume-sound', function(e) {
		  wavesurfer.setVolume(parseInt(jQuery(this).val())/100);
	  });
	  jQuery('#volume-sound').val(data.vol);
	  jQuery('#volume-sound').trigger('input');
	  callback(1)
}
function soundwavetogglePlay() {
  var myAudio = document.getElementById("soundwaveaudio");
  return myAudio.paused ? myAudio.play() : myAudio.pause();
};

/* don't remove this uncommented code, this is for fadein fadeout html
<div class="w-75"><input type="checkbox" checked="checked" name="first_sound" id="first-sound" value="1"> Fade-in 1.0 sec</div><div class="w-300"><input type="checkbox" checked="checked" name="last_sound" id="last-sound" value="1"> Fade-out 1.0 sec</div>
*/
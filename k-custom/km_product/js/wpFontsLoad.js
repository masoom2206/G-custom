/**
 * callback function kmdsFontsLoad();
 * to load kmds fonts before JSON render at canvas
 * @return ''
 **/
function wpFontsLoad() {
  var wpFonts = {
    'Monaco': 'https://s3.us-west-2.amazonaws.com/kaboodlemedia.dev.test/s3fs_public/kmdsFonts/Monaco/Monaco.ttf',
    'Luminari': 'https://s3.us-west-2.amazonaws.com/kaboodlemedia.dev.test/s3fs_public/kmdsFonts/Luminari/Luminari-Regular.woff',
    'Lucida Console': 'https://s3.us-west-2.amazonaws.com/kaboodlemedia.dev.test/s3fs_public/kmdsFonts/LucidaConsole/LucidaConsoleRegular.ttf',
    'Georgia': 'https://s3.us-west-2.amazonaws.com/kaboodlemedia.com/s3fs_public/kmdsFonts/Georgia/Georgia.ttf',
    'Impact': 'https://s3.us-west-2.amazonaws.com/kaboodlemedia.com/s3fs_public/kmdsFonts/Impact/impact.ttf',
    'Didot': 'https://s3.us-west-2.amazonaws.com/kaboodlemedia.com/s3fs_public/kmdsFonts/Didot/Didot.ttf',
    //'American Typewriter': 'https://s3.us-west-2.amazonaws.com/kaboodlemedia.com/s3fs_public/kmdsFonts/AmericanTypewriter/AmericanTypewriter.ttf',
    'American Typewriter': 'https://s3.us-west-2.amazonaws.com/kaboodlemedia.com/s3fs_public/kmdsFonts/American+Typewriter/American+Typewriter+Regular.ttf',
    'Andale Mono': 'https://s3.us-west-2.amazonaws.com/kaboodlemedia.com/s3fs_public/kmdsFonts/AndaleMono/ANDALEMO.woff',
    'Bradley Hand': 'https://s3.us-west-2.amazonaws.com/kaboodlemedia.com/s3fs_public/kmdsFonts/BradleyHand/BradleysPen.woff',
  };
  var count = Object.keys(wpFonts).length
  jQuery.each(wpFonts, function(key, val){
    var kmdsFont = new FontFace(key, 'url('+val+')');
    kmdsFont.load().then(function(font){
      document.fonts.add(font);
      count--;
      if(count == 0){
        console.log('WP fonts loaded!');
      }
    });
  });
}
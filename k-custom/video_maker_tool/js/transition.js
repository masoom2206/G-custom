console.log('I am connected to js file to execute it.');
if ((typeof process !== 'undefined') && (process.release.name.search(/node|io.js/) !== -1)) { 
  console.log('this script is running in Node.js'); 
} else { 
  console.log('this script is not running in Node.js'); 
}

try {
  const concat = require('./home/ubuntu/mysql');
  console.log('ffmpeg-concat module found!');
  await concat({
    output: '/var/tmp/vmt/5/output/km-test-transition.mp4',
    videos: [
      '/var/tmp/vmt/5/output/km_00001.mp4',
      '/var/tmp/vmt/5/output/km_00002.mp4',
      '/var/tmp/vmt/5/output/km_00003.mp4',
      '/var/tmp/vmt/5/output/km_00004.mp4',
    ],
    transitions: [
      {
        name: 'circleOpen',
        duration: 1000
      },
      {
        name: 'crossWarp',
        duration: 800
      },
      {
        name: 'squaresWire',
        duration: 2000
      }
    ]
  });
} catch (e) {
  console.log('ffmpeg-concat module not found!');
}

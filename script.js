// let Btn = document.getElementById('btn');
// let URLinput = document.querySelector('.URL-input');
// let select = document.querySelector('.opt');
// let serverURL = 'http://localhost:8080';

// Btn.addEventListener('click', () => {
// 	if (!URLinput.value) {
// 		alert('Enter YouTube URL');
// 	} else {
// 		if (select.value == 'mp3') {
// 			downloadMp3(URLinput.value);
// 		} else if (select.value == 'mp4') {
// 			downloadMp4(URLinput.value);
// 		}
// 	}
// });

// async function downloadMp3(query) {
// 	const res = await fetch(`${serverURL}/downloadmp3?url=${query}`);
// 	if(res.status == 200) {
// 		var a = document.createElement('a');
//   		a.href = `${serverURL}/downloadmp3?url=${query}`;
//   		a.setAttribute('download', '');
// 		a.click();
// 	} else if(res.status == 400) {
// 		alert("Invalid url");
// 	}
// }

// async function downloadMp4(query) {
// 	const res = await fetch(`${serverURL}/downloadmp4?url=${query}`);
// 	if(res.status == 200) {
// 		var a = document.createElement('a');
//   		a.href = `${serverURL}/downloadmp4?url=${query}`;
//   		a.setAttribute('download', '');
// 		a.click();
// 	} else if(res.status == 400) {
// 		alert('Invalid url');
// 	}
// }



const ytdl = require('ytdl-core');
const fs = require('fs');
const videoId='';

function fnOnPressDownload(sVideoUrl){
	videoId= sVideoUrl;
	fnDownloadVideo();
}
// const videoId = 'ENTER_YOUTUBE_VIDEO_ID_OR_URL_HERE';

function fnDownloadVideo(){
// Get video info from YouTube
ytdl.getInfo(videoId).then((info) => {
  // Select the video format and quality
  const format = ytdl.chooseFormat(info.formats,{quality:"248"});
  // Create a write stream to save the video file
  const outputFilePath = `${info.videoDetails.title}.${videoFormat.container}`;
  const outputStream = fs.createWriteStream(outputFilePath);
  // Download the video file
  ytdl.downloadFromInfo(info, { format: format }).pipe(outputStream);
  // When the download is complete, show a message
  outputStream.on('finish', () => {
    console.log(`Finished downloading: ${outputFilePath}`);
  });
}).catch((err) => {
  console.error(err);
});

}















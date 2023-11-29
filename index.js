

let myLeads = []
let myVideos = []
const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")
const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"))
const tabBtn = document.getElementById("tab-btn")
const ulFrames = document.getElementById("ul-el2")
const videosFromLocalStorage = JSON.parse(localStorage.getItem("myVideos"))

if (leadsFromLocalStorage) {
    myLeads = leadsFromLocalStorage
    render(myLeads)
}

tabBtn.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        myLeads.push(tabs[0].url)
        localStorage.setItem("myLeads", JSON.stringify(myLeads))
        render(myLeads)
    })
})

function render(leads) {
    let listItems = ""
    for (let i = 0; i < leads.length; i++) {
        listItems += `
            <li>
                <a target='_blank' href='${leads[i]}'>
                    ${leads[i]}
                </a>
            </li>
        `
    }
    ulEl.innerHTML = listItems
}

deleteBtn.addEventListener("dblclick", function () {
    localStorage.clear()
    myLeads = []
    myVideos = []
    render(myLeads)
    renderVideo(myVideos)
})

inputBtn.addEventListener("click", function () {
    myLeads.push(inputEl.value)
    inputEl.value = ""
    localStorage.setItem("myLeads", JSON.stringify(myLeads))
    render(myLeads)
})

// for youtube videos


// function authenticate() {
//     return gapi.auth2.getAuthInstance()
//         .signin({ scope: "https://www.googleapis.com/auth/youtube.force-ssl" })
//         .then(function () { console.log("Sign-in successful"); },
//             function (err) { console.error("Error signing in", err); });
// }
// function loadClient() {
//     gapi.client.setApiKey("AIzaSyD1_TDKl7NgkFGt0OBVGJKWN2C_Ia7mhbg");
//     return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
//         .then(function () { console.log("GAPI client loaded for API"); },
//             function (err) { console.error("Error loading GAPI client for API", err); });
// }

// Make sure the client is loaded and sign-in is complete before calling this method.
function execute() {
    var that=this;
    const searchTerm = inputEl.value;
    const YOUTUBE_API_KEY = "AIzaSyD1_TDKl7NgkFGt0OBVGJKWN2C_Ia7mhbg";
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${searchTerm}&key=${YOUTUBE_API_KEY}`;
    // console.log(url);
    fetch(url)
        .then(response => response.json())
        .then(data => {
            //console.log(data.items[0].id.videoId);
            // document.querySelector(".youtubeVideo").src = `https://www.youtube.com/embed/${data.items[0].id.videoId}`
            // let aArr=
			let sItem= data.items[0],
			sVideoLink= `https://www.youtube.com/embed/${sItem.id.videoId}`,
			sVideoTitle= sItem.snippet.title;
			myVideos.push({
				"title": sVideoTitle,
				"url" : sVideoLink
			})
    		inputEl.value = ""
    		// localStorage.setItem("myVideos", myVideos);
			localStorage.setItem("myVideos", JSON.stringify(myVideos));
			// JSON.parse(localStorage.getItem('myVideos'));

            renderVideo(myVideos);
            
        });

}

if (videosFromLocalStorage) {
    myVideos = videosFromLocalStorage
    renderVideo(myVideos)
}

function renderVideo(myVideos){
    // myVideos.push(data)
    // localStorage.setItem("myVideos", myVideos)
    let listValues="";
    
    if(myVideos){
    for(let i=0;i<myVideos.length; i++){
        // let sItem= data.items[i],
        let sVideoLink= myVideos[i].url,
        sVideoTitle= myVideos[i].title;
		sId= 'id_iFrame'+i;
        // creating list
        listValues+=`
        <li>
        <iframe id='${sId}' src='${sVideoLink}' title='${sVideoTitle}' allow='autoplay'> </iframe>
		</li>
        `
		// listValues+=`
        // <li>
        // <video>
		// <source id='${sId}' src='${sVideoLink}' type='video/mp4'>
		// <source id='${sId}' src='${sVideoLink}' type='video/ogg'>
		// </source>
		// </video>
		// </li>
        // `
     }
     ulFrames.innerHTML=listValues;
    }
}

// function play(){
//     // let sUrl= document.querySelector(".youtubeVideo").src+'?autoplay=1&mute=0';
//     document.querySelector(".youtubeVideo").play();

// }

function play(){
	$(document).ready(function($)
	{ 
		var youtube_data_parser = function(data)
		{
			//---> parse video data - start
			var qsToJson = function (qs) 
			{
				var res = {};
				var pars = qs.split('&');
				var kv, k, v;
				for (i in pars) 
				{
					kv = pars[i].split('=');
					k = kv[0];
					v = kv[1];
					res[k] = decodeURIComponent(v);
				}
				return res;
			}			
			//---> parse video data - end

			var get_video_info = qsToJson(data);

			if(get_video_info.status == 'fail')
			{
				return {status:"error", code: "invalid_url",  msg : "check your url or video id"};

			} 
			else  
			{
				// remapping urls into an array of objects

				//--->parse > url_encoded_fmt_stream_map > start

				//will get the video urls
				var tmp = get_video_info["url_encoded_fmt_stream_map"];
				if (tmp) 
				{
					tmp = tmp.split(',');
					for (i in tmp) 
					{
					  tmp[i] = qsToJson(tmp[i]);
					}		    
					get_video_info["url_encoded_fmt_stream_map"] = tmp;
				}
				//--->parse > url_encoded_fmt_stream_map > end


				//--->parse > player_response > start
				var tmp1 = get_video_info["player_response"];
				if (tmp1) 
				{ 		    
					get_video_info["player_response"] = JSON.parse(tmp1);
				}
				//--->parse > player_response > end

				//--->parse > keywords > start
				var keywords = get_video_info["keywords"];
				if (keywords) 
				{ 	
					key_words = keywords.replace(/\+/g,' ').split(',');
					for (i in key_words) 
					{
					  keywords[i] = qsToJson(key_words[i]);
					}
					get_video_info["keywords"] = {all:keywords.replace(/\+/g,' '), arr: key_words};
				}				
				//--->parse > keywords > end

				//return data
				return {status: 'success', raw_data:qsToJson(data), video_info:get_video_info};
			}
		}


		

		$(document).on('click', '.btn_get_youtube_vidoe_id', function(event) 
		{
			event.preventDefault();
			
			var get_video_id = $('.youtube_video_id').val();

			var ajax_url = 'http://localhost/?id='+get_video_id;
			 
			$.get(ajax_url, function(d1) 
			{	
				
				var data = youtube_data_parser(d1)

				console.log( data)
				 
				var video_data = data.video_info

				var video_title = video_data.title.replace(/\+/g,' ')
				var video_thumbnail_url = video_data.thumbnail_url

				var video_arr = video_data.url_encoded_fmt_stream_map;

				//quality "hd720"
				var video_arr_final = {}
				$.each(video_arr, function(i1, v1) 
				{
					if(v1.quality == "hd720")
					{	
						var url = v1.url
						video_arr_final = {
							video_title:video_title,
							video_thumbnail_url:video_thumbnail_url,
							video_url:v1.url
						}
					}
				});
				 
				var d = ''
				+ '<br>'
				+'<a class="btn  btn-primary" href="'+video_arr_final.video_url+'" download="youtube.mp3"> Download</a>'

				+'<video  src="'+video_arr_final.video_url+'" controls autoplay controlsList="nodownload" oncontextmenu="return false;" height="350" width="100%">'
				+'</video >'

				$('.youtube_video').html(d) 

			});

		});

	});
}


// function saveLink(){
//     const express = require(['require', 'express'])
// const app = express()
// const cors = require(['require', 'cors'])

// app.use(express.json())
// app.use(cors({
//   methods: ['GET'],
//   origin: '*'
// }));

// const mp3Router = require('./routes/mp3')
// app.use('/mp3', mp3Router)

// app.get('/', (req, res) => {
//   res.json({
//     status: 200,
//     message: "TubeConverterAPI is a Youtube converter API with extra features! Read the docs: https://github.com/datwalkerv/TubeConverterAPI"
//   })
// })

// app.listen(3000, () => {
//   console.log(`TubeConverter has started!`)
// })
// }


// const express = require('express');
// const cors = require('cors');
// const ytdl = require('ytdl-core');
// const app = express();
// app.listen(4000, () => {
//     console.log('Server Works !!! At port 4000');
// });

function saveLink(){
	// import {} from './script.js'
	// const getVideo= require('./script.js');
}
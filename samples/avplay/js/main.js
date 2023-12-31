/*
 * Methods use shows below:
 * open : This method instantiates the player object and take input url as input paramter.
 * prepare: This method prepare the media player for playback.
 * Player must have been created before this with a valid URI.
 * setDisplayRect:This method sets the display area for playing video content on TV screen
 * play: This method starts the playback of the stream.
 * close:This method destroys the avplay object.
 * prepareAsync:This method prepares the media player for playback, asynchronously.
 * This API, would prepare the MM core module asynchronously.
 * It means internal media elements will change the state asynchronously.
 *
 */

/**
 * This object is used in order to obtain the Buffering,
 * Playback Time, Playback mode, DRM mode information etc. *
 */

var listener = {
    onbufferingstart: function () {
        console.log("Buffering start.");
        showLoading();
    },
    onbufferingprogress: function (percent) {
        console.log("Buffering progress data : " + percent);
        updateLoading(percent);
    },
    onbufferingcomplete: function () {
        console.log("Buffering complete.");
        hideLoading();
        if (typeof plugin !== 'undefined') {
            // plugin.getAdapter().onbufferingcomplete();
        }
    },
    oncurrentplaytime: function (currentTime) {
        console.log("Current Playtime : " + currentTime);
        updateCurrentTime(currentTime);
        if (typeof plugin !== 'undefined') {
            // plugin.getAdapter().oncurrentplaytime();
        }

    },
    onevent: function (eventType, eventData) {
        console.log("event type : " + eventType + ", data: " + eventData);
    },
    onerror: function (eventType) {
        console.log("error type : " + eventType);
        if (typeof plugin !== 'undefined') {
            // plugin.getAdapter().onerror();
        }
    },
    onsubtitlechange: function (duration, text, data3, data4) {
        console.log("Subtitle Changed.");
    },
    ondrmevent: function (drmEvent, drmData) {
        console.log("DRM callback: " + drmEvent + ", data: " + drmData);
    },
    onstreamcompleted: function () {
        // console.log("Stream Completed");
        //You should write stop code in onstreamcompleted.
        webapis.avplay.pause();
        webapis.avplay.seekTo(0);

        if (typeof plugin !== 'undefined') {
            // plugin.getAdapter().onstreamcompleted();
        }
    }
};

//Initialize function
var init = function () {
    //register video related keys
    tizen.tvinputdevice.registerKey("MediaPlayPause");
    tizen.tvinputdevice.registerKey("MediaPlay");
    tizen.tvinputdevice.registerKey("MediaPause");
    tizen.tvinputdevice.registerKey("MediaStop");
    tizen.tvinputdevice.registerKey("MediaFastForward");
    tizen.tvinputdevice.registerKey("MediaRewind");
    tizen.tvinputdevice.registerKey("1");
    tizen.tvinputdevice.registerKey("2");
    tizen.tvinputdevice.registerKey("3");
    tizen.tvinputdevice.registerKey("4");
    tizen.tvinputdevice.registerKey("5");
    tizen.tvinputdevice.registerKey("6");
    tizen.tvinputdevice.registerKey("7");
    tizen.tvinputdevice.registerKey("8");
    tizen.tvinputdevice.registerKey("9");
    tizen.tvinputdevice.registerKey("0");
    //You don't need to register volume related key.

    //add eventListener for video related keys
    document.addEventListener('keydown', function (e) {
        console.log("Button clicked: " + e.keyCode);
        switch (e.keyCode) {
            case tizen.tvinputdevice.getKey("MediaPlayPause").code:
                console.log("Play/Pause toggle button clicked");
                if (webapis.avplay.getState() == "PAUSED" || webapis.avplay.getState() == "READY") {
                    playVideo();
                } else if (webapis.avplay.getState() == "PLAYING") {
                    pauseVideo();
                }
                break;
            case tizen.tvinputdevice.getKey("MediaPlay").code:
                playVideo();
                break;
            case tizen.tvinputdevice.getKey("MediaPause").code:
                pauseVideo();
                break;
            case tizen.tvinputdevice.getKey("MediaStop").code:
                stopVideo();
                break;
            case tizen.tvinputdevice.getKey("MediaFastForward").code:
                jumpForwardVideo(1000);
                break;
            case tizen.tvinputdevice.getKey("MediaRewind").code:
                jumpBackwardVideo(1000);
                break;
            case 49:
                videoPlayMp4();
                break;
            case 50:
                videoError();
                break;
            case 51:
                videoPlayHLS();
                break;
            case 52:
                videoPlayHLSVod();
                break;
            case 53:
                videoPlayPR();
                break;
            case 54:
                videoPlayWV();
                break;
            case 55:
                videoPlayMp4Bit();
                break;
        }
    });
};

// window.onload can work without <body onload="">
window.onload = init;

/**
 * open function
 *
 * You should do this code sequence before you play video.
 * open -> setListener -> prepare -> setDisplayRect -> play
 */
var videoPlayMp4 = function () {
    try {
        var url = "https://sec.ch9.ms/ch9/6b3d/57930795-7f62-4218-8e18-888623426b3d/Goodfellow_mid.mp4";

        if (typeof plugin !== 'undefined') {
            plugin.setOptions({
                'content.title': 'mp4 video',
                'content.resource': url,
                'content.isLive': false
            });
            plugin.getAdapter().fireStart();
        }

        console.log("Current state: " + webapis.avplay.getState());
        console.log("open start");
        //open API gets target URL. URL validation is done in prepare API.
        webapis.avplay.open(url);
        //setListener should be done before prepare API. Do setListener after open immediately.
        webapis.avplay.setListener(listener);
        console.log("Current state: " + webapis.avplay.getState());
        console.log("open complete");
        //reset duration
        updateDuration();

        // Prepare
        prepare();
    } catch (e) {
        console.log("Current state: " + webapis.avplay.getState());
        console.log("Exception: " + e.name);
        console.log(e);
    }
};

var videoPlayMp4Bit = function () {
    try {
        var url = "https://sec.ch9.ms/ch9/6b3d/57930795-7f62-4218-8e18-888623426b3d/Goodfellow_mid.mp4";

        if (typeof plugin !== 'undefined') {
            plugin.setOptions({
                'content.title': 'mp4 Video w/ Bitrate',
                'content.resource': url,
                'content.isLive': false
            });
            plugin.getAdapter().fireStart();
        }

        console.log("Current state: " + webapis.avplay.getState());
        console.log("open start");
        //open API gets target URL. URL validation is done in prepare API.
        webapis.avplay.open(url);
        //setListener should be done before prepare API. Do setListener after open immediately.
        webapis.avplay.setListener(listener);
        console.log("Current state: " + webapis.avplay.getState());
        console.log("open complete");
        //reset duration
        updateDuration();

        // Prepare
        prepare();
    } catch (e) {
        console.log("Current state: " + webapis.avplay.getState());
        console.log("Exception: " + e.name);
        console.log(e);
    }
};

var videoError = function () {
    try {
        var url = "http://deslasexta.antena3.com/mp_series1/2012/09/10/00001s.mp4";

        if (typeof plugin !== 'undefined') {
            plugin.setOptions({
                'content.title': 'Error Video',
                'content.resource': url,
                'content.isLive': false
            });
            plugin.getAdapter().fireStart();
        }

        console.log("Current state: " + webapis.avplay.getState());
        console.log("open start ERROR FILE");
        //open API gets target URL. URL validation is done in prepare API.

        webapis.avplay.open(url);
        //setListener should be done before prepare API. Do setListener after open immediately.
        webapis.avplay.setListener(listener);
        console.log("Current state: " + webapis.avplay.getState());
        console.log("open complete");
        //reset duration
        updateDuration();

        // Prepare
        prepare();
    } catch (e) {
        console.log("Current state: " + webapis.avplay.getState());
        console.log("Exception: " + e.name);
        console.log(e);
    }
};

var videoPlayHLS = function () {
    try {
        var url = "https://e2.dotice.me/plyvivo/lu4u5i5u4u3o2iw02uba/playlist.m3u8";
        if (typeof plugin !== 'undefined') {
            plugin.setOptions({
                'content.title': 'HLS live',
                'content.resource': url,
                'content.isLive': true
            });
            plugin.getAdapter().fireStart();
        }

        console.log("Current state: " + webapis.avplay.getState());
        console.log("open start");
        //open API gets target URL. URL validation is done in prepare API.

        webapis.avplay.open(url);
        //setListener should be done before prepare API. Do setListener after open immediately.
        webapis.avplay.setListener(listener);
        console.log("Current state: " + webapis.avplay.getState());
        console.log("open complete");
        //reset duration
        updateDuration();

        // Prepare
        prepare();
    } catch (e) {
        console.log("Current state: " + webapis.avplay.getState());
        console.log("Exception: " + e.name);
        console.log(e);
    }
};

var videoPlayHLSVod = function () {
    try {
        var url = "http://qthttp.apple.com.edgesuite.net/1010qwoeiuryfg/sl.m3u8";
        if (typeof plugin !== 'undefined') {
            plugin.setOptions({
                'content.title': 'HLS VOD',
                'content.resource': url,
                'content.isLive': false
            });
            plugin.getAdapter().fireStart();
        }

        console.log("Current state: " + webapis.avplay.getState());
        console.log("open start");
        //open API gets target URL. URL validation is done in prepare API.

        webapis.avplay.open(url);
        //setListener should be done before prepare API. Do setListener after open immediately.
        webapis.avplay.setListener(listener);
        console.log("Current state: " + webapis.avplay.getState());
        console.log("open complete");
        //reset duration
        updateDuration();

        // Prepare
        prepare();
    } catch (e) {
        console.log("Current state: " + webapis.avplay.getState());
        console.log("Exception: " + e.name);
        console.log(e);
    }
};

var videoPlayPR = function () {
    try {
        var url = "http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/Manifest";
        if (typeof plugin !== 'undefined') {
            plugin.setOptions({
                'content.title': 'PlayReady',
                'content.resource': url,
                'content.isLive': false
            });
            plugin.getAdapter().fireStart();
        }

        console.log("Current state: " + webapis.avplay.getState());
        console.log("open start");
        //open API gets target URL. URL validation is done in prepare API.

        webapis.avplay.open(url);
        //setListener should be done before prepare API. Do setListener after open immediately.
        webapis.avplay.setListener(listener);
        console.log("Current state: " + webapis.avplay.getState());
        console.log("open complete");
        //reset duration
        updateDuration();

        var drmParam = new Object();
        drmParam.LicenseServer = 'http://playready.directtaps.net/pr/svc/rightsmanager.asmx';
        drmParam.DeleteLicenceAfterUse = true;
        webapis.avplay.setDrm('PLAYREADY', 'SetProperties', JSON.stringify(drmParam));

        // Prepare
        // prepare();
    } catch (e) {
        console.log("Current state: " + webapis.avplay.getState());
        console.log("Exception: " + e.name);
        console.log(e);
    }
};

var videoPlayWV = function () {
    try {
        var url = "http://commondatastorage.googleapis.com/wvmedia/starz_main_720p_6br_tp.wvm";
        if (typeof plugin !== 'undefined') {
            plugin.setOptions({
                'content.title': 'WideVine',
                'content.resource': url,
                'content.isLive': false
            });
            plugin.getAdapter().fireStart();
        }

        console.log("Current state: " + webapis.avplay.getState());
        console.log("open start");
        //open API gets target URL. URL validation is done in prepare API.

        webapis.avplay.open(url);
        //setListener should be done before prepare API. Do setListener after open immediately.
        webapis.avplay.setListener(listener);
        console.log("Current state: " + webapis.avplay.getState());
        console.log("open complete");
        //reset duration
        updateDuration();

        var drmParam = new Object();
        drmParam.LicenseServer = 'https://license.uat.widevine.com/getlicense/widevine';
        webapis.avplay.setDrm('PLAYREADY', 'SetProperties', JSON.stringify(drmParam));

        // Prepare
        prepare();
    } catch (e) {
        console.log("Current state: " + webapis.avplay.getState());
        console.log("Exception: " + e.name);
        console.log(e);
    }
};

/**
 * prepare function
 *
 * You should do this code sequence before you play video.
 * open -> setListener -> prepare -> setDisplayRect -> play
 */
var prepare = function () {
    try {
        console.log("Current state: " + webapis.avplay.getState());
        console.log("prepare start");
        //prepare API should be done after open API.
        webapis.avplay.prepare();
        //set default position and size
        //setDisplayRect should be done to display video. without it, video is not shown.
        var avPlayerObj = document.getElementById("av-player");
        webapis.avplay.setDisplayRect(avPlayerObj.offsetLeft, avPlayerObj.offsetTop, avPlayerObj.offsetWidth, avPlayerObj.offsetHeight);
        console.log("Current state: " + webapis.avplay.getState());
        console.log("prepare complete");

        //duration can be get after prepare complete
        updateDuration();

        // Play
        playVideo();
    } catch (e) {
        console.log("Current state: " + webapis.avplay.getState());
        console.log(e);

        if (typeof plugin !== 'undefined') {
            // plugin.getAdapter().onerror(e.name);
        }
    }
};


/**
 * playVideo use to play the video
 */
var playVideo = function () {
    console.log("Current state: " + webapis.avplay.getState());
    console.log('Play Video');
    try {
        if (typeof plugin !== 'undefined') {
            // plugin.getAdapter().playVideo();
        }
        webapis.avplay.play();
        console.log("Current state: " + webapis.avplay.getState());
    } catch (e) {
        console.log("Current state: " + webapis.avplay.getState());
        console.log(e);
    }

};

/**
 * This is used to pause the video
 */
var pauseVideo = function () {
    console.log("Current state: " + webapis.avplay.getState());
    console.log('Pause Video');
    try {
        if (typeof plugin !== 'undefined') {
            // plugin.getAdapter().pauseVideo();
        }
        webapis.avplay.pause();
        console.log("Current state: " + webapis.avplay.getState());
    } catch (e) {
        console.log("Current state: " + webapis.avplay.getState());
        console.log(e);
    }

};

/**
 * This function is used to stop the video
 */
var stopVideo = function () {
    console.log("Current state: " + webapis.avplay.getState());
    console.log('Stop Video');
    try {
        if (typeof plugin !== 'undefined') {
            // plugin.getAdapter().stopVideo();
        }
        webapis.avplay.stop();
        console.log("Current state: " + webapis.avplay.getState());
    } catch (e) {
        console.log("Current state: " + webapis.avplay.getState());
        console.log(e);
    }
};

/**
 * jump forward
 * @param time millisecond
 */
var jumpForwardVideo = function (time) {
    console.log("Current state: " + webapis.avplay.getState());
    console.log('FF Video');
    try {
        if (typeof plugin !== 'undefined') {
            // plugin.getAdapter().jumpForwardVideo();
        }
        webapis.avplay.jumpForward(time);
        console.log("Current state: " + webapis.avplay.getState());
    } catch (e) {
        console.log("Current state: " + webapis.avplay.getState());
        console.log(e);
    }
};

/**
 * jump backward
 * @param time millisecond
 */
var jumpBackwardVideo = function (time) {
    console.log("Current state: " + webapis.avplay.getState());
    console.log('RW Video');
    try {
        if (typeof plugin !== 'undefined') {
            // plugin.getAdapter().jumpBackwardVideo();
        }
        webapis.avplay.jumpBackward(time);
        console.log("Current state: " + webapis.avplay.getState());
    } catch (e) {
        console.log("Current state: " + webapis.avplay.getState());
        console.log(e);
    }
};

/*
 * Handling time indicator
 */
var updateDuration = function () {
    //duration is given in millisecond
    var duration = webapis.avplay.getDuration();
    document.getElementById("totalTime").innerHTML = Math.floor(duration / 3600000) + ":" + Math.floor((duration / 60000) % 60) + ":" + Math.floor((duration / 1000) % 60);
};

var updateCurrentTime = function (currentTime) {
    //current time is given in millisecond
    if (currentTime == null) {
        currentTime = webapis.avplay.getCurrentTime();
    }
    document.getElementById("currentTime").innerHTML = Math.floor(currentTime / 3600000) + ":" + Math.floor((currentTime / 60000) % 60) + ":" + Math.floor((currentTime / 1000) % 60);
}

/*
 * Handling loading indicator
 */
var showLoading = function () {
    var avPlayerObj = document.getElementById("av-player");
    document.getElementById("loading").style.display = "block";
    document.getElementById("loading").style.left = avPlayerObj.offsetLeft + (avPlayerObj.offsetWidth / 2) - (document.getElementById("loading").offsetWidth / 2);
    document.getElementById("loading").style.top = avPlayerObj.offsetTop + (avPlayerObj.offsetHeight / 2) - (document.getElementById("loading").offsetHeight / 2);
    document.getElementById("percent").innerHTML = 0;
}

var hideLoading = function () {
    document.getElementById("loading").style.display = "none";
}

var updateLoading = function (percent) {
    document.getElementById("percent").innerHTML = percent;
}

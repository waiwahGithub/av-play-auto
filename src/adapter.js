/* global webapis */
var youbora = require('youboralib')
var manifest = require('../manifest.json')

youbora.adapters.SamsungAvplay = youbora.Adapter.extend({
  /** Override to return current plugin version */
  getVersion: function () {
    return manifest.version + '-' + manifest.name + '-' + manifest.tech
  },

  /** Override to return current playhead of the video */
  getPlayhead: function () {
    return this._toSeconds(this._getValueFromAvplay('getCurrentTime'))
  },

  /** Override to return video duration */
  getDuration: function () {
    return this._toSeconds(this._getValueFromAvplay('getDuration'))
  },

  /** Override to return current bitrate */
  getBitrate: function () {
    return this._getExtraInfo().bitrate
  },

  /** Override to return rendition */
  getRendition: function () {
    var info = this._getExtraInfo()
    return youbora.Util.buildRenditionString(info.width, info.height, info.bitrate)
  },

  /** Override to return player version */
  getPlayerVersion: function () {
    return this._getValueFromAvplay('getVersion')
  },

  /** Override to return player's name */
  getPlayerName: function () {
    return 'AVPlay'
  },

  _getExtraInfo: function() {
    var ret = {}
    var currentStreamInfo = this._getValueFromAvplay('getCurrentStreamInfo')
    if (currentStreamInfo) {
      for (var i = 0; i < currentStreamInfo.length; ++i) {
        if (currentStreamInfo[i].type === 'VIDEO') {
          var info = {}
          try {
            info = JSON.parse(currentStreamInfo[i].extra_info) || info
          } catch (err) {
            info = {}
          }
          if (typeof info.Bit_rate !== 'undefined') {
            var bitrate = Number(info.Bit_rate) || -1
            if (bitrate < 2.5 * 1e4) {
              bitrate *= 100 // lower than 25k, for example: 22,000 -> 22,000,000 (it wont be less than 25kbps)
            } else if (bitrate > 2.5 * 1e7) {
              bitrate /= 100 // higher than 25M, for example: 35,000,000 -> 35,000 (it wont be more than 25Mbps)
            }
            ret.bitrate = bitrate
          }
          ret.width = info.Width
          ret.height = info.Height
          return ret
        }
      }
    }
    return ret
  },

  _getValueFromAvplay: function (functionName) {
    var ret = null
    try {
      if (typeof functionName === 'string' && typeof webapis !== 'undefined' && webapis.avplay && typeof webapis.avplay[functionName] === 'function') {
        ret = webapis.avplay[functionName]()
      }
    } catch (err) {
      youbora.Log.debug('Couldnt access to the method: ', functionName)
    }
    return ret
  },

  _toSeconds: function(inNumber) {
    var ret = Number(inNumber) || 0
    return ret / 1000
  },

  /** Register listeners to this.player. */
  registerListeners: function () {
    // Enable playhead monitor (buffer = true, seek = false)
    this.monitorPlayhead(true, true)
  },

  /** Unregister listeners to this.player. */
  unregisterListeners: function () {
    // Disable playhead monitoring
    if (this.monitor) this.monitor.stop()
  },

  onbufferingcomplete: function () {
    // youbora.log.debug("onbufferingcomplete")
  },

  oncurrentplaytime: function () {
    // youbora.log.debug("oncurrentplaytime")
    this.fireJoin()
    this.fireStart()
  },
  
  onerror: function (eventType) {
    this.fireFatalError(eventType)
  },

  onstreamcompleted: function () {
    this.fireStop()
  },

  playVideo: function () {
    this.fireResume()
  },

  pauseVideo: function () {
    this.firePause()
  },

  stopVideo: function () {
    this.fireStop()
  },

  jumpForwardVideo: function () {
    if (!this.flags.isBuffering) {
      this.fireSeekBegin()
    }
  },

  jumpBackwardVideo: function () {
    if (!this.flags.isBuffering) {
      this.fireSeekBegin()
    }
  }
})

module.exports = youbora.adapters.SamsungAvplay

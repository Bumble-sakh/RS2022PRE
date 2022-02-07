const playlist = [
  {
    artist: 'Coolio feat. L.V.',
    track: "Gangsta's Paradise",
    cover: 'coolio-gangstas-paradise',
    file: 'coolio-gangstas-paradise',
  },
  {
    artist: 'ATB',
    track: '9 PM',
    cover: 'atb-9-pm',
    file: 'atb-9-pm',
  },
  {
    artist: 'Dr. Alban',
    track: "It's My Life",
    cover: 'dr-alban-its-my-life',
    file: 'dr-alban-its-my-life',
  },
]

class Player {
  constructor(playlist) {
    this.playlist = playlist
    this.currentTrack = 0
    this.track = new Audio(
      `assets/playlist/${this.playlist[this.currentTrack].file}.mp3`
    )
    this.track.currentTime = 0
    this.currentVolume = this.track.volume
  }

  get cover() {
    return this.playlist[this.currentTrack].cover
  }

  get artistName() {
    return this.playlist[this.currentTrack].artist
  }

  get trackName() {
    return this.playlist[this.currentTrack].track
  }

  get trackDuration() {
    return this.track.duration
  }

  get isPlay() {
    return !this.track.paused
  }

  get isMuted() {
    return this.track.muted
  }

  set volume(volume) {
    this.track.volume = volume / 100
    this.currentVolume = this.track.volume
  }

  set currentTime(time) {
    this.track.currentTime = time
  }

  mute() {
    this.track.muted = true
  }

  unmute() {
    this.track.muted = false
  }

  play() {
    this.track.play()
  }

  pause() {
    this.track.pause()
  }

  setCurrentTrack() {
    if (this.isPlay) {
      this.pause()
      this.track = new Audio(
        `assets/playlist/${this.playlist[this.currentTrack].file}.mp3`
      )
      this.play()
    } else {
      this.track = new Audio(
        `assets/playlist/${this.playlist[this.currentTrack].file}.mp3`
      )
    }
    this.track.volume = this.currentVolume
  }

  next() {
    if (this.currentTrack < this.playlist.length - 1) {
      this.currentTrack++
    } else {
      this.currentTrack = 0
    }
    this.setCurrentTrack()
  }

  prev() {
    if (this.currentTrack > 0) {
      this.currentTrack--
    } else {
      this.currentTrack = this.playlist.length - 1
    }
    this.setCurrentTrack()
  }
}

let isChanging = false

/* UI */
const cover = document.querySelector('.main__img')
const artist = document.querySelector('.main__controls__artist')
const track = document.querySelector('.main__controls__track')
const currentTimeLabel = document.querySelector('.current-time')
const durationLabel = document.querySelector('.duration')
const timeLine = document.querySelector('.time-line')
const playBtn = document.querySelector('.play-btn')
const nextBtn = document.querySelector('.next-btn')
const prevBtn = document.querySelector('.prev-btn')
const volumeRange = document.querySelector('.volume')
const muteBtn = document.querySelector('.mute')

/* Player */

const player = new Player(playlist)

/* Functions */

const trackEnded = () => {
  player.next()
  setPlayBtn()
  changeTrackInfo()
  switchPlay()
  player.track.addEventListener('ended', trackEnded)
}

const timeTemplate = (time) => {
  const min = Math.trunc(time / 60).toString()
  const sec = Math.trunc(time % 60).toString()
  const out = `${min.padStart(2, 0)}:${sec.padStart(2, 0)}`
  return out
}

const timeUpdate = () => {
  player.track.addEventListener('timeupdate', () => {
    if (!isChanging) {
      const time = Math.floor(player.track.currentTime)
      timeLine.value = time
      currentTimeLabel.textContent = timeTemplate(time)
    }
  })
}

const changeDuration = () => {
  player.track.addEventListener('loadedmetadata', () => {
    const duration = Math.ceil(player.trackDuration)
    durationLabel.textContent = timeTemplate(duration)
    timeLine.max = duration
  })
}

const changeTrackInfo = () => {
  cover.style['background-image'] = `url(assets/playlist/${player.cover}.jpg)`
  artist.textContent = player.artistName
  track.textContent = player.trackName
  changeDuration()
  timeUpdate()
  timeLine.value = 0
  currentTimeLabel.textContent = timeTemplate(0)
}

const setPlayBtn = () => {
  if (player.isPlay) {
    playBtn.classList.remove('uil-play-circle')
    playBtn.classList.add('uil-pause-circle')
  } else {
    playBtn.classList.remove('uil-pause-circle')
    playBtn.classList.add('uil-play-circle')
  }
}

const switchPlay = () => {
  if (player.isPlay) {
    player.pause()
  } else {
    player.play()
  }
  setPlayBtn()
}

const setVolume = (e) => {
  const volume = e.target.value
  player.volume = volume
  player.unmute()
}

const setMuteBtn = () => {
  if (player.isMuted) {
    muteBtn.classList.remove('uil-volume-mute')
    muteBtn.classList.add('uil-volume')
  } else {
    muteBtn.classList.remove('uil-volume')
    muteBtn.classList.add('uil-volume-mute')
  }
}

const switchMute = () => {
  if (player.isMuted) {
    player.unmute()
  } else {
    player.mute()
  }
  setMuteBtn()
}

/* Listeners */

player.track.addEventListener('ended', trackEnded)

nextBtn.addEventListener('click', (e) => {
  player.next()
  setPlayBtn()
  changeTrackInfo()
})

prevBtn.addEventListener('click', (e) => {
  player.prev()
  setPlayBtn()
  changeTrackInfo()
})

timeLine.addEventListener('input', () => {
  isChanging = true
})

timeLine.addEventListener('change', () => {
  player.currentTime = timeLine.value
  isChanging = false
})

playBtn.addEventListener('click', switchPlay)

volumeRange.addEventListener('change', setVolume)

muteBtn.addEventListener('click', switchMute)

/* Init */

changeTrackInfo()

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

  get isPlay() {
    return !this.track.paused
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

const player = new Player(playlist)

const cover = document.querySelector('.main__img')
const artist = document.querySelector('.main__controls__artist')
const track = document.querySelector('.main__controls__track')
const changeTrackInfo = () => {
  cover.style['background-image'] = `url(assets/playlist/${player.cover}.jpg)`
  artist.textContent = player.artistName
  track.textContent = player.trackName
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

const playBtn = document.querySelector('.play-btn')
const switchPlay = () => {
  if (player.isPlay) {
    player.pause()
  } else {
    player.play()
  }
  setPlayBtn()
}
playBtn.addEventListener('click', switchPlay)

const nextBtn = document.querySelector('.next-btn')
nextBtn.addEventListener('click', (e) => {
  player.next()
  setPlayBtn()
  changeTrackInfo()
})

const prevBtn = document.querySelector('.prev-btn')
prevBtn.addEventListener('click', (e) => {
  player.prev()
  setPlayBtn()
  changeTrackInfo()
})

/* Init */

changeTrackInfo()

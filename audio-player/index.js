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
  get isPlay() {
    return !this.track.paused
  }
  play() {
    this.track.play()
  }
  pause() {
    this.track.pause()
  }
}

const player = new Player(playlist)

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

<template>
  <div class="container">
    <div class="button-container">
      <button @click="swap()">
        Swap player
      </button>
      <button @click="playPause()">
        {{ buttonText }}
      </button>
    </div>
    <div v-if="showTimeSettings" class="time-settings">
      <label for="time2Display">Chaser starting time:</label>
      <input id="chaserMinutes" v-model="chaserMinutes" type="number" placeholder="Minutes" @input="onTimeInput()" />
      <input id="chaserSeconds" v-model="chaserSeconds" type="number" placeholder="Seconds" @input="onTimeInput()" />
    </div>
    <div class="time-container">
      <div ref="display1" class="time-display">Player: <span ref="playerTime" class="time"></span></div>
      <div ref="display2" class="time-display">Chaser: <span ref="chaserTime" class="time"></span></div>
    </div>
  </div>
</template>

<script>
import introAudioFile from '@/assets/Intro.wav';
import finishAudioFile from '@/assets/Beat The Chasers.mp3';

export default {
  data() {
    return {
      time1: 60000,
      time2: 60000,
      chaserMinutes: 0,
      chaserSeconds: 50,
      currentPlayer: 'player',
      intervalId: null,
      isGamePaused: true,
      hasGameStarted: false,
      introAudio: new Audio(introAudioFile),
      finishAudio: new Audio(finishAudioFile),
      audioPaused: true,
      finishAudioPaused: true,
      showTimeSettings: true,
    };
  },

  mounted() {
    this.updateDisplay();
    this.onTimeInput();
    this.introAudio.addEventListener("ended", (event) => {
      this.hasGameStarted = true;
      this.isGamePaused = false;
      this.startTimer();
    });
    this.introAudio.addEventListener('play', () => {
      this.audioPaused = false;
    });
    this.introAudio.addEventListener('pause', () => {
      this.audioPaused = true;
    });
    this.finishAudio.addEventListener('play', () => {
      this.finishAudioPaused = false;
    });
    this.finishAudio.addEventListener('pause', () => {
      this.finishAudioPaused = true;
    });
  },

  methods: {
    playPause() {
      if (!this.hasGameStarted) {
        this.showTimeSettings = false;
        this.introAudio.play();
      } else {
        this.isGamePaused = !this.isGamePaused;
        if (this.isGamePaused) {
          this.stopTimer();
        } else {
          this.startTimer();
        }
      }
    },

    swap() {
      this.currentPlayer = (this.currentPlayer === 'player') ? 'chaser' : 'player';
      this.updateDisplay();
    },

    finish(player) {
      this.finishAudio.play();
      player === 'player' ? this.time1 = 0 : this.time2 = 0;
      this.stopTimer();
      this.updateDisplay();
      this.flash(player);
    },

    flash(player) {
      if (player === 'player') {
        this.$refs.display1.classList.add('blink');
      } else {
        this.$refs.display2.classList.add('blink');
      }
    },

    startTimer() {
      this.intervalId = setInterval(() => {
        if (this.currentPlayer === 'player') {
          this.time1 -= 100;
          if (this.time1 <= 0) {
            this.finish(this.currentPlayer)
          }
        } else {
          this.time2 -= 100;
          if (this.time2 <= 0) {
            this.finish(this.currentPlayer);
          }
        }
        this.updateDisplay();
      }, 100);
    },

    stopTimer() {
      clearInterval(this.intervalId);
    },

    updateDisplay() {
      this.$refs.display1.classList.toggle('active-player', this.currentPlayer === 'player');
      this.$refs.playerTime.innerText = `${this.formattedTime1}`;
      this.$refs.display2.classList.toggle('active-player', this.currentPlayer === 'chaser');
      this.$refs.chaserTime.innerText = `${this.formattedTime2}`;
    },

    onTimeInput() {
      this.time2 = (this.chaserMinutes * 60 + this.chaserSeconds) * 1000;
      this.updateDisplay();
    }
  },

  computed: {
    formattedTime1() {
      const minutes = Math.floor(this.time1 / 60000);
      const seconds = Math.floor((this.time1 % 60000) / 1000);
      const milliseconds = this.time1 % 1000;
      const tenths = Math.floor(milliseconds / 100);
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${tenths.toString().padStart(1, '0')}`;
    },
  
    formattedTime2() {
      const minutes = Math.floor(this.time2 / 60000);
      const seconds = Math.floor((this.time2 % 60000) / 1000);
      const milliseconds = this.time2 % 1000;
      const tenths = Math.floor(milliseconds / 100);
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${tenths.toString().padStart(1, '0')}`;
    },

    buttonText() {
      let text;
      if (this.hasGameStarted) {
        text = this.isGamePaused ? 'Resume' : 'Pause';
      } else {
        text = this.audioPaused ? 'Start' : 'Starting...';
      }
      return text;
    },
  }
};
</script>

<style>
.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px; /* Add this line */
}

.button-container button {
  margin-bottom: 10px;
}

.container {
  background-image: url('./assets/beat_the_chasers.jpg');
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.time-display {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  background-color: rgba(255, 255, 255, 0.5); /* Add this line */
  backdrop-filter: blur(5px);
  border-radius: 20px;
  padding: 18px;
  background-color: rgba(255, 255, 255, 0.5);
  padding-left: 30px;
  padding-right: 30px;
  color: white;
  text-align: center;
  font-family: sans-serif;
}

.active-player {
  font-weight: bold;
  color: black;
}

.time-container {
  top: 200px;
  position: fixed;
}

.blink .time {
  animation: blink-animation 1s step-start infinite;
  -webkit-animation: blink-animation 1s step-start infinite;
}
@keyframes blink-animation {
  50% {
    color: transparent;
  }
}
@-webkit-keyframes blink-animation {
  50% {
    color: transparent;
  }
}
/* Blue 2c1f66 */
/* Red ba0a0a */
</style>
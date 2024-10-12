<template>
  <div>
    <div class="container">
      <div class="button-container">
        <div class="button-group left">
          <button @click="swap()">
            Swap player
          </button>
          <button @click="playPause()">
            {{ buttonText }}
          </button>
        </div>
        <div class="button-group right">
          <button @click="swap()">
            Swap player
          </button>
          <button @click="playPause()">
            {{ buttonText }}
          </button>
        </div>
      </div>
      <div class="time-container">
        <div ref="display1" class="time-display top">Player: <span ref="playerTime" class="time"></span></div>
        <div ref="display2" class="time-display bottom">Chaser: <span ref="chaserTime" class="time"></span></div>
      </div>
    </div>
    <div v-if="showTimeSettings" class="modal">
      <div class="time-settings">
        <label class="modal-heading">Chaser starting time</label>
        <label for="chaserMinutes">Minutes</label>
        <input id="chaserMinutes" v-model="chaserMinutes" type="number" max="60" min="0" placeholder="Minutes" @input="onTimeInput()" />
        <label for="chaserSeconds">Seconds</label>
        <input id="chaserSeconds" v-model="chaserSeconds" type="number" max="59" min="1" placeholder="Seconds" @input="onTimeInput()" />
        <button @click="showTimeSettings = false">Done</button>
      </div>
    </div>
    <div v-if="showTimeSettings" class="modal-backdrop"></div>
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
button {
  backdrop-filter: blur(5px);
  background-color: rgba(253 238 250 / 50%);
  border: 2.5px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  box-shadow: 0 0 80px rgba(0, 0, 0, 0.3);
  color: white;
  cursor: pointer;
  font-family: sans-serif;
  font-size: 24px;
  font-weight: bold;
  height: 50%;
  padding-bottom: 15px;
  padding-left: 27px;
  padding-right: 27px;
  padding-top: 15px;
  text-align: center;
}

.modal {
  backdrop-filter: blur(5px);
  background-color: rgba(255 141 141 / 50%);
  border: 2.5px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  box-shadow: 0 0 80px rgba(0, 0, 0, 0.3);
  color: white;
  font-family: sans-serif;
  height: 415px;
  left: calc(50% - 250px);
  position: absolute;
  top: calc(50% - 207.5px);
  width: 500px;
  z-index: 5;
}

.button-container {
  align-items: center;
  display: flex;
  justify-content: space-between;
  height: 100%;
  margin-bottom: 50px;
  margin-top: 50px;
  width: 100%;
}

.button-container button:first-child {
  margin-bottom: 10px;
}

.container {
  align-items: center;
  background-image: url('./assets/beat_the_chasers.jpg');
  background-position: center;
  background-size: cover;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.time-display {
  align-content: center;
  backdrop-filter: blur(5px);
  background-color: rgba(253 238 250 / 50%);
  border-radius: 20px;
  color: #5a0912;
  display: flex;
  flex-direction: column;
  font-family: sans-serif;
  font-size: 28px;
  font-weight: bold;
  height: 85px;
  justify-content: center;
  line-height: 43px;
  margin-bottom: 20px;
  margin-left: auto;
  margin-right: auto;
  max-width: 50%;
  padding: 18px;
  padding-left: 30px;
  padding-right: 30px;
  text-align: center;
  transition: color 0.5s;
  width: 100%;
}

.active-player {
  border: 4px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-weight: bold;
  padding-bottom: 14px;
  padding-left: 26px;
  padding-right: 26px;
  padding-top: 14px;
}

.time-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  position: fixed;
  width: 400px;
}

.button-group {
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.button-group button {
  width: 100%;
}

.left {
  margin-left: 40px;
}

.right {
  margin-right: 40px;
}

.top {
  margin-top: 50px;
}

.bottom {
  margin-bottom: 50px;
}

.time-settings {
  display: flex;
  flex-direction: column;
  font-size: 30px;
  font-weight: 600;
  padding: 20px;
  text-align: center;
}

.time-settings input {
  backdrop-filter: blur(5px);
  background-color: rgba(253 238 250 / 50%);
  border: 2.5px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  box-shadow: 0 0 80px rgba(0, 0, 0, 0.3);
  color: white;
  font-family: sans-serif;
  font-size: 20px;
  font-weight: 700;
  height: 30px;
  margin: 20px;
  margin-left: auto;
  margin-right: auto;
  outline: none;
  padding: 5px;
  text-align: center;
  width: 40px;
}

.modal-backdrop {
  backdrop-filter: blur(10px);
  background-color: rgba(255 141 141 / 50%);
  height: 100vh;
  position: absolute;
  top: 0;
  width: 100%;
}

.time-settings input[type=number]::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.modal-heading {
  margin-bottom: 30px;
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
</style>
<template>
  <div class="container">
    <div class="button-container">
      <button @click="onClick('swap')">
        Swap player
      </button>
      <button @click="onClick('pause')">
        {{ hasGameStarted ? (isGamePaused ? 'Resume' : 'Pause') : 'Start' }}
      </button>
    </div>
    <div ref="display1" class="time-display"></div>
    <div ref="display2" class="time-display"></div>
  </div>
</template>

<script>
import beatTheChasersAudio from '@/assets/Intro.wav';

export default {
  data() {
    return {
      time1: 60000,
      time2: 45000,
      tenths1: 0,
      tenths2: 0,
      currentPlayer: 'player',
      intervalId: null,
      isGamePaused: true,
      hasGameStarted: false,
      introAudio: new Audio(beatTheChasersAudio),
    };
  },

  mounted() {
    this.updateDisplay();
  },

  methods: {
    onClick(clicker) {
      if (clicker === 'pause') {
        if (!this.hasGameStarted) {
          this.introAudio.addEventListener("ended", (event) => {
            this.hasGameStarted = true;
            this.isGamePaused = false;
            this.startTimer();
          });
          this.introAudio.play();
        } else {
          this.isGamePaused = !this.isGamePaused;
          if (this.isGamePaused) {
            this.stopTimer();
          } else {
            this.startTimer();
          }
        }
      } else if (clicker === 'swap') {
        this.currentPlayer = (this.currentPlayer === 'player') ? 'chaser' : 'player';
        this.updateDisplay(); // Add this line
      }
    },

    startTimer() {
      this.intervalId = setInterval(() => {
        if (this.currentPlayer === 'player') {
          this.time1 -= 100;
          if (this.time1 <= 0) {
            this.time1 = 0;
            this.stopTimer();
            alert('Player ran out of time!');
          }
        } else {
          this.time2 -= 100;
          if (this.time2 <= 0) {
            this.time2 = 0;
            this.stopTimer();
            alert('Chaser ran out of time!');
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
      this.$refs.display1.innerText = `Player: ${this.formattedTime1}`;
      this.$refs.display2.classList.toggle('active-player', this.currentPlayer === 'chaser');
      this.$refs.display2.innerText = `Chaser: ${this.formattedTime2}`;
    },
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
  }
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
  padding: 10px; /* Add some padding to make the background visible */
}

.active-player {
  font-weight: bold;
  color: red;
}
</style>
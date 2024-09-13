import { createApp } from './petite-vue.es.js';

const API_URL = 'https://parroty.seanockert.workers.dev/api';
const CACHED_TIME = 1000 * 60 * 10; // 10 minutes
const $parrot = document.getElementById('parrot');
const storageKey = 'parroty_';
let blinkInterval;
let moveEyeInterval;
let isAnimating = false;

const supportedLanguages = [
  { code: 'af', name: 'Afrikaans' },
  { code: 'ar', name: 'Arabic' },
  { code: 'bg', name: 'Bulgarian' },
  { code: 'bn', name: 'Bengali' },
  { code: 'ca', name: 'Catalan' },
  { code: 'cs', name: 'Czech' },
  { code: 'da', name: 'Danish' },
  { code: 'de', name: 'German' },
  { code: 'el', name: 'Greek' },
  { code: 'es', name: 'Spanish' },
  { code: 'et', name: 'Estonian' },
  { code: 'fi', name: 'Finnish' },
  { code: 'fr', name: 'French' },
  { code: 'he', name: 'Hebrew' },
  { code: 'hi', name: 'Hindi' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'id', name: 'Indonesian' },
  { code: 'it', name: 'Italian' },
  { code: 'jp', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'lt', name: 'Lithuanian' },
  { code: 'lv', name: 'Latvian' },
  { code: 'ms', name: 'Malay' },
  { code: 'nl', name: 'Dutch' },
  { code: 'no', name: 'Norwegian' },
  { code: 'pl', name: 'Polish' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ro', name: 'Romanian' },
  { code: 'ru', name: 'Russian' },
  { code: 'sk', name: 'Slovak' },
  { code: 'sl', name: 'Slovene' },
  { code: 'sv', name: 'Swedish' },
  { code: 'ta', name: 'Tamil' },
  { code: 'th', name: 'Thai' },
  { code: 'tr', name: 'Turkish' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'zh', name: 'Chinese Mandarin' },
];

// Animate the parrot
const animateParrot = () => {
  const animate = (className, durationRange, intervalRange) => {
    const duration = Math.floor(Math.random() * durationRange[1]) + durationRange[0];
    const interval = Math.floor(Math.random() * intervalRange[1]) + intervalRange[0];

    $parrot.classList.add(className);
    setTimeout(() => $parrot.classList.remove(className), duration);

    return setInterval(() => {
      if (isAnimating) {
        $parrot.classList.add(className);
        setTimeout(() => $parrot.classList.remove(className), duration);
      }
    }, interval);
  };

  isAnimating = true;
  blinkInterval = animate('blink', [100, 400], [4000, 2000]);
  moveEyeInterval = animate('move-eye', [1000, 1000], [10000, 25000]);
};

// Drag and drop list items
const list = document.querySelector('.drag-list');

// Main app
function Parroty() {
  const storage = {
    load: async (key, category = '') => {
      const response = await localforage.getItem(`${storageKey}_${key}_${category}`);
      if (response) {
        const { timestamp, data } = JSON.parse(response);
        if (timestamp > Date.now() - CACHED_TIME || key === 'user') {
          return data;
        }
      }
      return null;
    },
    save: (key, category, data) => {
      const storedData = { timestamp: Date.now(), data };
      localforage
        .setItem(`${storageKey}_${key}_${category}`, JSON.stringify(storedData))
        .catch((error) => console.error('Error saving data:', error));
    },
    delete: (key, category = '') => {
      localforage
        .removeItem(`${storageKey}_${key}_${category}`)
        .catch((error) => console.error('Error deleting data:', error));
    },
  };

  const api = {
    get: async (endpoint, params = '') => {
      const response = await fetch(`${API_URL}/${endpoint}/${params}`);

      if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
      return response.json();
    },
    post: async (endpoint, data) => {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error(`Failed to post ${endpoint}`);
      return response.json();
    },
    put: async (endpoint, data) => {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error(`Failed to update ${endpoint}`);
      return response.json();
    },
    delete: async (endpoint) => {
      const response = await fetch(`${API_URL}/${endpoint}`, { method: 'DELETE' });

      if (!response.ok) throw new Error(`Failed to delete ${endpoint}`);
    },
  };

  return {
    activeCategory: null,
    audio: null,
    audioActiveId: null,
    audioBuffers: null,
    audioContext: null,
    audioProgress: 0,
    audioSource: null,
    audioStatus: 'pause',
    categories: [],
    defaultLanguage: 'en',
    draggedItem: null,
    isLoading: false,
    isTranslating: null,
    languages: supportedLanguages,
    onboardingLanguages: ['es', 'fr', 'de', 'th', 'id', 'jp'],
    onboarding: {
      email: '',
      language: 'es',
      name: '',
    },
    phrase: '',
    phrases: [],
    user: null,

    async mounted() {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.audioBuffers = {};
      this.login();
      animateParrot();

      // Add drag and drop event listeners
      // list.addEventListener('dragstart', this.dragStart, false);
      // list.addEventListener('dragend', this.dragEnd, false);
      // list.addEventListener('dragover', this.dragOver, false);
      // list.addEventListener('dragenter', this.dragEnter, false);
    },

    async loadData(key, category = '', fetchFunction) {
      const localData = await storage.load(key, category);

      if (localData) {
        this[key] = localData;
        return;
      }

      try {
        this.isLoading = true;
        const data = await fetchFunction();

        this[key] = data;
        storage.save(key, category, data);
      } catch (err) {
        console.error(`Error loading ${key}:`, err);
      } finally {
        this.isLoading = false;
      }
    },

    async login() {
      await this.loadData('user', '', () => {
        if (this.onboarding.email) {
          return api.get('user', this.onboarding.email);
        }
      });

      if (this.user?.isNew) {
        document.getElementById('name').focus();
      }

      if (this.user?.id && !this.user?.isNew) {
        await this.loadData('categories', '', () => api.get('categories', this.user.id));
        this.activeCategory = this.categories[0] || {
          id: null,
          language_from: this.defaultLanguage,
          language_to: 'es',
        };
        this.loadPhrases(this.activeCategory.id);
      }
    },

    async signup() {
      if (this.user?.id && this.user?.isNew && this.onboarding.name.length > 1) {
        const newUser = await api.put(`user/${this.user.id}`, { name: this.onboarding.name });

        this.user = newUser;
        await storage.save('user', '', this.user);

        await this.addCategory(this.defaultLanguage, this.onboarding.language);
        this.activeCategory = this.categories[0];

        this.phrase = `Hello ${this.onboarding.name}!`;
        this.addPhrase();
      }
    },

    async loadPhrases(categoryId) {
      this.activeCategory = this.categories.find((c) => c.id === categoryId);
      await this.loadData('phrases', categoryId, () => api.get('phrases', `${this.user.id}/${categoryId}`));

      for (const phrase of this.phrases) {
        if (phrase.audio_url) {
          await this.loadAudio(phrase.id, phrase.audio_url);
        }
      }

      document.getElementById('add-phrase').focus();
    },

    async addCategory(languageFrom, languageTo) {
      try {
        const newCategory = await api.post('categories', { languageFrom, languageTo });

        this.categories.push(newCategory);
        storage.save('categories', '', this.categories);
      } catch (err) {
        console.error('Error adding category:', err);
      }
    },

    async deleteByCategory(categoryId) {
      try {
        const response = await api.delete(`phrasesByCategory/${categoryId}`);
        console.log('response', response);
        this.categories = this.categories.filter((c) => c.id !== categoryId);
        this.phrases = this.phrases.filter((c) => c.categoryId !== categoryId);
        storage.delete('categories', '', this.categories);
        storage.delete('phrases', categoryId);
      } catch (err) {
        console.error('Error deleting phrases in category:', err);
      }
    },

    async addPhrase() {
      try {
        this.isTranslating = 1;
        this.toggleParrotTalk();

        const newPhrase = await api.post('phrases', {
          languageFrom: this.activeCategory.language_from,
          languageTo: this.activeCategory.language_to,
          phrase: this.phrase,
          userId: this.user.id,
        });

        this.phrases.unshift(newPhrase);
        storage.save('phrases', this.activeCategory.id, this.phrases);
        this.phrase = '';
        this.loadAudio(newPhrase.id, newPhrase.audio_url);
      } catch (err) {
        console.error('Error translating:', err);
      } finally {
        this.isTranslating = null;
        this.toggleParrotTalk(false);
      }
    },

    async updatePhrase(id, phrase) {
      const item = this.phrases.find((p) => p.id === id);
      if (!item || item.phrase === phrase) {
        return;
      }

      if (phrase.trim() === '') {
        this.deletePhrase(id);
      }

      try {
        this.isTranslating = id;
        this.toggleParrotTalk();

        const updatedPhrase = await api.put(`phrases/${id}`, {
          phrase,
          languageFrom: item.language_from,
          languageTo: item.language_to,
        });

        this.phrases = this.phrases.map((p) => (p.id === id ? updatedPhrase : p));
        storage.save('phrases', this.activeCategory.id, this.phrases);
      } catch (err) {
        console.error('Error updating phrase:', err);
      } finally {
        this.isTranslating = null;
        this.toggleParrotTalk(false);
      }
    },

    async sortPhrase(id, sort) {
      try {
        const updatedPhrase = await api.put(`phrases/sort/${id}`, { sort });

        this.phrases = this.phrases.map((p) => (p.id === id ? updatedPhrase : p));
        storage.save('phrases', this.activeCategory.id, this.phrases);
      } catch (err) {
        console.error('Error sorting phrase:', err);
      }
    },

    async deletePhrase(id) {
      //if (confirm('Delete this phrase?')) {
      try {
        await api.delete(`phrases/${id}`);
        this.phrases = this.phrases.filter((p) => p.id !== id);
        storage.save('phrases', this.activeCategory.id, this.phrases);
      } catch (err) {
        console.error('Error deleting phrase:', err);
      }
      //}
    },

    logout() {
      localforage.clear().then(() => {
        this.categories = null;
        this.phrases = null;
        this.user = null;
        this.onboarding.email = '';
        this.onboarding.name = '';
      });

      document.getElementById('email').focus();
    },

    async loadAudio(id, audioUrl) {
      if (this.audioBuffers[id]) {
        return;
      }

      try {
        const response = await fetch(audioUrl);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.audioBuffers[id] = audioBuffer;
      } catch (error) {
        console.error('Error loading audio:', error);
      }
    },

    playAudio(id) {
      this.audioActiveId = id;

      if (!this.audioActiveId || !this.audioBuffers[this.audioActiveId]) {
        return;
      }

      if (this.currentSource) {
        this.currentSource.stop();
      }

      if (this.audioStatus === 'play') {
        this.pauseAudio();
        return;
      }

      const buffer = this.audioBuffers[this.audioActiveId];

      this.currentSource = this.audioContext.createBufferSource();
      this.currentSource.buffer = buffer;
      this.currentSource.connect(this.audioContext.destination);

      this.currentSource.onended = () => {
        this.audioStatus = 'pause';
        this.toggleParrotTalk(false);
        setTimeout(() => (this.audioProgress = 0), 300);
      };

      const startTime = this.audioContext.currentTime;
      this.currentSource.start(0, this.audioProgress * buffer.duration);
      this.audioSource = this.currentSource;
      this.audioStatus = 'play';
      this.toggleParrotTalk();
      let animationFrameId;

      const updateProgress = () => {
        if (this.audioStatus === 'play') {
          const elapsedTime = this.audioContext.currentTime - startTime;
          this.audioProgress = Math.min(elapsedTime / buffer.duration, 1);

          if (this.audioProgress >= 1) {
            cancelAnimationFrame(animationFrameId);
          }
          animationFrameId = requestAnimationFrame(updateProgress);
        }
      };

      updateProgress();
    },

    pauseAudio() {
      if (this.audioSource) {
        this.audioSource.stop();
        this.audioSource = null;
      }

      this.audioStatus = 'pause';
      this.toggleParrotTalk(false);
    },

    toggleParrotAnimation(pause = true) {
      isAnimating = pause;
    },

    toggleParrotTalk(talk = true) {
      if (talk) {
        $parrot.classList.add('talk');
      } else {
        $parrot.classList.remove('talk');
      }
    },

    dragStart(e) {
      this.draggedItem = e.target;
      setTimeout(() => {
        e.target.classList.add('dragging');
      }, 0);
    },

    dragEnd(e) {
      e.target.classList.remove('dragging');
    },

    dragOver(e) {},
  };
}

createApp({ Parroty }).mount();

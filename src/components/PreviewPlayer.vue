<template>
    <div class="d-flex w-100 align-center justify-center h-100 pa-8 flex-column">
        <!--<p>text size, speed, edit content, edit title, edit text</p>-->

        <div v-if="showMultiple" style="min-height: 35vh"
            class="justify-center align-center pa-6 mt-16 w-100 d-flex flex-column no-wrap container-bg">
            <p class="word-slot mr-6 text-h3 text-sm-h1 bold" v-html="styledWordPrev" />
            <p class="word-slot text-h3 text-sm-h1 bold" v-html="styledWord" />
            <p class="word-slot ml-6 text-h3 text-sm-h1 bold" v-html="styledWordNext" />
        </div>
        <div v-else style="min-height: 35vh"
            class="justify-center align-center pa-6 mt-16 w-100 d-flex no-wrap container-bg">
            <p class="word-slot w-100 text-h3 text-sm-h1 bold" v-html="styledWord" />
        </div>

        <v-divider />

        <div class="mb-12 w-100 align-center d-flex flex-row justify-space-around mt-12">
            <div class="mr-1 d-flex align-center justify-center">
                <div class="d-flex align-center justify-center flex-row">
                    <v-btn size="40" icon variant="text" @click="toggleMultiple">
                        <v-icon size="40">{{ showMultiple ? 'mdi-comment-multiple' : 'mdi-comment-multiple-outline'
                        }}</v-icon>
                    </v-btn>
                </div>
            </div>
            <v-btn @click="paused = !paused" size="75" icon variant="plain">
                <v-icon size="75">{{ !paused ? 'mdi-pause' : 'mdi-play' }}</v-icon>
            </v-btn>
            <div class="mr-1 d-flex align-center justify-center">
                <div class="d-flex align-center justify-center flex-row">
                    <v-number-input :min="90" :max=1500 style="min-width: 200px" :hide-spin-buttons="true"
                        v-model="speed" :reverse="false" controlVariant="split" label="Speed" :hideInput="false"
                        :inset="false"></v-number-input>
                </div>
            </div>
        </div>

        <div class="d-flex w-100 flex-column">
            <v-slider :step="1" v-model="wordIndex" :max="words.length - 1" :min="0" class="align-center" hide-details>
            </v-slider>
            <div class="d-flex w-100 align-end flex-column justify-center">
                <p>{{ timePassed }} / {{ totalTime }}</p>
                <p style="color: rgb(var(--v-theme-playerText))">{{ wordIndex }} / {{ words.length }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { PREV_WORDS } from '@/assets/preview-words'

/* -------------------------------------------------------------------------- */
/*                                    REFS                                    */
/* -------------------------------------------------------------------------- */

const words = ref(PREV_WORDS)

const wordIndex = ref(0)
const currentWord = computed(() => words.value[wordIndex.value] ?? "")

const playerTitle = ref("If you have multiple interests, do not waste the next 2-3 years")

const speed = ref(400)

/* -------------------------------------------------------------------------- */
/*                                STYLED WORDS                                */
/* -------------------------------------------------------------------------- */

const styledWord = computed(() => {
    const word = currentWord.value
    if (!word) return ""

    const mid = Math.floor(word.length / 2)

    return (
        word.slice(0, mid) +
        `<span class="bold" style="color: rgb(var(--v-theme-playerEmphasis))">${word[mid]}</span>` +
        word.slice(mid + 1)
    )
})

const styledWordPrev = computed(() => {
    const word = words.value[wordIndex.value - 1] ?? ""
    if (!word) return ""

    const mid = Math.floor(word.length / 2)

    return (
        word.slice(0, mid) +
        `<span class="bold" style="color: rgb(var(--v-theme-playerEmphasis))">${word[mid]}</span>` +
        word.slice(mid + 1)
    )
})

const styledWordNext = computed(() => {
    const word = words.value[wordIndex.value + 1] ?? ""
    if (!word) return ""

    const mid = Math.floor(word.length / 2)

    return (
        word.slice(0, mid) +
        `<span class="bold" style="color: rgb(var(--v-theme-playerEmphasis))">${word[mid]}</span>` +
        word.slice(mid + 1)
    )
})

/* -------------------------------------------------------------------------- */
/*                                 PLAYER VARS                                */
/* -------------------------------------------------------------------------- */

const paused = ref(true)

const lastSwitchedWord = ref(null)
const wordInterval = computed(() => 60 / speed.value)

const timeRemaining = computed(() => formatTime(Math.floor((words.value.length - wordIndex.value) * wordInterval.value)))
const timePassed = computed(() => formatTime(Math.floor(wordIndex.value * wordInterval.value)))
const totalTime = computed(() => formatTime(Math.floor(words.value.length * wordInterval.value)))

/* -------------------------------------------------------------------------- */
/*                                SHOW MULTIPLE                               */
/* -------------------------------------------------------------------------- */

const showMultiple = ref(false)

function toggleMultiple() {
    showMultiple.value = !showMultiple.value
    if (showMultiple.value) localStorage.setItem("show-multiple", 1)
    else localStorage.removeItem("show-multiple")
}

/* -------------------------------------------------------------------------- */
/*                          PLAYER WORD LOAD INTERVAL                         */
/* -------------------------------------------------------------------------- */

onMounted(() => {
    const interval = setInterval(() => {
        if (paused.value) return

        if (lastSwitchedWord.value === null) {
            lastSwitchedWord.value = getNow()
            return
        }

        if (getNow() - lastSwitchedWord.value > wordInterval.value) {
            if (wordIndex.value + 1 === words.value.length) {
                wordIndex.value = 0
                return
            }
            wordIndex.value++
            lastSwitchedWord.value = getNow()
            return
        }
    }, 10);
})


/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

function getNow() {
    return Date.now() / 1000
}

function formatTime(totalSeconds) {
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor((totalSeconds / 60) % 60);
    const hours = Math.floor(totalSeconds / 3600);

    const pad = n => String(n).padStart(2, "0");

    if (hours > 0) {
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }

    return `${pad(minutes)}:${pad(seconds)}`;
}
</script>

<style scoped>
.container-bg {
    background: rgb(var(--v-theme-playerBg));
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    border: 1px solid rgb(var(--v-theme-primary))
}

.no-wrap {
    flex-wrap: nowrap !important;
}

.word-slot {
    color: rgb(var(--v-theme-playerText));
    overflow: hidden;
    text-overflow: clip;
    white-space: nowrap;
    text-align: center;
}
</style>
<template>
    <div class="d-flex w-100 pa-8 flex-column">
        <div class="d-flex w-100 align-center justify-space-between">
            <div class="w-75 d-flex align-center justify-center flex-row">
                <p class="w-100 text-truncate text-h3">{{ player?.title }}</p>
            </div>
            <v-spacer />
            <div v-if="!isPreview" class="w-25 d-flex flex-row justify-end">
                <v-btn @click="showEdit = !showEdit" icon variant="text">
                    <v-icon size="25">mdi-pencil</v-icon>
                </v-btn>
                <v-btn @click="del" icon color="red" variant="text">
                    <v-icon size="25">mdi-delete</v-icon>
                </v-btn>
            </div>
        </div>

        <div @dblclick="toggleFullscreen" ref="playerEl" v-if="showMultiple" style="min-height: 35vh"
            class="justify-center align-center pa-6 mt-8 w-100 d-flex flex-column no-wrap container-bg">
            <p class="word-slot mr-6 text-h3 text-sm-h1 bold" v-html="styledWordPrev" />
            <p class="word-slot text-h3 text-sm-h1 bold" v-html="styledWord" />
            <p class="word-slot ml-6 text-h3 text-sm-h1 bold" v-html="styledWordNext" />
        </div>
        <div @dblclick="toggleFullscreen" ref="playerEl" v-else style="min-height: 35vh"
            class="justify-center align-center pa-6 mt-8 w-100 d-flex no-wrap container-bg">
            <p class="word-slot w-100 text-h3 text-sm-h1 bold" v-html="styledWord" />
        </div>

        <v-divider />

        <div class="w-12 align-center flex-wrap d-flex flex-row justify-space-around mt-12">
            <v-btn size="55" @click="toggleFullscreen" icon variant="text">
                <v-icon size="45">mdi-fullscreen</v-icon>
            </v-btn>
            <div class="mr-1 d-flex align-center justify-center">
                <div class="d-flex align-center justify-center flex-row">
                    <v-btn size="55" icon variant="text" @click="toggleMultiple">
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
                    <v-number-input @blur="updateSpeed" :min="90" :max=1500 style="min-width: 200px"
                        :hide-spin-buttons="true" v-model="speed" :reverse="false" controlVariant="split" label="Speed"
                        :hideInput="false" :inset="false"></v-number-input>
                </div>
            </div>
        </div>

        <div class="d-flex w-100 flex-column">
            <v-slider :step="1" v-model="wordIndex" :max="words.length - 1" :min="0" class="align-center" hide-details>
            </v-slider>
            <div class="d-flex w-100 align-end flex-column justify-center">
                <p>{{ timePassed }} / {{ totalTime }}</p>
                <p style="color: rgb(var(--v-theme-playerEmphasis))">{{ wordIndex }} / {{ words.length }}</p>
            </div>
        </div>
    </div>

    <EditPlayer :active="showEdit" @save="savePlayer" @cancel="cancelEdit" :player="playerToEdit" />
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router';
import router from '@/router';
import { getPlayerById, deletePlayer, updatePlayerSpeed, updatePlayerTitle, updatePlayer } from '@/db/handle';
import EditPlayer from '@/components/EditPlayer.vue';
import { PREV_WORDS } from '@/assets/preview-words';

/* -------------------------------------------------------------------------- */
/*                                    REFS                                    */
/* -------------------------------------------------------------------------- */

const props = defineProps({
    preview: {
        type: Boolean,
        default: false
    }
})

const isPreview = computed(() => props.preview)

const route = useRoute()

const isLoading = ref(true)

const pId = route.params.player_id
const player = ref({
    title: "...",
    words: [],
    speed: 150,
})

const words = computed(() => player.value?.words ?? [])

const wordIndex = ref(0)
const currentWord = computed(() => words.value[wordIndex.value] ?? "")

const playerTitle = ref("")
const titleInput = ref(null)

const speed = ref(null)

/* -------------------------------------------------------------------------- */
/*                                 FULLSCREEN                                 */
/* -------------------------------------------------------------------------- */

const playerEl = ref(null)
const toggleFullscreen = () => {
    if (!document.fullscreenElement && playerEl.value?.requestFullscreen) {
        playerEl.value.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
};

/* -------------------------------------------------------------------------- */
/*                                  KEYBINDS                                  */
/* -------------------------------------------------------------------------- */

onMounted(() => {
    document.addEventListener("keydown", (e) => {
        if (e.key === " ") {
            e.preventDefault()
            paused.value = !paused.value
        }

        if (e.key === "ArrowLeft") {
            wordIndex.value = wordIndex.value - 5 > -1 ? wordIndex.value - 5 : 0
        }

        if (e.key === "ArrowRight") {
            wordIndex.value = wordIndex.value + 5 < words.value.length ? wordIndex.value + 5 : words.value.length
        }
    })
})

/* -------------------------------------------------------------------------- */
/*                                   EDITING                                  */
/* -------------------------------------------------------------------------- */

const showEdit = ref(false)

function cancelEdit() {
    showEdit.value = false
}

async function savePlayer(v) {
    showEdit.value = false
    await updatePlayer(v)
    player.value = v
}

async function del() {
    const sure = window.confirm("Are you sure you want to delete this player? This can't be undone")
    if (!sure) return
    await deletePlayer(player.value.id)
    location.href = "/players"
}

const playerToEdit = computed(() => player.value)

/* -------------------------------------------------------------------------- */
/*                              LOAD PLAYER DATA                              */
/* -------------------------------------------------------------------------- */

onMounted(async () => {
    if (isPreview.value) {
        player.value = {
            id: "",
            title: "Title",
            words: PREV_WORDS,
            speed: 500
        }
        isLoading.value = false
        speed.value = 500
        playerTitle.value = "Player Title"
        return
    }

    if (!pId && !isPreview.value) router.push("/404")

    player.value = await getPlayerById(pId)

    if (!player) router.push("/494")

    isLoading.value = false
    speed.value = player.value.speed ?? 150
    playerTitle.value = player.value.title ?? "Player Title"
})

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
/*                            UPDATE TITLE & SPEED                            */
/* -------------------------------------------------------------------------- */

async function renamePlayer() {
    const p = playerTitle.value.trim()
    if (!p) {
        playerTitle.value = player.value.title
        return
    }
    if (p.length > 1000) {
        playerTitle.value = player.value.title
        return
    }

    titleInput.value.blur();

    player.value.title = playerTitle.value
    await updatePlayerTitle(playerTitle.value, pId)
}

async function updateSpeed() {
    const v = speed.value
    if (isNaN(v)) return
    if (v < 90 || v > 1500) return
    await updatePlayerSpeed(v, player.value.id)
}

/* -------------------------------------------------------------------------- */
/*                          PLAYER WORD LOAD INTERVAL                         */
/* -------------------------------------------------------------------------- */

onMounted(() => {
    const interval = setInterval(() => {
        if (paused.value) return

        if (lastSwitchedWord.value === null) {
            console.log("x")
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
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    border: 1px solid rgb(var(--v-theme-primary))
}

.emphasis-text {
    display: none !important
}

.no-wrap {
    flex-wrap: nowrap !important;
}

.word-slot {
    color: rgb(var(--v-theme-playerText));
    padding: 10px;
    overflow: hidden;
    text-overflow: clip;
    white-space: nowrap;
    text-align: center;
}
</style>
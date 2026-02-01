<template>
    <div class="d-flex w-100 h-100 flex-column justify-center pa-8">
        <v-skeleton-loader v-for="x in 5" v-if="isLoading" type="article"></v-skeleton-loader>

        <div v-if="players?.length" class="d-flex flex-column mt-6 mb-6 w-100">
            <p class="text-sm-h2 w-100 text-h4 text-primary text-center">Your Players</p>

            <div class="pr-8 pl-8 d-flex mt-6 w-100 align-center flex-row justify-center">
                <v-text-field variant="underlined" label="Search" v-model="search"></v-text-field>
                <v-icon class="ml-4">mdi-magnify</v-icon>
            </div>
        </div>

        <div v-if="!players?.length && !isLoading" class="d-flex w-100 h-100 flex-column align-center justify-center">
            <p class="text-sm-h2 w-100 text-h4 text-primary text-center">You don't have any players</p>
            <p class="w-100 text-h5 text-center pa-8">How about you try making one?</p>
            <v-btn size="x-large" to="/create" rounted="sm" color="primary" variant="flat">Create Player</v-btn>
        </div>

        <v-card @click="goToPlayer(v.id)" v-for="v in searchResults" variant="elevated"
            class="w-100 cursor-pointer mb-4 pa-4">
            <div class="w-100 d-flex justify-space-between flex-row align-center">
                <v-card-title class="w-75 text-truncate text-h5">{{ v.title }}</v-card-title>
                <div class="w-25 d-flex justify-end">
                    <v-btn class="mr-1" icon @click.stop="editPlayer(v)">
                        <v-icon size="25">mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn variant="text" color="error" icon @click.stop="del(v.id)">
                        <v-icon size="25">mdi-delete</v-icon>
                    </v-btn>
                </div>
            </div>
            <v-card-subtitle v-html="presentWords(v.words)" class="mt-6"></v-card-subtitle>

            <div class="mt-4 d-flex w-100 justify-end">
                <v-icon size="20" class="mr-1">mdi-calendar</v-icon>
                <p class="text-caption">{{ formatSeconds(v.created_at) }}</p>
            </div>
        </v-card>

        <EditPlayer :active="showEdit" @save="savePlayer" @cancel="cancelEdit" :player="playerToEdit" />
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { getPlayers, deletePlayer, updatePlayer } from '@/db/handle'
import EditPlayer from '@/components/EditPlayer.vue'
import router from '@/router'

const players = ref(null)
const isLoading = ref(true)

const playerToEdit = ref(null)
const showEdit = ref(false)

const search = ref(null)
const searchResults = computed(() =>
    players.value?.filter(containsSearch)?.length
        ?
        players.value.filter(containsSearch)
        :
        players.value
        ??
        []
)

function containsSearch(v) {
    const s = search.value?.trim().toLowerCase()
    const t = v.title.trim().toLowerCase()
    const w = v.words.join("").trim().toLowerCase()
    return t.includes(s) || w.includes(s)
}

onMounted(async () => {
    players.value = await getPlayers()
    isLoading.value = false
})

function presentWords(words) {
    if (words.words) words = words.words
    return words.join("///").replaceAll("///", " ")
}

function goToPlayer(id) {
    location.href = "/player/" + id
}

function editPlayer(v) {
    playerToEdit.value = v
    showEdit.value = true
}

function cancelEdit() {
    showEdit.value = false
}

async function savePlayer(v) {
    showEdit.value = false
    await updatePlayer(v)
    const i = players.value.findIndex(x => x.id === v.id)
    players.value[i] = v
}

async function del(id) {
    const sure = window.confirm("Are you sure you want to delete this player? This can't be undone")
    if (!sure) return

    await deletePlayer(id)
    const index = players.value.findIndex(v => v.id === id)
    players.value.splice(index, 1)
    return true
}

function formatSeconds(secondsSince1970) {
    const now = Math.floor(Date.now() / 1000);
    let diff = Math.max(0, now - secondsSince1970);

    const days = Math.floor(diff / 86400);
    diff %= 86400;

    const hours = Math.floor(diff / 3600);
    diff %= 3600;

    const minutes = Math.floor(diff / 60);
    const seconds = Math.floor(diff % 60);

    let res

    if (seconds)
        res = `${seconds} second${seconds !== 1 ? "s" : ""}`
    if (minutes) res = `${minutes} minute${minutes !== 1 ? "s" : ""}`
    if (hours) res = `${hours} hour${hours !== 1 ? "s" : ""}`
    if (days) res = `${days} day${days !== 1 ? "s" : ""}`

    return res + " ago";
}
</script>
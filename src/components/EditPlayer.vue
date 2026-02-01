<template>
    <v-dialog v-model="isActive" max-width="500">
        <v-card :title="`Edit ${player?.title ?? ''}`">
            <div class="pa-6 d-flex flex-column">
                <v-text-field label="Title" placeholder="Title" v-model="playerData.title"></v-text-field>
                <v-number-input :min="90" :max="1500" label="Speed" v-model="playerData.speed"
                    placeholder="Speed"></v-number-input>
                <v-textarea v-model="playerData.words"></v-textarea>
                <v-card-actions class="pa-0">
                    <span class="w-50">Words: <span class="bold">{{ wordCount }}</span></span>
                    <div class="w-50 d-flex flex-row">
                        <v-select label="Word Separator" :items="separators" v-model="playerData.wordSeparator"
                        :class="[playerData.wordSeparator === 'custom' ? 'w-25' : 'w-50']"></v-select>
                        <v-text-field class="pl-4 w-25" v-model="playerData.customSeparator" label="Custom Separator"
                        v-if="playerData.wordSeparator === 'custom'"></v-text-field>
                    </div>
                </v-card-actions>

                <v-alert class="mt-4" v-if="formError" type="error" :text="formError" />
            </div>

            <v-card-actions class="pa-4">
                <v-btn text="Cancel" @click="cancel"></v-btn>
                <v-spacer />
                <v-btn :disabled="formError?.length" text="Save" color="primary" @click="save"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps(["player", "active"])
const emit = defineEmits(["cancel", "save"])

const separators = ref([
    {
        title: "Space ( )",
        value: "space"
    },
    {
        title: "Comma (,)",
        value: "comma"
    },
    {
        title: "Slash (/)",
        value: "slash"
    },
    {
        title: "Custom (?)",
        value: "custom"
    },
])

const player = computed(() => props.player ?? null)
const playerData = ref({
    title: "",
    words: [],
    speed: 150,
    wordSeparator: "space",
    customSeparator: ";"
})

const sepVal = computed(() => {
    switch (playerData.value.wordSeparator) {
        case "space": return " ";
        case "comma": return ",";
        case "slash": return "/";
        case "custom": return playerData.value.customSeparator
    }
})
const separatedWords = computed(() => playerData.value.words.split?.(sepVal.value).map?.((v) => { return v.trim().length ? v.trim() : null }))
const wordCount = computed(() => separatedWords.value?.length ?? 0)

const isActive = computed(() => props.active ?? false)

const show = ref(false)

const formError = ref(null)

watch(player, (v) => {
    playerData.value = JSON.parse(JSON.stringify(v))
    playerData.value.wordSeparator = "space"
    playerData.value.customSeparator = ";"
    playerData.value.words = playerData.value.words.join("///").replaceAll("///", " ")
})

watch(isActive, (v) => {
    show.value = v
})

function setFormError(v) {
    const r = validateFormData(v)

    if (!r.ok) {
        formError.value = r.msg
        return
    }

    formError.value = null
}

watch(playerData, (v) => {
    setFormError(v)
}, { deep: true })

function validateFormData(v) {
    // TITLE
    const title = v.title
    if (!title || !title?.trim?.().length) return { ok: false, msg: "Title cannot be empty" }

    // WORDS
    const words = v.words
    if (!words || wordCount.value < 10) return { ok: false, msg: "Must have at least 10 words " }

    // SPEED
    const speed = v.speed
    if (!speed || isNaN(speed) || speed > 1500 || speed < 90) return { ok: false, msg: "Speed must be between 90 and 1500 words per minute" }

    return {
        ok: true,
        msg: null
    }
}

function save() {
    setFormError(playerData.value)

    if (formError.value) return

    const v = {
        id: playerData.value.id,
        title: playerData.value.title,
        words: separatedWords.value,
        speed: playerData.value.speed
    }

    emit("save", v)
}

function cancel() {
    emit("cancel")
}
</script>
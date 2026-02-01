<template>
    <div class="w-100 h-100 d-flex flex-column align-center justify-start fill-height">
        <v-card elevation="3" :rounded="false" class="w-100 pa-sm-4 pa-6">

            <v-form @submit.prevent="submit">
                <v-alert type="error" v-if="formError && formError?.length" :text="formError"></v-alert>

                <div class="d-flex w-100 flex-column pa-6 flex-sm-row">
                    <v-text-field class="w-sm-75 w-100 mr-4" label="Title" v-model="title"></v-text-field>
                    <v-number-input class="w-sm-25 w-100" label="Speed (wpm)" v-model="speed"></v-number-input>
                </div>

                <v-tabs fixed-tabs color="primary" v-model="format">
                    <v-tab value="file">File</v-tab>
                    <v-tab value="text">Text</v-tab>
                </v-tabs>

                <v-tabs-window direction="vertical" v-model="format">

                    <v-tabs-window-item value="file">
                        <v-file-input @change="validateForm" v-model="file" label="Upload a file (PDF, DOC, TXT...)"
                            variant="outlined" color="primary" class="mb-4 mt-6" />
                    </v-tabs-window-item>

                    <v-tabs-window-item value="text">
                        <v-textarea @input="validateForm" label="Paste your text here" variant="outlined" rows="6"
                            v-model="text" class="mb-6" />
                    </v-tabs-window-item>

                </v-tabs-window>

                <v-alert icon="mdi-lock" class="mb-3" variant="text" type="info"
                    text="Everything is processed and stored locally in your browser - nothing is ever uploaded."></v-alert>
                <v-btn :loading="isLoading" :disabled="!canSubmitForm" color="primary" size="large" block type="submit">
                    Create
                </v-btn>
            </v-form>
        </v-card>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { validateDocumentFile } from "@/helpers/validate";
import { extractWordsFromFile } from "@/helpers/read";
import { createPlayer } from "@/db/handle";

const title = ref("")
const speed = ref(350)
const file = ref(null);
const text = ref("");
const format = ref("file")
const isLoading = ref(false)

const formData = computed(() => {
    return [
        title.value,
        speed.value,
        text.value,
        file.value,
        format.value
    ]
})

const emit = defineEmits(['created'])

/* -------------------------------------------------------------------------- */
/*                             VALIDATE FORM                                  */
/* -------------------------------------------------------------------------- */

const formError = ref(true)
const canSubmitForm = computed(() => !formError.value && !isLoading.value)

watch(formData, (v) => {
    validateForm()
})

function validateForm() {
    if (format.value === "file") {
        const validExt = validateDocumentFile(file.value)
        if (!validExt.valid) {
            formError.value = "Invalid file type"
            return
        }

        formError.value = null
        return
    }

    if (format.value === "text") {
        if (!text.value.trim()) {
            formError.value = "Text can't be empty"
            return
        }

        if (text.value.trim().split(" ").length < 10) {
            formError.value = "Text must have at least 10 words"
            return
        }
    }

    if (!title.value || !title.value?.length) {
        formError.value = "Title can't be empty"
        return
    }

    if (!speed.value || isNaN(speed.value) || speed > 1500 || speed < 90) {
        formError.value = "Speed must be between 90 and 1500"
        return
    }

    formError.value = null
    return
}

/* -------------------------------------------------------------------------- */
/*                              CREATE WORDPLAYER                             */
/* -------------------------------------------------------------------------- */

async function submit() {
    isLoading.value = true

    let words;

    if (format.value === "text") {
        words = text.value
            .replace(/\s+/g, " ")
            .replace(/[^\p{L}\p{N}'-]+/gu, " ")
            .trim()
            .split(" ")
            .filter(Boolean)
    } else {
        words = await extractWordsFromFile(file.value)
        if (!words.words) {
            isLoading.value = false
            formError.value = words.reason
            return
        }
        words = words.words ?? []
    }

    if (words?.length < 10) {
        isLoading.value = false
        formError.value = "There must be at least 10 words"
        return
    }

    const data = {
        words: words,
        title: title.value,
        speed: speed.value
    }

    const player = await createPlayer(data)

    if (!player) {
        isLoading.value = false
        formError.value = "Unable to create player"
        return
    }

    emit('created', player.id)
}
</script>
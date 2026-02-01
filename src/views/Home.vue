<template>
    <!-- ================= MAIN ================= -->
    <div fluid class="hero-section section d-flex align-center justify-center position-relative">
        <div class="w-100 w-md-50 pa-6 text-center">

            <div class="d-flex w-100 flex-column justify-center align-center">
                <h1 class="text-h4 text-md-h2 font-weight-bold my-6">
                    Read text at lightning speed.
                </h1>
            </div>

            <div class="text-body-1 text-medium-emphasis mb-10">
                Pageless converts documents into focused word-by-word players so you can
                absorb information dramatically faster.
            </div>

            <div class="d-flex justify-center flex-wrap gap-4 mb-6">
                <v-chip class="ma-1">⚡ Up to 1500 WPM</v-chip>
                <v-chip class="ma-1">🔒 Local only</v-chip>
                <v-chip class="ma-1">🎯 Focus letter</v-chip>
                <v-chip class="ma-1">👤 No signup required</v-chip>
            </div>

            <v-card-actions class="d-flex ga-4 justify-center">
                <v-btn class="w-100" size="x-large" @click="scrollToPreview" variant="flat" rounded="lg">get
                    started</v-btn>
            </v-card-actions>
        </div>
    </div>

    <div id="preview" class="d-flex justify-center align-center section preview-section">
        <div class="w-100 h-100 d-flex flex-column">
            <div class="mb-0 w-100 mt-6 pa-6 d-flex w-100 align-center justify-center flex-column">
                <h1 class="text-h4 text-md-h2 text-center font-weight-bold my-2">
                    Check out how it works.
                </h1>
                <p class="text-h6 my-2 text-center">
                    Play, pause, adjust speed - the customisation is all yours
                </p>

                <v-btn class="mt-2" variant="elevated" @click="scrollToCreate">Create your own</v-btn>
            </div>
            <Player :preview="true" />
        </div>
    </div>

    <div id="create" class="d-flex justify-center align-center section create-section">
        <div class="w-100 pa-6 h-100 d-flex flex-column">
            <div class="mb-0 w-100 mt-4 pa-6 d-flex w-100 align-center justify-center flex-column">
                <h3 class="text-h3 text-center w-100 font-weight-medium mb-4">
                    Create Your First Player
                </h3>

                <p class="text-h6 text-center w-100">
                    No signup required
                </p>
            </div>
            <CreateForm @created="handleCreate" />
        </div>
    </div>
</template>

<script setup>
import CreateForm from "@/components/CreateForm.vue";
import Player from "./Player.vue";

const scrollToPreview = () => {
    const el = document.getElementById("preview")

    if (!el) return

    el.scrollIntoView({
        behavior: "smooth",
        block: "start"
    })
}

const scrollToCreate = () => {
    const el = document.getElementById("create")

    if (!el) return

    el.scrollIntoView({
        behavior: "smooth",
        block: "start"
    })
}

function handleCreate(id) {
    location.href = "/player/" + id
}
</script>

<style scoped>
html {
    scroll-snap-type: y mandatory;
}

.section {
    min-height: 100vh;
    scroll-snap-align: start;
}

.preview-section {
    border-top: 10px solid rgb(var(--v-theme-playerBg));
    border-bottom: 10px solid rgb(var(--v-theme-playerBg))
}

.hero-section {
    background: rgb(var(--v-theme-background))
}
</style>
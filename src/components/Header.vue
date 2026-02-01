<template><!-- ================= HEADER ================= -->
    <v-app-bar flat height="56" class="px-4" color="white">
        <!-- LOGO -->
        <div class="d-flex align-center flex-row">
            <v-btn @click="goHome" icon color="primary">
                <v-icon>mdi-video-vintage</v-icon>
            </v-btn>
        </div>

        <v-spacer />

        <ThemePicker />

        <!-- ICONS -->
        <v-btn to="/create" icon color="primary">
            <v-icon>mdi-plus-box</v-icon>
        </v-btn>

        <v-btn to="/players" variant="text" icon color="primary">
            <v-icon>mdi-history</v-icon>
        </v-btn>
    </v-app-bar>
</template>

<script setup>
import router from '@/router';
import ThemePicker from './ThemePicker.vue';

function goHome() {
    location.href = "/"
}
</script>
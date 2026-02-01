<template>
    <div class="d-flex h-100 w-100 pa-6 flex-column align-center">
        <div class="d-flex w-100 mt-8">
            <p class="text-sm-h2 w-100 text-h4 text-primary text-center">Create Player</p>
        </div>

        <div class="d-flex w-100 mt-sm-8 mb-sm-8 mb-4 mt-4">
        </div>

        <div class="d-flex w-100">
            <CreateForm @created="handleCreated" />
        </div>
    </div>
</template>

<script setup>
import CreateForm from '@/components/CreateForm.vue';

function handleCreated(id) {
    location.href = "/player/" + id
}
</script>
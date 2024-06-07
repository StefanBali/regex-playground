<template>
  <v-app>
    <v-main>
      <v-container class="fill-height">
        <v-layout class="align-center justify-center">
          <RouterView />
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
  import { RouterView } from "vue-router";
</script>

<template>
  <div>
    <v-card width="1000" class="ma-5 fill-height">
      <v-card-title>Aufgabenauswahl</v-card-title>

      <v-card-text>
        <v-textarea :readonly="selectedExercisesLocked" no-resize variant="outlined" v-model="selectedExercises"></v-textarea>
      </v-card-text>

      <v-card-actions class="flex-column">
        <v-btn border class="align-self-end" @click="start">Start</v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar :timeout="4000" color="success" location="top" v-model="showSnackbar" >
      Glückwunsch! Aufgaben erfolgreich abgeschlossen
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
  import { useRoute, useRouter } from "vue-router";
  import { onMounted } from "vue";

  let selectedExercises = defineModel<string>("selectedExercises");
  let selectedExercisesLocked = defineModel<boolean>("selectedExercisesLocked", {default: false});
  let showSnackbar = defineModel("showSnackbar", {default: false});

  const router = useRouter();
  const route = useRoute();

  onMounted(() => {
    if (route.query.selectedExerciseIds !== undefined) {
      selectedExercises.value = route.query.selectedExerciseIds as string;
      selectedExercisesLocked.value = true;
    }
    if (route.query.success === "true") {
      showSnackbar.value = true;
    }
  });

  function start() {
    if (selectedExercises.value === undefined || selectedExercises.value.trim() === "") {
      localStorage.removeItem("selectedExerciseIds");
    } else {
      localStorage.setItem("selectedExerciseIds", selectedExercises.value);
    }
    router.push({name: "exercise"});
  }
</script>

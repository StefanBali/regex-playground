<template>
  <ExerciseCard v-if="currentExercise"
                :exerciseDefinition="currentExercise"
                :previousCallback="previous"
                :nextCallback="next"/>
</template>

<script setup lang="ts">
  import exercises from "@/exercises/exercises.json";
  import { onMounted, watch } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import type { ExerciseDefinition } from "@/views/ExerciseDefinition";
  import ExerciseCard from "@/views/ExerciseCard.vue";

  const selectedExerciseIds = getSelectedExerciseIds();
  const router = useRouter();
  const route = useRoute();

  onMounted(() => {
    if (route.params.id === undefined) {
      const firstExerciseId = findFirstExerciseId();
      router.replace({name: "exercise", params: {id: firstExerciseId}});
    }

  });

  function findFirstExerciseId() {
    if (selectedExerciseIds.length === 0) {
      return 1;
    }
    return selectedExerciseIds[0];
  }

  function getSelectedExerciseIds() {
    const selectedExerciseIdsString = localStorage.getItem("selectedExerciseIds");
    if (selectedExerciseIdsString === null) {
      return [];
    }
    return JSON.parse(selectedExerciseIdsString) as number[];
  }

  let currentExercise: ExerciseDefinition | null = null;
  watch(() => route.params.id, newId => {
    const id = parseInt(newId as string);
    currentExercise = exercises[id - 1];
  }, { immediate: true });

  function previous() {
    const currentRouteId = parseInt(route.params.id as string);
    if (selectedExerciseIds.length === 0) {
      // console.log("selectedExerciseIds: " + selectedExerciseIds);
      if (currentRouteId <= 1) {
        // console.log("currentRouteId: " + currentRouteId);
        router.push({name: "home"});
      } else {
        // console.log("currentRouteId: " + currentRouteId);
        router.push({name: "exercise", params: {id: currentRouteId - 1}});
      }
    } else {
      const indexOfCurrentRouteId = selectedExerciseIds.indexOf(currentRouteId);
      if (indexOfCurrentRouteId <= 0) {
        router.push({name: "home"});
      } else {
        router.push({name: "exercise", params: {id: selectedExerciseIds[indexOfCurrentRouteId - 1]}});
      }
    }
  }

  function next() {
    const currentRouteId = parseInt(route.params.id as string);
    if (selectedExerciseIds.length === 0) {
      if (currentRouteId >= exercises.length) {
        router.push({name: "home", query: {success: "true"}});
      } else {
        router.push({name: "exercise", params: {id: currentRouteId + 1}});
      }
    } else {
      const indexOfCurrentRouteId = selectedExerciseIds.indexOf(currentRouteId);
      if (indexOfCurrentRouteId >= selectedExerciseIds.length - 1) {
        router.push({name: "home", query: {success: "true"}});
      } else {
        router.push({name: "exercise", params: {id: selectedExerciseIds[indexOfCurrentRouteId + 1]}});
      }
    }
  }

</script>

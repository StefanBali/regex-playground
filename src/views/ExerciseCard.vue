<template>
  <v-card width="1000" class="ma-5">
    <v-card-title>
      {{ exerciseDefinition.title }}
    </v-card-title>

    <v-card-subtitle opacity="1" class="subtitle">
      {{ exerciseDefinition.description }}
    </v-card-subtitle>

    <v-card-text>
      <div v-if="exerciseDefinition.type === 'match'">
        <v-text-field
            v-model="regex"
            :error="regexError"
            :base-color="solved ? 'success' : ''"
            :color="solved ? 'success' : ''"
            autofocus
            single-line
            hide-details
            flat
            density="compact"
            variant="outlined"
            label="Regex"/>
        <RegexMatchArea :regex="regex" :rows="exerciseDefinition.lines" :matchesChanged="matchesChanged"/>
      </div>
      <div v-else-if="exerciseDefinition.type === 'replace'">
        <v-text-field
            v-model="regex"
            :error="regexError"
            :base-color="solved ? 'success' : ''"
            :color="solved ? 'success' : ''"
            autofocus
            single-line
            hide-details
            flat
            density="compact"
            variant="outlined"
            label="Regex"/>
        <v-text-field
            v-model="replace"
            class="mt-2"
            single-line
            hide-details
            flat
            density="compact"
            variant="outlined"
            label="Replace"/>
        <RegexReplaceArea :regex="regex" :replace="replace" :rows="exerciseDefinition.lines" :replacedLinesChanged="replacedLinesChanged"/>
      </div>
    </v-card-text>

    <v-card-actions class="px-4 justify-space-between">
      <v-btn border @click="previous">Zurück</v-btn>
      <v-btn border :disabled="!solved" @click="next">Weiter</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
  import type { ExerciseDefinition } from "@/views/ExerciseDefinition";
  import RegexMatchArea from "@/views/RegexMatchArea.vue";
  import RegexReplaceArea from "@/views/RegexReplaceArea.vue";
  import { watch } from "vue";
  import { useRoute } from "vue-router";

  const props = defineProps<{
    exerciseDefinition: ExerciseDefinition,
    previousCallback: () => void,
    nextCallback: () => void,
  }>();

  const route = useRoute();
  const regex = defineModel<string>("regex", {default: ""});
  const replace = defineModel<string>("replace", {default: ""});
  const regexError = defineModel<boolean>("regexError", {default: false});
  const solved = defineModel<boolean>("solved", {default: false});

  watch(() => regex.value, newRegex => {
    try {
      new RegExp(newRegex);
      regexError.value = false;
    } catch (error) {
      regexError.value = true;
    }
  });

  watch(() => route.params.id, newId => {
    solved.value = false;
    regex.value = localStorage.getItem(`exercise-${newId}-regex`) ?? "";
    replace.value = localStorage.getItem(`exercise-${newId}-replace`) ?? "";
  }, {immediate: true});

  function matchesChanged(matchingRows: number[][]) {
    solved.value = JSON.stringify(matchingRows) === JSON.stringify(props.exerciseDefinition.indicesToMatch);
  }

  function replacedLinesChanged(replacedLines: string[]) {
    solved.value = JSON.stringify(replacedLines) === JSON.stringify(props.exerciseDefinition.expectedLines);
  }

  function previous() {
    const id = route.params.id as string;
    localStorage.setItem(`exercise-${id}-regex`, regex.value);
    localStorage.setItem(`exercise-${id}-replace`, replace.value);
    props.previousCallback();
  }

  function next() {
    const id = route.params.id as string;
    localStorage.setItem(`exercise-${id}-regex`, regex.value);
    localStorage.setItem(`exercise-${id}-replace`, replace.value);
    props.nextCallback();
  }
</script>

<style scoped>
  .subtitle {
    font-size: 16px;
    overflow: visible;
    text-wrap: wrap;
  }
</style>

<template>
  <div class="d-flex mx-2 mt-2">
    <div class="area flex-1-1">
      <div v-for="(rowHtml, index) in rowsHtml" :key="index" v-html="rowHtml"></div>
    </div>
    <div class="operations">
      <v-btn @click="reset" icon="icon" rounded="circle" variant="outlined" color="black" block density="compact">
        <v-icon>
          <svg viewBox="0 0 24 24"><path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"/></svg>
        </v-icon>
      </v-btn>
      <v-btn @click="doReplace" icon="icon" rounded="circle" variant="outlined" color="black" block density="compact" class="mt-2">
        <v-icon>
          <svg viewBox="0 0 24 24"><path d="M19,7V11H5.83L9.41,7.41L8,6L2,12L8,18L9.41,16.58L5.83,13H21V7H19Z"/></svg>
        </v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

  const props = defineProps<{
    regex: string,
    replace: string,
    rows: string[],
    replacedLinesChanged: (replacedLines: string[]) => void;
  }>();
  const modifiedRows = ref(props.rows);

  watch(() => props.rows, newRows => {
    modifiedRows.value = newRows;
  });

  const rowsHtml = computed(() => {
    let regExp;
    try {
      regExp = new RegExp(props.regex, "dg");
    } catch (error) {
      return modifiedRows;
    }
    return modifiedRows.value.map(row => {
      let matches = [...row.matchAll(regExp)];
      return buildHtml(row, matches);
    });
  });

  function buildHtml(rowString: string, matches: RegExpExecArray[]) {
    let htmlRow = "";
    let currentPosition = 0;
    matches.forEach((match) => {
      //@ts-ignore: ts lacks behind as always...
      const indices = match.indices[0];
      htmlRow += rowString.substring(currentPosition, indices[0]);
      if (indices[1] > indices[0]) {
        htmlRow += `<span class="match">${rowString.substring(indices[0], indices[1])}</span>`;
      }
      currentPosition = indices[1];
    });
    if (currentPosition <= rowString.length) {
      htmlRow += rowString.substring(currentPosition, rowString.length);
    }
    return htmlRow;
  }

  function reset() {
    modifiedRows.value = props.rows;
    props.replacedLinesChanged(modifiedRows.value);
  }

  function doReplace() {
    let regExp;
    try {
      regExp = new RegExp(props.regex, "dg");
    } catch (error) {
      return;
    }
    modifiedRows.value = modifiedRows.value.map(row => row.replace(regExp, props.replace));
    props.replacedLinesChanged(modifiedRows.value);
  }
</script>

<style scoped>
  .area {
    font-size: 16px;
  }

  .area > div {
    white-space: pre-wrap;
  }

  :deep(.match) {
    background-color: #d5ebff;
  }

  .operations {
    min-width: 24px;
  }
</style>

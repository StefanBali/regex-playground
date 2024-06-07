<template>
  <div class="area ml-2 mt-2">
    <div v-for="(rowHtml, index) in rowsHtml" :key="index" v-html="rowHtml"></div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";

  const props = defineProps<{
    regex: string,
    rows: string[],
    matchesChanged: (matchingRows: number[][]) => void;
  }>();

  const rowsHtml = computed(() => {
    let regExp;
    try {
      regExp = new RegExp(props.regex, "dg");
    } catch (error) {
      return props.rows;
    }
    const matchingRows: number[][] = [];
    const rowsHtml = props.rows.map((row) => {
      let matches = [...row.matchAll(regExp)];
      if (matches.length > 0) {
        //@ts-ignore: ts lacks behind as always...
        matchingRows.push(matches.map(match => match.indices[0]));
      } else {
        matchingRows.push([]);
      }
      return buildHtml(row, matches);
    });
    props.matchesChanged(matchingRows);
    return rowsHtml;
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
</style>

<script setup lang="ts">
  import Icon from '@/components/Icon/Icon.vue';
</script>

<template>
  <div class="flex flex-col">
    <div class="title flex justify-start items-start">
      1. Click
      <div class="flex inline-flex flex-col mx-2">
        <Icon icon="ant-design:caret-up-filled" :size="12" class="inline-block" />
        <Icon icon="ant-design:caret-down-filled" :size="12" class="inline-block" />
      </div>
      icon to sort and
      <Icon
        icon="ant-design:filter-filled"
        :size="15"
        class="inline-block flex items-center h-20px mx-2"
      />
      icon to filter data.
    </div>
    <div class="text-center">
      <img
        src="/assets/img/table-guide/sort.png"
        class="rounded-lg border-solid border border-light-500"
      />
    </div>

    <div class="title flex justify-start items-start">
      2. Focus the search bar and type to search.
    </div>
    <div class="text-center">
      <img
        src="/assets/img/table-guide/search-1.jpg"
        class="rounded-lg border-solid border border-light-500"
      />
      <img
        src="/assets/img/table-guide/search-2.jpg"
        class="rounded-lg border-solid border border-light-500"
      />
    </div>

    <div class="title flex justify-start items-start">
      3. <span class="font-bold mr-1">Hover</span> and click clear icon to reset.
    </div>
    <div class="text-center">
      <img
        src="/assets/img/table-guide/search-3.png"
        class="rounded-lg border-solid border border-light-500"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
  .title {
    @apply mb-2;
  }

  img {
    @apply mb-5;
  }
</style>

<script setup lang="ts"></script>

<template>
  <div>
    <div class="mb-2">
      When using the

      <router-link class="font-bold mx-1 text-blue-500" :to="{ name: 'Bookmarklet' }">
        Scraper Tool
      </router-link>

      to scrape reviews from Amazon, the system will add the Amazon source to the scheduler
      automatically.
    </div>

    <div class="flex flex-col">
      <div class="flex justify-center">
        <img
          src="/assets/img/bookmarklet/step-2.gif"
          class="rounded w-full max-w-400px border-solid border border-light-500"
        />
      </div>
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

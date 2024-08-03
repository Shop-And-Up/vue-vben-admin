<script setup lang="ts"></script>

<template>
  <div class="flex flex-col">
    <div class="mb-3 flex justify-center items-center">
      Using
      <router-link class="font-bold mx-1 text-blue-500" :to="{ name: 'Crawler' }">
        Amazon Bot
      </router-link>

      to scrape reviews from Amazon by scheduler automatically
    </div>
    <div class="text-center">
      <img
        src="/assets/img/crawler/list-page.png"
        class="rounded-lg border-solid border border-light-500"
      />
    </div>
  </div>
</template>

<style lang="less" scoped></style>

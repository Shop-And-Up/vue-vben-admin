<script lang="ts" setup>
  import { useUserStore } from '@/store/modules/user';

  const userStore = useUserStore();
</script>

<template>
  <div>
    Shopify Theme OS2.0 supports customizing all widgets via the Theme Customize function.

    <ul class="list-decimal list-inside">
      <li>
        <span class="link" @click="userStore.goToThemeEditor"> Go to Shopify Theme Editor </span>
        and select the page where you want to display the widget.

        <div class="flex justify-center mt-2">
          <img
            src="/assets/img/guide-embed/ge-1.png"
            class="rounded w-full max-w-500px border-solid border border-light-500"
          />
        </div>
      </li>

      <li>
        <span class="font-semibold">Add block</span> or
        <span class="font-semibold">Add section</span> to create new widget

        <div class="flex justify-center mt-2">
          <img
            src="/assets/img/guide-embed/ge-2.png"
            class="rounded w-full max-w-500px border-solid border border-light-500"
          />
        </div>
      </li>

      <li>
        Drag and drop to relocate the position.

        <div class="flex justify-center mt-2">
          <img
            src="/assets/img/guide-embed/ge-3.png"
            class="rounded w-full max-w-500px border-solid border border-light-500"
          />
        </div>
      </li>

      <li>
        Customize and click <span class="font-semibold">Save</span> to submit your changes.

        <div class="flex justify-center mt-2">
          <img
            src="/assets/img/guide-embed/ge-4.png"
            class="rounded w-full max-w-500px border-solid border border-light-500"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="less" scoped>
  ul {
    li {
      @apply mt-7;

      span.link {
        @apply text-blue-600 cursor-pointer;
      }
    }
  }
</style>

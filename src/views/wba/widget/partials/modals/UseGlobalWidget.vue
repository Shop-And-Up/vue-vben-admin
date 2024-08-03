<script lang="ts" setup>
  import { useUserStore } from '@/store/modules/user';

  defineProps({
    widgetType: { type: String, default: 'wba-apps' },
  });

  const userStore = useUserStore();
</script>

<template>
  <div>
    Shopify Theme OS2.0 supports customizing all widgets via the Theme Customize function.

    <ul class="list-decimal list-inside">
      <li>
        <span class="link" @click="userStore.goToThemeEditor(widgetType)">
          Go to Shopify Theme Editor
        </span>
        and click <span class="font-semibold">App Embeds</span>.

        <div class="flex justify-center mt-2">
          <img
            src="/assets/img/guide-embed/shopify-theme-app-embeds.png"
            class="rounded w-full max-w-250px border-solid border border-light-500"
          />
        </div>
      </li>

      <li>
        Select the widget and customize the settings. If you want to
        <span class="font-semibold"> disable (hide) the widget </span>, please
        <span class="font-semibold"> switch it off </span> to change.

        <div class="flex justify-center mt-2">
          <img
            src="/assets/img/guide-embed/shopify-theme-app-embeds-adjust.png"
            class="rounded w-full max-w-250px border-solid border border-light-500"
          />
        </div>
      </li>

      <li>
        Click to the widget in order to adjust the setting and click
        <span class="font-semibold">Save</span> to apply your changes.

        <div class="flex justify-center mt-2">
          <img
            src="/assets/img/guide-embed/shopify-theme-app-embeds-save.png"
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

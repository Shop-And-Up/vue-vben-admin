<script lang="ts" setup>
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useUserStore } from '@/store/modules/user';

  const userStore = useUserStore();

  const [register, { redoModalHeight }] = useModalInner(() => {
    redoModalHeight();

    setTimeout(() => {
      redoModalHeight();
    }, 1000);
  });
</script>

<template>
  <BasicModal
    :canFullscreen="false"
    :draggable="false"
    :footer="null"
    v-bind="$attrs"
    title="Embed widgets to any pages"
    @register="register"
    width="700px"
  >
    <div class="px-5">
      There are some special pages, sections or blocks that we
      <span class="font-semibold"> can not add app blocks </span>, such as the
      <span class="font-semibold"> Featured Product Block </span>. In this case, we should use
      <span class="font-semibold"> Embed Code </span> to add the widget manually.

      <div class="flex justify-center mt-2">
        <img
          src="/assets/img/guide-embed/sample-rating-widget.png"
          class="rounded w-full max-w-500px border-solid border border-light-500"
        />
      </div>

      <ul class="list-decimal list-inside mt-5">
        <li>
          After creating widget, please copy widget embed script.

          <div class="flex justify-center mt-2">
            <img
              src="/assets/img/guide-embed/create-widget-embedded-code.png"
              class="rounded w-full border-solid border border-light-500"
            />
          </div>
        </li>
        <li>
          <span class="link" @click="userStore.goToThemeCodeEditor">
            Go to Shopify Code Editor
          </span>
          and select the place where you want to display the widget.

          <div class="flex justify-center mt-2">
            <img
              src="/assets/img/guide-embed/gd-1.png"
              class="rounded w-full max-w-500px border-solid border border-light-500"
            />
          </div>
        </li>
        <li>
          Paste your embed code.

          <div class="flex justify-center mt-2">
            <img
              src="/assets/img/guide-embed/gd-2.png"
              class="rounded w-full max-w-500px border-solid border border-light-500"
            />
          </div>
        </li>
        <li>
          Save and review your widget from
          <span class="link" @click="userStore.goToStore"> your store </span> .

          <div class="flex justify-center mt-2">
            <img
              src="/assets/img/guide-embed/gd-3.png"
              class="rounded w-full max-w-500px border-solid border border-light-500"
            />
          </div>
        </li>
      </ul>
    </div>
  </BasicModal>
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

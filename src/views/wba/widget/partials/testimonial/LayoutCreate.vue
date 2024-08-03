<script lang="ts" setup>
  import FormPlacement from '@/views/wba/widget/partials/FormPlacement.vue';
  import FormName from '@/views/wba/widget/partials/FormName.vue';
  import LayoutSetting from '@/views/wba/widget/partials/testimonial/LayoutSetting.vue';

  import { useUserStore } from '@/store/modules/user';
  import { useManageWidgetStore } from '@/views/wba/widget/useManageWidgetStore';

  const userStore = useUserStore();
  const mngWgStore = useManageWidgetStore();
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <FormPlacement v-if="userStore.isThemeV2" class="col-span-2" />
    <FormName v-show="!mngWgStore.hideSaveBtn" class="col-span-2" />

    <LayoutSetting v-show="!mngWgStore.hideSaveBtn" />
  </div>
</template>

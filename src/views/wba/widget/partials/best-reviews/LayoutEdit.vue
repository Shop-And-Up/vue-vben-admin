<script lang="ts" setup>
  import FormQuota from '@/views/wba/widget/partials/FormQuota.vue';
  import LayoutSetting from '@/views/wba/widget/partials/best-reviews/LayoutSetting.vue';
  import FormName from '@/views/wba/widget/partials/FormName.vue';
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <FormQuota class="col-span-2" />
    <FormName class="col-span-2" />
    <LayoutSetting />
  </div>
</template>

<script lang="ts" setup>
  import FormQuota from '@/views/wba/widget/partials/FormQuota.vue';
  import FormName from '@/views/wba/widget/partials/FormName.vue';
  import FormProduct from '@/views/wba/components/FormProduct.vue';
  import LayoutSetting from '@/views/wba/widget/partials/rating-reviews/LayoutSetting.vue';
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <FormQuota class="col-span-2" />
    <FormName class="col-span-2 md:col-span-1" />
    <FormProduct class="col-span-2 md:col-span-1" />

    <LayoutSetting />
  </div>
</template>

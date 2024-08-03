<script lang="ts" setup>
  import { useField } from 'vee-validate';
  import { Card, Image, Radio } from 'ant-design-vue';
  import { reactive } from 'vue';

  const ImagePreviewGroup = Image.PreviewGroup;
  const templates = [
    {
      id: 'grid',
      name: 'Grid',
      banner: '/assets/img/widget-banners/product-reviews.png',
    },
    {
      id: 'list',
      name: 'List',
      banner: '/assets/img/widget-banners/product-reviews-list.png',
    },
  ];

  const { value: templateStyle } = useField('setting.template_style');

  const state = reactive({
    viewSampleImage: '',
  });
</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <Card v-for="item in templates" :key="item.id" class="col-span-12 md:col-span-6">
      <template #cover>
        <img
          :alt="item.id"
          :src="item.banner"
          class="cursor-pointer"
          @click="state.viewSampleImage = item.id"
        />
      </template>

      <ImagePreviewGroup
        :preview="{
          visible: state.viewSampleImage == item.id,
          onVisibleChange: (vis) => (state.viewSampleImage = vis),
        }"
      >
        <div class="hidden">
          <Image :previewMask="false" :src="item.banner" fallback="/assets/img/no-image.png" />
        </div>
      </ImagePreviewGroup>

      <div
        class="h-50px flex items-center justify-between space-x-1 cursor-pointer"
        @click="templateStyle = item.id"
      >
        <span> {{ item.name }} style </span>

        <Radio :checked="templateStyle == item.id" />
      </div>
    </Card>
  </div>
</template>

<style lang="less" scoped>
  ::v-deep(.ant-card-body) {
    padding: 0 10px !important;
  }
</style>

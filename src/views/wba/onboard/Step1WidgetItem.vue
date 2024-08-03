<script lang="ts" setup>
  import { Image, Switch } from 'ant-design-vue';
  import { reactive } from 'vue';

  const emit = defineEmits(['update:modelValue']);
  const ImagePreviewGroup = Image.PreviewGroup;

  const state = reactive({
    showPreview: false,
  });

  const props = defineProps({
    disable: { type: Boolean, required: false },
    modelValue: { type: Object, default: {} },
  });

  const change = (val) => {
    props.modelValue.is_show = val;
    emit('update:modelValue', props.modelValue);
  };
</script>

<template>
  <div class="item-container">
    <div
      :class="[{ active: modelValue.is_show == true }]"
      class="icon-img"
      @click="state.showPreview = true"
    >
      <img :src="modelValue.background_small" />
    </div>
    <div class="header">
      <div class="name">{{ modelValue.title }}</div>

      <Switch
        v-model:checked="modelValue.is_show"
        :checkedValue="true"
        :disabled="disable"
        :unCheckedValue="false"
        size="small"
        @change="change"
      />
    </div>

    <ImagePreviewGroup
      :preview="{
        visible: state.showPreview,
        onVisibleChange: (vis) => (state.showPreview = vis),
      }"
    >
      <div class="hidden">
        <Image
          :previewMask="false"
          :src="modelValue.background"
          class="!object-cover !h-15 !w-15 !rounded-md cursor-pointer"
          fallback="/assets/img/no-image.png"
        />
      </div>
    </ImagePreviewGroup>
  </div>
</template>

<style lang="less" scoped>
  .item-container {
    @apply w-m-220px;

    .header {
      @apply flex flex-row items-center mt-2;

      .name {
        @apply font-medium text-16px flex-grow;
      }
    }

    .icon-img {
      @apply rounded-xl cursor-pointer border-3 border-gray-300 h-m-150px flex justify-center items-center;

      img,
      .background {
        @apply rounded-lg object-cover h-full;
      }

      &:hover {
        @apply bg-white text-blue-400;

        svg :deep(.star) {
          @apply fill-yellow-500;
        }
      }

      &.active {
        @apply bg-white text-blue-400 border-3 border-primary;

        svg :deep(.star) {
          @apply fill-yellow-500;
        }
      }
    }
  }
</style>

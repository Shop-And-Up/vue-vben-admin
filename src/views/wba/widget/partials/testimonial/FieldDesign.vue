<script setup lang="ts">
  import { reactive } from 'vue';
  import { useField } from 'vee-validate';
  import { Slider, Select, Collapse, CollapsePanel } from 'ant-design-vue';
  import { CaretRightOutlined } from '@ant-design/icons-vue';

  import FormEditorVue from '@/views/wba/components/FormEditor.vue';
  import FormColorVue from '@/views/wba/components/FormColor.vue';

  import rotator from './assets/rotator-quote.svg';
  import carousel from './assets/carousel.svg';
  import classic from './assets/classic-review.svg';
  import bubble from './assets/bubble-review.svg';
  import { useManageWidgetStore } from '../../useManageWidgetStore';

  const { value: header_title } = useField('setting.header_title');
  const { value: header_color } = useField('setting.header_color');
  const { value: header_font_size } = useField('setting.header_font_size');
  const { value: header_align } = useField('setting.header_align');
  const { value: header_margin_bottom } = useField('setting.header_margin_bottom');

  const { value: feedback_background_color } = useField<any>('setting.feedback_background_color');
  const { value: feedback_color } = useField<any>('setting.feedback_color');
  const { value: feedback_font_size } = useField<any>('setting.feedback_font_size');

  const { value: star_icon_size } = useField('setting.star_icon_size');
  const { value: star_icon_color } = useField('setting.star_icon_color');

  const { value: layout_margin_top } = useField('setting.layout_margin_top');
  const { value: layout_margin_bottom } = useField('setting.layout_margin_bottom');

  const { value: templateStyle } = useField('setting.template_style');

  const { value: read_more } = useField('language.read_more');
  const { value: read_less } = useField('language.read_less');

  const mngWgStore = useManageWidgetStore();

  const state = reactive({
    alignList: [
      { value: 'left', label: 'Left' },
      { value: 'center', label: 'Center' },
      { value: 'right', label: 'Right' },
    ],
    templates: [
      {
        id: 'rotator_quote',
        name: 'Rotator quote',
        background: rotator,
      },
      {
        id: 'carousel',
        name: 'Carousel',
        background: carousel,
      },
      {
        id: 'classic_review',
        name: 'Classic review',
        background: classic,
      },
      {
        id: 'bubble_review',
        name: 'Bubble review',
        background: bubble,
      },
    ],
  });
</script>
<template>
  <div>
    <Collapse
      :activeKey="['layout', 'title', 'content', 'star-icon', 'margin', 'translate']"
      ghost
      style="margin: -15px"
    >
      <template #expandIcon>
        <CaretRightOutlined :rotate="90" />
      </template>
      <CollapsePanel key="layout">
        <template #header>
          <strong>Layout</strong>
        </template>

        <div class="grid grid-cols-12 gap-4 ml-30px">
          <div v-for="item in state.templates" :key="item.id" class="col-span-12 md:col-span-6">
            <div
              @click="templateStyle = item.id"
              :class="[{ active: templateStyle == item.id }]"
              class="icon-item pb-3"
            >
              <component class="max-w-150px h-full" :is="item.background" />
              <div class="text-sm">{{ item.name }}</div>
            </div>
          </div>
        </div>
      </CollapsePanel>

      <CollapsePanel key="title">
        <template #header>
          <strong>Title</strong>
        </template>
        <div class="grid grid-cols-2 gap-x-8 gap-y-4 ml-30px">
          <FormEditorVue class="col-span-2" v-model="header_title" />
          <div class="col-span-2 lg:col-span-1">
            <div class="mb-1">Color</div>
            <div>
              <FormColorVue v-model="header_color" />
            </div>
          </div>
          <div class="col-span-2 lg:col-span-1">
            <div class="mb-1">Text align</div>
            <Select class="w-full" v-model:value="header_align" :options="state.alignList" />
          </div>
          <div class="col-span-2 lg:col-span-1">
            <div class="flex justify-between">
              <div>Font size</div>
              <div class="text-xs text-gray-500">{{ header_font_size }}px</div>
            </div>
            <div>
              <Slider v-model:value="header_font_size" :min="9" :max="36" />
            </div>
          </div>
          <div class="col-span-2 lg:col-span-1">
            <div class="flex justify-between">
              <div>Bottom margin</div>
              <div class="text-xs text-gray-500">{{ header_margin_bottom }}px</div>
            </div>
            <div>
              <Slider v-model:value="header_margin_bottom" :min="0" :max="50" />
            </div>
          </div>
        </div>
      </CollapsePanel>

      <CollapsePanel key="content">
        <template #header>
          <strong>Content</strong>
        </template>

        <div class="grid grid-cols-2 gap-x-8 gap-y-4 ml-30px">
          <div class="col-span-2 lg:col-span-1">
            <div class="mb-1 section-subtitle">Color</div>
            <div>
              <FormColorVue v-model="feedback_color" />
            </div>
          </div>

          <div class="col-span-2 lg:col-span-1">
            <div class="mb-1 section-subtitle">Background</div>
            <div>
              <FormColorVue v-model="feedback_background_color" />
            </div>
          </div>

          <div class="col-span-2">
            <div class="flex justify-between">
              <div class="section-subtitle">Font size</div>
              <div class="text-xs text-gray-500">{{ feedback_font_size }}px</div>
            </div>
            <div>
              <Slider v-model:value="feedback_font_size" :min="9" :max="16" />
            </div>
          </div>
        </div>
      </CollapsePanel>

      <CollapsePanel key="star-icon">
        <template #header>
          <strong>Star icon</strong>
        </template>

        <div class="grid grid-cols-2 gap-x-8 gap-y-4 ml-30px">
          <div class="col-span-2 lg:col-span-1">
            <div class="mb-1">Color</div>
            <div>
              <FormColorVue v-model="star_icon_color" />
            </div>
          </div>

          <div class="col-span-2 lg:col-span-1">
            <div class="flex justify-between">
              <div>Size</div>
              <div class="text-xs text-gray-500">{{ star_icon_size }}px</div>
            </div>
            <div>
              <Slider v-model:value="star_icon_size" :min="5" :max="32" />
            </div>
          </div>
        </div>
      </CollapsePanel>

      <CollapsePanel key="margin">
        <template #header>
          <strong>Layout margin</strong>
        </template>
        <div class="grid grid-cols-2 gap-x-8 gap-y-4 ml-30px">
          <div class="col-span-2 lg:col-span-1">
            <div class="flex justify-between">
              <div>Top</div>
              <div class="text-xs text-gray-500">{{ layout_margin_top }}px</div>
            </div>
            <div>
              <Slider v-model:value="layout_margin_top" :min="0" :max="50" />
            </div>
          </div>

          <div class="col-span-2 lg:col-span-1">
            <div class="flex justify-between">
              <div>Bottom</div>
              <div class="text-xs text-gray-500">{{ layout_margin_bottom }}px</div>
            </div>
            <div>
              <Slider v-model:value="layout_margin_bottom" :min="0" :max="50" />
            </div>
          </div>
        </div>
      </CollapsePanel>

      <CollapsePanel v-if="mngWgStore.isDefaultWidget" key="translate">
        <template #header>
          <strong>Translate</strong>
          <span class="text-xs text-gray-500 italic">
            (This translate will apply to all widgets)</span
          >
        </template>
        <div class="grid grid-cols-2 gap-x-8 gap-y-4 ml-30px">
          <div class="col-span-2 lg:col-span-1">
            <div class="mb-1">Read more</div>
            <div>
              <a-input v-model:value="read_more" />
            </div>
          </div>
          <div class="col-span-2 lg:col-span-1">
            <div class="mb-1">Read less</div>
            <div>
              <a-input v-model:value="read_less" />
            </div>
          </div>
        </div>
      </CollapsePanel>
    </Collapse>
  </div>
</template>

<style lang="less" scoped>
  .icon-item {
    @apply bg-gray-50 text-gray-300 flex flex-col justify-center items-center rounded cursor-pointer border-2 border-light-400;

    &:hover {
      @apply bg-white text-blue-400;

      svg :deep(.star) {
        @apply fill-yellow-500;
      }
    }

    &.active {
      @apply bg-white text-blue-400 border-2 border-primary;

      svg :deep(.star) {
        @apply fill-yellow-500;
      }
    }
  }
</style>

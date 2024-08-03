<script setup lang="ts">
  import { reactive } from 'vue';
  import { useField } from 'vee-validate';
  import { Slider, Select, Switch, Collapse, CollapsePanel } from 'ant-design-vue';
  import { CaretRightOutlined } from '@ant-design/icons-vue';

  import FormEditorVue from '../../../components/FormEditor.vue';
  import FormColorVue from '../../../components/FormColor.vue';

  import grid from './assets/grid.svg';
  import rotator from './assets/rotator-quote.svg';
  import carousel from './assets/carousel.svg';
  import classic from './assets/classic-review.svg';
  import bubble from './assets/bubble-review.svg';
  import { useManageWidgetStore } from '../../useManageWidgetStore';

  const { value: template_style } = useField('setting.template_style');
  const { value: header_title } = useField('setting.header_title');
  const { value: header_color } = useField('setting.header_color');
  const { value: header_font_size } = useField('setting.header_font_size');
  const { value: header_align } = useField('setting.header_align');
  const { value: header_margin_bottom } = useField('setting.header_margin_bottom');

  const { value: show_flag_icon } = useField<any>('setting.show_flag_icon');
  const { value: show_verified_icon } = useField<any>('setting.show_verified_icon');

  const { value: feedback_font_size } = useField<any>('setting.feedback_font_size');
  const { value: feedback_color } = useField<any>('custom_setting.feedback_color');
  const { value: feedback_background_color } = useField<any>(
    'custom_setting.feedback_background_color',
  );
  const { value: feedback_border_color } = useField<any>('custom_setting.feedback_border_color');

  const { value: interval } = useField<any>('setting.interval');
  const { value: interval_pause_on_hover } = useField<any>('setting.interval_pause_on_hover');

  const { value: star_icon_size } = useField('setting.star_icon_size');
  const { value: star_icon_color } = useField('setting.star_icon_color');
  const { value: star_background_color } = useField<any>('custom_setting.star_background_color');
  const { value: verified_icon_color } = useField<any>('custom_setting.verified_icon_color');
  const { value: show_product_bottom } = useField<any>('custom_setting.show_product_bottom');

  const { value: layout_margin_top } = useField('setting.layout_margin_top');
  const { value: layout_margin_bottom } = useField('setting.layout_margin_bottom');
  const { value: templateStyle } = useField('setting.template_style');
  const { value: read_more } = useField<string>('language.read_more');

  const mngWgStore = useManageWidgetStore();

  const templates = [
    {
      id: 'grid',
      name: 'Grid',
      background: grid,
    },
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
  ];

  const state = reactive({
    alignList: [
      { value: 'left', label: 'Left' },
      { value: 'center', label: 'Center' },
      { value: 'right', label: 'Right' },
    ],
  });
</script>

<template>
  <div>
    <Collapse :activeKey="['content']" ghost style="margin: -15px">
      <template #expandIcon>
        <CaretRightOutlined :rotate="90" />
      </template>
      <CollapsePanel key="content">
        <template #header>
          <strong>Layout</strong>
        </template>

        <div class="collapse-panel">
          <div v-for="item in templates" :key="item.id" class="col-span-1">
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
      <CollapsePanel key="content">
        <template #header>
          <strong>Title</strong>
        </template>

        <div class="collapse-panel">
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

        <div class="collapse-panel">
          <div class="col-span-2 lg:col-span-1 flex justify-between">
            <div class="section-subtitle">Show flag icon?</div>
            <div>
              <Switch
                size="small"
                v-model:checked="show_flag_icon"
                :unCheckedValue="false"
                :checkedValue="true"
              />
            </div>
          </div>

          <div class="col-span-2 lg:col-span-1 flex justify-between">
            <div class="section-subtitle">Show verified icon?</div>
            <div>
              <Switch
                size="small"
                v-model:checked="show_verified_icon"
                :unCheckedValue="false"
                :checkedValue="true"
              />
            </div>
          </div>

          <div class="col-span-2 lg:col-span-1 flex justify-between">
            <div class="section-subtitle">Show product info? (Grid & Classic style only)</div>
            <div>
              <Switch
                size="small"
                v-model:checked="show_product_bottom"
                :disabled="template_style != 'grid' && template_style != 'classic_review'"
                :unCheckedValue="false"
                :checkedValue="true"
              />
            </div>
          </div>

          <div class="col-span-2 lg:col-span-1">
            <div class="flex justify-between">
              <div class="section-subtitle">Font size</div>
              <div class="text-xs text-gray-500">{{ feedback_font_size }}px</div>
            </div>
            <div>
              <Slider v-model:value="feedback_font_size" :min="9" :max="16" />
            </div>
          </div>

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

          <div class="col-span-2 lg:col-span-1">
            <div class="mb-1 section-subtitle">Divider</div>
            <div>
              <FormColorVue v-model="feedback_border_color" />
            </div>
          </div>
        </div>
      </CollapsePanel>

      <CollapsePanel key="content">
        <template #header>
          <strong>Rating icon</strong>
        </template>

        <div class="collapse-panel">
          <div class="col-span-2 lg:col-span-1">
            <div class="mb-1 section-subtitle">Color</div>
            <div>
              <FormColorVue v-model="star_icon_color" />
            </div>
          </div>

          <div class="col-span-2 lg:col-span-1">
            <div class="flex justify-between">
              <div class="section-subtitle">Size</div>
              <div class="text-xs text-gray-500">{{ star_icon_size }}px</div>
            </div>
            <div>
              <Slider v-model:value="star_icon_size" :min="5" :max="32" />
            </div>
          </div>

          <div class="col-span-1">
            <div class="mb-1 section-subtitle">Background</div>
            <div>
              <FormColorVue v-model="star_background_color" />
            </div>
          </div>

          <div class="col-span-1">
            <div class="mb-1 section-subtitle">Verified color</div>
            <div>
              <FormColorVue v-model="verified_icon_color" />
            </div>
          </div>
        </div>
      </CollapsePanel>

      <CollapsePanel key="content">
        <template #header>
          <strong>Autoplay</strong>
        </template>
        <div class="collapse-panel">
          <div class="col-span-2 lg:col-span-1 flex justify-between">
            <div class="section-subtitle">Pause on hover?</div>
            <div>
              <Switch
                size="small"
                v-model:checked="interval_pause_on_hover"
                :unCheckedValue="false"
                :checkedValue="true"
              />
            </div>
          </div>
          <div class="col-span-2 lg:col-span-1">
            <div class="flex justify-between">
              <div class="section-subtitle">Interval</div>
              <div class="text-xs text-gray-500">{{ interval }}s</div>
            </div>
            <div>
              <Slider v-model:value="interval" :min="0" :max="10" />
            </div>
          </div>
        </div>
      </CollapsePanel>

      <CollapsePanel key="content">
        <template #header>
          <strong>Layout margin</strong>
        </template>
        <div class="collapse-panel">
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

      <CollapsePanel key="content" v-if="mngWgStore.isDefaultWidget">
        <template #header>
          <strong>Translate</strong>
          <span class="text-xs text-gray-500 italic">
            (This translate will apply to all widgets)</span
          >
        </template>
        <div class="collapse-panel">
          <div class="col-span-2 lg:col-span-1">
            <div class="mb-1">Read more</div>
            <div>
              <a-input v-model:value="read_more" />
            </div>
          </div>
        </div>
      </CollapsePanel>
    </Collapse>
  </div>
</template>

<style lang="less" scoped>
  .collapse-panel {
    @apply grid grid-cols-2 gap-x-8 gap-y-4 ml-30px;
  }

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

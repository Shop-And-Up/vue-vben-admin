<script lang="ts" setup>
  import { CaretRightOutlined } from '@ant-design/icons-vue';
  import { Card, Collapse, CollapsePanel, Radio, Select, Slider, Switch } from 'ant-design-vue';
  import { useField } from 'vee-validate';
  import { reactive } from 'vue';

  import { pageSizeList, sortByList } from '@/views/wba/widget/service';
  import FormColorVue from '../../../components/FormColor.vue';

  const { value: template_style } = useField('setting.template_style');
  const { value: header } = useField('setting.header');
  const { value: header_color } = useField('setting.header_color');
  const { value: header_font_size } = useField<any>('setting.header_font_size');
  const { value: header_margin_bottom } = useField<any>('custom_setting.header_margin_bottom');

  const { value: show_flag_icon } = useField<any>('setting.show_flag_icon');
  const { value: show_verified_icon } = useField<any>('setting.show_verified_icon');
  const { value: feedback_background_color } = useField<any>(
    'custom_setting.feedback_background_color',
  );
  const { value: feedback_color } = useField<any>('custom_setting.feedback_color');
  const { value: feedback_font_size } = useField<any>('setting.feedback_font_size');
  const { value: feedback_format_date } = useField<any>('setting.feedback_format_date');
  const { value: page_size } = useField<any>('custom_setting.page_size');
  const { value: sort_by } = useField<any>('custom_setting.sort_by');
  const { value: grid_col_width } = useField<any>('custom_setting.grid_col_width');

  const { value: star_icon_size } = useField<any>('setting.star_icon_size');
  const { value: star_icon_color } = useField<any>('setting.star_icon_color');
  const { value: star_background_color } = useField<any>('custom_setting.star_background_color');
  const { value: star_background_progress } = useField<any>(
    'custom_setting.star_background_progress',
  );
  const { value: verified_icon_color } = useField<any>('custom_setting.verified_icon_color');

  const { value: btn_background_color } = useField<any>('custom_setting.btn_background_color');
  const { value: btn_color } = useField<any>('custom_setting.btn_color');
  const { value: btn_font_size } = useField<any>('custom_setting.btn_font_size');
  const { value: btn_stroke_line } = useField<any>('custom_setting.btn_stroke_line');
  const { value: btn_stroke_color } = useField<any>('custom_setting.btn_stroke_color');
  const { value: btn_stroke_radius } = useField<any>('custom_setting.btn_stroke_radius');
  const { value: btn_padding_x } = useField<any>('custom_setting.btn_padding_x');
  const { value: btn_padding_y } = useField<any>('custom_setting.btn_padding_y');

  const { value: layout_margin_top } = useField<any>('setting.layout_margin_top');
  const { value: layout_margin_bottom } = useField<any>('setting.layout_margin_bottom');

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

  const state = reactive({
    show_feedback_date: !!feedback_format_date.value,
    pageSizeList: pageSizeList,
    sortByList: sortByList,
  });

  const toggleFeedbackDate = (val) => {
    if (val) {
      feedback_format_date.value = 'yyyy/mm/dd';
    } else {
      feedback_format_date.value = '';
    }
  };
</script>

<template>
  <Collapse activeKey="title" ghost style="margin: -15px">
    <template #expandIcon>
      <CaretRightOutlined :rotate="90" />
    </template>

    <CollapsePanel key="title">
      <template #header>
        <strong>Layout</strong>
      </template>

      <div class="grid grid-cols-12 gap-4 ml-30px">
        <Card v-for="item in templates" :key="item.id" class="col-span-12 md:col-span-6">
          <template #cover>
            <img
              :alt="item.id"
              :src="item.banner"
              class="cursor-pointer"
              @click="template_style = item.id"
            />
          </template>

          <div
            class="h-50px flex items-center justify-between space-x-1 cursor-pointer"
            @click="template_style = item.id"
          >
            <span> {{ item.name }} style </span>

            <Radio :checked="template_style == item.id" />
          </div>
        </Card>
      </div>
    </CollapsePanel>

    <CollapsePanel key="title">
      <template #header>
        <strong>Title</strong>
      </template>

      <div class="collapse-panel">
        <a-input v-model:value="header" class="col-span-2" />

        <div class="col-span-2 lg:col-span-1">
          <div class="mb-1 section-subtitle">Color</div>
          <div>
            <FormColorVue v-model="header_color" />
          </div>
        </div>
        <div class="col-span-2 lg:col-span-1">
          <div class="flex justify-between">
            <div class="section-subtitle">Font size</div>
            <div class="text-xs text-gray-500">{{ header_font_size }}px</div>
          </div>
          <div>
            <Slider v-model:value="header_font_size" :max="36" :min="9" />
          </div>
        </div>
        <div class="col-span-2 col-span-2">
          <div class="flex justify-between">
            <div class="section-subtitle">Bottom margin</div>
            <div class="text-xs text-gray-500">{{ header_margin_bottom }}px</div>
          </div>
          <div>
            <Slider v-model:value="header_margin_bottom" :max="50" :min="0" />
          </div>
        </div>
      </div>
    </CollapsePanel>
    <CollapsePanel key="title">
      <template #header>
        <strong>Content</strong>
      </template>
      <div class="collapse-panel">
        <div class="col-span-2 xl:col-span-1 flex justify-between">
          <div class="section-subtitle">Show flag icon?</div>
          <div>
            <Switch
              v-model:checked="show_flag_icon"
              :checkedValue="true"
              :unCheckedValue="false"
              size="small"
            />
          </div>
        </div>
        <div class="col-span-2 xl:col-span-1 flex justify-between">
          <div class="section-subtitle">Show verified icon?</div>
          <div>
            <Switch
              v-model:checked="show_verified_icon"
              :checkedValue="true"
              :unCheckedValue="false"
              size="small"
            />
          </div>
        </div>

        <div class="col-span-2 xl:col-span-1 flex justify-between">
          <div class="section-subtitle">Show feedback date?</div>
          <div>
            <Switch
              v-model:checked="state.show_feedback_date"
              :checkedValue="true"
              :unCheckedValue="false"
              size="small"
              @change="toggleFeedbackDate"
            />
          </div>
        </div>

        <div class="col-span-2 lg:col-span-1">
          <div class="mb-1">Format date</div>
          <div>
            <a-input
              v-model:value="feedback_format_date"
              :disabled="!state.show_feedback_date"
              placeholder="yyyy/mm/dd"
            />
          </div>
        </div>

        <div class="col-span-2 xl:col-span-1">
          <div class="mb-1">Default sort by</div>
          <Select v-model:value="sort_by" :options="state.sortByList" class="w-full" />
        </div>

        <div class="col-span-2 xl:col-span-1">
          <div class="mb-1">Default page size</div>
          <Select v-model:value="page_size" :options="state.pageSizeList" class="w-full" />
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
          <div class="flex justify-between">
            <div class="section-subtitle">Font size</div>
            <div class="text-xs text-gray-500">{{ feedback_font_size }}px</div>
          </div>
          <div>
            <Slider v-model:value="feedback_font_size" :max="20" :min="9" />
          </div>
        </div>

        <div class="col-span-2 lg:col-span-1">
          <div class="flex justify-between">
            <div class="section-subtitle">Grid col width (Grid style only)</div>
            <div class="text-xs text-gray-500">{{ grid_col_width }}px</div>
          </div>
          <div>
            <Slider
              v-model:value="grid_col_width"
              :disabled="template_style != 'grid'"
              :max="350"
              :min="200"
              :step="5"
            />
          </div>
        </div>
      </div>
    </CollapsePanel>
    <CollapsePanel key="title">
      <template #header>
        <strong>Button</strong>
      </template>
      <div class="collapse-panel">
        <div class="col-span-2 lg:col-span-1">
          <div class="mb-1 section-subtitle">Color</div>
          <div>
            <FormColorVue v-model="btn_color" />
          </div>
        </div>
        <div class="col-span-2 lg:col-span-1">
          <div class="flex justify-between">
            <div class="section-subtitle">Font size</div>
            <div class="text-xs text-gray-500">{{ btn_font_size }}px</div>
          </div>
          <div>
            <Slider v-model:value="btn_font_size" :max="36" :min="9" />
          </div>
        </div>

        <div class="col-span-1">
          <div class="mb-1 section-subtitle">Background</div>
          <div>
            <FormColorVue v-model="btn_background_color" />
          </div>
        </div>

        <div class="col-span-2 lg:col-span-1">
          <div class="flex justify-between">
            <div class="section-subtitle">Radius</div>
            <div class="text-xs text-gray-500">{{ btn_stroke_radius }}px</div>
          </div>
          <div>
            <Slider v-model:value="btn_stroke_radius" :max="50" :min="0" />
          </div>
        </div>

        <div class="col-span-2 lg:col-span-1">
          <div class="flex justify-between">
            <div class="section-subtitle">Stroke line</div>
            <div class="text-xs text-gray-500">{{ btn_stroke_line }}px</div>
          </div>
          <div>
            <Slider v-model:value="btn_stroke_line" :max="5" :min="0" />
          </div>
        </div>

        <div class="col-span-2 lg:col-span-1">
          <div class="mb-1 section-subtitle">Stroke color</div>
          <div>
            <FormColorVue v-model="btn_stroke_color" />
          </div>
        </div>

        <div class="col-span-2 lg:col-span-1">
          <div class="flex justify-between">
            <div class="section-subtitle">Vertical padding</div>
            <div class="text-xs text-gray-500">{{ btn_padding_y }}px</div>
          </div>
          <div>
            <Slider v-model:value="btn_padding_y" :max="30" :min="1" />
          </div>
        </div>

        <div class="col-span-2 lg:col-span-1">
          <div class="flex justify-between">
            <div class="section-subtitle">Horizontal padding</div>
            <div class="text-xs text-gray-500">{{ btn_padding_x }}px</div>
          </div>
          <div>
            <Slider v-model:value="btn_padding_x" :max="30" :min="1" />
          </div>
        </div>
      </div>
    </CollapsePanel>
    <CollapsePanel key="title">
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
            <Slider v-model:value="star_icon_size" :max="32" :min="5" />
          </div>
        </div>

        <div class="col-span-1">
          <div class="mb-1 section-subtitle">Background grid item</div>
          <div>
            <FormColorVue v-model="star_background_color" />
          </div>
        </div>

        <div class="col-span-1">
          <div class="mb-1 section-subtitle">Background progress bar</div>
          <div>
            <FormColorVue v-model="star_background_progress" />
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
    <CollapsePanel key="title">
      <template #header>
        <strong>Layout margin</strong>
      </template>
      <div class="collapse-panel">
        <div class="col-span-2 lg:col-span-1">
          <div class="flex justify-between">
            <div class="section-subtitle">Top</div>
            <div class="text-xs text-gray-500">{{ layout_margin_top }}px</div>
          </div>
          <div>
            <Slider v-model:value="layout_margin_top" :max="50" :min="0" />
          </div>
        </div>

        <div class="col-span-2 lg:col-span-1">
          <div class="flex justify-between">
            <div class="section-subtitle">Bottom</div>
            <div class="text-xs text-gray-500">{{ layout_margin_bottom }}px</div>
          </div>
          <div>
            <Slider v-model:value="layout_margin_bottom" :max="50" :min="0" />
          </div>
        </div>
      </div>
    </CollapsePanel>
  </Collapse>
</template>

<style lang="less" scoped>
  .collapse-panel {
    @apply grid grid-cols-2 gap-x-8 gap-y-4 ml-30px;
  }

  ::v-deep(.ant-card-body) {
    padding: 0 10px !important;
  }
</style>

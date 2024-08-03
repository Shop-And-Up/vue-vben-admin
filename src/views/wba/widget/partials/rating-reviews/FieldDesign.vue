<script setup lang="ts">
  import { useField } from 'vee-validate';
  import { Collapse, CollapsePanel, Select, Slider, Switch } from 'ant-design-vue';
  import { reactive } from 'vue';

  import FormColorVue from '../../../components/FormColor.vue';
  import { CaretRightOutlined } from '@ant-design/icons-vue';

  const { value: show_inline } = useField<any>('setting.show_inline');
  const { value: disable_when_no_data } = useField<any>('setting.disable_when_no_data');
  const { value: center_on_mobile } = useField<any>('setting.center_on_mobile');
  const { value: align } = useField<any>('setting.align');

  const { value: star_icon_size } = useField<any>('setting.star_icon_size');
  const { value: star_icon_color } = useField<any>('setting.star_icon_color');
  const { value: star_icon_background_color } = useField<any>('setting.star_icon_background_color');

  const { value: label_size } = useField<any>('setting.label_size');
  const { value: label_color } = useField<any>('setting.label_color');
  const { value: translate_reviews } = useField<string>('setting.translate_reviews');

  const { value: layout_margin_top } = useField<any>('setting.layout_margin_top');
  const { value: layout_margin_bottom } = useField<any>('setting.layout_margin_bottom');
  const { value: layout_margin_left } = useField<any>('setting.layout_margin_left');
  const { value: layout_margin_right } = useField<any>('setting.layout_margin_right');

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
    <Collapse :activeKey="['layout']" ghost style="margin: -15px">
      <template #expandIcon>
        <CaretRightOutlined :rotate="90" />
      </template>
      <CollapsePanel key="layout">
        <template #header>
          <strong>Layout</strong>
        </template>

        <div class="grid grid-cols-2 gap-x-8 gap-y-4 ml-30px">
          <div class="col-span-2 lg:col-span-1">
            <div class="flex justify-between">
              <div class="section-subtitle">Show inline?</div>
              <div>
                <Switch
                  size="small"
                  v-model:checked="show_inline"
                  :unCheckedValue="false"
                  :checkedValue="true"
                />
              </div>
            </div>
          </div>

          <div class="col-span-2 lg:col-span-1">
            <div class="flex justify-between">
              <div class="section-subtitle">Hide widget if no reviews?</div>
              <div>
                <Switch
                  size="small"
                  v-model:checked="disable_when_no_data"
                  :unCheckedValue="false"
                  :checkedValue="true"
                />
              </div>
            </div>
          </div>

          <div class="col-span-2 lg:col-span-1">
            <div class="flex justify-between">
              <div class="section-subtitle">Always align center on mobile</div>
              <div>
                <Switch
                  size="small"
                  v-model:checked="center_on_mobile"
                  :unCheckedValue="false"
                  :checkedValue="true"
                />
              </div>
            </div>
          </div>

          <div class="col-span-2">
            <div class="mb-1">Align</div>
            <Select class="w-full" v-model:value="align" :options="state.alignList" />
          </div>
        </div>
      </CollapsePanel>

      <CollapsePanel key="layout">
        <template #header>
          <strong>Rating icon</strong>
        </template>

        <div class="grid grid-cols-2 gap-x-8 gap-y-4 ml-30px">
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

          <div class="col-span-2 lg:col-span-1">
            <div class="mb-1 section-subtitle">Background color</div>
            <div>
              <FormColorVue v-model="star_icon_background_color" />
            </div>
          </div>
        </div>
      </CollapsePanel>

      <CollapsePanel key="layout">
        <template #header>
          <strong>Label</strong>
        </template>

        <div class="grid grid-cols-2 gap-x-8 gap-y-4 ml-30px">
          <div class="col-span-2 lg:col-span-1">
            <div class="mb-1 section-subtitle">Color</div>
            <div>
              <FormColorVue v-model="label_color" />
            </div>
          </div>

          <div class="col-span-2 lg:col-span-1">
            <div class="flex justify-between">
              <div class="section-subtitle">Size</div>
              <div class="text-xs text-gray-500">{{ label_size }}px</div>
            </div>
            <div>
              <Slider v-model:value="label_size" :min="5" :max="32" />
            </div>
          </div>

          <div class="col-span-2">
            <div class="mb-1">Text <small class="text-gray-500">Example: @ (# reviews)</small></div>
            <a-input v-model:value="translate_reviews" />
          </div>
        </div>
      </CollapsePanel>

      <CollapsePanel key="layout">
        <template #header>
          <strong>Margin</strong>
        </template>

        <div class="grid grid-cols-2 gap-x-8 gap-y-4 ml-30px">
          <div class="col-span-2 lg:col-span-1">
            <div class="flex justify-between">
              <div class="section-subtitle">Left</div>
              <div class="text-xs text-gray-500">{{ layout_margin_left }}px</div>
            </div>
            <div>
              <Slider v-model:value="layout_margin_left" :min="0" :max="50" />
            </div>
          </div>

          <div class="col-span-2 lg:col-span-1">
            <div class="flex justify-between">
              <div class="section-subtitle">Right</div>
              <div class="text-xs text-gray-500">{{ layout_margin_right }}px</div>
            </div>
            <div>
              <Slider v-model:value="layout_margin_right" :min="0" :max="50" />
            </div>
          </div>
          <div class="col-span-2 lg:col-span-1">
            <div class="flex justify-between">
              <div class="section-subtitle">Top</div>
              <div class="text-xs text-gray-500">{{ layout_margin_top }}px</div>
            </div>
            <div>
              <Slider v-model:value="layout_margin_top" :min="0" :max="50" />
            </div>
          </div>

          <div class="col-span-2 lg:col-span-1">
            <div class="flex justify-between">
              <div class="section-subtitle">Bottom</div>
              <div class="text-xs text-gray-500">{{ layout_margin_bottom }}px</div>
            </div>
            <div>
              <Slider v-model:value="layout_margin_bottom" :min="0" :max="50" />
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
</style>

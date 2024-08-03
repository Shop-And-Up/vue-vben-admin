<script setup lang="ts">
  import { reactive } from 'vue';
  import { useField } from 'vee-validate';
  import { Slider, Select, Switch, Collapse, CollapsePanel } from 'ant-design-vue';
  import { CaretRightOutlined } from '@ant-design/icons-vue';

  import FormColorVue from '../../../components/FormColor.vue';

  const { value: display_on_page } = useField('setting.display_on_page');
  const { value: position } = useField('setting.position');
  const { value: show_flag_icon } = useField<any>('setting.show_flag_icon');
  const { value: show_verified_icon } = useField<any>('setting.show_verified_icon');
  const { value: show_feedback_date } = useField<any>('setting.show_feedback_date');
  const { value: show_on_mobile } = useField<any>('setting.show_on_mobile');

  const { value: feedback_font_size } = useField<any>('setting.feedback_font_size');
  const { value: feedback_color } = useField<any>('setting.feedback_color');
  const { value: feedback_background_color } = useField<any>('setting.feedback_background_color');
  const { value: feedback_border_color } = useField<any>('setting.feedback_border_color');

  const { value: interval_hide } = useField<any>('setting.interval_hide');
  const { value: interval_show } = useField<any>('setting.interval_show');

  const { value: star_icon_size } = useField('setting.star_icon_size');
  const { value: star_icon_color } = useField('setting.star_icon_color');
  const { value: star_background_color } = useField<any>('setting.star_background_color');
  const { value: verified_icon_color } = useField<any>('custom_setting.verified_icon_color');

  const { value: layout_margin_horizon } = useField('setting.layout_margin_horizon');
  const { value: layout_margin_bottom } = useField('setting.layout_margin_bottom');

  const state = reactive({
    positions: [
      {
        value: 'left',
        label: 'Bottom - Left',
      },
      {
        value: 'right',
        label: 'Bottom - Right',
      },
    ],
    displayList: [
      {
        value: 'all',
        label: 'All pages',
      },
      {
        value: 'index',
        label: 'Only home page',
      },
      {
        value: 'product',
        label: 'Only product page',
      },
    ],
  });
</script>

<template>
  <div>
    <Collapse
      :activeKey="['content', 'star-icon', 'autoplay', 'margin']"
      ghost
      style="margin: -15px"
    >
      <template #expandIcon>
        <CaretRightOutlined :rotate="90" />
      </template>

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
            <div class="section-subtitle">Show date?</div>
            <div>
              <Switch
                size="small"
                v-model:checked="show_feedback_date"
                :unCheckedValue="false"
                :checkedValue="true"
              />
            </div>
          </div>
          <div class="col-span-2 lg:col-span-1 flex justify-between">
            <div class="section-subtitle">Show on mobile?</div>
            <div>
              <Switch
                size="small"
                v-model:checked="show_on_mobile"
                :unCheckedValue="false"
                :checkedValue="true"
              />
            </div>
          </div>

          <div class="col-span-2 lg:col-span-1">
            <div class="section-subtitle">Display on</div>
            <Select class="w-full" v-model:value="display_on_page" :options="state.displayList" />
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
            <div class="mb-1">Color</div>
            <div>
              <FormColorVue v-model="feedback_color" />
            </div>
          </div>

          <div class="col-span-2 lg:col-span-1">
            <div class="mb-1">Background</div>
            <div>
              <FormColorVue v-model="feedback_background_color" />
            </div>
          </div>

          <div class="col-span-2 lg:col-span-1">
            <div class="mb-1">Divider</div>
            <div>
              <FormColorVue v-model="feedback_border_color" />
            </div>
          </div>

          <div class="col-span-2 lg:col-span-1">
            <div class="section-subtitle">Position</div>
            <Select class="w-full" v-model:value="position" :options="state.positions" />
          </div>
        </div>
      </CollapsePanel>

      <CollapsePanel key="star-icon">
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

      <CollapsePanel key="autoplay">
        <template #header>
          <strong>Autoplay</strong>
        </template>
        <div class="collapse-panel">
          <div class="col-span-2">
            <div class="flex justify-between">
              <div class="section-subtitle">
                When the user clicks the close icon to close the popup, the popup will be
                <span class="font-semibold italic"> hidden for the next 24 hours. </span>
              </div>
            </div>
          </div>

          <div class="col-span-2 lg:col-span-1">
            <div class="flex justify-between">
              <div class="section-subtitle">Hidden time</div>
              <div class="text-xs text-gray-500">{{ interval_hide }}s</div>
            </div>
            <div>
              <Slider v-model:value="interval_hide" :min="2" :max="10" />
            </div>
          </div>
          <div class="col-span-2 lg:col-span-1">
            <div class="flex justify-between">
              <div class="section-subtitle">Show time</div>
              <div class="text-xs text-gray-500">{{ interval_show }}s</div>
            </div>
            <div>
              <Slider v-model:value="interval_show" :min="2" :max="10" />
            </div>
          </div>
        </div>
      </CollapsePanel>

      <CollapsePanel key="margin">
        <template #header>
          <strong>Margin</strong>
        </template>
        <div class="collapse-panel">
          <div class="col-span-2 lg:col-span-1">
            <div class="flex justify-between">
              <div>Horizon</div>
              <div class="text-xs text-gray-500">{{ layout_margin_horizon }}px</div>
            </div>
            <div>
              <Slider v-model:value="layout_margin_horizon" :min="0" :max="100" :step="5" />
            </div>
          </div>

          <div class="col-span-2 lg:col-span-1">
            <div class="flex justify-between">
              <div>Bottom</div>
              <div class="text-xs text-gray-500">{{ layout_margin_bottom }}px</div>
            </div>
            <div>
              <Slider v-model:value="layout_margin_bottom" :min="0" :max="200" :step="5" />
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

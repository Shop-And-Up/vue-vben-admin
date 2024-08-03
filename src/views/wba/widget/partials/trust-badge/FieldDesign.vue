<script setup lang="ts">
  import { useField } from 'vee-validate';
  import { Slider } from 'ant-design-vue';

  import FormColorVue from '../../../components/FormColor.vue';

  const { value: bgColorVal } = useField('setting.box_background');
  const { value: paddingVal } = useField('setting.padding');
  const { value: strokeVal } = useField('setting.stroke_line');
  const { value: strokeColorVal } = useField('setting.stroke_color');
  const { value: radiusVal } = useField('setting.radius');

  const { value: layout_margin_top } = useField('setting.layout_margin_top');
  const { value: layout_margin_bottom } = useField('setting.layout_margin_bottom');
</script>

<template>
  <div class="grid grid-cols-2 gap-x-8 gap-y-4">
    <div class="col-span-2 lg:col-span-1">
      <div class="mb-1">Box background</div>
      <div>
        <FormColorVue v-model="bgColorVal" />
      </div>
    </div>

    <div class="col-span-2 lg:col-span-1">
      <div class="flex justify-between">
        <div>Padding</div>
        <div class="text-xs text-gray-500">{{ paddingVal }}px</div>
      </div>
      <div>
        <Slider v-model:value="paddingVal" :min="0" :max="50" />
      </div>
    </div>

    <div class="col-span-2 py-3">
      <div class="w-full border-t border-gray-200"></div>
    </div>

    <div class="col-span-2 lg:col-span-1">
      <div class="flex justify-between">
        <div>Stroke line</div>
        <div class="text-xs text-gray-500">{{ strokeVal }}px</div>
      </div>
      <div>
        <Slider v-model:value="strokeVal" :min="0" :max="5" />
      </div>
    </div>

    <div class="col-span-2 lg:col-span-1">
      <div class="flex justify-between">
        <div>Radius</div>
        <div class="text-xs text-gray-500">{{ radiusVal }}px</div>
      </div>
      <div>
        <Slider v-model:value="radiusVal" :min="0" :max="16" />
      </div>
    </div>

    <div class="col-span-2 lg:col-span-1">
      <div class="mb-1">Stroke color</div>
      <div>
        <FormColorVue v-model="strokeColorVal" />
      </div>
    </div>

    <div class="col-span-2 py-3">
      <div class="w-full border-t border-gray-200"></div>
    </div>

    <div class="col-span-2 lg:col-span-1">
      <div class="flex justify-between">
        <div>Top margin</div>
        <div class="text-xs text-gray-500">{{ layout_margin_top }}px</div>
      </div>
      <div>
        <Slider v-model:value="layout_margin_top" :min="0" :max="50" />
      </div>
    </div>

    <div class="col-span-2 lg:col-span-1">
      <div class="flex justify-between">
        <div>Bottom margin</div>
        <div class="text-xs text-gray-500">{{ layout_margin_bottom }}px</div>
      </div>
      <div>
        <Slider v-model:value="layout_margin_bottom" :min="0" :max="50" />
      </div>
    </div>
  </div>
</template>

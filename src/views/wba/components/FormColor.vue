<template>
  <Popover :title="false" :trigger="['click']">
    <template #content>
      <div class="form-color">
        <Sketch v-model="modelVal" :preset-colors="[]" />
      </div>
    </template>
    <div class="items-center rounded border flex h-32px divide-x cursor-pointer">
      <div class="flex w-full">
        <div class="border h-15px w-15px ml-3" :style="{ backgroundColor: modelVal.hex8 }"></div>
        <div class="ml-2 text-xs">{{ modelVal.hex }}</div>
      </div>
      <div class="h-full w-75px grid place-content-center">
        <span class="text-xs">{{ Math.round(modelVal.a * 100) }}%</span>
      </div>
    </div>
  </Popover>
</template>

<script lang="ts">
  import { Sketch } from '@ckpack/vue-color';
  import { computed } from 'vue';
  import { TinyColor } from '@ctrl/tinycolor';
  import { Popover } from 'ant-design-vue';

  export default {
    components: {
      Sketch,
      Popover,
    },
    props: {
      modelValue: {
        type: String,
        default: () => 'rgba(28, 28, 40, 1)',
      },
    },
    setup(props, { emit }) {
      const modelVal = computed({
        get: () => {
          const color = new TinyColor(props.modelValue);
          return {
            hex: color.toHexString().toUpperCase(),
            hex8: color.toHex8String().toUpperCase(),
            rgba: color.toRgbString(),
            a: color.getAlpha(),
          };
        },
        set: (val) => {
          emit('update:modelValue', new TinyColor(val.rgba).toRgbString());
        },
      });

      return {
        modelVal,
      };
    },
  };
</script>

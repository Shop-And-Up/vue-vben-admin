<template>
  <div ref="chartRef" :style="{ height, width }"></div>
</template>
<script lang="ts" setup>
  import { onMounted, ref, Ref } from 'vue';
  import { useECharts } from '@/hooks/web/useECharts';

  const props = defineProps({
    setting: { type: Object, require: true },
    width: {
      type: String as PropType<string>,
      default: '100%',
    },
    height: {
      type: String as PropType<string>,
      default: '280px',
    },
  });
  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

  onMounted(() => {
    setOptions({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          lineStyle: {
            width: 1,
            color: '#019680',
          },
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: props.setting!.date.map((res) => res.substring(0, 10)),
        // splitLine: {
        //   show: true,
        //   lineStyle: {
        //     width: 1,
        //     type: 'solid',
        //     color: 'rgba(226,226,226,0.5)',
        //   },
        // },
        axisTick: {
          show: false,
        },
      },
      yAxis: [
        {
          type: 'value',
          splitNumber: 4,
          axisTick: {
            show: false,
          },
          splitArea: {
            show: true,
            areaStyle: {
              color: ['rgba(255,255,255,0.2)', 'rgba(226,226,226,0.2)'],
            },
          },
        },
      ],
      grid: { left: '1%', right: '1%', top: '2%', bottom: 0, containLabel: true },
      series: [
        {
          name: 'View',
          smooth: true,
          data: props.setting!.view,
          type: 'line',
          // areaStyle: {},
          itemStyle: {
            color: '#5ab1ef',
          },
        },
        {
          name: 'Click',
          smooth: true,
          data: props.setting!.click,
          type: 'line',
          // areaStyle: {},
          itemStyle: {
            color: '#019680',
          },
        },
      ],
    });
  });
</script>

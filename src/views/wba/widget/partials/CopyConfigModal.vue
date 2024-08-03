<script lang="ts" setup>
  import { Select } from 'ant-design-vue';
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';

  import { WidgetItem } from '@/api/wba/model/widgetModel';
  import { listWidgetByType } from '@/api/wba/widget';
  import { SvgIcon } from '@/components/Icon';
  import { BasicModal, useModalInner } from '@/components/Modal';

  const list = ref<any[]>([]);
  const widget = ref<WidgetItem>();
  const widgetCopy = ref();
  const widgetType = ref();

  const router = useRouter();
  const emit = defineEmits(['selected']);

  const [register, { setModalProps, closeModal }] = useModalInner((data) => {
    data && initData(data);
  });

  // Init modal setting
  function initData(data: { widget: any; widget_type: any }) {
    widget.value = data.widget;
    widgetType.value = data.widget_type;
    widgetCopy.value = null;

    setModalProps({ loading: true });

    // Get widget list
    listWidgetByType({
      type: widgetType.value.id,
      withSetting: true,
      withDefaultWidget: true,
      page: 1,
      pageSize: 999,
    }).then((res) => {
      // Not list current widget
      if (widget.value) {
        res.data = res.data.filter((c) => c.id != widget.value!.id);
      }

      // Map to select options Format
      list.value = res.data.map((c) => {
        if (c.page_name && c.theme_name) {
          c.name = `${c.name} / ${c.page_name} page / ${c.theme_name} theme`;
        }

        return c;
      });

      setModalProps({ loading: false });
    });
  }

  const handleSubmit = () => {
    emit('selected', widgetCopy.value.option);
    closeModal();
  };

  const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  const handleOpenEdit = () => {
    const url = router.resolve({
      name: 'WidgetEdit',
      params: {
        id: widgetCopy.value.option.id,
        type: widgetType.value.id,
      },
    });
    window.open(url.href, '_blank');
  };
</script>

<template>
  <BasicModal
    :canFullscreen="false"
    :okButtonProps="{
      disabled: !widgetCopy,
    }"
    okText="Apply"
    title="Copy setting from another widget"
    v-bind="$attrs"
    width="800px"
    @ok="handleSubmit"
    @register="register"
  >
    <div class="m-3">
      <!-- <Alert
        message="Warning"
        description="After copying the settings from another widget, You can restore the previous setting by refresh (press F5) your browser."
        class="!mb-5"
        type="warning"
        show-icon
        closable
      >
        <template #icon><SmileOutlined /></template>
      </Alert> -->
      <div v-if="widgetType" class="flex space-x-5">
        <div class="relative">
          <div class="h-10 w-10 border bg-gray-200 border-gray-200 rounded"></div>
          <div
            class="h-10 w-10 grid place-content-center border border-gray-200 rounded absolute top-1 left-1 bg-white"
          >
            <SvgIcon :name="widgetType.icon" :size="24" class="text-primary" />
          </div>
        </div>

        <div class="flex flex-col justify-between w-full space-y-3">
          <div>
            <span class="mr-3 text-base font-bold">
              {{ widgetType.name }}
            </span>
            <div class="text-gray-600 mt-1"> Saving time by copy setting from another widget.</div>
          </div>
          <div class="flex space-x-2">
            <Select
              v-model:value="widgetCopy"
              :field-names="{ label: 'name', value: 'id' }"
              :filter-option="filterOption"
              :labelInValue="true"
              :options="list"
              class="w-full"
              placeholder="Please select a widget"
              show-search
            />
            <a-button
              :disabled="!widgetCopy"
              preIcon="ant-design:eye-outlined"
              @click="handleOpenEdit"
              type="dashed"
            />
          </div>
        </div>
      </div>
    </div>
  </BasicModal>
</template>

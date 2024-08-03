<script lang="ts" setup>
  import { cloneDeep } from 'lodash-es';
  import { useForm } from 'vee-validate';
  import { onBeforeMount, unref } from 'vue';
  import { useRouter } from 'vue-router';
  import * as Yup from 'yup';

  import { PageWrapper } from '@/components/Page';
  import { useMessage } from '@/hooks/web/useMessage';
  import { actionType, copyWidgetSetting, updateWidget } from '@/views/wba/widget/service';
  import {
    IManageWidgetStore,
    useManageWidgetStore,
  } from '@/views/wba/widget/useManageWidgetStore';
  import CopyConfigModal from './partials/CopyConfigModal.vue';
  import { useModal } from '@/components/Modal';

  const { push, currentRoute } = useRouter();
  const { createConfirm } = useMessage();
  const mngWgStore = useManageWidgetStore();
  const [registerModal, { openModal }] = useModal();

  const veeForm = useForm<any>({
    validationSchema: Yup.object().shape({
      name: Yup.string().max(200).required().label('Name'),
    }),
  });

  onBeforeMount(() => {
    mngWgStore.setState(<IManageWidgetStore>{
      type: unref(currentRoute).params.type,
      actionType: actionType.edit,
    });

    // Load both default and normal widget
    mngWgStore.getDefaultWidget();
    mngWgStore.getWidgetInfo(unref(currentRoute).params.id).then((defaultWidget) => {
      veeForm.resetForm({
        values: {
          ...cloneDeep(defaultWidget),
        },
      });
    });
  });

  const onSubmit = () => {
    mngWgStore.isLoading = true;
    updateWidget(veeForm)
      .then(() => {
        // Update store
        mngWgStore.setState(<IManageWidgetStore>{
          widgetInfo: cloneDeep(veeForm.values),
        });
      })
      .finally(() => {
        mngWgStore.isLoading = false;
      });
  };

  // Cancel form - redirect to template page
  const onCancel = () => {
    createConfirm({
      iconType: 'warning',
      title: () => 'Discard Change',
      content: () => 'Do you want to leave edit form?',
      onOk: async () => {
        await push({
          name: 'WidgetManage',
          params: {
            type: veeForm.values.type,
          },
        });
      },
    });
  };

  const handleCopyConfig = (res: { setting: any; custom_setting: any }) => {
    copyWidgetSetting(veeForm, res);
  };
</script>

<template>
  <PageWrapper
    v-loading="mngWgStore.isLoading || !mngWgStore.hasBothDefaultAndNormalWidget"
    class="2xl:w-screen-xl xl:w-screen-lg mx-auto gap-4 pb-60px"
  >
    <div v-if="veeForm.values.id" class="grid gap-4 widget-form">
      <form v-if="mngWgStore.hasBothDefaultAndNormalWidget" class="form">
        <component :is="mngWgStore.selectedCpt" />
      </form>
    </div>

    <template #leftFooter>
      <div v-if="veeForm.values.id" class="w-full flex items-center justify-center space-x-2 my-3">
        <a-button class="w-150px" preIcon="ant-design:left-outlined" @click="onCancel">
          Cancel
        </a-button>

        <a-button
          v-show="!mngWgStore.isEmbeddedWidget"
          class="w-200px"
          preIcon="ant-design:copy-outlined"
          @click="
            openModal(true, {
              widget: veeForm.values,
              widget_type: mngWgStore.widgetTypeInfo,
            })
          "
        >
          Copy setting from
        </a-button>

        <a-button
          :disabled="!veeForm.meta.value.dirty"
          :loading="mngWgStore.isLoading"
          class="w-150px"
          preIcon="bx:save"
          type="primary"
          @click="onSubmit"
        >
          Update
        </a-button>
      </div>
    </template>

    <CopyConfigModal @register="registerModal" @selected="handleCopyConfig" />
  </PageWrapper>
</template>

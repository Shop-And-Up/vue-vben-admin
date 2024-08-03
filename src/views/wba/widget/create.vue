<script lang="ts" setup>
  import { cloneDeep } from 'lodash-es';
  import { useForm } from 'vee-validate';
  import { onBeforeMount, reactive, unref } from 'vue';
  import { useRouter } from 'vue-router';
  import * as Yup from 'yup';

  import { widgetCreate } from '@/api/wba/widget';
  import { PageWrapper } from '@/components/Page';
  import { useMessage } from '@/hooks/web/useMessage';
  import { actionType, copyWidgetSetting } from '@/views/wba/widget/service';
  import {
    IManageWidgetStore,
    useManageWidgetStore,
  } from '@/views/wba/widget/useManageWidgetStore';
  import CopyConfigModal from './partials/CopyConfigModal.vue';
  import { useModal } from '@/components/Modal';

  const { createConfirm, notification } = useMessage();
  const { push, currentRoute } = useRouter();
  const mngWgStore = useManageWidgetStore();
  const [registerModal, { openModal }] = useModal();

  const state = reactive({
    isCreating: false,
  });

  const veeForm = useForm<any>({
    validationSchema: Yup.object().shape({
      name: Yup.string().max(200).required().label('Name'),
    }),
  });

  onBeforeMount(() => {
    mngWgStore.setState(<IManageWidgetStore>{
      type: unref(currentRoute).params.type,
      actionType: actionType.create,
    });

    mngWgStore.getDefaultWidget().then(() => {
      const _tmpInfo: any = cloneDeep(mngWgStore.widgetTypeInfo.form);
      _tmpInfo.type = mngWgStore.type;
      _tmpInfo.name = mngWgStore.widgetTypeInfo.name;

      veeForm.resetForm({
        values: _tmpInfo,
      });
    });
  });

  // Submit form - show loading and redirect to edit page when create successfully
  const onSubmit = () => {
    veeForm.validate().then((res) => {
      if (res.valid) {
        // Success case
        state.isCreating = true;
        widgetCreate(veeForm.values)
          .then((result) => {
            push({
              name: 'WidgetEdit',
              params: {
                id: result.id,
                type: mngWgStore.type,
              },
            });
          })
          .finally(() => {
            state.isCreating = false;
          });
      } else {
        // Error case
        Object.keys(res.errors).forEach((key) => {
          notification.error({ message: 'Error', description: res.errors[key] });
        });
      }
    });
  };

  // Cancel form - redirect to template page
  const onCancel = () => {
    createConfirm({
      iconType: 'warning',
      title: () => 'Discard Change',
      content: () => 'Do you want to leave this form?',
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
    v-loading="mngWgStore.isLoading"
    class="2xl:w-screen-xl xl:w-screen-lg mx-auto gap-4 pb-60px"
  >
    <div class="grid gap-4 widget-form">
      <template v-if="veeForm.values.type">
        <form>
          <component :is="mngWgStore.selectedCpt" />
        </form>
      </template>
    </div>

    <template #leftFooter>
      <div class="w-full flex items-center justify-center space-x-2 my-3">
        <a-button class="w-150px" preIcon="ant-design:left-outlined" @click="onCancel">
          Cancel
        </a-button>

        <a-button
          :disabled="mngWgStore.hideSaveBtn"
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
          :disabled="mngWgStore.hideSaveBtn"
          :loading="state.isCreating"
          class="w-150px"
          preIcon="bx:save"
          type="primary"
          @click="onSubmit"
        >
          Create
        </a-button>
      </div>
    </template>

    <CopyConfigModal @register="registerModal" @selected="handleCopyConfig" />
  </PageWrapper>
</template>

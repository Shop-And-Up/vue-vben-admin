<script lang="ts" setup>
  import { cloneDeep } from 'lodash-es';
  import { useForm } from 'vee-validate';
  import { onBeforeMount, unref } from 'vue';
  import { useRouter } from 'vue-router';

  import { useModal } from '@/components/Modal';
  import { PageWrapper } from '@/components/Page';
  import CopyConfigModal from '@/views/wba/widget/partials/CopyConfigModal.vue';
  import {
    IManageWidgetStore,
    useManageWidgetStore,
  } from '@/views/wba/widget/useManageWidgetStore';
  import * as Yup from 'yup';
  import ListWidget from './list/index.vue';
  import { actionType, copyWidgetSetting, updateWidget } from './service';

  const mngWgStore = useManageWidgetStore();
  const { push, currentRoute } = useRouter();
  const [registerModal, { openModal }] = useModal();

  const veeForm = useForm<any>({
    validationSchema: Yup.object().shape({
      name: Yup.string().max(200).required().label('Name'),
    }),
  });

  onBeforeMount(() => {
    mngWgStore.setState(<IManageWidgetStore>{
      type: unref(currentRoute).params.type,
      actionType: actionType.manage,
    });

    mngWgStore.getDefaultWidget().then((defaultWidget) => {
      veeForm.resetForm({
        values: {
          ...cloneDeep(defaultWidget),
        },
      });
    });
  });

  const handleCopyConfig = (res: any) => {
    copyWidgetSetting(veeForm, res);
  };

  const onSubmit = () => {
    mngWgStore.isLoading = true;
    updateWidget(veeForm)
      .then(() => {
        // Update store
        mngWgStore.setState(<IManageWidgetStore>{
          defaultWidget: cloneDeep(veeForm.values),
        });
      })
      .finally(() => {
        mngWgStore.isLoading = false;
      });
  };

  const onCancel = () => {
    push({
      name: 'TemplatePage',
    });
  };
</script>

<template>
  <PageWrapper
    v-loading="mngWgStore.isLoading"
    class="2xl:w-screen-xl xl:w-screen-lg mx-auto gap-4 pb-60px"
  >
    <div class="grid gap-4 widget-form">
      <!-- Form -->
      <template v-if="veeForm.values.id">
        <ListWidget v-if="!mngWgStore.isEmbeddedWidget" />
        <form class="form">
          <component :is="mngWgStore.selectedCpt" />
        </form>
      </template>
    </div>

    <!-- Footer -->
    <template #leftFooter>
      <div v-if="veeForm.values.id" class="w-full flex items-center justify-center space-x-2 my-3">
        <a-button class="w-150px" preIcon="ant-design:left-outlined" @click="onCancel">
          Back
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

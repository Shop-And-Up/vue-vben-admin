<script lang="ts" setup>
  import {
    InputGroup as AInputGroup,
    InputNumber as AInputNumber,
    Upload as AUpload,
    Card,
    Select,
    SelectOption,
  } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';
  import { useForm } from 'vee-validate';
  import { onMounted, reactive } from 'vue';
  import { useRouter } from 'vue-router';

  import { getSettingAPI, updateMailSettingAPI } from '@/api/wba/shop';
  import { uploadImageApi } from '@/api/wba/upload';
  import Icon from '@/components/Icon/Icon.vue';
  import { useModal } from '@/components/Modal';
  import { PageWrapper } from '@/components/Page';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useUserStore } from '@/store/modules/user';
  import FormColorVue from '../components/FormColor.vue';
  import MailSettingPreview from './MailSettingPreview.vue';
  import VariantModal from './VariantModal.vue';

  const [registerVariantModal, { openModal }] = useModal();
  const { notification } = useMessage();

  const state = reactive({
    isLoading: true,
    statusList: <any>[
      { value: true, label: 'Automatically' },
      { value: false, label: 'Manually' },
    ],
  });

  const router = useRouter();
  const veeForm = useForm<any>();
  const { userInfo } = useUserStore();
  const [mailEnable, mailSettings] = veeForm.useFieldModel(['mail_enable', 'mail_settings']);

  onMounted(() => {
    getSettingAPI().then((res) => {
      veeForm.resetForm({ values: cloneDeep(res) });

      state.isLoading = false;
    });
  });

  const handleUpload = (file: any): Promise<any> => {
    state.isLoading = true;

    return uploadImageApi({ file }, (progressEvent) => {
      file.status = progressEvent.total == progressEvent.loaded ? 'done' : 'uploading';
      file.percent = ((progressEvent.loaded / progressEvent.total) * 100) | 0;
    }).then((res) => {
      file.url = res.data.result;
      mailSettings.value.mail_banner = file.url;
      state.isLoading = false;

      return false;
    });
  };

  const onSubmit = (testMode = false) => {
    veeForm.validate().then((res) => {
      if (res.valid) {
        // Success case
        state.isLoading = true;
        updateMailSettingAPI(veeForm.values, testMode)
          .then(() => {
            veeForm.resetForm({ values: cloneDeep(veeForm.values) });
            notification.success({
              message: 'Saved',
              description: 'The mail setting has been updated.',
            });
          })
          .finally(() => {
            state.isLoading = false;
          });
      } else {
        // Error case
        Object.keys(res.errors).forEach((key) => {
          notification.error({ message: 'Error', description: res.errors[key] });
        });
      }
    });
  };

  const goToOrderPage = () => {
    router.push({
      name: 'OrderPage',
    });
  };
</script>

<template>
  <PageWrapper v-loading="state.isLoading" class="pb-60px">
    <div class="rounded bg-blue-900 lg:relative mb-4">
      <div class="p-6">
        <div class="flex space-x-4">
          <div
            class="flex-shrink-0 !h-10 !w-10 grid place-content-center border border-gray-200 rounded bg-white"
          >
            <Icon icon="material-symbols:mail-outline" color="success" :size="24" />
          </div>
          <div>
            <div class="text-lg font-bold text-white"> Mail Setting </div>
            <div class="text-xs text-gray-300">
              Config mail setting to send review request via email base on
              <span class="!font-bold"> fulfilled orders. </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <form class="form">
      <div class="grid grid-cols-2 gap-4 widget-form" v-if="veeForm.values.id">
        <div class="col-span-2 md:col-span-1">
          <Card>
            <template #title>
              <div class="text-base font-bold">
                <span class="!mr-3"> Settings </span>

                <a-button
                  @click="goToOrderPage"
                  preIcon="ant-design:export"
                  size="small"
                  type="link"
                  class="!m-0 !p-0"
                >
                  Manage orders
                </a-button>
              </div>
            </template>

            <div class="grid grid-cols-2 gap-x-8 gap-y-4">
              <div class="col-span-2 xl:col-span-1">
                <div class="mb-1"> Schedule </div>
                <Select class="w-full" v-model:value="mailEnable" :options="state.statusList" />
              </div>
              <div class="col-span-2 xl:col-span-1" v-if="mailEnable">
                <div class="mb-1">
                  After receiving the <span class="!font-bold"> fulfilled orders </span>
                </div>
                <a-input-number v-model:value="mailSettings.schedule_time" :min="0" class="w-full">
                  <template #addonAfter>
                    <Select v-model:value="mailSettings.schedule_unit" class="!w-100px">
                      <SelectOption value="days">Days</SelectOption>
                      <SelectOption value="hours">Hours</SelectOption>
                    </Select>
                  </template>
                </a-input-number>
              </div>

              <div class="col-span-2 my-1 border-t border-dashed border-gray-200"></div>

              <div class="col-span-2">
                <div class="mb-1 flex justify-between">
                  <span>Subject</span>
                  <a-button
                    type="link"
                    preIcon="ant-design:exclamation-circle-outlined"
                    @click="openModal"
                  >
                    Variant list
                  </a-button>
                </div>
                <a-input v-model:value="mailSettings.mail_subject" />
              </div>

              <div class="col-span-2">
                <div class="mb-1 flex justify-between">
                  <span>Content</span>
                  <a-button
                    type="link"
                    preIcon="ant-design:exclamation-circle-outlined"
                    @click="openModal"
                  >
                    Variant list
                  </a-button>
                </div>
                <a-textarea
                  :auto-size="{
                    minRows: 4,
                  }"
                  v-model:value="mailSettings.mail_content"
                ></a-textarea>
              </div>

              <div class="col-span-2">
                <!-- <div class="mb-1"></div> -->
                <div class="mb-1 flex justify-between">
                  <span>Sub content</span>
                  <a-button
                    type="link"
                    preIcon="ant-design:exclamation-circle-outlined"
                    @click="openModal"
                  >
                    Variant list
                  </a-button>
                </div>
                <a-textarea
                  :auto-size="{
                    minRows: 2,
                  }"
                  v-model:value="mailSettings.mail_sub_content"
                ></a-textarea>
              </div>

              <div class="col-span-2">
                <div class="mb-1 flex justify-between">
                  <span>Footer</span>
                  <a-button
                    type="link"
                    preIcon="ant-design:exclamation-circle-outlined"
                    @click="openModal"
                  >
                    Variant list
                  </a-button>
                </div>
                <a-textarea
                  :auto-size="{
                    minRows: 2,
                  }"
                  v-model:value="mailSettings.mail_footer"
                ></a-textarea>
              </div>
            </div>

            <div class="my-4 border-t border-dashed border-gray-200"></div>

            <div class="grid grid-cols-2 gap-x-8 gap-y-4">
              <div class="col-span-2 lg:col-span-1">
                <div class="mb-1 section-subtitle">Background Color</div>
                <div>
                  <FormColorVue v-model="mailSettings.background_color" />
                </div>
              </div>

              <div class="col-span-2 lg:col-span-1">
                <div class="mb-1 section-subtitle">Frame Color</div>
                <div>
                  <FormColorVue v-model="mailSettings.frame_color" />
                </div>
              </div>

              <div class="col-span-2">
                <div class="mb-1 section-subtitle">Logo/Banner</div>
                <div class="mail-setting">
                  <a-upload
                    :beforeUpload="handleUpload"
                    class="!w-full"
                    :max-count="1"
                    @remove="() => false"
                    accept="image/*"
                  >
                    <a-button type="dashed" preIcon="ant-design:upload-outlined" class="!w-full">
                      Upload
                    </a-button>
                    <template #itemRender> </template>
                  </a-upload>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div class="col-span-2 md:col-span-1">
          <Card>
            <template #title>
              <div class="text-base font-bold">Preview</div>
            </template>

            <MailSettingPreview :settings="mailSettings"></MailSettingPreview>
          </Card>
        </div>
      </div>
    </form>

    <template #rightFooter>
      <div class="flex justify-end my-3" v-if="veeForm.values.id">
        <a-input-group compact>
          <a-button preIcon="ant-design:mail-outlined" @click="onSubmit(true)">
            Save & Send test mail to [{{ userInfo?.email }}]
          </a-button>
        </a-input-group>

        <a-button
          @click="onSubmit()"
          :disabled="!veeForm.meta.value.dirty"
          :loading="state.isLoading"
          class="w-150px"
          preIcon="bx:save"
          type="primary"
        >
          Save
        </a-button>
      </div>
    </template>

    <VariantModal @register="registerVariantModal" />
  </PageWrapper>
</template>

<style lang="less" scoped></style>

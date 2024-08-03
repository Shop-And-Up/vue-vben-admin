<script lang="ts" setup>
  import { ref } from 'vue';
  import { Rate, Upload, Avatar as AAvatar } from 'ant-design-vue';

  import { uploadImageApi } from '@/api/wba/upload';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { ModalPayload, Testimonial } from './FieldReview.vue';

  const emit = defineEmits(['save']);
  const [register, { closeModal, setModalProps }] = useModalInner((data) => {
    data && initData(data);
  });

  const reviewRef = ref<Testimonial>();
  const idRef = ref();

  function initData(data: ModalPayload) {
    reviewRef.value = data.review;
    idRef.value = data.id;
  }

  const handleSave = () => {
    emit('save', {
      review: reviewRef.value,
      id: idRef.value,
    });

    closeModal();
  };

  const uploadAvatar = (file): Promise<any> => {
    setModalProps({ loading: true, confirmLoading: true });

    return uploadImageApi({ file }, () => {})
      .then((res: any) => {
        reviewRef.value!.avatar = res.data.result;
      })
      .finally(() => {
        setModalProps({ loading: false, confirmLoading: false });
      });
  };
</script>

<template>
  <BasicModal
    v-bind="$attrs"
    title="Testimonial form"
    @register="register"
    @ok="handleSave"
    okText="Save"
    width="700px"
  >
    <div v-if="reviewRef">
      <div class="grid grid-cols-12 gap-5">
        <div class="col-start-6 col-span-12 md:col-span-6">
          <div class="mb-1 font-medium">Name</div>
          <a-input v-model:value="reviewRef!.name" />
        </div>

        <div class="col-span-12 md:col-span-6">
          <div class="mb-1 font-medium">Caption</div>
          <a-input v-model:value="reviewRef!.caption" />
        </div>

        <div class="col-span-12 md:col-span-6">
          <div class="mb-1 font-medium">Avatar</div>
          <div
            class="flex justify-between w-full border border-gray-200 rounded px-3 items-center h-50px"
          >
            <a-avatar :src="reviewRef!.avatar" />

            <Upload name="avatar" accept="image/*" :action="uploadAvatar" :showUploadList="false">
              <a-button type="link" preIcon="ant-design:upload-outlined"> Change </a-button>
            </Upload>
          </div>
        </div>

        <div class="col-span-12 md:col-span-6">
          <div class="mb-1 font-medium">Rating</div>
          <div class="flex items-center border border-gray-200 rounded px-3 h-50px">
            <Rate v-model:value="reviewRef!.rate" />
          </div>
        </div>

        <div class="col-span-12">
          <div class="mb-1 font-medium">Message</div>
          <a-textarea v-model:value="reviewRef!.message" auto-size />
        </div>
      </div>
    </div>
  </BasicModal>
</template>

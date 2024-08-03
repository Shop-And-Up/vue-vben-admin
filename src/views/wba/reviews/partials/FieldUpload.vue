<script lang="ts" setup>
  import { computed, PropType, reactive } from 'vue';
  import { Image as AImage, Modal as AModal, Popconfirm, Upload as AUpload } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { uploadImageApi } from '@/api/wba/upload';
  import { sortBy } from 'lodash-es';
  import { Loading } from '@/components/Loading';

  const emit = defineEmits(['update:value', 'ratioChange']);
  const props = defineProps({
    value: { type: Array as PropType<any[]>, required: true },
  });

  const fileList = computed<any[]>({
    get: () =>
      props.value.map((c, index) => {
        return {
          uid: index,
          rotate: c.rotate,
          name: null,
          status: 'done',
          url: c.url,
        };
      }),
    set: (val: any) => {
      // Update ratio
      setTimeout(updateRatio, 2000);

      // Update file list change
      emit('update:value', val);
    },
  });

  const state = reactive({
    isLoading: false,
    isShowPreview: false,
    previewImage: null,
    previewImageRotate: null,
  });

  const updateRatio = () => {
    let ratioVal: any = null;
    if (fileList.value.length) {
      const el = new Image();
      el.src = fileList.value[0].url;
      ratioVal = el.naturalHeight ? ((el.naturalHeight * 100) / el.naturalWidth).toFixed(2) : null;
    }

    emit('ratioChange', ratioVal);
  };

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = (await getBase64(file.originFileObj)) as string;
    }

    state.previewImage = file.url || file.preview;
    state.isShowPreview = true;
    state.previewImageRotate = file.rotate;

    function getBase64(file: File) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    }
  };

  const handleCancel = () => {
    state.isShowPreview = false;
  };

  const handleUpload = async (file: any): Promise<any> => {
    if (fileList.value.length >= 5) {
      return Promise.resolve(false);
    }

    // Upload image
    state.isLoading = true;
    fileList.value.push(file);
    const res = await uploadImageApi({ file }, (progressEvent) => {
      file.status = progressEvent.total == progressEvent.loaded ? 'done' : 'uploading';
      file.percent = ((progressEvent.loaded / progressEvent.total) * 100) | 0;
    });
    file.url = res.data.result;
    state.isLoading = false;

    // Update ratio
    setTimeout(updateRatio, 2000);

    return false;
  };

  const handleRemove = (file: any) => {
    fileList.value = fileList.value.filter((c) => c.uid != file.uid);

    // Update ratio
    setTimeout(updateRatio, 2000);
  };

  const handlePin = (file: any) => {
    // fileList.value = fileList.value.filter((c) => c.uid != file.uid);
    fileList.value = sortBy(fileList.value, ({ uid }) => (uid === file.uid ? 0 : 1));

    // Update ratio
    setTimeout(updateRatio, 2000);
  };

  const handleRotate = (file: any) => {
    if (file.rotate === undefined) {
      file.rotate = -90;
    } else {
      file.rotate -= 90;
    }

    // Trigger change
    fileList.value = fileList.value;
  };

  const isFirstImage = (file: any) => {
    return fileList.value[0].uid == file.uid;
  };
</script>

<template>
  <a-upload
    v-model:file-list="fileList"
    :beforeUpload="handleUpload"
    :max-count="5"
    @preview="handlePreview"
    @remove="() => false"
    list-type="picture-card"
    accept="image/*"
    multiple
  >
    <Loading :loading="state.isLoading" :absolute="true" />

    <div v-if="fileList.length < 5">
      <Icon class="!text-gray-600" size="20" icon="ant-design:cloud-upload-outlined" />
      <div> Upload</div>
    </div>

    <template #itemRender="{ file, actions }">
      <div class="relative h-full w-full group">
        <div class="overflow-hidden h-full w-full rounded-md">
          <AImage
            wrapperClassName="h-full w-full"
            :loading="true"
            class="!w-full !h-full !object-cover"
            :style="{
              transform: `rotate(${file.rotate}deg)`,
            }"
            :preview="{ visible: false }"
            :previewMask="false"
            :src="file.url"
            fallback="/assets/img/no-image.png"
          />
        </div>
        <div class="rounded-full group-hover:grid top-2px left-2px border-red-500 !text-red-500">
          <Popconfirm
            placement="top"
            title="Do you want to delete this item?"
            ok-text="Yes"
            cancel-text="No"
            @confirm="handleRemove(file)"
          >
            <Icon icon="bx:trash" size="20" />
          </Popconfirm>
        </div>
        <div
          v-if="!isFirstImage(file)"
          class="rounded-full group-hover:grid top-2px right-2px border-blue-500 !text-blue-500"
        >
          <Icon @click="handlePin(file)" icon="ant-design:pushpin-outlined" size="20" />
        </div>
        <div
          class="rounded-full group-hover:grid bottom-2px left-2px border-blue-500 !text-blue-500"
        >
          <Icon @click="actions.download" icon="ant-design:cloud-download-outlined" size="20" />
        </div>
        <div
          class="rounded-full group-hover:grid bottom-35px right-35px border-blue-500 !text-blue-500"
        >
          <Icon @click="actions.preview" icon="ant-design:eye-twotone" size="20" />
        </div>
        <div
          class="rounded-full group-hover:grid bottom-2px right-2px border-blue-500 !text-blue-500"
        >
          <Icon @click="handleRotate(file)" icon="ant-design:rotate-left-outlined" size="20" />
        </div>
      </div>
    </template>
  </a-upload>

  <a-modal
    wrapClassName="bg-green"
    dialogClass="bg-red"
    v-model:open="state.isShowPreview"
    :footer="null"
    @cancel="handleCancel"
  >
    <img
      alt="preview image"
      class="w-full"
      :src="state.previewImage"
      :style="{
        transform: `rotate(${state.previewImageRotate}deg)`,
      }"
    />
  </a-modal>
</template>

<style lang="less">
  .bg-green {
    .ant-modal-content {
      background-color: transparent;
      box-shadow: none !important;
    }
  }

  .rounded-full {
    @apply w-34px h-34px hidden place-content-center bg-white absolute border border-solid cursor-pointer;
  }
</style>

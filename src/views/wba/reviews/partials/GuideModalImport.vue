<script lang="ts" setup>
  import { ref, computed } from 'vue';

  import type { UploadProps } from 'ant-design-vue';
  import { Upload, Radio } from 'ant-design-vue';

  import { reviewsImportCSVAPI } from '@/api/wba/reviews';
  import Icon from '@/components/Icon/Icon.vue';
  import { useMessage } from '@/hooks/web/useMessage';

  const RadioGroup = Radio.Group;
  const RadioButton = Radio.Button;

  const emit = defineEmits(['success']);
  const { notification } = useMessage();

  const uploading = ref<boolean>(false);
  const fileList = ref<any>([]);
  const currentType = computed(() => {
    return csvTypes.find((c) => c.value == fileType.value);
  });

  const handleRemove: UploadProps['onRemove'] = (file) => {
    const index = fileList.value.indexOf(file);
    const newFileList = fileList.value.slice();
    newFileList.splice(index, 1);
    fileList.value = newFileList;
  };

  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    fileList.value = [file];
    return false;
  };

  const handleUpload = () => {
    const formData = new FormData();
    fileList.value.forEach((file: UploadProps['fileList'][number]) => {
      formData.append('files[]', file as any);
    });

    uploading.value = true;

    reviewsImportCSVAPI({
      file: fileList.value[0],
      data: { type: fileType.value },
    })
      .then((e) => {
        if (e.code) {
          notification.error({
            message: 'Error',
            description: e.message,
            duration: 5,
          });
        } else {
          notification.success({
            message: `Success `,
            description: `${e.result.total} items have been imported`,
            duration: 5,
          });

          emit('success');
        }
      })
      .finally(() => {
        fileList.value = [];
        uploading.value = false;
      });
  };

  const fileType = ref<any>('ecom');
  const csvTypes = [
    {
      logo: '/assets/img/ecom.png',
      file: '/assets/csv/real_reviews_template.csv',
      label: import.meta.env.VITE_GLOB_APP_TITLE,
      value: 'ecom',
    },
    {
      logo: '/assets/img/loox.jpg',
      file: '/assets/csv/loox_template.csv',
      label: 'Loox Reviews',
      value: 'loox',
    },
  ];
</script>

<template>
  <div class="flex flex-col justify-center items-center space-y-10 mt-3">
    <RadioGroup v-model:value="fileType" button-style="solid">
      <RadioButton
        class="w-150px text-center"
        v-for="item in csvTypes"
        :key="item.value"
        :value="item.value"
      >
        {{ item.label }}
      </RadioButton>
    </RadioGroup>

    <div>
      <div class="text-center text-sm">
        1. <a class="text-blue-500" download :href="currentType!.file">Click here</a> to download
        <span class="font-bold"> {{ currentType!.label }} </span>

        [
        <img
          class="w-28px h-28px object-cover inline-block"
          :src="currentType!.logo"
          :alt="currentType!.label"
        />
        ] template file and <span class="font-bold">fill data</span> into your file.
      </div>

      <Upload
        class="flex flex-col items-center justify-center mt-5"
        accept=".csv"
        :file-list="fileList"
        :before-upload="beforeUpload"
        @remove="handleRemove"
      >
        <a-button>
          <Icon :size="12" icon="ant-design:upload-outlined" />
          2. Upload your {{ currentType!.label }} CSV file
        </a-button>
      </Upload>
    </div>

    <a-button
      class="w-150px"
      type="primary"
      :disabled="fileList.length === 0"
      :loading="uploading"
      @click="handleUpload"
    >
      3. Submit
    </a-button>
  </div>
</template>

<style lang="less" scoped></style>

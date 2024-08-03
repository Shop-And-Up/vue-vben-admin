<script lang="ts" setup>
  import { computed } from 'vue';
  import { useFormValues } from 'vee-validate';

  import { useModal } from '@/components/Modal';
  import { generateEmbedCode } from '@coreThemeExt/index';
  import UseEmbedCodeGuide from './modals/UseEmbedCodeGuide.vue';
  import { copyText } from '@/utils/copyTextToClipboard';

  const [regUseEmbedCodeModal, { openModal: openUseEmbedModal }] = useModal();

  const formValues = useFormValues();

  const embedCode = computed(() => {
    return generateEmbedCode(formValues.value.type, formValues.value.block_id);
  });
</script>

<template>
  <div>
    <UseEmbedCodeGuide @register="regUseEmbedCodeModal" />
    <div v-if="!formValues.page_type" class="flex-row items-center space-y-2 w-full">
      There are some special pages, sections or blocks that we
      <span class="font-semibold"> can not add app blocks </span>, such as the
      <span class="font-semibold"> Featured Product Block </span>. In this case, we should use
      <span class="font-semibold"> Embed Code </span> to add the widget manually.

      <a-textarea :value="embedCode" readonly :rows="4" class="!text-gray-500" />

      <div class="flex items-center justify-between">
        <a-button
          :iconSize="14"
          class="!text-13px"
          preIcon="ant-design:question-circle-outlined"
          size="small"
          type="link"
          @click="openUseEmbedModal(true, {})"
        >
          How to use
        </a-button>
        <a-button
          preIcon="ant-design:copy-outlined"
          type="primary"
          @click="copyText(embedCode, 'Embedded code has been copied.')"
        >
          Copy code
        </a-button>
      </div>
    </div>
  </div>
</template>

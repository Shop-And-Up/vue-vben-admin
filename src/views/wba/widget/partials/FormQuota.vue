<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { Badge as ABadge, Card as ACard } from 'ant-design-vue';
  import { useFormValues } from 'vee-validate';

  import { useModal } from '@/components/Modal';
  import { generateEmbedCode } from '@coreThemeExt/index';

  import ChangePageModal from './modals/ChangePageModal.vue';
  import UseAppBlockWidgetGuide from './modals/UseAppBlockWidgetGuide.vue';
  import UseGlobalWidgetGuide from './modals/UseGlobalWidgetGuide.vue';
  import UseEmbedCodeGuide from './modals/UseEmbedCodeGuide.vue';
  import { useManageWidgetStore } from '@/views/wba/widget/useManageWidgetStore';
  import { copyText } from '@/utils/copyTextToClipboard';

  const [regGlobalWidgetModal, { openModal: openGlobalWidgetModal }] = useModal();
  const [regUseEmbedCodeModal, { openModal: openUseEmbedModal }] = useModal();
  const [regUseShopifyModal, { openModal: openUseShopifyModal }] = useModal();
  const [regUseChangePageModal, { openModal: openUseChangePageModal }] = useModal();

  const mngWgStore = useManageWidgetStore();
  const formValues = useFormValues();

  const openGuide = () => {
    if (mngWgStore.isEmbeddedWidget) {
      openGlobalWidgetModal(true, {});
      return;
    }

    if (formValues.value.page_type) {
      openUseShopifyModal(true, {});
      return;
    }

    openUseEmbedModal(true, {});
    return;
  };

  const changePageHandle = (pageType) => {
    formValues.value.page_type = pageType;

    if (pageType == 'index') {
      formValues.value.page_name = 'Home';
    } else {
      formValues.value.page_name = pageType
        .toLowerCase()
        .split('-')
        .map(function (word) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
    }
  };

  const embedCode = computed(() => {
    return generateEmbedCode(formValues.value.type, formValues.value.block_id);
  });
</script>

<template>
  <div>
    <UseGlobalWidgetGuide :widgetType="formValues.type" @register="regGlobalWidgetModal" />
    <UseEmbedCodeGuide @register="regUseEmbedCodeModal" />
    <UseAppBlockWidgetGuide @register="regUseShopifyModal" />

    <ChangePageModal
      :widget="formValues"
      @register="regUseChangePageModal"
      @selected="changePageHandle"
    />

    <a-card class="px-2">
      <!-- <div class="mb-2 flex space-x-2 justify-start items-end">
        <div class="text-base font-bold">Overview</div>
        <a-button
          :iconSize="14"
          class="!text-13px"
          preIcon="ant-design:question-circle-outlined"
          size="small"
          type="link"
          @click="openGuide"
        >
          Customize with Shopify Editor
        </a-button>
      </div> -->
      <div class="flex flex-wrap items-center w-full">
        <div v-if="!mngWgStore.isEmbeddedWidget" class="statistic">
          <div class="name">
            <a-badge color="blue" text="Placement: " />
          </div>
          <div class="detail">
            <template v-if="formValues.page_type">
              {{ formValues.page_name }} page
              <span class="mx-2"> | </span>
              <a-button
                preIcon="bx:edit"
                size="small"
                type="primary"
                @click="openUseChangePageModal(true, {})"
              >
                Change position
              </a-button>

              <a-button
                :iconSize="14"
                class="!text-13px"
                preIcon="ant-design:question-circle-outlined"
                size="small"
                type="link"
                @click="openGuide"
              >
                Customize with Shopify Editor
              </a-button>
            </template>
            <template v-else> Manually</template>
          </div>
        </div>

        <!-- <div class="statistic">
          <div class="name">
            <a-badge color="blue" text="Total views: " />
          </div>
          <div class="detail">
            {{ formValues.view ?? 0 }}
          </div>
        </div>

        <div class="statistic">
          <div class="name">
            <a-badge color="blue" text="Total click: " />
          </div>
          <div class="detail">
            {{ formValues.click ?? 0 }}
          </div>
        </div> -->

        <div class="statistic">
          <div class="name">
            <a-badge color="blue" text="Created at:" />
          </div>
          <div class="detail"> {{ formValues.created_at.substr(0, 10) }}</div>
        </div>
      </div>

      <div v-if="!mngWgStore.isEmbeddedWidget && !formValues.page_type" class="btn-group mt-20px">
        <a-input
          :value="embedCode"
          addon-before="Embedded code"
          class="flex-grow !text-gray-500"
          readonly
        />
        <a-button
          class="!w-150px flex-shrink-0"
          preIcon="ant-design:copy-outlined"
          type="primary"
          @click="copyText(embedCode, 'Embedded code has been copied.')"
        >
          Copy code
        </a-button>
        <a-button
          class="!w-150px flex-shrink-0"
          postIcon="ant-design:question-circle-outlined"
          type="primary"
          @click="openGuide"
        >
          How to use
        </a-button>
      </div>
    </a-card>
  </div>
</template>

<style lang="less" scoped>
  .statistic {
    @apply flex mr-20;

    .name {
      @apply w-100px font-semibold;
    }

    .detail {
      @apply capitalize min-w-180px xl: min-w-max flex;
    }
  }

  .btn-group {
    @apply flex items-center space-x-3 w-full;
  }
</style>

<script lang="ts" setup>
  import { useField } from 'vee-validate';
  import { Radio } from 'ant-design-vue';
  import _ from 'lodash-es';

  import { useModal } from '@/components/Modal';
  import FieldReviewHelperModal from './FieldReviewHelperModal.vue';
  import FieldReviewManualModal from './FieldReviewManualModal.vue';
  import FieldReviewPreview from './FieldReviewPreview.vue';

  const ARadioGroup = Radio.Group;

  const radioStyle = {
    display: 'flex',
    height: '30px',
    lineHeight: '30px',
  };
  const [registerModal, { openModal }] = useModal();
  const [registerManualModal, { openModal: openManualModal }] = useModal();

  const { value: dataType } = useField('custom_setting.data_type');
  const { value: reivewList } = useField<any[]>('custom_setting.data');

  const handleAddChange = (reviews: any[]) => {
    reivewList.value = _.concat(reivewList.value, reviews);
    reivewList.value = _.uniqWith(reivewList.value, _.isEqual);
  };
</script>

<template>
  <div class="pl-2">
    <div class="font-bold mb-2"> Choose data from the sources listed below: </div>
    <div class="pl-4 w-full">
      <ARadioGroup class="pl-4 w-full" v-model:value="dataType">
        <Radio :style="radioStyle" value="best_reviews" class="w-full h-full">
          <div class="flex justify-between items-center w-full">
            <div> Best reviews from your all reviews </div>
            <a-button
              @click="openModal(true, dataType)"
              v-if="dataType == 'best_reviews'"
              type="link"
              size="small"
              class="ml-4"
            >
              How to collapse!
            </a-button>
          </div>
        </Radio>
        <Radio :style="radioStyle" value="verified_reviews" class="w-full h-full">
          <div class="flex justify-between items-center w-full">
            <div> Only verified reviews </div>
            <a-button
              @click="openModal(true, dataType)"
              v-if="dataType == 'verified_reviews'"
              type="link"
              size="small"
              class="ml-4"
            >
              How to verify!
            </a-button>
          </div>
        </Radio>
        <Radio :style="radioStyle" value="manual" class="w-full h-full">
          <div class="flex justify-between items-center w-full">
            <div> Manual</div>
            <a-button
              @click="openManualModal(true)"
              v-if="dataType == 'manual'"
              type="primary"
              size="small"
              class="ml-4"
            >
              + Add
            </a-button>
          </div>
        </Radio>
      </ARadioGroup>
    </div>

    <div class="mt-5">
      <FieldReviewPreview />
    </div>

    <FieldReviewHelperModal @register="registerModal" />
    <FieldReviewManualModal @added="handleAddChange" @register="registerManualModal" />
  </div>
</template>

<style lang="less" scoped></style>

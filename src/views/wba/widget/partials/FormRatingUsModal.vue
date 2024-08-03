<script lang="ts" setup>
  import { reactive } from 'vue';
  import { Rate, Form, FormItem, Row, Col } from 'ant-design-vue';

  import { BasicModal, useModalInner } from '@/components/Modal';
  import { sendImproveFeedback } from '@/api/wba/shop';
  import { appUrl } from '@coreThemeExt/components/utils';

  const [register, { closeModal }] = useModalInner();

  const state = reactive({
    rate: null,
    feedback: '',
    isLoading: false,
  });

  const handleSubmit = () => {
    state.isLoading = true;
    sendImproveFeedback(state).finally(() => {
      state.isLoading = false;
      closeModal();
    });
  };

  function handleVisibleChange(v) {
    state.rate = null;
    state.feedback = '';
  }

  const rateChange = (val) => {
    if (val > 4) {
      const url = appUrl + '#modal-show=ReviewListingModal';
      window.open(url, '_blank');
      closeModal();
    }
  };
</script>

<template>
  <BasicModal
    :loading="state.isLoading"
    :confirm-loading="state.isLoading"
    :canFullscreen="false"
    :okButtonProps="{
      disabled: !state.rate,
    }"
    okText="Submit"
    v-bind="$attrs"
    title="Rating Us"
    @register="register"
    @ok="handleSubmit"
    width="500px"
    @visible-change="handleVisibleChange"
  >
    <Form layout="vertical" class="!mx-5 !mt-2">
      <Row :gutter="24">
        <Col :span="24">
          <FormItem label="Rate">
            <Rate @change="rateChange" v-model:value="state.rate" :allowClear="false" />
          </FormItem>
        </Col>
      </Row>

      <!-- <transition name="fade-slide"> -->
      <!-- v-show="state.rate && state.rate < 4" -->
      <Row :gutter="24">
        <Col :span="24">
          <FormItem label="Feedback">
            <a-textarea v-model:value="state.feedback" :auto-size="{ minRows: 4 }" />
          </FormItem>
        </Col>
      </Row>
      <!-- </transition> -->
    </Form>
  </BasicModal>
</template>

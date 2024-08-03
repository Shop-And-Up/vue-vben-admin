<script setup lang="ts">
  import { reactive, onMounted, onUnmounted } from 'vue';
  import { useForm } from 'vee-validate';
  import { Steps } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';
  import { Channel } from 'pusher-js';

  import Step1SetupWidgets from './Step1SetupWidgets.vue';
  import Step2Install from './Step2Install.vue';
  import Step3Preview from './Step3Preview.vue';

  import PusherService from '@/plugins/pusher';
  import { useUserStore } from '@/store/modules/user';
  import { postOnboard } from '@/api/wba/shop';
  import { PageWrapper } from '@/components/Page';
  import { WidgetTemplates } from '../widget-config';

  const cookieTemplate = cloneDeep(WidgetTemplates.find((c) => c.id == 'cookie_consent'));
  const Step = Steps.Step;
  const userStore = useUserStore();

  const state = reactive({
    current: 0,
    percentage: 0,
    cookieForm: useForm<any>({
      initialValues: {
        ...cloneDeep(cookieTemplate?.form),
        type: cookieTemplate?.id,
      },
    }),
  });

  // Handle pusher - sync state
  let onboardPs: Channel;

  onMounted(() => {
    onboardPs = PusherService.subscribe().bind('onboard', async (info: { percentage: number }) => {
      // Update percentage for step 2
      if (state.current == 1) {
        state.percentage = info.percentage;
        if (info.percentage >= 100) {
          state.percentage = 100;
          handleStep2Next();
        }
      }
    });
  });

  onUnmounted(() => {
    if (onboardPs) {
      onboardPs.unbind_all().unsubscribe();
    }
  });

  function handleStep1Next(payload: { widgets: any[]; theme_id: any }) {
    state.current = 1;
    state.percentage = 10;

    postOnboard(payload).then(() => {});
  }

  function handleStep2Next() {
    state.current = 2;

    // Reload new shop info
    userStore.validUserInfoAction();
  }
</script>

<template>
  <PageWrapper contentClass="p-4">
    <div class="flex flex-col space-y-8">
      <div class="flex justify-center items-center">
        <Steps :current="state.current" :percent="state.percentage" class="max-w-800px">
          <Step title="Setup Widgets" />
          <Step title="In Progress" />
          <Step title="Preview" />
        </Steps>
      </div>

      <Step1SetupWidgets v-show="state.current === 0" @next="handleStep1Next" />
      <Step2Install v-show="state.current === 1" />
      <Step3Preview v-show="state.current === 2" />
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
  import { CrispOpenWithText } from '@/plugins/crisp';
  import { useUserStore } from '@/store/modules/user';

  const userStore = useUserStore();

  const handleSupport = () => {
    CrispOpenWithText('Hi! Please help me customize all of my widgets.');
  };

  const handleGotoDashboard = () => {
    userStore.loginWithToken({ token: userStore.getToken, goHome: true });
  };
</script>

<template>
  <div class="grid grid-cols-4 gap-4">
    <div class="col-span-4 flex items-center justify-center">
      <div class="text-2xl font-medium">
        Are you satisfied with the appearance of the widgets?
      </div>
    </div>
    <div class="col-span-4 flex items-center justify-center">
      <div>
        Could you please verify the widgets on
        <a @click="userStore.goToStore" class="text-blue-600 font-semibold">your store</a> directly
        and inform us if everything appears satisfactory?
      </div>
    </div>
    <div class="col-span-4 flex items-center justify-center font-medium">
      <a-button @click="handleGotoDashboard" type="primary" size="large">
        Yes, it looks great!
      </a-button>
      <a-button @click="handleSupport" type="link"> No, please help me customize them </a-button>
    </div>
  </div>
</template>

<style lang="less" scoped></style>

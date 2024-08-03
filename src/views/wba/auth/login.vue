<script lang="ts" setup>
  import { Form as AForm, FormItem } from 'ant-design-vue';
  import { Field, Form } from 'vee-validate';
  import { ref } from 'vue';
  import * as Yup from 'yup';

  import { useGlobSetting } from '@/hooks/setting';
  import { useDesign } from '@/hooks/web/useDesign';

  const { prefixCls } = useDesign('login');
  const { apiUrl } = useGlobSetting();
  const isLoading = ref(false);

  // Define form
  const formRules = Yup.object().shape({
    domain: Yup.string().required().label('Domain'),
  });

  const handleSubmit = (formValue) => {
    isLoading.value = true;
    const url =
      apiUrl +
      '/auth/generate?subdomain=' +
      formValue.domain
        .replace(/\s/g, '')
        .replace('https://', '')
        .replace('http://', '')
        .replace('.myshopify.com', '');

    window.location.href = url;
  };
</script>

<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <div class="container relative h-full py-2 mx-auto sm:px-10">
      <div class="flex h-full">
        <div class="hidden min-h-full pl-4 mr-4 xl:flex xl:flex-col xl:w-6/12">
          <div class="my-auto">
            <img src="../../../assets/images/logo.png" class="w-1/4 -mt-16 -enter-x" />
            <div class="mt-10 font-medium text-white -enter-x">
              <span class="inline-block mt-4 text-3xl"> All real reviews in One App </span>
            </div>
            <!-- <div class="mt-5 font-normal text-white text-md dark:text-gray-500 -enter-x">
              Drag and drop multiple widget across your storefronts and no need for coding or
              time-wasting.
            </div> -->
          </div>
        </div>
        <div class="flex w-full h-full py-5 xl:h-auto xl:py-0 xl:my-0 xl:w-6/12">
          <div
            :class="`${prefixCls}-form`"
            class="relative w-full px-5 py-8 mx-auto my-auto rounded-md shadow-md xl:ml-16 xl:bg-transparent sm:px-8 xl:p-4 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto enter-x"
          >
            <div>
              <h2 class="mb-3 text-2xl font-bold text-center xl:text-3xl enter-x xl:text-left">
                Sign in
              </h2>
              <!-- Add AForm to include error validate css -->
              <AForm />
              <Form
                class="flex flex-col space-y-1 mt-8 enter-x"
                @submit="handleSubmit"
                :validation-schema="formRules"
              >
                <Field name="domain" v-slot="{ value, handleChange, errorMessage }">
                  <FormItem
                    :help="errorMessage"
                    :validate-status="errorMessage ? 'error' : 'success'"
                  >
                    <a-input
                      :disabled="isLoading"
                      size="large"
                      placeholder="Shopify domain"
                      class="fix-auto-fill"
                      :value="value"
                      name="domain"
                      @update:value="handleChange"
                    >
                      <template #suffix>
                        <span class="text-gray-500">.myshopify.com</span>
                      </template>
                    </a-input>
                  </FormItem>
                </Field>
                <div class="enter-x">
                  <a-button
                    type="primary"
                    size="large"
                    block
                    htmlType="submit"
                    :loading="isLoading"
                  >
                    Submit
                  </a-button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  /* stylelint-disable media-query-no-invalid */
  @prefix-cls: ~'@{namespace}-login';
  @logo-prefix-cls: ~'@{namespace}-app-logo';

  .@{prefix-cls} {
    min-height: 100%;
    overflow: hidden;

    @media (max-width: @screen-xl) {
      background-color: #293146;

      .@{prefix-cls}-form {
        background-color: #fff;
      }
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      margin-left: -48%;
      background-image: url('@/assets/svg/login-bg.svg');
      background-repeat: no-repeat;
      background-position: 100%;
      background-size: auto 100%;

      @media (max-width: @screen-xl) {
        display: none;
      }
    }

    .@{logo-prefix-cls} {
      position: absolute;
      top: 12px;
      height: 30px;

      &__title {
        color: #fff;
        font-size: 16px;
      }

      img {
        width: 32px;
      }
    }

    .container {
      .@{logo-prefix-cls} {
        display: flex;
        width: 60%;
        height: 80px;

        &__title {
          color: #fff;
          font-size: 24px;
        }

        img {
          width: 48px;
        }
      }
    }

    .ant-row {
      display: block;
    }
  }
</style>

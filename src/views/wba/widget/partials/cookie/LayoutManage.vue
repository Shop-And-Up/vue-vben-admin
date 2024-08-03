<script lang="ts" setup>
  import { CaretRightOutlined } from '@ant-design/icons-vue';
  import {
    Affix,
    Card,
    Collapse,
    CollapsePanel,
    Radio,
    RadioGroup,
    Select,
    Slider,
    Switch,
  } from 'ant-design-vue';
  import { computed, onMounted, onUnmounted, ref } from 'vue';

  import { useModal } from '@/components/Modal';
  import { useUserStore } from '@/store/modules/user';
  import { useField, useFormValues } from 'vee-validate';

  import { CookieWidget } from '@coreThemeExt';

  import FullPreviewModal from '@/views/wba/widget/partials/FullPreviewModal.vue';
  import FormColorVue from '../../../components/FormColor.vue';
  import FormEditorVue from '../../../components/FormEditor.vue';

  const userStore = useUserStore();
  const formValue = useFormValues();

  const [registerModal, { openModal }] = useModal();

  const { value: position } = useField('setting.position');
  const { value: display_on_page } = useField('setting.display_on_page');
  const { value: background_color } = useField('setting.background_color');
  const { value: cookie_icon } = useField('setting.cookie_icon');
  const { value: cookie_type } = useField('setting.cookie_type');

  const { value: content_message } = useField('setting.content_message');
  const { value: content_color } = useField('setting.content_color');
  const { value: content_font_size } = useField('setting.content_font_size');
  const { value: content_text_align } = useField('setting.content_text_align');

  const { value: accept_btn_text } = useField('setting.accept_btn_text');
  const { value: accept_btn_font_size } = useField('setting.accept_btn_font_size');
  const { value: accept_btn_background } = useField('setting.accept_btn_background');
  const { value: accept_btn_color } = useField('setting.accept_btn_color');

  const { value: decline_btn_text } = useField('setting.decline_btn_text');
  const { value: decline_btn_font_size } = useField('setting.decline_btn_font_size');
  const { value: decline_btn_background } = useField('setting.decline_btn_background');
  const { value: decline_btn_color } = useField('setting.decline_btn_color');

  const { value: confirm_btn_text } = useField('setting.confirm_btn_text');
  const { value: confirm_btn_font_size } = useField('setting.confirm_btn_font_size');
  const { value: confirm_btn_background } = useField('setting.confirm_btn_background');
  const { value: confirm_btn_color } = useField('setting.confirm_btn_color');

  const cookieIcons = [
    { value: 'basic', label: 'Basic' },
    { value: 'blur', label: 'Blur' },
    { value: 'clean', label: 'Clean' },
  ];

  const alignList = [
    { value: 'left', label: 'Left' },
    { value: 'center', label: 'Center' },
    { value: 'right', label: 'Right' },
  ];

  const referenceAfixx = ref();

  onMounted(() => {
    window.addEventListener('scroll', handleScrollEvent, true);
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScrollEvent, true);
  });

  const handleScrollEvent = () => {
    referenceAfixx.value.updatePosition();
  };

  const quotaVisibleLogo = computed(() => {
    return userStore.getQuotaLogo;
  });

  const positionChange = (el: any) => {
    display_on_page.value = el.target.value;
  };
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <div class="col-span-2 md:col-span-1">
      <Card>
        <template #title>
          <div class="flex items-center justify-between h-30px">
            <div class="text-base font-bold">Setting</div>
            <Switch
              :checked="formValue.is_show"
              @change="formValue.is_show = !formValue.is_show"
              checked-children="Enable"
              un-checked-children="Disable"
            />
          </div>
        </template>

        <Collapse v-show="formValue.is_show" :activeKey="['content']" ghost style="margin: -15px">
          <template #expandIcon>
            <CaretRightOutlined :rotate="90" />
          </template>

          <CollapsePanel key="content">
            <template #header>
              <strong>Layout</strong>
            </template>
            <div class="collapse-panel">
              <div class="col-span-2">
                <div class="mb-2">Type</div>
                <RadioGroup size="small" v-model:value="cookie_type">
                  <div class="grid gap-1 ml-4">
                    <Radio :value="'default'"> Just tell users that you use cookies </Radio>
                    <Radio :value="'opt'">Ask users to opt into cookies </Radio>
                  </div>
                </RadioGroup>
              </div>

              <div class="col-span-2">
                <div class="mb-2"> Display on </div>
                <RadioGroup size="small" v-model:value="display_on_page">
                  <div class="grid gap-1 ml-4">
                    <Radio :value="'all'">All pages</Radio>
                    <Radio :value="'index'">Only home page </Radio>
                  </div>
                </RadioGroup>
              </div>

              <div class="col-span-2">
                <div class="mb-2"> Position </div>
                <RadioGroup @change="positionChange" size="small" v-model:value="position">
                  <div class="grid gap-1 ml-4">
                    <Radio :value="'top'"> Top </Radio>
                    <Radio :value="'bottom'">Bottom</Radio>
                  </div>
                </RadioGroup>
              </div>

              <div class="col-span-2 lg:col-span-1">
                <div class="mb-1">Icon</div>
                <Select class="w-full" v-model:value="cookie_icon" :options="cookieIcons" />
              </div>

              <div class="col-span-2 lg:col-span-1">
                <div class="mb-1">Background</div>
                <div>
                  <FormColorVue v-model="background_color" />
                </div>
              </div>
            </div>
          </CollapsePanel>

          <CollapsePanel key="content">
            <template #header>
              <strong>Content</strong>
            </template>

            <div class="collapse-panel">
              <FormEditorVue class="col-span-2" v-model="content_message" />

              <div class="col-span-2 lg:col-span-1">
                <div class="mb-1">Text color</div>
                <div>
                  <FormColorVue v-model="content_color" />
                </div>
              </div>

              <div class="col-span-2 lg:col-span-1">
                <div class="mb-1">Text align</div>
                <Select class="w-full" v-model:value="content_text_align" :options="alignList" />
              </div>

              <div class="col-span-2">
                <div class="flex justify-between">
                  <div class="text-sm">Font size</div>
                  <div class="text-xs text-gray-500">{{ content_font_size }}px</div>
                </div>
                <div>
                  <Slider v-model:value="content_font_size" :min="5" :max="40" />
                </div>
              </div>
            </div>
          </CollapsePanel>
          <CollapsePanel key="content" v-show="cookie_type === 'opt'">
            <template #header>
              <strong>Accept Button</strong>
            </template>

            <div class="collapse-panel">
              <div class="col-span-2 lg:col-span-1">
                <div class="mb-1">Label</div>
                <div>
                  <a-input v-model:value="accept_btn_text" />
                </div>
              </div>

              <div class="col-span-2 lg:col-span-1">
                <div class="flex justify-between">
                  <div class="text-sm">Font size</div>
                  <div class="text-xs text-gray-500">{{ accept_btn_font_size }}px</div>
                </div>
                <div>
                  <Slider v-model:value="accept_btn_font_size" :min="5" :max="40" />
                </div>
              </div>

              <div class="col-span-2 lg:col-span-1">
                <div class="mb-1">Button color</div>
                <div>
                  <FormColorVue v-model="accept_btn_background" />
                </div>
              </div>

              <div class="col-span-2 lg:col-span-1">
                <div class="mb-1">Text color</div>
                <div>
                  <FormColorVue v-model="accept_btn_color" />
                </div>
              </div>
            </div>
          </CollapsePanel>
          <CollapsePanel key="content" v-show="cookie_type === 'opt'">
            <template #header>
              <strong>Decline Button</strong>
            </template>

            <div class="collapse-panel">
              <div class="col-span-2 lg:col-span-1">
                <div class="mb-1">Label</div>
                <div>
                  <a-input v-model:value="decline_btn_text" />
                </div>
              </div>

              <div class="col-span-2 lg:col-span-1">
                <div class="flex justify-between">
                  <div class="text-sm">Font size</div>
                  <div class="text-xs text-gray-500">{{ decline_btn_font_size }}px</div>
                </div>
                <div>
                  <Slider v-model:value="decline_btn_font_size" :min="5" :max="40" />
                </div>
              </div>

              <div class="col-span-2 lg:col-span-1">
                <div class="mb-1">Button color</div>
                <div>
                  <FormColorVue v-model="decline_btn_background" />
                </div>
              </div>

              <div class="col-span-2 lg:col-span-1">
                <div class="mb-1">Text color</div>
                <div>
                  <FormColorVue v-model="decline_btn_color" />
                </div>
              </div>
            </div>
          </CollapsePanel>

          <CollapsePanel key="content" v-show="cookie_type === 'default'">
            <template #header>
              <strong>Confirm Button</strong>
            </template>

            <div class="collapse-panel">
              <div class="col-span-2 lg:col-span-1">
                <div class="mb-1">Label</div>
                <div>
                  <a-input v-model:value="confirm_btn_text" />
                </div>
              </div>

              <div class="col-span-2 lg:col-span-1">
                <div class="flex justify-between">
                  <div class="text-sm">Font size</div>
                  <div class="text-xs text-gray-500">{{ confirm_btn_font_size }}px</div>
                </div>
                <div>
                  <Slider v-model:value="confirm_btn_font_size" :min="5" :max="40" />
                </div>
              </div>

              <div class="col-span-2 lg:col-span-1">
                <div class="mb-1">Button color</div>
                <div>
                  <FormColorVue v-model="confirm_btn_background" />
                </div>
              </div>

              <div class="col-span-2 lg:col-span-1">
                <div class="mb-1">Text color</div>
                <div>
                  <FormColorVue v-model="confirm_btn_color" />
                </div>
              </div>
            </div>
          </CollapsePanel>
        </Collapse>
      </Card>
    </div>
    <div class="col-span-2 md:col-span-1">
      <Affix :offset-top="16" ref="referenceAfixx">
        <Card>
          <a-button block class="mb-5" type="dashed" @click="openModal"> Full preview</a-button>

          <div class="flex flex-col">
            <CookieWidget
              v-if="formValue.is_show && formValue.setting.position == 'top'"
              :key="formValue.setting.position"
              v-bind="{
                setting: formValue.setting,
                quotaVisibleLogo,
              }"
            />
            <img src="/assets/img/widget-banners/sample_background.png" />
            <CookieWidget
              v-if="formValue.is_show && formValue.setting.position == 'bottom'"
              :key="formValue.setting.position"
              v-bind="{
                setting: formValue.setting,
                quotaVisibleLogo,
              }"
            />
          </div>
        </Card>
      </Affix>
    </div>
  </div>

  <FullPreviewModal @register="registerModal">
    <CookieWidget
      v-bind="{
        setting: formValue.setting,
        quotaVisibleLogo,
      }"
    />
  </FullPreviewModal>
</template>

<style lang="less" scoped>
  .collapse-panel {
    @apply grid grid-cols-2 gap-x-8 gap-y-4 ml-30px;
  }
</style>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { Slider, Select, Switch, RadioGroup, Radio } from 'ant-design-vue';
  import { useField } from 'vee-validate';
  import draggable from 'vuedraggable';

  import ManageIcon from './ManageIconModal.vue';
  import { useModal } from '@/components/Modal';
  import Icon from '@/components/Icon/Icon.vue';

  import FormEditorVue from '../../../components/FormEditor.vue';
  import FormColorVue from '../../../components/FormColor.vue';
  import { paymentIcons } from './config';

  const [registerModal, { openModal }] = useModal();

  // Show payment section
  const { value: isEnableVal } = useField('setting.show_payment');
  const isEnableModel = computed({
    get: () => isEnableVal.value,
    set: (val) => (isEnableVal.value = val),
  });

  // Show heading title
  const { value: showHeaderVal } = useField('setting.payment_heading_visible');
  const showHeaderModel = computed({
    get: () => showHeaderVal.value,
    set: (val) => (showHeaderVal.value = val),
  });

  // Title content
  const { value: headerVal } = useField('setting.payment_heading');

  // Title Color
  const { value: headerColorVal } = useField('setting.payment_heading_color');

  // Title Align
  // Shopify is not support align in Text Editor
  const { value: headerAlignVal } = useField('setting.payment_heading_text_align');
  const alignList = ref([
    { value: 'left', label: 'Left' },
    { value: 'center', label: 'Center' },
    { value: 'right', label: 'Right' },
  ]);

  const { value: headerSizeVal } = useField('setting.payment_heading_font_size');

  // Payment icon size
  const { value: iconVal } = useField('setting.payment_icon_size');

  // Payment icons
  const { value: formIcons } = useField<Array<any>>('custom_setting.payment_icons');

  const removeAt = (id) => {
    formIcons.value = formIcons.value.filter((c) => c != id);
  };

  const iconSrc = (url) => {
    return paymentIcons.find((c) => c.icon == url)?.icon;
  };
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <div class="col-span-2 flex justify-between">
      <div class="text-sm">Show payment section?</div>
      <div>
        <Switch
          size="small"
          v-model:checked="isEnableModel"
          :unCheckedValue="false"
          :checkedValue="true"
        />
      </div>
    </div>

    <div class="col-span-2 border-t border-gray-200"></div>

    <!-- Heading setting -->
    <div class="col-span-2">
      <div class="font-bold mb-2">Heading</div>
      <RadioGroup size="small" v-model:value="showHeaderModel">
        <div class="grid gap-1">
          <Radio :value="true"> Show heading </Radio>
          <Radio :value="false">Hide </Radio>
        </div>
      </RadioGroup>
    </div>
    <FormEditorVue class="col-span-2" v-model="headerVal" />
    <div class="col-span-2 lg:col-span-1">
      <div class="mb-1">Color</div>
      <div>
        <FormColorVue v-model="headerColorVal" />
      </div>
    </div>
    <div class="col-span-2 lg:col-span-1">
      <div class="mb-1">Text align</div>
      <Select class="w-full" v-model:value="headerAlignVal" :options="alignList" />
    </div>
    <div class="col-span-2">
      <div class="flex justify-between">
        <div class="text-sm">Font size</div>
        <div class="text-xs text-gray-500">{{ headerSizeVal }}px</div>
      </div>
      <div>
        <Slider v-model:value="headerSizeVal" :min="9" :max="36" />
      </div>
    </div>

    <div class="col-span-2 border-t border-gray-200"></div>

    <div class="col-span-2">
      <div class="font-bold mb-2">Payment listing</div>
      <draggable
        class="grid grid-cols-12 gap-4"
        v-model="formIcons"
        handle=".payment-icon"
        :animation="200"
        ghost-class="moving-card"
        item-key="id"
      >
        <template #item="{ element }">
          <div class="payment-icon">
            <img class="w-50px" :src="iconSrc(element)" />

            <div class="rounded-full -top-10px border-red-600 text-red-600 !cursor-pointer">
              <Icon @click="removeAt(element)" icon="bi-x" size="15" />
            </div>

            <div class="rounded-full -bottom-10px border-primary">
              <Icon icon="bi-arrows-move" size="15" />
            </div>
          </div>
        </template>
      </draggable>
    </div>

    <a-button
      preIcon="ant-design:plus-outlined"
      @click="openModal(true)"
      class="col-span-2 font-bold text-primary"
    >
      Manage icons
    </a-button>

    <div class="col-span-2">
      <div class="flex justify-between">
        <div class="text-sm">Icon size</div>
        <div class="text-xs text-gray-500">{{ iconVal }}%</div>
      </div>
      <div>
        <Slider v-model:value="iconVal" :min="10" :max="200" :step="10" />
      </div>
    </div>
  </div>

  <ManageIcon type="payment" v-model:iconSelected="formIcons" @register="registerModal" />
</template>
<style lang="less" scoped>
  .payment-icon {
    @apply hover:border-primary col-span-6 md:col-span-4 xl:col-span-3 h-100px border rounded-md bg-light-200 grid place-content-center cursor-move relative;

    .rounded-full {
      @apply w-20px h-20px grid place-content-center bg-white absolute -right-10px border hidden;
    }

    &:hover {
      .rounded-full {
        display: inherit;
      }
    }
  }
</style>

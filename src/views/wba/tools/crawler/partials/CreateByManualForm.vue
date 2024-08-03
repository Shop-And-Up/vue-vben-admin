<script lang="ts" setup>
  import * as Yup from 'yup';
  import { Field, useForm } from 'vee-validate';
  import { Col, Form, FormItem, Radio, Row, Select } from 'ant-design-vue';

  import { useMessage } from '@/hooks/web/useMessage';
  import { crawlerCreate, crawlerUpdateAPI } from '@/api/wba/crawler';
  import { useUserStore } from '@/store/modules/user';

  import FieldSelectProduct from '@/views/wba/reviews/partials/FieldSelectProduct.vue';
  import { computed, watch } from 'vue';
  import { isEmpty } from 'lodash-es';
  import CheckGate from '@/views/wba/CheckGate.vue';
  import { ECommercePlatform } from '../../../widget-config';

  const emit = defineEmits(['storaged', 'update:saving']);
  const props = defineProps({
    modelData: { type: Object },
    saving: { type: Boolean, default: false },
  });

  const RadioGroup = Radio.Group;
  const statusList = [
    { value: true, label: 'Active' },
    { value: false, label: 'Inactive' },
  ];

  // Init form validation with default value
  const veeForm = useForm<any>({
    validationSchema: Yup.object().shape({
      status: Yup.boolean().required().label('Status'),
      product_id: Yup.number().required().nullable().label('Product'),
      source_url: Yup.string().url().required().nullable().label('Source URL'),
    }),
    initialValues: {
      id: null,
      status: true,
      product_id: null,
      source_url: null,
      type: ECommercePlatform.Amazon,
      product: {
        id: null,
        name: null,
      },
    },
  });

  // Init modal data when open modal
  const { createMessage } = useMessage();
  const userStore = useUserStore();

  watch(
    () => props.modelData,
    () => {
      veeForm.resetForm();

      // Edit form
      if (!isEmpty(props.modelData)) {
        veeForm.setValues(props.modelData!);
      }
    },
  );

  const saving = computed({
    get() {
      return props.saving;
    },

    set(value) {
      return emit('update:saving', value);
    },
  });

  const handleSave = () => {
    veeForm.validate().then((res) => {
      if (!res.valid) {
        return;
      }

      // Show loading icon
      saving.value = true;

      const promise = veeForm.values.id
        ? crawlerUpdateAPI(veeForm.values.id, veeForm.values)
        : crawlerCreate(veeForm.values);

      promise
        .then(() => {
          emit('storaged');

          const mess = veeForm.values.id ? 'updated' : 'created';
          createMessage.success('The item has been ' + mess + ' successfully');
        })
        .finally(() => {
          saving.value = false;
        });
    });
  };
</script>

<template>
  <Form :layout="'vertical'">
    <Row :gutter="24">
      <Col :span="24" :md="12">
        <Field name="status" v-slot="{ value, handleChange, errorMessage }">
          <FormItem
            label="Status"
            :has-feedback="!!errorMessage"
            :help="errorMessage"
            :validate-status="errorMessage ? 'error' : 'success'"
          >
            <Select
              class="w-full"
              :value="value"
              @update:value="handleChange"
              :options="statusList"
            />
          </FormItem>
        </Field>
      </Col>
      <Col :span="24" :md="12">
        <Field name="product_id" v-slot="{ value, handleChange, errorMessage }">
          <FormItem
            label="Product"
            :has-feedback="!!errorMessage"
            :help="errorMessage"
            :validate-status="errorMessage ? 'error' : 'success'"
          >
            <FieldSelectProduct
              :current-label="veeForm.values.product"
              :value="value"
              @update:value="handleChange"
            />
          </FormItem>
        </Field>
      </Col>
    </Row>

    <Row :gutter="24">
      <Col :span="24">
        <Field name="source_url" v-slot="{ value, handleChange, errorMessage }">
          <FormItem
            label="Amazon product link"
            :has-feedback="!!errorMessage"
            :help="errorMessage"
            :validate-status="errorMessage ? 'error' : 'success'"
          >
            <a-input
              placeholder="Example: https://www.amazon.com/Display-Quad-Processor/dp/B0CJV41KZN"
              :value="value"
              @update:value="handleChange"
            />
          </FormItem>
        </Field>
      </Col>
    </Row>

    <Row :gutter="24">
      <Col :span="24">
        <FormItem label="Schedule">
          <RadioGroup
            v-model:value="userStore.userInfo!.charge_name"
            class="!flex !flex-col space-y-2 !pl-3"
          >
            <Radio value="Free"> Monthly</Radio>
            <Radio value="Pro"> Weekly</Radio>
          </RadioGroup>
        </FormItem>
      </Col>
    </Row>

    <Row :gutter="24">
      <Col :span="24">
        <div>
          <div>Setting</div>
          <ul class="list-circle list-inside ml-4">
            <li> Auto scrapes <span class="font-medium"> the first 10 recent reviews </span></li>
            <li> Only scrape reviews from <span class="font-medium"> 3 stars and above</span></li>
          </ul>
        </div>
      </Col>
    </Row>

    <Row :gutter="24">
      <Col :span="24">
        <div class="flex justify-center items-center mt-4 mb-0">
          <CheckGate #button="{ isFreePlan }">
            <a-button
              @click="handleSave"
              :disabled="!veeForm.meta.value.dirty || isFreePlan"
              :loading="saving"
              preIcon="bx:cloud-upload"
              type="primary"
            >
              Submit
            </a-button>
          </CheckGate>
        </div>
      </Col>
    </Row>
  </Form>
</template>

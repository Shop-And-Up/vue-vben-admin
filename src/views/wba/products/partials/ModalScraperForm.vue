<script lang="ts" setup>
  import * as Yup from 'yup';
  import { computed, reactive, onMounted, watch } from 'vue';
  import { isEmpty } from 'lodash-es';
  import { Field, useForm } from 'vee-validate';
  import { Col, Form, FormItem, Row } from 'ant-design-vue';

  import { useMessage } from '@/hooks/web/useMessage';
  import { crawlerCreate } from '@/api/wba/crawler';
  import CheckGate from '@/views/wba/CheckGate.vue';
  import { ECommercePlatform } from '../../widget-config';

  const emit = defineEmits(['completed']);
  const props = defineProps({
    modalData: { type: Object },
    scrapeType: { type: String },
  });

  const state = reactive({
    loading: false,
  });

  // Init form validation with default value
  const veeForm = useForm<any>({
    validationSchema: Yup.object().shape({
      id: Yup.number().required().nullable().label('Product Id'),
      name: Yup.string().required().nullable().label('Product'),
      source_url: Yup.string()
        .url()
        .required()
        .nullable()
        .label(props.scrapeType + ' product link'),
    }),
    initialValues: {
      id: null,
      name: null,
      source_url: null,
    },
  });

  // Init modal data when open modal
  const { createMessage } = useMessage();

  onMounted(() => {
    initForm();
  });

  watch(
    () => props.modalData,
    () => initForm(),
  );

  const placeholder = computed(() => {
    return props.scrapeType === ECommercePlatform.AliExpress
      ? 'https://aliexpress.com/item/1005007053762883.html'
      : 'https://www.amazon.com/Display-Quad-Core-Processor/dp/B0CJV41KZN';
  });

  const initForm = () => {
    veeForm.resetForm();

    if (!isEmpty(props.modalData)) {
      veeForm.setValues(props.modalData!);
    }
  };

  const handleSave = () => {
    veeForm.validate().then((res) => {
      if (!res.valid) {
        return;
      }

      // Show loading icon
      state.loading = true;

      crawlerCreate({
        product_id: veeForm.values.id,
        source_url: veeForm.values.source_url,
        type: props.scrapeType,
        dispatch_now: true,
      })
        .then(() => {
          emit('completed');
          createMessage.success('Product reviews have been scraped successfully');
        })
        .finally(() => {
          state.loading = false;
        });
    });
  };
</script>

<template>
  <Form :layout="'vertical'">
    <Row :gutter="24">
      <Col :span="24">
        <Field name="name" v-slot="{ value, handleChange, errorMessage }">
          <FormItem
            label="Product"
            :has-feedback="!!errorMessage"
            :help="errorMessage"
            :validate-status="errorMessage ? 'error' : 'success'"
          >
            <a-input :disabled="true" :value="value" @update:value="handleChange" />
          </FormItem>
        </Field>
      </Col>
    </Row>
    <Row :gutter="24">
      <Col :span="24">
        <Field name="source_url" v-slot="{ value, handleChange, errorMessage }">
          <FormItem
            :label="scrapeType + ' product link'"
            :has-feedback="!!errorMessage"
            :help="errorMessage"
            :validate-status="errorMessage ? 'error' : 'success'"
          >
            <a-input :placeholder="placeholder" :value="value" @update:value="handleChange" />
          </FormItem>
        </Field>
      </Col>
    </Row>
    <Row :gutter="24" v-if="scrapeType == 'amazon'">
      <Col :span="24">
        <div class="italic">
          <div class="font-bold">Note:</div>
          <ul class="list-circle list-inside ml-4">
            <li>
              Currently, the AI bot can only scrape up to
              <span class="font-bold">10 reviews</span> per Amazon product.
            </li>
            <li>
              To gather more reviews, please use our
              <router-link class="font-bold mx-1 text-blue-500" :to="{ name: 'Bookmarklet' }">
                Scraper Tool
              </router-link>
            </li>
          </ul>
        </div>
      </Col>
    </Row>
    <Row :gutter="24">
      <Col :span="24">
        <div class="flex justify-center items-center mt-4 mb-0">
          <CheckGate>
            <template #button="{ isFreePlan }">
              <a-button
                @click="handleSave"
                :disabled="!veeForm.meta.value.dirty || isFreePlan"
                :loading="state.loading"
                type="primary"
              >
                {{ state.loading ? 'Scraping' : 'Submit' }}
              </a-button>
            </template>
          </CheckGate>
        </div>
      </Col>
    </Row>
  </Form>
</template>

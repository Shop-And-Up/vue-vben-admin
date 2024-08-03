<script lang="ts" setup>
  import * as Yup from 'yup';
  import { cloneDeep, isEmpty } from 'lodash-es';
  import { Field, useForm } from 'vee-validate';
  import { Col, DatePicker, Form, FormItem, Rate, Row, Select, Switch } from 'ant-design-vue';

  import { BasicModal, useModalInner } from '@/components/Modal';
  import { reviewsCreate, reviewsUpdateAPI } from '@/api/wba/reviews';
  import { countries } from '@coreThemeExt';
  import { useMessage } from '@/hooks/web/useMessage';
  import { dateUtil } from '@/utils/dateUtil';
  import FieldUpload from './FieldUpload.vue';
  import FieldSelectProduct from './FieldSelectProduct.vue';

  const emit = defineEmits(['storaged']);

  const countryOptions = countries.filter((c) => c.value != 'ALL');
  const statusList = [
    { value: 'published', label: 'Published' },
    { value: 'unpublished', label: 'Unpublished' },
  ];

  // Init form validation with default value
  const veeForm = useForm<any>({
    validationSchema: Yup.object().shape({
      customer_name: Yup.string().max(200).required().nullable().label('Name'),
      customer_email: Yup.string().email().nullable().label('Email'),
      country_code: Yup.string().required().nullable().label('Country'),
      rate: Yup.number().required().label('Rate'),
      product_id: Yup.number().required().nullable().label('Product'),
      status: Yup.string().required().label('Status'),
      feedback_date: Yup.string().required().label('Date'),
      feedback: Yup.string().max(4500).required().nullable().label('Feedback'),
    }),
    initialValues: {
      id: null,
      product_id: null,
      is_verified: false,
      rate: 5,
      status: 'published',
      country_code: null,
      customer_name: null,
      customer_email: null,
      feedback: null,
      feedback_date: dateUtil(),
      images: [],
      image_ratio: null,
      product: {
        id: null,
        name: null,
      },
    },
  });

  const [isVerified] = veeForm.useFieldModel(['is_verified']);

  // Init modal data when open modal
  const { createMessage } = useMessage();
  const [register, { closeModal, setModalProps }] = useModalInner((modalData) => {
    modalData && initData(modalData);
  });

  function initData(modalData: any) {
    // Reset form when open modal
    setTimeout(() => {
      veeForm.resetForm();

      if (!isEmpty(modalData)) {
        const _data = cloneDeep(modalData);

        // Format date
        _data.feedback_date = _data.feedback_date ? dateUtil(_data.feedback_date) : dateUtil();

        _data.images = _data.images.map((url: any) => {
          return {
            url,
            rotate: 0,
          };
        });

        veeForm.setValues(_data);
      }
    }, 100);
  }

  const handleSave = () => {
    veeForm.validate().then((res) => {
      if (!res.valid) {
        return;
      }

      setModalProps({ loading: true, confirmLoading: true });

      const _payload = cloneDeep(veeForm.values);

      // Mapping image info
      _payload.image_rotate = _payload.images.map((c) => {
        return c.rotate ?? 0;
      });

      _payload.images = _payload.images.map((c) => {
        return c.url ?? null;
      });

      const promise = _payload.id
        ? reviewsUpdateAPI(_payload.id, _payload)
        : reviewsCreate(_payload);

      promise
        .then(() => {
          emit('storaged');
          const mess = _payload.id ? 'updated' : 'created';
          createMessage.success('The item has been ' + mess + ' successfully');
          closeModal();
        })
        .catch(() => {
          createMessage.error('Error! Please check review data');
        })
        .finally(() => {
          setModalProps({ loading: false, confirmLoading: false });
        });
    });
  };

  const handleSearchCountry = (input: string, option: any) => {
    return (
      option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
      option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
    );
  };
</script>

<template>
  <BasicModal
    :canFullscreen="false"
    :draggable="false"
    :okText="veeForm.values.id ? 'Update' : 'Create'"
    :title="veeForm.values.id ? 'Update review' : 'Create review'"
    v-bind="$attrs"
    width="700px"
    @ok="handleSave"
    @register="register"
  >
    <Form :layout="'vertical'">
      <Row :gutter="24">
        <Col :md="8" :span="24">
          <Field v-slot="{ value, handleChange, errorMessage }" name="rate">
            <FormItem
              :has-feedback="!!errorMessage"
              :help="errorMessage"
              :validate-status="errorMessage ? 'error' : 'success'"
              label="Rate"
            >
              <Rate :allowClear="false" :value="value" @update:value="handleChange" />
            </FormItem>
          </Field>
        </Col>
        <Col :md="8" :span="24">
          <FormItem>
            <div class="flex justify-between">
              <div>Verified</div>
              <Switch v-model:checked="isVerified" />
            </div>
          </FormItem>
        </Col>
      </Row>

      <Row :gutter="24">
        <Col :md="8" :span="24">
          <Field v-slot="{ value, handleChange, errorMessage }" name="customer_name">
            <FormItem
              :has-feedback="!!errorMessage"
              :help="errorMessage"
              :validate-status="errorMessage ? 'error' : 'success'"
              label="Customer name"
            >
              <a-input :value="value" @update:value="handleChange" />
            </FormItem>
          </Field>
        </Col>

        <Col :md="8" :span="24">
          <Field v-slot="{ value, handleChange, errorMessage }" name="customer_email">
            <FormItem
              :has-feedback="!!errorMessage"
              :help="errorMessage"
              :validate-status="errorMessage ? 'error' : 'success'"
              label="Customer email"
            >
              <a-input :value="value" @update:value="handleChange" />
            </FormItem>
          </Field>
        </Col>

        <Col :md="8" :span="24">
          <Field v-slot="{ value, handleChange, errorMessage }" name="country_code">
            <FormItem
              :has-feedback="!!errorMessage"
              :help="errorMessage"
              :validate-status="errorMessage ? 'error' : 'success'"
              label="Country"
            >
              <Select
                :filter-option="handleSearchCountry"
                :options="countryOptions"
                :value="value"
                placeholder="Search country..."
                show-search
                @update:value="handleChange"
              />
            </FormItem>
          </Field>
        </Col>

        <Col :md="8" :span="24">
          <Field v-slot="{ value, handleChange, errorMessage }" name="status">
            <FormItem
              :has-feedback="!!errorMessage"
              :help="errorMessage"
              :validate-status="errorMessage ? 'error' : 'success'"
              label="Status"
            >
              <Select
                :options="statusList"
                :value="value"
                class="w-full"
                @update:value="handleChange"
              />
            </FormItem>
          </Field>
        </Col>

        <Col :md="8" :span="24">
          <Field v-slot="{ value, handleChange, errorMessage }" name="product_id">
            <FormItem
              :has-feedback="!!errorMessage"
              :help="errorMessage"
              :validate-status="errorMessage ? 'error' : 'success'"
              label="Product"
            >
              <FieldSelectProduct :value="value" @update:value="handleChange" />
            </FormItem>
          </Field>
        </Col>

        <Col :md="8" :span="24">
          <Field v-slot="{ value, handleChange, errorMessage }" name="feedback_date">
            <FormItem
              :has-feedback="!!errorMessage"
              :help="errorMessage"
              :validate-status="errorMessage ? 'error' : 'success'"
              label="Feedback date"
            >
              <DatePicker :value="value" class="w-full" @update:value="handleChange" />
            </FormItem>
          </Field>
        </Col>
      </Row>

      <Row :gutter="24">
        <Col :span="24">
          <Field v-slot="{ value, handleChange, errorMessage }" name="feedback">
            <FormItem
              :has-feedback="!!errorMessage"
              :help="errorMessage"
              :validate-status="errorMessage ? 'error' : 'success'"
              label="Feedback"
            >
              <a-textarea :auto-size="{ minRows: 4 }" :value="value" @update:value="handleChange" />
            </FormItem>
          </Field>
        </Col>
      </Row>

      <Row :gutter="24">
        <Col :span="24">
          <Field v-slot="{ value, handleChange, errorMessage }" name="reply">
            <FormItem
              :has-feedback="!!errorMessage"
              :help="errorMessage"
              :validate-status="errorMessage ? 'error' : 'success'"
              label="Shop reply"
            >
              <a-textarea :auto-size="{ minRows: 4 }" :value="value" @update:value="handleChange" />
            </FormItem>
          </Field>
        </Col>
      </Row>

      <Row :gutter="24">
        <Col :span="24">
          <Field v-slot="{ value, handleChange }" name="images">
            <FormItem label="Media">
              <FieldUpload
                :value="value"
                @update:value="handleChange"
                @ratio-change="(val) => (veeForm.values.image_ratio = val)"
              />
            </FormItem>
          </Field>
        </Col>
      </Row>
    </Form>
  </BasicModal>
</template>

<style lang="less" scoped></style>

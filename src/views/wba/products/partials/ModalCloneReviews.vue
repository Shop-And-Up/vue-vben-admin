<script lang="ts" setup>
  import * as Yup from 'yup';
  import { Field, useForm } from 'vee-validate';
  import { Col, Form, FormItem, Row } from 'ant-design-vue';

  import { BasicModal, useModalInner } from '@/components/Modal';
  import { productCloneReviewAPI } from '@/api/wba/products';
  import { useMessage } from '@/hooks/web/useMessage';
  import FieldSelectProduct from '@/views/wba/reviews/partials/FieldSelectProduct.vue';

  const emit = defineEmits(['storaged']);

  // Init form validation with default value
  const veeForm = useForm<any>({
    validationSchema: Yup.object().shape({
      to_product_id: Yup.number().required().nullable().label('Product'),
    }),
    initialValues: {
      from_product_id: null,
      from_product_name: null,
      to_product_id: null,
    },
  });

  // Init modal data when open modal
  const { notification } = useMessage();
  const [register, { closeModal, setModalProps }] = useModalInner((modalData) => {
    modalData && initData(modalData);
  });

  function initData(modalData: any) {
    // Reset form when open modal
    setTimeout(() => {
      veeForm.resetForm();

      // Format date
      veeForm.setFieldValue('from_product_id', modalData.id);
      veeForm.setFieldValue('from_product_name', modalData.name);
    }, 100);
  }

  const handleSave = () => {
    veeForm.validate().then((res) => {
      if (!res.valid) {
        return;
      }

      setModalProps({ loading: true, confirmLoading: true });

      productCloneReviewAPI(veeForm.values)
        .then(() => {
          emit('storaged');
          notification.success({
            message: 'Cloned',
            description: 'All reviews have been cloned.',
          });

          closeModal();
        })
        .catch(() => {
          notification.error({
            message: 'Error',
            description: 'Error! Please check review data',
          });
        })
        .finally(() => {
          setModalProps({ loading: false, confirmLoading: false });
        });
    });
  };
</script>

<template>
  <BasicModal
    :canFullscreen="false"
    :draggable="false"
    v-bind="$attrs"
    @register="register"
    @ok="handleSave"
    title="Clone All Reviews"
    okText="Clone"
    width="500px"
  >
    <Form :layout="'vertical'">
      <Row :gutter="24">
        <Col :span="24">
          <FormItem label="From Product">
            <a-input :value="veeForm.values.from_product_name" disabled />
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="24">
        <Col :span="24">
          <Field name="to_product_id" v-slot="{ value, handleChange, errorMessage }">
            <FormItem
              label="To Product"
              :has-feedback="!!errorMessage"
              :help="errorMessage"
              :validate-status="errorMessage ? 'error' : 'success'"
            >
              <FieldSelectProduct :value="value" @update:value="handleChange" />
            </FormItem>
          </Field>
        </Col>
      </Row>
    </Form>
  </BasicModal>
</template>

<style lang="less" scoped></style>

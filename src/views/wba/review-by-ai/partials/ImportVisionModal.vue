<script lang="ts" setup>
  import * as Yup from 'yup';
  import { reactive } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { BasicTable, TableAction } from '@/components/Table';
  import { registerTable, reload } from '@/views/wba/review-by-ai/partials/importVisionTableConfig';
  import { cloneReviewAPI } from '@/api/wba/products-vision';
  import { Field, useForm } from 'vee-validate';
  import { useMessage } from '@/hooks/web/useMessage';
  import {
    Badge,
    Checkbox,
    Col,
    Form,
    FormItem,
    Image,
    Radio,
    Rate,
    Row,
    Space,
    Tooltip,
  } from 'ant-design-vue';
  import Vue3ClampVue from '@coreThemeExt/components/common/Vue3Clamp.vue';
  import FieldSelectProduct from '@/views/wba/reviews/partials/FieldSelectProduct.vue';

  const RadioGroup = Radio.Group;
  const ImagePreviewGroup = Image.PreviewGroup;
  const searchInfo = reactive<Recordable>({});
  const { notification } = useMessage();

  const state = reactive({
    isLoadingReviews: true,
  });

  // Init form validation with default value
  const veeForm = useForm<any>({
    validationSchema: Yup.object().shape({
      product_id: Yup.number().required().nullable().label('Product'),
    }),
    initialValues: {
      product_id: null,
      product_vision_id: null,
      review_vision_id: null,
      review_filter: 'all',
      publish_all: true,
      auto_translate: false,
      verify_all: false,
    },
  });

  // Init modal data when open modal
  const [register, { closeModal, setModalProps }] = useModalInner((modalData: any) => {
    if (!modalData) {
      return;
    }

    // Reset form when open modal
    setTimeout(() => {
      veeForm.resetForm();

      // Loading review table data
      searchInfo.product_id = modalData.id;
      veeForm.setFieldValue('product_vision_id', searchInfo.product_id);

      reload();
    }, 100);
  });

  const handleSingleClone = (record: Recordable) => {
    veeForm.setFieldValue('review_vision_id', record.id);

    handleSubmitClone(false);
  };

  const handleCloneAll = () => {
    veeForm.setFieldValue('review_vision_id', null);

    handleSubmitClone(true);
  };

  const handleSubmitClone = (autoCloseModal = true) => {
    veeForm.validate().then((res) => {
      if (!res.valid) {
        return;
      }
      setModalProps({ loading: true, confirmLoading: true });

      cloneReviewAPI(veeForm.values)
        .then(() => {
          notification.success({ message: 'Cloned', description: 'All reviews have been cloned.' });

          if (autoCloseModal) {
            setTimeout(() => {
              closeModal();
            }, 200);
          }
        })
        .finally(() => {
          setModalProps({ loading: false, confirmLoading: false });
        });
    });
  };
</script>

<template>
  <BasicModal
    title="Review & Clone reviews"
    okText="Clone All Reviews"
    width="auto"
    v-bind="$attrs"
    @register="register"
    @ok="handleCloneAll"
    :canFullscreen="true"
    :draggable="false"
    :defaultFullscreen="false"
  >
    <div class="p-4">
      <Form :label-col="{ style: { width: '150px' } }">
        <Row :gutter="24">
          <Col :span="24">
            <Field name="product_id" v-slot="{ value, handleChange, errorMessage }">
              <FormItem
                label="Clone reviews to"
                :has-feedback="!!errorMessage"
                :help="errorMessage"
                :validate-status="errorMessage ? 'error' : 'success'"
              >
                <FieldSelectProduct :value="value" @update:value="handleChange" />
              </FormItem>
            </Field>
          </Col>
        </Row>

        <Row :gutter="24">
          <Col :span="12">
            <FormItem label="Filter">
              <RadioGroup
                v-model:value="veeForm.values.review_filter"
                class="!flex !flex-col space-y-2 !pl-3"
              >
                <Radio value="all"> All reviews</Radio>
                <Radio value="without_images"> Only reviews WITHOUT images</Radio>
                <Radio value="has_images"> Only reviews HAS images</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="Advanced option">
              <Space direction="vertical">
                <Checkbox v-model:checked="veeForm.values.auto_translate">
                  Translate feedback in English
                </Checkbox>
                <Checkbox v-model:checked="veeForm.values.verify_all"> Verify all review</Checkbox>
                <Checkbox v-model:checked="veeForm.values.publish_all">
                  Publish all review
                </Checkbox>
              </Space>
            </FormItem>
          </Col>
        </Row>
      </Form>

      <BasicTable
        @register="registerTable"
        @fetch-success="state.isLoadingReviews = false"
        :searchInfo="searchInfo"
        :loading="state.isLoadingReviews"
        :canResize="false"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'feedback'">
            <div class="!whitespace-normal text-left">
              <Tooltip placement="top" :title="record.feedback">
                <Vue3ClampVue autoresize :max-lines="2" :maxHeight="1000">
                  {{ record.feedback }}
                </Vue3ClampVue>
              </Tooltip>
            </div>
          </template>
          <template v-if="column.key === 'feedback_translate'">
            <div class="!whitespace-normal text-left">
              <Tooltip placement="top" :title="record.feedback_translate">
                <Vue3ClampVue autoresize :max-lines="2" :maxHeight="1000">
                  {{ record.feedback_translate }}
                </Vue3ClampVue>
              </Tooltip>
            </div>
          </template>
          <template v-else-if="column.key === 'rate'">
            <div class="flex flex-row items-center justify-center space-x-2">
              <img
                :src="`https://storage.widgetbuilder.app/widget_builder/static-images/flags/${record.country_code.toUpperCase()}.png`"
                class="h-3"
              />
              <Rate class="!text-16px" :allowClear="false" disabled :value="record.rate" />
            </div>
          </template>
          <template v-else-if="column.key === 'has_image'">
            <template v-if="veeForm.values.review_filter != 'without_images'">
              <Image
                v-if="record.images.length == 1"
                :preview="{ visible: false }"
                :previewMask="false"
                :src="record.images[0]"
                fallback="/assets/img/no-image.png"
                @click="record.image_show_preview = true"
                class="!object-cover !h-10 !w-10 !rounded-md cursor-pointer"
              />

              <Badge
                style="font-size: 10px"
                :offset="[20, 20]"
                :count="'+' + (record.images.length - 1)"
                v-if="record.images.length > 1"
              >
                <Image
                  :preview="{ visible: false }"
                  :previewMask="false"
                  :src="record.images[0]"
                  fallback="/assets/img/no-image.png"
                  @click="record.image_show_preview = true"
                  class="!object-cover !h-10 !w-10 !rounded-md cursor-pointer"
                />
              </Badge>
              <ImagePreviewGroup
                :preview="{
                  visible: record.image_show_preview,
                  onVisibleChange: (vis) => (record.image_show_preview = vis),
                }"
              >
                <div class="hidden">
                  <Image
                    v-for="(url, index) in record.images"
                    :key="index"
                    :src="url"
                    :previewMask="false"
                    fallback="/assets/img/no-image.png"
                    class="!object-cover !h-15 !w-15 !rounded-md cursor-pointer"
                  />
                </div>
              </ImagePreviewGroup>
            </template>
          </template>
          <template v-else-if="column.key === 'action'">
            <TableAction
              :divider="false"
              :actions="[
                {
                  icon: 'clarity:clone-line',
                  label: 'Clone',
                  onClick: handleSingleClone.bind(null, record),
                  disabled: !veeForm.meta.value.valid,
                },
              ]"
            />
          </template>
        </template>
      </BasicTable>
    </div>
  </BasicModal>
</template>

<style lang="less" scoped></style>

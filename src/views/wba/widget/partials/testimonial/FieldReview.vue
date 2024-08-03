<script lang="ts" setup>
  import { useField } from 'vee-validate';
  import { TypographyLink, Avatar, Dropdown, Menu, Popconfirm } from 'ant-design-vue';
  import draggable from 'vuedraggable';
  import _ from 'lodash-es';

  import Icon from '@/components/Icon/Icon.vue';
  import { useModal } from '@/components/Modal';
  import FormModal from './FormModal.vue';

  export interface Testimonial {
    name: any;
    caption: any;
    avatar: any;
    rate: number;
    message: any;
  }

  export interface ModalPayload {
    review: Testimonial;
    id: any;
  }

  const AMenu = Menu;
  const AMenuItem = Menu.Item;
  const APopconfirm = Popconfirm;

  const [registerModal, { openModal }] = useModal();

  const { value: reviews } = useField<Testimonial[]>('custom_setting.testimonials');

  const handleDuplicate = (item: Testimonial) => {
    const temp = _.cloneDeep(item);
    temp.name += ' - Duplicate';
    reviews.value.push(temp);
  };

  const handleDelete = (index) => {
    reviews.value.splice(index, 1);
  };

  const handleModalOpen = (review: Testimonial | null = null, id = null) => {
    if (!review) {
      review = {
        name: 'Customer name ' + (reviews.value.length + 1),
        caption: 'Position at Company',
        avatar: '',
        rate: 5,
        message:
          'Elit sit nulla occaecat nulla nisi commodo qui qui irure. Cillum qui commodo adipisicing et qui dolor non. Consectetur cillum dolor proident officia qui aute do qui ipsum nostrud id. Eu duis nisi laborum eiusmod minim ullamco est proident magna. Velit nulla Lorem quis Lorem cupidatat voluptate elit ex do cupidatat minim aliquip labore. Fugiat ea non ex nisi ullamco reprehenderit amet in non quis.',
      };
    }
    openModal(true, {
      review: _.cloneDeep(review),
      id,
    });
  };

  const handleModalSave = (data: ModalPayload) => {
    if (data.id != null) {
      // Update
      reviews.value[data.id] = data.review;
    } else {
      // Add new
      reviews.value.push(data.review);
    }
  };
</script>

<template>
  <div>
    <div class="w-full flex justify-end items-center mb-2">
      <TypographyLink href="https://this-person-does-not-exist.com" target="_blank">
        Sample avatar?
      </TypographyLink>
    </div>
    <draggable
      class="grid gap-1"
      v-model="reviews"
      handle=".move-icon"
      :animation="200"
      ghost-class="moving-card"
    >
      <template #item="{ element, index }">
        <div class="review-item">
          <div class="move-icon">
            <Icon icon="ant-design:drag-outlined" />
          </div>
          <div class="flex-1 flex justify-start items-center space-x-2">
            <Avatar :src="element.avatar" size="large" />
            <div class="cursor-pointer" @click="handleModalOpen(element, index)">
              <div class="font-medium"> {{ element.name }} </div>
              <div class="text-xs text-gray-400 truncate w-175px"> {{ element.message }} </div>
            </div>
          </div>

          <a-popconfirm
            v-if="reviews.length > 1"
            @confirm="handleDelete(index)"
            title="Do you want to delete this item?"
            okText="Yes"
          >
            <div class="btn-action px-3 py-2">
              <Icon icon="bx:trash" class="!text-red-500" />
            </div>
          </a-popconfirm>
          <div class="btn-action">
            <Dropdown trigger="click" placement="left">
              <Icon icon="ci:more-horizontal" @click.prevent class="!text-blue-500" />

              <template #overlay>
                <a-menu>
                  <a-menu-item @click="handleModalOpen(element, index)">
                    <Icon icon="bx:edit" />
                    Edit
                  </a-menu-item>
                  <a-menu-item @click="handleDuplicate(element)">
                    <Icon icon="bx:duplicate" />
                    Duplicate
                  </a-menu-item>
                </a-menu>
              </template>
            </Dropdown>
          </div>
        </div>
      </template>
    </draggable>

    <a-button
      @click="handleModalOpen()"
      class="mt-4"
      iconSize="16"
      type="dashed"
      block
      preIcon="ant-design:plus"
    >
      Add more
    </a-button>
  </div>

  <FormModal @save="handleModalSave" @register="registerModal" />
</template>

<style lang="less" scoped>
  .review-item {
    @apply bg-gray-100 px-4 py-2 rounded-md flex justify-start items-center space-x-3;

    .move-icon {
      @apply cursor-move;
    }

    .btn-action {
      @apply w-20px h-20px bg-white flex justify-center items-center rounded cursor-pointer;
    }
  }
</style>

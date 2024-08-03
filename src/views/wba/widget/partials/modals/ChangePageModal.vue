<script lang="ts" setup>
  import { reactive } from 'vue';
  import { Select, Tree } from 'ant-design-vue';
  import { TreeDataItem } from 'ant-design-vue/es/tree/Tree';
  import type { AntTreeNodeDropEvent, TreeProps } from 'ant-design-vue/es/tree';

  import { themePages } from '@/api/wba/theme';
  import { widgetChangePage } from '@/api/wba/widget';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useMessage } from '@/hooks/web/useMessage';
  import { DragOutlined } from '@ant-design/icons-vue';
  import { useUserStore } from '@/store/modules/user';

  const props = defineProps({
    widget: { type: Object },
    widgetPosition: { type: Object },
  });

  const state = reactive({
    pageChanged: true,
    loading: true,
    pages: <any>[],
    tree_selected_key: <any>null,
    tree_expanded_key: <any>[],
    params: {
      block_id: undefined,
      page_type: 'index',
      position: <TreeProps['treeData'] | any>[],
    },
  });

  const emit = defineEmits(['selected']);
  const [register, { closeModal }] = useModalInner(() => {
    // Set current block UUID
    if (!state.tree_selected_key) {
      state.tree_selected_key = props.widget!.block_id;
    }

    if (props.widget?.position && props.widget?.position.length) {
      state.params.position = props.widget?.position;
    } else {
      state.params.position = [];
    }

    initData(props.widget!.page_type);
  });
  const { notification } = useMessage();
  const userStore = useUserStore();

  const pageChange = (templatePage) => {
    state.params.position = [];
    initData(templatePage);
  };

  function initData(templatePage) {
    state.loading = true;

    themePages(userStore.userInfo?.theme_id, templatePage, state.tree_selected_key)
      .then((res) => {
        state.pages = res.templates.map((item) => {
          return {
            value: item.key,
            label: item.name + ' page',
          };
        });

        // Create widget case
        // if (!props.widget!.block_id) {
        //   state.pages.unshift({
        //     value: null,
        //     label: 'Manually (Embed Code)',
        //   });
        // }

        // Set current block UUID
        if (!state.tree_selected_key) {
          state.tree_selected_key = res.block_uuid;
        }

        // In case: chọn lại position
        if (state.params.position.length) {
          res.template_struct = state.params.position;
        }

        state.tree_expanded_key = [];
        res.template_struct.forEach((item) => {
          state.tree_expanded_key.push(item.key);
        });
        state.params.position = res.template_struct;

        // Set current page and position
        state.params.page_type = templatePage;
      })
      .finally(() => (state.loading = false));
  }

  const handleSubmit = () => {
    // Create case
    if (props.widget!.block_id === undefined) {
      closePositionModel();
      return;
    }

    // Update case
    state.loading = true;
    widgetChangePage(props.widget!.id, state.params)
      .then(() => {
        notification.success({ message: 'Changed', description: 'The page has been relocated.' });

        closePositionModel();
        // setTimeout(() => {
        //   location.reload();
        // }, 1000);
      })
      .finally(() => (state.loading = false));

    function closePositionModel() {
      emit('selected', state.params.page_type, state.tree_selected_key, state.params.position);

      closeModal();
    }
  };

  const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  const onDrop = (info: AntTreeNodeDropEvent) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos!.split('-');

    if (dropPos.length > 2 && info.dropToGap == false) {
      info.dropToGap = true;
    }

    if (dropPos.length == 2 && info.node.isLeaf) {
      info.dropToGap = true;
    }

    if (dragKey != state.tree_selected_key) {
      return;
    }

    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    const loop = (data: TreeProps['treeData'], key: string | number, callback: any) => {
      data!.forEach((item, index) => {
        if (item.key === key) {
          return callback(item, index, data);
        }
        if (item.children) {
          return loop(item.children, key, callback);
        }
      });
    };

    let data: any = [];
    if (state.params.position!.length) {
      data = [...state.params.position!];
    }

    // Find dragObject
    let dragObj: TreeDataItem;
    loop(data, dragKey, (item: TreeDataItem, index: number, arr: TreeProps['treeData']) => {
      arr!.splice(index, 1);
      dragObj = item;
    });
    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item: TreeDataItem) => {
        item.children = item.children || [];
        /// where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
      // } else if (
      //   (info.node.children || []).length > 0 && // Has children
      //   info.node.expanded && // Is expanded
      //   dropPosition === 1 // On the bottom gap
      // ) {
      //   loop(data, dropKey, (item: TreeDataItem) => {
      //     item.children = item.children || [];
      //     // where to insert 示例添加到头部，可以是随意位置
      //     item.children.unshift(dragObj);
      //   });
    } else {
      let ar: TreeProps['treeData'] = [];
      let i = 0;
      loop(data, dropKey, (_item: TreeDataItem, index: number, arr: TreeProps['treeData']) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }

    state.params.position = data;
  };
</script>

<template>
  <BasicModal
    :canFullscreen="false"
    :draggable="false"
    :loading="state.loading"
    :okButtonProps="{
      disabled: state.loading,
    }"
    okText="Apply"
    v-bind="$attrs"
    title="Change display page"
    @register="register"
    @ok="handleSubmit"
    width="500px"
  >
    <div class="flex flex-col justify-between space-y-3">
      <div class="font-semibold"> Display on </div>
      <Select
        v-model:value="state.params.page_type"
        class="!mt-1"
        show-search
        placeholder="Select a page"
        option-label-prop="label"
        :filter-option="filterOption"
        :options="state.pages"
        @change="pageChange"
      />

      <div class="font-semibold !mt-8" v-if="state.params.page_type">
        Position
        <small class="font-normal text-sm ml-2">(Drag and drop the current widget )</small>
      </div>
      <Tree
        v-if="state.tree_selected_key"
        class="draggable-tree"
        draggable
        block-node
        default-expand-all
        :show-line="{
          showLeafIcon: false,
        }"
        :show-icon="true"
        :tree-data="state.params.position"
        :expanded-keys="state.tree_expanded_key"
        :selected-keys="[state.tree_selected_key]"
        @drop="onDrop"
      >
        <template #icon="{ selected }">
          <DragOutlined v-if="selected" />
        </template>
      </Tree>
    </div>
  </BasicModal>
</template>

<style lang="less">
  .tree-parent {
    font-weight: 500;
  }
</style>

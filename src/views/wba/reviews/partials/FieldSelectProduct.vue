<script lang="ts" setup>
  import { onMounted, reactive, watch } from 'vue';
  import { debounce } from 'lodash-es';
  import { Select, Spin } from 'ant-design-vue';

  import { productListAPI } from '@/api/wba/products';
  import { generateImage } from '@coreThemeExt';

  const emit = defineEmits(['update:value']);
  const props = defineProps({
    allowClear: { type: Boolean, default: false },
    title: { type: String, default: 'Search product...' },
    value: { type: null as unknown as PropType<number | null>, default: null },
  });

  const state = reactive({
    value: null as number | null,
    pageSize: 200,
    currentPage: 1,
    fetching: true,
    list: [],
  });

  function initState() {
    state.value = props.value;
    handleSearch(state.value);
  }

  onMounted(() => {
    initState();
  });

  watch(
    () => props.value,
    (first, second) => initState(),
  );

  const handleSearch = debounce((searchStr) => {
    state.fetching = true;
    state.list = [];

    productListAPI({
      search_field: 'name',
      search_value: searchStr,
      page_size: state.pageSize,
      page: state.currentPage,
    })
      .then((res) => {
        state.list = res.data.map((c) => {
          return {
            value: Number(c.id),
            label: c.name,
            image: c.image ?? '/assets/img/no-image.png',
          };
        });
      })
      .finally(() => {
        state.fetching = false;
      });
  }, 400);

  const handleChange = (val: any) => {
    emit('update:value', val);

    if (val == undefined) {
      handleSearch(null);
    }
  };
</script>

<template>
  <Select
    v-model:value="state.value"
    :allow-clear="allowClear"
    :default-active-first-option="false"
    :filter-option="false"
    :loading="state.fetching"
    :not-found-content="state.fetching ? undefined : null"
    :options="state.list"
    :placeholder="title"
    show-search
    @change="handleChange"
    @search="handleSearch"
  >
    <template #option="{ label, image }">
      <div class="flex items-center space-x-3">
        <img :src="generateImage(image)" class="object-cover h-10 w-10 rounded-md cursor-pointer" />
        <span> {{ label }} </span>
      </div>
    </template>

    <template v-if="state.fetching" #notFoundContent>
      <Spin size="small" />
    </template>
  </Select>
</template>

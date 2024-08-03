<script lang="ts" setup>
  import { useField } from 'vee-validate';
  import { Card, Select } from 'ant-design-vue';
  import { onMounted, ref } from 'vue';
  import { productListAPI } from '@/api/wba/products';

  const data = ref<any[]>([]);
  const { value: default_product_handle } = useField<any>('setting.default_product_handle');

  onMounted(() => {
    if (default_product_handle.value == undefined || !default_product_handle.value) {
      default_product_handle.value = null;
    }

    // Init data for select box
    handleSearch(default_product_handle.value, 'handle');
  });

  const handleSearch = (val: any, field = 'name') => {
    productListAPI({
      page: 1,
      pageSize: 10,
      search_field: field,
      search_value: val,
    }).then(mapData);
  };

  const handleChange = (val: string) => {
    if (val == undefined || !val) {
      default_product_handle.value = null;

      // Reset product list
      handleSearch('');
    }
  };

  const mapData = (res: any) => {
    data.value = res.data.map((c) => {
      return {
        value: c.handle,
        label: c.name,
      };
    });
  };
</script>

<template>
  <Card class="px-2 wba-form-card">
    <div class="flex flex-col space-y-2">
      <div class="font-bold text-base">Default product</div>
      <Select
        v-model:value="default_product_handle"
        placeholder="Auto set from Product page"
        :default-active-first-option="false"
        :filter-option="false"
        :not-found-content="null"
        :options="data"
        :show-arrow="true"
        allowClear
        show-search
        @change="handleChange"
        @search="handleSearch"
        class="w-full"
      />
    </div>
  </Card>
</template>

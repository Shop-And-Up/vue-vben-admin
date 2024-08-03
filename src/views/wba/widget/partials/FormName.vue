<script setup lang="ts">
  import { useField } from 'vee-validate';
  import { Card, FormItem } from 'ant-design-vue';

  const { errorMessage, value } = useField('name');
</script>

<template>
  <Card>
    <div class="text-base font-bold mb-2">Widget name</div>
    <FormItem
      class="!mb-0"
      :help="errorMessage"
      :validate-status="errorMessage ? 'error' : 'success'"
    >
      <a-input v-model:value="value" />
    </FormItem>
  </Card>
</template>

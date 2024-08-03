<script lang="ts" setup>
  import { CaretRightOutlined } from '@ant-design/icons-vue';
  import { Collapse, CollapsePanel } from 'ant-design-vue';
  import { useField } from 'vee-validate';

  const { value: based_on } = useField<string>('language.based_on');
  const { value: read_more } = useField<string>('language.read_more');
  const { value: reply_by } = useField<string>('language.reply_by');

  const { value: page_size } = useField<string>('language.page_size');
  const { value: load_more } = useField<string>('language.load_more');
  const { value: sort_by_date } = useField<string>('language.sort_by_date');
  const { value: sort_by_rating } = useField<string>('language.sort_by_rating');
  const { value: sort_by_media } = useField<string>('language.sort_by_media');
  const { value: sort_by_the_latest_change } = useField<string>(
    'language.sort_by_the_latest_change',
  );
</script>

<template>
  <Collapse activeKey="title" ghost style="margin: -15px">
    <template #expandIcon>
      <CaretRightOutlined :rotate="90" />
    </template>

    <CollapsePanel key="title">
      <template #header>
        <strong>General</strong>
      </template>
      <div class="collapse-panel">
        <div class="col-span-2 lg:col-span-1">
          <div class="mb-1">Based on # reviews</div>
          <div>
            <a-input v-model:value="based_on" />
          </div>
        </div>
        <div class="col-span-2 lg:col-span-1">
          <div class="mb-1">Read more</div>
          <div>
            <a-input v-model:value="read_more" />
          </div>
        </div>
        <div class="col-span-2 lg:col-span-1">
          <div class="mb-1">Shop reply</div>
          <div>
            <a-input v-model:value="reply_by" />
          </div>
        </div>
      </div>
    </CollapsePanel>

    <CollapsePanel key="title">
      <template #header>
        <strong>Paging</strong>
      </template>
      <div class="collapse-panel">
        <div class="col-span-2 lg:col-span-1">
          <div class="mb-1">Page size</div>
          <div>
            <a-input v-model:value="page_size" />
          </div>
        </div>
        <div class="col-span-2 lg:col-span-1">
          <div class="mb-1">Load more</div>
          <div>
            <a-input v-model:value="load_more" />
          </div>
        </div>

        <div class="col-span-2 lg:col-span-1">
          <div class="mb-1">Sort by date</div>
          <div>
            <a-input v-model:value="sort_by_date" />
          </div>
        </div>
        <div class="col-span-2 lg:col-span-1">
          <div class="mb-1">Sort by rating</div>
          <div>
            <a-input v-model:value="sort_by_rating" />
          </div>
        </div>
        <div class="col-span-2 lg:col-span-1">
          <div class="mb-1">Sort by media</div>
          <div>
            <a-input v-model:value="sort_by_media" />
          </div>
        </div>
        <div class="col-span-2 lg:col-span-1">
          <div class="mb-1">Sort by the latest change</div>
          <div>
            <a-input v-model:value="sort_by_the_latest_change" />
          </div>
        </div>
      </div>
    </CollapsePanel>
  </Collapse>
</template>

<style lang="less" scoped>
  .collapse-panel {
    @apply grid grid-cols-2 gap-x-8 gap-y-4 ml-30px;
  }
</style>

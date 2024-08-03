<script lang="ts" setup>
  import { useField } from 'vee-validate';
  import { Collapse, CollapsePanel } from 'ant-design-vue';
  import { CaretRightOutlined } from '@ant-design/icons-vue';

  const { value: based_on } = useField<string>('language.based_on');
  const { value: write_review } = useField<string>('language.write_review');
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

  const { value: form_title } = useField<string>('language.form_title');
  const { value: form_name } = useField<string>('language.form_name');
  const { value: form_email } = useField<string>('language.form_email');
  const { value: form_rating } = useField<string>('language.form_rating');
  const { value: form_feedback } = useField<string>('language.form_feedback');
  const { value: form_add_media } = useField<string>('language.form_add_media');
  const { value: form_cancel } = useField<string>('language.form_cancel');
  const { value: form_submit } = useField<string>('language.form_submit');

  const { value: thank_title } = useField<string>('language.thank_title');
  const { value: thank_description } = useField<string>('language.thank_description');
</script>

<template>
  <Collapse :activeKey="['translate']" ghost style="margin: -15px">
    <template #expandIcon>
      <CaretRightOutlined :rotate="90" />
    </template>

    <CollapsePanel key="translate">
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
          <div class="mb-1">Write a review</div>
          <div>
            <a-input v-model:value="write_review" />
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

    <CollapsePanel key="translate">
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

    <CollapsePanel key="translate">
      <template #header>
        <strong>Review form</strong>
      </template>
      <div class="collapse-panel">
        <div class="col-span-2 lg:col-span-1">
          <div class="mb-1">Title</div>
          <div>
            <a-input v-model:value="form_title" />
          </div>
        </div>
        <div class="col-span-2 lg:col-span-1">
          <div class="mb-1">Name</div>
          <div>
            <a-input v-model:value="form_name" />
          </div>
        </div>
        <div class="col-span-2 lg:col-span-1">
          <div class="mb-1">Email</div>
          <div>
            <a-input v-model:value="form_email" />
          </div>
        </div>
        <div class="col-span-2 lg:col-span-1">
          <div class="mb-1">Rating</div>
          <div>
            <a-input v-model:value="form_rating" />
          </div>
        </div>

        <div class="col-span-2 lg:col-span-1">
          <div class="mb-1">Feedback</div>
          <div>
            <a-input v-model:value="form_feedback" />
          </div>
        </div>
        <div class="col-span-2 lg:col-span-1">
          <div class="mb-1">Add media (Max: 5 files)</div>
          <div>
            <a-input v-model:value="form_add_media" />
          </div>
        </div>
        <div class="col-span-2 lg:col-span-1">
          <div class="mb-1">Cancel</div>
          <div>
            <a-input v-model:value="form_cancel" />
          </div>
        </div>
        <div class="col-span-2 lg:col-span-1">
          <div class="mb-1">Submit</div>
          <div>
            <a-input v-model:value="form_submit" />
          </div>
        </div>
        <div class="col-span-2">
          <div class="mb-1">Thank you - Title</div>
          <div>
            <a-input v-model:value="thank_title" />
          </div>
        </div>
        <div class="col-span-2">
          <div class="mb-1">Thank you - Description</div>
          <div>
            <a-textarea v-model:value="thank_description" />
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

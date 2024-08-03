<script lang="ts" setup>
  import { reactive } from 'vue';
  import { Collapse, CollapsePanel } from 'ant-design-vue';

  const projectName = import.meta.env.VITE_GLOB_APP_TITLE;
  const state = reactive({
    activeKey: 'v3.0.0',
  });
</script>

<template>
  <div class="mx-auto md:min-w-screen-md mb-5">
    <div class="mx-auto max-w-screen-md text-center mb-8 mt-15">
      <h2 class="mb-4 text-2xl tracking-tight font-extrabold">
        {{ projectName }} - Release Notes
      </h2>
    </div>
    <Collapse v-model:activeKey="state.activeKey">
      <CollapsePanel key="v3.0.0" header="Version v3.0.0 - 2024/08/10">
        <ul class="list-disc list-inside marker:text-blue-500">
          <li>
            Improve UI/UX 🚀

            <ul class="sub-list marker:text-blue-300">
              <li> Upgrade platform</li>
            </ul>
            <ul class="sub-list marker:text-blue-300">
              <li> Enhance loading performance</li>
            </ul>
          </li>
        </ul>
      </CollapsePanel>
      <CollapsePanel key="v2.8.0" header="Version v2.8.0 - 2024/07/18">
        <ul class="list-disc list-inside marker:text-blue-500">
          <li>
            New feature ✨✨✨

            <ul class="sub-list marker:text-blue-300">
              <li> Scrape AliExpress and Amazon directly from Product page</li>
              <li> Upgrade the server to handle thousands more requests</li>
            </ul>
          </li>
          <li>
            Improve UI/UX 🚀

            <ul class="sub-list marker:text-blue-300">
              <li> Enhance loading performance</li>
            </ul>
          </li>
        </ul>
      </CollapsePanel>
      <CollapsePanel key="v2.7.0" header="Version v2.7.0 - 2024/02/20">
        <ul class="list-disc list-inside marker:text-blue-500">
          <li>
            Improve UI/UX 🚀

            <ul class="sub-list marker:text-blue-300">
              <li> Widget flow</li>
              <li> Enhance loading performance</li>
            </ul>
          </li>
        </ul>
      </CollapsePanel>
      <CollapsePanel key="v2.6.0" header="Version v2.6.0 - 2023/11/23">
        <ul class="list-disc list-inside marker:text-blue-500">
          <li>
            New feature ✨✨✨

            <ul class="sub-list marker:text-blue-300">
              <li> Find and clone review with Artificial Intelligence</li>
            </ul>
          </li>
          <li>
            Improve UI/UX 🚀

            <ul class="sub-list marker:text-blue-300">
              <li> Update layout for Product Review widgets</li>
              <li> Update UI for Reviews and Products pages</li>
              <li> Fix mini bugs for product search and country search</li>
            </ul>
          </li>
        </ul>
      </CollapsePanel>
      <CollapsePanel key="v2.5.0" header="Version v2.5.0 - 2023/10/04">
        <ul class="list-disc list-inside marker:text-blue-500">
          <li>
            New feature and improve UI/UX 🚀

            <ul class="sub-list marker:text-blue-300">
              <li> Google Product Review Feed</li>
              <li> Carousel widget - Add option to hide product info with Grid style</li>
              <li> Rating widget - Add option to change background color for rating icon</li>
              <li> Rating widget - Add option to change background color for rating icon</li>
              <li> Update Dashboard UI</li>
            </ul>
          </li>
        </ul>
      </CollapsePanel>
      <CollapsePanel key="v2.4.0" header="Version v2.4.0 - 2023/07/12">
        <ul class="list-disc list-inside marker:text-blue-500">
          <li>
            New Widget & Improve app performance 🚀

            <ul class="sub-list marker:text-blue-300">
              <li> Best Reviews</li>
              <li> Add always align center on mobile screen for Rating widget</li>
              <li> Update Popup Widget performance</li>
              <li> Loading faster with CDN and resized images</li>
              <li> Add change verified icon color feature for all widgets</li>
              <li> Add options for Popup widget to display on some special pages</li>
            </ul>
          </li>
        </ul>
      </CollapsePanel>
      <CollapsePanel key="v2.3.0" header="Version v2.3.0 - 2023/06/01">
        <ul class="list-disc list-inside marker:text-blue-500">
          <li>
            Improve UI/UX🚀

            <ul class="sub-list marker:text-blue-300">
              <li> Onboarding</li>
              <li> Dashboard UI</li>
              <li> Update rating widget</li>
              <li> Add country filter in review page</li>
              <li> Support Shopify AppBridge</li>
              <li> Add page size option for Product Review widget</li>
            </ul>
          </li>
        </ul>
      </CollapsePanel>
      <CollapsePanel key="v2.2.0" header="Version v2.2.0 - 2023/02/13">
        <ul class="list-disc list-inside marker:text-blue-500">
          <li>
            New feature 🚀

            <ul class="sub-list marker:text-blue-300">
              <li> Etsy supported - Crawl reviews from Etsy platform</li>
              <li> Review request email base on fulfilled orders</li>
              <li> Create/Change position component for widgets</li>
            </ul>
          </li>
        </ul>
      </CollapsePanel>
      <CollapsePanel key="v2.1.0" header="Version v2.1.0 - 2022/12/08">
        <ul class="list-disc list-inside marker:text-blue-500">
          <li>
            Improve 🚀
            <ul class="sub-list marker:text-blue-300">
              <li> Google search schema for Product Reviews widget</li>
              <li> Bookmarklet button layout V2.7</li>
              <li> Update pricing information 🚀</li>
              <li> Bookmarklet - WB V2.6 - Improve performance for AliExpress sites</li>
            </ul>
          </li>
        </ul>
      </CollapsePanel>
      <CollapsePanel key="v2.0.0" header="Version v2.0.0 - 2022/11/12">
        <ul class="list-disc list-inside marker:text-blue-500">
          <li>
            Improve 🚀

            <ul class="sub-list marker:text-blue-300">
              <li> Update performance for Testimonial</li>
              <li> Update layout for Testimonial and Trust Badge widgets</li>
              <li> Bookmarklet button layout V2.5 - Improve performance for AliExpress sites</li>
              <li> Product reviews performance</li>
              <li> Add app-bridge for Shopify Admin page</li>
            </ul>
          </li>
        </ul>
      </CollapsePanel>

      <CollapsePanel key="v1.0.0" header="Version v1.0.0 - 2022/08/26">
        <ul class="list-disc list-inside marker:text-blue-500">
          <li>
            New ✨✨✨

            <ul class="sub-list marker:text-blue-300">
              <li> Testimonial widget</li>
              <li> Cookie consent widget</li>
              <li> Trust badge widget</li>
            </ul>
          </li>
          <li>
            Improve 🚀
            <ul class="sub-list marker:text-blue-300">
              <li> High loading performance</li>
              <li> Suport both Vintage Theme and Theme OS 2.0</li>
              <li> Scraper Tool</li>
              <li> Product reviews widget</li>
              <li> Rating reviews widget</li>
              <li> Carousel reviews widget</li>
              <li> Popup reviews widget</li>
            </ul>
          </li>
        </ul>
      </CollapsePanel>
    </Collapse>
  </div>
</template>

<style lang="less" scoped>
  ul.sub-list {
    @apply list-disc list-inside ml-4 !text-xs leading-5;

    li {
      @apply my-1;
    }
  }

  li {
    @apply mb-3;
  }
</style>

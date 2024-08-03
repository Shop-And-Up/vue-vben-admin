<script lang="ts" setup>
  import { reactive } from 'vue';
  import { useUserStore } from '@/store/modules/user';

  defineProps({
    settings: <any>{ type: Object },
  });

  const { userInfo } = useUserStore();
  const state = reactive({
    products: [
      {
        name: 'Black Leather Bags',
        image: 'https://storage.widgetbuilder.app/widget_builder/static-images/reviews/014.jpg',
        url: 'https://' + userInfo?.myshopify_domain,
      },
      {
        name: 'Blue Silk Tuxeds',
        image: 'https://storage.widgetbuilder.app/widget_builder/static-images/reviews/009-0.jpg',
        url: 'https://' + userInfo?.myshopify_domain,
      },
      {
        name: 'Chequered Red Shirt',
        image: 'https://storage.widgetbuilder.app/widget_builder/static-images/reviews/015.jpg',
        url: 'https://' + userInfo?.myshopify_domain,
      },
      {
        name: 'Classic Leather Jacket',
        image: 'https://storage.widgetbuilder.app/widget_builder/static-images/reviews/013.jpg',
        url: 'https://' + userInfo?.myshopify_domain,
      },
    ],
  });

  const rickContent = (str) => {
    return str
      .replace('@Store_Name', userInfo?.username)
      .replace('@Order_Name', '#9999')
      .replace('@Buyer_First_Name', 'John')
      .replace('@Buyer_Last_Name', 'Smith')
      .replace('@Buyer_Full_Name', 'John Smith')
      .replace('@Buyer_Email', 'JohnSmith@sample.mail');
  };
</script>

<template>
  <div class="text-center bg-blue-50 p-3 rounded-md">
    <a-button class="!font-semibold !px-0 !pr-2" type="link" postIcon="ant-design:double-right-outlined">
      Mail Subject
    </a-button>
    <span class="font-semibold"> {{ rickContent(settings.mail_subject) }} </span>
  </div>

  <div class="p-5">
    <div
      style="
        width: 100%;
        min-height: 100%;
        margin: 0;
        padding: 0;
        color: #2f3044;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 15px;
        font-weight: normal;
        line-height: 1.8;
      "
    >
      <br />
      <table
        align="center"
        border="0"
        cellpadding="0"
        cellspacing="0"
        width="100%"
        style=" max-width: 600px; margin: 0 auto; padding: 0;border-collapse: collapse"
      >
        <tbody>
          <tr v-if="settings.mail_banner">
            <td align="center" style=" padding: 0 0 20px;text-align: center">
              <a href="" rel="noopener" target="_blank">
                <img
                  alt="Logo"
                  :src="settings.mail_banner"
                  style="max-width: 100%; margin: 0 auto"
                />
              </a>
            </td>
          </tr>
          <tr>
            <td align="left">
              <div
                :style="{
                  'text-align': 'left',
                  padding: '20px',
                  'background-color': settings.background_color,
                  'border-radius': '15px',
                }"
              >
                <div style="padding-bottom: 30px" class="wba-nl2br">
                  {{ rickContent(settings.mail_content) }}
                </div>

                <div style="padding-bottom: 10px; font-size: 17px; text-align: center">
                  <strong>{{ rickContent(settings.mail_sub_content) }}</strong>
                </div>

                <div
                  :style="{
                    border: '2px solid ' + settings.frame_color,
                    'border-radius': '15px',
                  }"
                >
                  <div style="padding: 10px 20px 10px 45px">
                    <table
                      v-for="(tProduct, tIndex) in state.products"
                      :key="tIndex"
                      border="0"
                      cellspacing="0"
                      style="width: 100%; margin: 10px auto"
                    >
                      <tbody>
                        <tr>
                          <td style="width: 50px">
                            <a :href="tProduct.url" target="_blank">
                              <div
                                v-bind:style="{
                                  'background-image': 'url(' + tProduct.image + ')',
                                  display: 'flex',
                                  'align-items': 'center',
                                  'justify-content': 'center',
                                  'font-weight': '500',
                                  color: '#3F4254',
                                  'background-color': '#F3F6F9',
                                  'background-repeat': 'no-repeat',
                                  'background-position': 'center center',
                                  'background-size': 'cover',
                                  'border-radius': '0.42rem',
                                  width: '50px',
                                  height: '50px',
                                }"
                              ></div>
                            </a>
                          </td>
                          <td style="vertical-align: middle">
                            <a
                              :href="tProduct.url"
                              target="_blank"
                              style="
                                display: -webkit-box;
                                margin-left: 15px;
                                overflow: hidden;
                                color: #5f5f5f;
                                font-size: 13.5px;
                                font-weight: bold;
                                line-height: 20px;
                                text-align: left;
                                text-decoration: none;
                                text-overflow: ellipsis;
                                word-break: break-all;
                              "
                            >
                              {{ tProduct.name }}
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- <div style="text-align: center">
                  <a
                    href="{{ $review_url }}"
                    target="_blank"
                    style="text-decoration:none;display:inline-block;text-align:center;padding: 8px 20px;font-size:0.925rem;line-height:1.5;border-radius:0.35rem;color:#ffffff;background-color: {{$frame_color}};border:0px;/* margin-right:0.75rem!important; */font-weight:600!important;outline:none!important;vertical-align:middle;margin-top: 10px;"
                  >
                    {{ settings.btn_review_text }}
                  </a>
                </div> -->
              </div>
            </td>
          </tr>
          <tr>
            <td
              class="wba-nl2br"
              align="center"
              style=" padding: 20px; color: #6d6e7c;font-size: 13px; text-align: center"
            >
              {{ rickContent(settings.mail_footer) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .wba-nl2br {
    white-space: pre;
  }
</style>

<template>
  <Card size="small">
    <template #title>
      <div class="flex justify-start items-center space-x-1">
        <div v-for="item in listBtns" :key="item.key" @click="item.handle()">
          <div
            class="font-bold cursor-pointer rounded w-30px h-30px grid place-content-center"
            :class="{
              'text-primary bg-blue-50': editor.isActive(item.key),
              '!hidden': item.key == 'unlink' && !editor.isActive('link'),
            }"
          >
            <Icon size="17" :icon="item.icon" />
          </div>
        </div>
      </div>
    </template>

    <EditorContent :editor="editor" />
  </Card>
</template>

<script lang="ts">
  import { computed, onUnmounted } from 'vue';
  import { Card } from 'ant-design-vue';
  import { Editor, EditorContent } from '@tiptap/vue-3';
  import StarterKit from '@tiptap/starter-kit';
  import Link from '@tiptap/extension-link';

  import Icon from '@/components/Icon/Icon.vue';

  export default {
    components: {
      EditorContent,
      Card,
      Icon,
    },
    props: {
      modelValue: {
        type: String,
        default: () => '',
      },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      let modelVal = computed({
        get: () => props.modelValue,
        set: (val) => emit('update:modelValue', val),
      });

      const editor = new Editor({
        extensions: [
          StarterKit,
          Link.configure({
            openOnClick: false,
          }),
        ],
        content: modelVal.value ?? '',
        onUpdate: () => {
          modelVal.value = editor.getHTML();
        },
      });

      const listBtns = [
        {
          key: 'bold',
          icon: 'ant-design:bold-outlined',
          handle: () => {
            editor.chain().focus().toggleBold().run();
          },
        },
        {
          key: 'italic',
          icon: 'ant-design:italic-outlined',
          handle: () => {
            editor.chain().focus().toggleItalic().run();
          },
        },
        {
          key: 'link',
          icon: 'ant-design:link-outlined',
          handle: () => {
            const previousUrl = editor.getAttributes('link').href;
            const url = window.prompt('Link to:', previousUrl);

            if (url === null) {
              return;
            }
            // empty
            if (url === '') {
              editor.chain().focus().extendMarkRange('link').unsetLink().run();
              return;
            }

            // update link
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
          },
        },
        {
          key: 'unlink',
          icon: 'bx:unlink',
          handle: () => {
            editor.chain().focus().unsetLink().run();
          },
        },
      ];

      const content = computed(() => {
        return editor.getHTML();
      });

      onUnmounted(() => {
        editor?.destroy();
      });

      return {
        listBtns,
        editor,
        content,
      };
    },
  };
</script>

<style lang="less">
  /* Basic editor styles */
  .ProseMirror {
    > * + * {
      margin-top: 0.75em;
    }

    ul,
    ol {
      padding: 0 1rem;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      line-height: 1.1;
    }

    code {
      background-color: rgba(#616161, 0.1);
      color: #616161;
    }

    pre {
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      background: #0d0d0d;
      color: #fff;
      font-family: JetBrainsMono, monospace;

      code {
        padding: 0;
        background: none;
        color: inherit;
        font-size: 0.8rem;
      }
    }

    img {
      max-width: 100%;
      height: auto;
    }

    blockquote {
      padding-left: 1rem;
      border-left: 2px solid rgba(#0d0d0d, 0.1);
    }

    hr {
      margin: 2rem 0;
      border: none;
      border-top: 2px solid rgba(#0d0d0d, 0.1);
    }

    &:focus-visible {
      outline: none;
    }
  }
</style>

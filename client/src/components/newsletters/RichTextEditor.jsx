import { useEffect, useRef } from 'react';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import {
  BackgroundColor,
  Color,
  FontFamily,
  FontSize,
  TextStyle
} from '@tiptap/extension-text-style';

import AppIcon from '../common/AppIcon.jsx';
import FormAlert from '../common/FormAlert.jsx';
import { readFileAsDataUrl } from '../../utils/readFileAsDataUrl.js';

const fontFamilyOptions = [
  { label: 'Theme Font', value: '' },
  { label: 'Space Grotesk', value: 'Space Grotesk' },
  { label: 'Sora', value: 'Sora' },
  { label: 'Georgia', value: 'Georgia' },
  { label: 'Tahoma', value: 'Tahoma' },
  { label: 'Trebuchet', value: 'Trebuchet MS' },
  { label: 'Times', value: 'Times New Roman' },
  { label: 'Verdana', value: 'Verdana' }
];

const fontSizeOptions = [
  { label: 'Theme Size', value: '' },
  { label: '14 px', value: '14px' },
  { label: '16 px', value: '16px' },
  { label: '18 px', value: '18px' },
  { label: '20 px', value: '20px' },
  { label: '24 px', value: '24px' },
  { label: '32 px', value: '32px' },
  { label: '40 px', value: '40px' }
];

const normalizeEditorContent = (value) => {
  const normalizedValue = String(value || '').trim();
  return normalizedValue || '<p></p>';
};

const ensureHttpsUrl = (value) => {
  const normalized = String(value || '').trim();

  if (!normalized) {
    return '';
  }

  if (/^https?:\/\//i.test(normalized) || /^\/uploads\//i.test(normalized)) {
    return normalized;
  }

  return `https://${normalized}`;
};

const createToolbarButtonClassName = (active = false) =>
  `newsletter-editor-button ${active ? 'newsletter-editor-button-active' : ''}`.trim();

function ToolbarButton({
  active = false,
  disabled = false,
  icon,
  label,
  onClick
}) {
  return (
    <button
      aria-label={label}
      aria-pressed={active}
      className={createToolbarButtonClassName(active)}
      disabled={disabled}
      onClick={onClick}
      title={label}
      type="button"
    >
      <AppIcon className="h-4 w-4" name={icon} />
    </button>
  );
}

function ToolbarGroup({ children }) {
  return <div className="newsletter-editor-group">{children}</div>;
}

export default function RichTextEditor({
  error,
  helper,
  id,
  label,
  onChange,
  value
}) {
  const imageUploadInputRef = useRef(null);
  const editor = useEditor({
    immediatelyRender: false,
    content: normalizeEditorContent(value),
    editorProps: {
      attributes: {
        class:
          'newsletter-editor-surface prose prose-invert max-w-none focus:outline-none'
      }
    },
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
      TextStyle,
      Color,
      BackgroundColor,
      FontFamily,
      FontSize,
      Underline,
      Link.configure({
        autolink: true,
        openOnClick: false
      }),
      Image.configure({
        allowBase64: true,
        inline: false
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Placeholder.configure({
        placeholder: 'Start writing your newsletter content here...'
      })
    ],
    onUpdate: ({ editor: nextEditor }) => {
      onChange(nextEditor.getHTML());
    }
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const nextContent = normalizeEditorContent(value);

    if (editor.getHTML() !== nextContent) {
      editor.commands.setContent(nextContent, false);
    }
  }, [editor, value]);

  const handleSetLink = () => {
    if (!editor) {
      return;
    }

    const currentHref = editor.getAttributes('link').href || '';
    const rawUrl = window.prompt('Enter the link URL', currentHref);

    if (rawUrl === null) {
      return;
    }

    const url = ensureHttpsUrl(rawUrl);

    if (!url) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const handleInsertImageFromUrl = () => {
    if (!editor) {
      return;
    }

    const rawUrl = window.prompt('Enter the image URL');
    const imageUrl = ensureHttpsUrl(rawUrl);

    if (!imageUrl) {
      return;
    }

    editor.chain().focus().setImage({ src: imageUrl }).run();
  };

  const handleImageUpload = async (file) => {
    if (!file || !editor) {
      return;
    }

    const imageDataUrl = await readFileAsDataUrl(file);
    editor.chain().focus().setImage({ src: imageDataUrl }).run();
  };

  const currentFontFamily = editor?.getAttributes('textStyle')?.fontFamily || '';
  const currentFontSize = editor?.getAttributes('textStyle')?.fontSize || '';
  const currentTextColor = editor?.getAttributes('textStyle')?.color || '#f8fafc';
  const currentHighlightColor =
    editor?.getAttributes('textStyle')?.backgroundColor || '#d4af37';

  return (
    <div>
      <label className="label" htmlFor={id}>
        {label}
      </label>

      <div className="newsletter-editor-shell admin-panel overflow-hidden">
        <div className="newsletter-editor-toolbar">
          <ToolbarGroup>
            <ToolbarButton
              active={editor?.isActive('bold')}
              disabled={!editor?.can().chain().focus().toggleBold().run()}
              icon="bold"
              label="Bold"
              onClick={() => editor?.chain().focus().toggleBold().run()}
            />
            <ToolbarButton
              active={editor?.isActive('italic')}
              disabled={!editor?.can().chain().focus().toggleItalic().run()}
              icon="italic"
              label="Italic"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
            />
            <ToolbarButton
              active={editor?.isActive('underline')}
              disabled={!editor?.can().chain().focus().toggleUnderline().run()}
              icon="underline"
              label="Underline"
              onClick={() => editor?.chain().focus().toggleUnderline().run()}
            />
            <ToolbarButton
              active={editor?.isActive('strike')}
              disabled={!editor?.can().chain().focus().toggleStrike().run()}
              icon="strike"
              label="Strikethrough"
              onClick={() => editor?.chain().focus().toggleStrike().run()}
            />
          </ToolbarGroup>

          <ToolbarGroup>
            <ToolbarButton
              active={editor?.isActive('paragraph')}
              icon="paragraph"
              label="Body text"
              onClick={() => editor?.chain().focus().setParagraph().run()}
            />
            <ToolbarButton
              active={editor?.isActive('heading', { level: 1 })}
              icon="heading1"
              label="Heading 1"
              onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
            />
            <ToolbarButton
              active={editor?.isActive('heading', { level: 2 })}
              icon="heading2"
              label="Heading 2"
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            />
            <ToolbarButton
              active={editor?.isActive('heading', { level: 3 })}
              icon="heading3"
              label="Heading 3"
              onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
            />
          </ToolbarGroup>

          <ToolbarGroup>
            <ToolbarButton
              active={editor?.isActive({ textAlign: 'left' })}
              icon="alignLeft"
              label="Align left"
              onClick={() => editor?.chain().focus().setTextAlign('left').run()}
            />
            <ToolbarButton
              active={editor?.isActive({ textAlign: 'center' })}
              icon="alignCenter"
              label="Align center"
              onClick={() => editor?.chain().focus().setTextAlign('center').run()}
            />
            <ToolbarButton
              active={editor?.isActive({ textAlign: 'right' })}
              icon="alignRight"
              label="Align right"
              onClick={() => editor?.chain().focus().setTextAlign('right').run()}
            />
            <ToolbarButton
              active={editor?.isActive({ textAlign: 'justify' })}
              icon="alignJustify"
              label="Justify"
              onClick={() => editor?.chain().focus().setTextAlign('justify').run()}
            />
          </ToolbarGroup>

          <ToolbarGroup>
            <ToolbarButton
              active={editor?.isActive('bulletList')}
              icon="listBullets"
              label="Bulleted list"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
            />
            <ToolbarButton
              active={editor?.isActive('orderedList')}
              icon="listNumbers"
              label="Numbered list"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            />
            <ToolbarButton
              active={editor?.isActive('blockquote')}
              icon="quote"
              label="Quote"
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            />
          </ToolbarGroup>

          <ToolbarGroup>
            <select
              className="newsletter-editor-select"
              onChange={(event) => {
                const nextValue = event.target.value;

                if (!editor) {
                  return;
                }

                if (!nextValue) {
                  editor.chain().focus().unsetFontFamily().run();
                  return;
                }

                editor.chain().focus().setFontFamily(nextValue).run();
              }}
              value={currentFontFamily}
            >
              {fontFamilyOptions.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              className="newsletter-editor-select"
              onChange={(event) => {
                const nextValue = event.target.value;

                if (!editor) {
                  return;
                }

                if (!nextValue) {
                  editor.chain().focus().unsetFontSize().run();
                  return;
                }

                editor.chain().focus().setFontSize(nextValue).run();
              }}
              value={currentFontSize}
            >
              {fontSizeOptions.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <label className="newsletter-editor-color-field">
              <span>Text</span>
              <input
                onChange={(event) => editor?.chain().focus().setColor(event.target.value).run()}
                type="color"
                value={currentTextColor}
              />
            </label>
            <label className="newsletter-editor-color-field">
              <span>Highlight</span>
              <input
                onChange={(event) =>
                  editor?.chain().focus().setBackgroundColor(event.target.value).run()
                }
                type="color"
                value={currentHighlightColor}
              />
            </label>
          </ToolbarGroup>

          <ToolbarGroup>
            <ToolbarButton
              active={editor?.isActive('link')}
              icon="link2"
              label="Insert link"
              onClick={handleSetLink}
            />
            <ToolbarButton
              disabled={!editor?.isActive('link')}
              icon="unlink"
              label="Remove link"
              onClick={() => editor?.chain().focus().extendMarkRange('link').unsetLink().run()}
            />
            <ToolbarButton
              icon="image"
              label="Insert image from URL"
              onClick={handleInsertImageFromUrl}
            />
            <ToolbarButton
              icon="upload"
              label="Upload image"
              onClick={() => imageUploadInputRef.current?.click()}
            />
          </ToolbarGroup>

          <ToolbarGroup>
            <ToolbarButton
              disabled={!editor?.can().chain().focus().undo().run()}
              icon="undo"
              label="Undo"
              onClick={() => editor?.chain().focus().undo().run()}
            />
            <ToolbarButton
              disabled={!editor?.can().chain().focus().redo().run()}
              icon="redo"
              label="Redo"
              onClick={() => editor?.chain().focus().redo().run()}
            />
          </ToolbarGroup>

          <input
            accept="image/*"
            className="hidden"
            id={`${id}-upload`}
            onChange={(event) => {
              void handleImageUpload(event.target.files?.[0]);
              event.target.value = '';
            }}
            ref={imageUploadInputRef}
            type="file"
          />
        </div>

        <EditorContent editor={editor} id={id} />
      </div>

      <p className="mt-2 text-xs text-[#8a8a8a]" id={`${id}-label`}>
        {helper || 'Use the toolbar to format text, add links, and insert inline images.'}
      </p>
      <FormAlert message={error} />
    </div>
  );
}

import {
  ChevronDown,
  X,
  List,
  ListOrdered,
  ListChecks,
  ImagePlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";

const NewNoteModal = ({ onClose, onCreate, note = null, mode = "create" }) => {
  const [title, setTitle] = useState(note?.title || "");
  const [category, setCategory] = useState(note?.category || "Personal");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(note?.image || "");
  const [imageError, setImageError] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [removeImage, setRemoveImage] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    content: "",
  });
  const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";
  const editor = useEditor({
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content: note?.content || "",
    editorProps: {
      attributes: {
        class: "note-editor",
      },
    },
  });
 useEffect(() => {
  if (!editor) return;

  const handleEditorUpdate = () => {
    if (errors.content) {
      setErrors((previous) => ({
        ...previous,
        content: "",
      }));
    }
  };

  editor.on("update", handleEditorUpdate);

  return () => {
    editor.off("update", handleEditorUpdate);
  };
}, [editor, errors.content]);
  const editorState = useEditorState({
      editor,
      selector: ({ editor }) => ({
        isBold: editor?.isActive("bold") ?? false,
        isItalic: editor?.isActive("italic") ?? false,
        isStrike: editor?.isActive("strike") ?? false,
        isBulletList: editor?.isActive("bulletList") ?? false,
        isOrderedList: editor?.isActive("orderedList") ?? false,
        isTaskList: editor?.isActive("taskList") ?? false,
      }),
    });

  useEffect(() => {
    setTitle(note?.title || "");
    setCategory(note?.category || "Personal");
    setCategoryOpen(false);
    setImage(null);
    setImagePreview(
      note?.image
        ? `${API_URL}${note.image}`
        : ""
    );
    setImageError("");
    setRemoveImage(false);

    if (editor) {
      editor.commands.setContent(note?.content || "");
    }
  }, [note, editor]);

  
 const handleCategoryChange = (newCategory) => {
    // Do nothing to the editor if the user selects the same category.
    if (newCategory === category) {
      setCategoryOpen(false);
      return;
    }

    // Only convert checklist → bullet list when the user
    // explicitly changes FROM To-Do to another category.
    if (category === "To-Do" && newCategory !== "To-Do" && editor) {
      const { doc } = editor.state;
      const taskListNodes = [];

      doc.descendants((node, pos) => {
        if (node.type.name === "taskList") {
          taskListNodes.push({ node, pos });
        }
      });

      editor.commands.command(({ tr, state }) => {
        taskListNodes.reverse().forEach(({ node, pos }) => {
          const listItems = [];

          node.forEach((taskItem) => {
            taskItem.forEach((child) => {
              if (child.type.name === "paragraph") {
                listItems.push(
                  state.schema.nodes.listItem.create(
                    null,
                    child
                  )
                );
              }
            });
          });

          if (listItems.length > 0) {
            const bulletList = state.schema.nodes.bulletList.create(
              null,
              listItems
            );

            tr.replaceWith(
              pos,
              pos + node.nodeSize,
              bulletList
            );
          }
        });

        return true;
      });
    }

    setCategory(newCategory);
    setCategoryOpen(false);
  };


  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setImageError("Only JPG, JPEG, PNG and WEBP images are allowed.");
      setImage(null);
      setImagePreview("");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setImageError("Image size must be less than 2MB.");
      setImage(null);
      setImagePreview("");
      event.target.value = "";
      return;
    }

    setImage(file);
    setImageError("");
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newErrors = {
      title: "",
      content: "",
    };

    if (!title.trim()) {
      newErrors.title = "Please enter a title.";
    }

    let content = editor?.getHTML() || "";
    content = content.replace(/<p><br><\/p>/g, "").trim();

    if (!content || content === "<p></p>") {
      newErrors.content = "Please enter some content.";
    }

    if (newErrors.title || newErrors.content) {
      setErrors(newErrors);
      return;
    }

    setErrors({
      title: "",
      content: "",
    });

   const formData = new FormData();

    formData.append("title", title.trim());
    formData.append("content", content);
    formData.append("category", category);

    if (image) {
      formData.append("image", image);
    }

    if (removeImage) {
      formData.append("removeImage", "true");
    }

    onCreate(formData);
  };

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className="note-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2>{mode === "edit" ? "Edit Note" : "New Note"}</h2>
            <p>
              {mode === "edit"
                ? "Make changes to your note."
                : "Capture something worth remembering."}
            </p>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form className="note-form" onSubmit={handleSubmit}>
          <div className="title-category-row">
            <div className="form-group title-group">
              <label htmlFor="note-title">Title</label>
              <input
                id="note-title"
                type="text"
                placeholder="Give your note a title"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);

                  if (errors.title) {
                    setErrors((previous) => ({
                      ...previous,
                      title: "",
                    }));
                  }
                }}
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? "note-title-error" : undefined}
                autoFocus
              />

              {errors.title && (
                <p id="note-title-error" className="form-error" role="alert">
                  {errors.title}
                </p>
              )}
            </div>

            <div className="form-group category-group">
              <label htmlFor="note-category">Category</label>
              <div className="category-dropdown">
                <button
                  id="note-category"
                  type="button"
                  className={`category-dropdown-button ${
                    categoryOpen ? "open" : ""
                  }`}
                  onClick={() => setCategoryOpen((previous) => !previous)}
                  aria-haspopup="listbox"
                  aria-expanded={categoryOpen}
                >
                  <span>{category}</span>

                  <ChevronDown
                    size={17}
                    className={
                      categoryOpen
                        ? "category-chevron rotated"
                        : "category-chevron"
                    }
                  />
                </button>

                {categoryOpen && (
                  <div className="category-dropdown-menu" role="listbox">
                    {["Personal", "Work", "Study", "Ideas", "To-Do", "Reminders"].map(
                      (option) => (
                        <button
                          key={option}
                          type="button"
                          className={`category-option ${
                            category === option ? "selected" : ""
                          }`}
                          onClick={() => {
                            handleCategoryChange(option)
                          }}
                          role="option"
                          aria-selected={category === option}
                        >
                          <span>{option}</span>

                          {category === option && (
                            <span className="category-check">✓</span>
                          )}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Content</label>

            <div className="editor-wrapper">
              {editor && (
                <>
                  <div className="editor-toolbar">
                    <button
                      type="button"
                      className={editorState.isBold ? "active" : ""}
                      onClick={() => editor.chain().focus().toggleBold().run()}
                    >
                      B
                    </button>

                    <button
                      type="button"
                      className={editorState.isItalic ? "active" : ""}
                      onClick={() =>
                        editor.chain().focus().toggleItalic().run()
                      }
                    >
                      <em>I</em>
                    </button>

                    <button
                      type="button"
                      className={editorState.isStrike ? "active" : ""}
                      onClick={() =>
                        editor.chain().focus().toggleStrike().run()
                      }
                    >
                      <s>S</s>
                    </button>

                    <button
                      type="button"
                      className={`toolbar-button ${
                        editorState.isBulletList ? "active" : ""
                      }`}
                      onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                      }
                      title="Bullet list"
                      aria-label="Bullet list"
                    >
                      <List size={17} />
                    </button>

                    <button
                      type="button"
                      className={`toolbar-button ${
                        editorState.isOrderedList ? "active" : ""
                      }`}
                      onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                      }
                      title="Numbered list"
                      aria-label="Numbered list"
                    >
                      <ListOrdered size={17} />
                    </button>

                    {category === "To-Do" && (
                      <button
                        type="button"
                        className={`toolbar-button ${
                          editorState.isTaskList ? "active" : ""
                        }`}
                        onClick={() =>
                          editor.chain().focus().toggleTaskList().run()
                        }
                        title="To-Do checklist"
                        aria-label="To-Do checklist"
                      >
                        <ListChecks size={17} />
                      </button>
                    )}
                  </div>

                  <EditorContent editor={editor} />
                </>
              )}
            </div>
            {errors.content && (
              <p className="form-error" role="alert">
                {errors.content}
              </p>
            )}
          </div>
          
            <div className="form-group note-image-group">
  <label htmlFor="note-image">Image</label>

  <label htmlFor="note-image" className="image-upload-button">
    <ImagePlus size={17} />
    {imagePreview ? "Replace Image" : "Add Image"}
  </label>

  <input
    id="note-image"
    type="file"
    accept="image/jpeg,image/jpg,image/png,image/webp"
    onChange={handleImageChange}
    hidden
  />

  {imageError && (
    <p className="form-error" role="alert">
      {imageError}
    </p>
  )}

  {imagePreview && (
    <div className="note-image-preview">
      <img src={imagePreview} alt="Note preview" />

      <button
        type="button"
        className="image-remove-button"
        onClick={() => {
          setImage(null);
          setImagePreview("");
          setImageError("");
          setRemoveImage(true);
        }}
      >
        <X size={15} />
        Remove Image
      </button>
    </div>
  )}
</div>
          

          <div className="modal-actions">
            <button
              type="button"
              className="modal-cancel"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className="modal-create">
              {mode === "edit" ? "Save Changes" : "Create Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewNoteModal
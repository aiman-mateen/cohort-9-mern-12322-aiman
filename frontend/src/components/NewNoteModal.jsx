import { ChevronDown, X, List, ListOrdered, ListChecks } from "lucide-react";
import { useEffect, useState } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";

const NewNoteModal = ({ onClose, onCreate, note = null, mode = "create" }) => {
  const [title, setTitle] = useState(note?.title || "");
  const [category, setCategory] = useState(note?.category || "Personal");
  const [categoryOpen, setCategoryOpen] = useState(false);
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

    if (editor) {
      editor.commands.setContent(note?.content || "");
    }
  }, [note, editor]);

  useEffect(() => {
    if (!editor || category === "To-Do") return;

    const { doc } = editor.state;

    const taskListNodes = [];

    doc.descendants((node, pos) => {
      if (node.type.name === "taskList") {
        taskListNodes.push({ node, pos });
      }
    });

    if (taskListNodes.length === 0) return;

    editor.commands.command(({ tr, state }) => {
      taskListNodes.reverse().forEach(({ node, pos }) => {
        const paragraphNodes = [];

        node.forEach((taskItem) => {
          taskItem.forEach((child) => {
            paragraphNodes.push(child);
          });
        });

        tr.replaceWith(
          pos,
          pos + node.nodeSize,
          paragraphNodes
        );
      });

      return true;
    });
  }, [category, editor]);

  const handleSubmit = (event) => {
  event.preventDefault();

  console.log("SUBMIT FIRED");
  console.log("Title:", title);
  console.log("Editor:", editor);
  console.log("Editor HTML:", editor?.getHTML());
  console.log("Editor empty:", editor?.isEmpty);

  if (!title.trim()) {
    console.log("RETURNED: title is empty");
    return;
  }

  const content = editor?.getHTML() || "";

  if (!content || content === "<p></p>") {
    console.log("RETURNED: content is empty");
    return;
  }

  console.log("CALLING onCreate");

  onCreate({
    title: title.trim(),
    content,
    category,
  });
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
                onChange={(event) => setTitle(event.target.value)}
                autoFocus
              />
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
                            setCategory(option);
                            setCategoryOpen(false);
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
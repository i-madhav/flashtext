import React, { useEffect, useRef, useState } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, ViewUpdate } from '@codemirror/view';
import { basicSetup } from '@codemirror/basic-setup';
import { javascript } from '@codemirror/lang-javascript';

const vsCodeTheme = EditorView.theme({
  '&': {
    backgroundColor: '#1E1E1E !important',
    height: '100%',
    fontSize: '20px',
    color: 'white'
  },
  '.cm-content': {
    caretColor: '#A9B7C6',
    color: '#D4D4D4'
  },
  '.cm-cursor': {
    borderLeftColor: '#A9B7C6'
  },
  '.cm-gutters': {
    backgroundColor: '#1E1E1E',
    color: '#858585',
    border: 'none'
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#2C323C'
  },
  '.cm-lineNumbers': {
    color: '#858585'
  },
  '.cm-line': {
    backgroundColor: '#1E1E1E'
  },
  '.cm-activeLine': {
    backgroundColor: '#2C323C'
  },
  '.cm-selectionMatch': {
    backgroundColor: '#3A3D41'
  },
  '.cm-matchingBracket, .cm-nonmatchingBracket': {
    backgroundColor: '#3A3D41',
    color: '#D4D4D4'
  },
  '.cm-searchMatch': {
    backgroundColor: '#515C6A'
  },
  '.cm-selectionBackground': {
    backgroundColor: '#264F78'
  }
}, { dark: true });

const Share = () => {
  const editorRef = useRef();
  const [editorContent, setEditorContent] = useState('// Write your code here');
  const [documentId, setDocumentId] = useState("");

  useEffect(() => {
    let path = window.location.pathname.slice(1);
    setDocumentId(path);
    if (!path)
      handleDocumentCreation()
  }, [])

  useEffect(() => {
    let path = window.location.pathname.slice(1);
    handleDocumentUpdation(path);
  },[editorContent]);

  async function handleDocumentCreation() {
    try {
      const response = await fetch('http://localhost:8000/', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          id: documentId,
          content: editorContent
        })
      });

      const data = await response.json();
      console.log(data);
      console.log(data.data._id);
      if (data && data.data._id) {
        const id = data.data._id;
        setDocumentId(id);
        window.history.pushState({}, '', `/${documentId}`);
      }

    } catch (error) {
      console.log("Error creating/updating document:", error);
    }
  }

  async function handleDocumentUpdation(id) {
    try {
      const response = await fetch(`http://localhost:8000/`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          id: documentId,
          content: editorContent
        })
      });

      const data = await response.json();
      console.log(data);
      setEditorContent(data.data.data);
    } catch (error) {
      console.log('Unable to update the document' + error);
    }

  }

  useEffect(() => {
    if (!editorRef.current) return;

    const startState = EditorState.create({
      doc: editorContent,
      extensions: [
        basicSetup,
        javascript(),
        vsCodeTheme,
        EditorView.updateListener.of((v) => {
          if (v.docChanged) {
            setEditorContent(v.state.doc.toString());
          }
        })
      ]
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current
    });

    return () => {
      view.destroy();
    };
  }, []);

  return (
    <div>
      <div ref={editorRef} style={{ height: '500px', width: '1100px', border: '1px solid #333' }}></div>
    </div>
  );
};

export default Share;
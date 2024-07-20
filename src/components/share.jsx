import React, { useEffect, useRef , useState } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView , ViewUpdate } from '@codemirror/view';
import { basicSetup } from '@codemirror/basic-setup';
import { javascript } from '@codemirror/lang-javascript';

const vsCodeTheme = EditorView.theme({
  '&': {
    backgroundColor: '#1E1E1E !important',
    height: '100%',
    fontSize:'20px',
    color:'white'
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
  console.log(editorContent);
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

  const handleGetContent = () => {
    console.log("Editor content:", editorContent);
    // You can use editorContent here as needed
  };

  return (
    <div>
      <div ref={editorRef} style={{ height: '500px', width: '1100px', border: '1px solid #333' }}></div>
    </div>
  );
};

export default Share;
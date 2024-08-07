import React, { useEffect, useRef, useState } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView} from "@codemirror/view";
import { basicSetup } from "@codemirror/basic-setup";
import { javascript } from "@codemirror/lang-javascript";

const vsCodeTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "#1E1E1E !important",
      height: "100%",
      fontSize: "20px",
      color: "white",
    },
    ".cm-content": {
      caretColor: "#A9B7C6",
      color: "#D4D4D4",
    },
    ".cm-cursor": {
      borderLeftColor: "#A9B7C6",
    },
    ".cm-gutters": {
      backgroundColor: "#1E1E1E",
      color: "#858585",
      border: "none",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "#2C323C",
    },
    ".cm-lineNumbers": {
      color: "#858585",
    },
    ".cm-line": {
      backgroundColor: "#1E1E1E",
    },
    ".cm-activeLine": {
      backgroundColor: "#2C323C",
    },
    ".cm-selectionMatch": {
      backgroundColor: "#3A3D41",
    },
    ".cm-matchingBracket, .cm-nonmatchingBracket": {
      backgroundColor: "#3A3D41",
      color: "#D4D4D4",
    },
    ".cm-searchMatch": {
      backgroundColor: "#515C6A",
    },
    ".cm-selectionBackground": {
      backgroundColor: "#264F78",
    },
  },
  { dark: true }
);

const Share = () => {
  const editorRef = useRef();
  const [documentId, setDocumentId] = useState("");
  const [editorContent, setEditorContent] = useState(localStorage.getItem(`${window.location.pathname.slice(1)}`));
  
  useEffect(() => {
    let path = window.location.pathname.slice(1);
    if (path.length > 1) {
      handleFetchData(path);
      setDocumentId(path);
    }else{
      handleDocumentCreation();
      setDocumentId(path);
    }
  }, []);

  useEffect(() => {
    if (editorContent) {
      localStorage.setItem(`${documentId}`, editorContent);
      let updatedData = localStorage.getItem(`${documentId}`);
      handleDocumentUpdation(documentId , updatedData);
    }
  }, [editorContent]);

  async function handleDocumentCreation() {
    try {
      const response = await fetch(
        "https://notepadbackend-y9k7.onrender.com/save",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            id: "",
            content: editorContent,
          }),
        }
      );

      const data = await response.json();
      if (data && data.data._id) {
        const id = data.data._id;
        console.log(id);
        
        window.history.pushState({}, "", `/${id}`);
      }
    } catch (error) {
      console.log("Error creating/updating document:", error);
    }
  }

  async function handleDocumentUpdation(id , updatedData){    
    try {
      console.log("this is the content being saved in the database" + `${editorContent} and id - ${id}`);
      const response = await fetch(
        `https://notepadbackend-y9k7.onrender.com/save`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            id: id,
            content: updatedData,
          }),});

         const data = await response.json();
         if(data.data.text === editorContent) return; 
    } catch (error) {
      console.log("Unable to update the document" + error);
    }
  }

  async function handleFetchData(docid) {
    try {
      const response = await fetch(
        `https://notepadbackend-y9k7.onrender.com/fetch/${docid}`);
      const data = await response.json();
      let stuff = data.data.text;
      localStorage.setItem(`${docid}` , stuff);
    } catch (error) {
      console.log("unable to fetch data from the backend - " + error);
    }
  }

  useEffect(() => {
    if (!editorRef.current) return;
    console.log("I ran inside editorREd=f");
    
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
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    return () => {
      view.destroy();
    };
  }, []);

  return (
    <div>
      <div
        ref={editorRef}
        style={{ height: "500px", width: "1100px", border: "1px solid #333" }}
      ></div>
    </div>
  );
};

export default Share;

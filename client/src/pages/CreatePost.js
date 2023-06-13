import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../editor";
import OptionSelector from "../components/options"


export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [selectedOption, setSelectedOption] = useState('All');

  const handleOptionChange = event => {
    setSelectedOption(event.target.value);
  };

  async function createNewPost(ev) {
    ev.preventDefault();

    const data = new FormData();

    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", files[0]);
    data.set('option',selectedOption)

    const response = await fetch("https://univibes-backend.onrender.com/post", {
      method: "POST",
      body: data,
      credentials: "include",
    });

    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <form onSubmit={createNewPost}>
      <input
        type="text"
        placeholder={"title"}
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <input
        type="summary"
        placeholder={"summary"}
        value={summary}
        onChange={(ev) => setSummary(ev.target.value)}
      />
      <OptionSelector
        selectedOption={selectedOption}
        onOptionChange={handleOptionChange}
      />
      <input type="file" onChange={(ev) => setFiles(ev.target.files)} />
      <Editor onChange={setContent}  value={content}/>
      
      <button style={{ marginTop: "10px" }}>Create Post</button>
    </form>
  );
}

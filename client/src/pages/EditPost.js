import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../editor";
import OptionSelector from "../components/options";

export default function EditPost() {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [selectedOption, setSelectedOption] = useState("All");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    fetch("https://univibes-backend.onrender.com/post/" + id).then((response) => {
      response.json().then((postInfo) => {
        setTitle(postInfo.title);
        setSummary(postInfo.summary);
        setContent(postInfo.content);
        setSelectedOption(postInfo.option);
      });
    });
    // eslint-disable-next-line
  }, []);

  async function updatePost(ev) {
    ev.preventDefault();

    const data = new FormData();

    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("option", selectedOption);
    data.set("id", id);
    if (files?.[0]) {
      data.set("file", files[0]);
    }

    const response = await fetch("https://univibes-backend.onrender.com/post", {
      method: "PUT",
      body: data,
      credentials: "include",
    });

    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/post/" + id} />;
  }
  return (
    <form onSubmit={updatePost}>
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

      <Editor onChange={setContent} value={content} />

      <button style={{ marginTop: "10px" }}>Update Post</button>
    </form>
  );
}

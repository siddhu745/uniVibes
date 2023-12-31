import { useEffect, useState } from "react";
import Post from "../Post";
import Navbar from "../components/nav";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const options = [
    "All",
    "Events",
    "Research",
    "Sports",
    "CSE",
    "ECE",
    "CIVIL",
    "MECH",
    "EEE",
  ];
  const [selectedOption, setSelectedOption] = useState("all");

  useEffect(() => {
    fetch("https://univibes-backend.onrender.com/post").then((response) => {
      response.json().then((posts) => {
        setPosts(posts);
        setFilteredPosts(posts);
      });
    });
  }, []);

 

  useEffect(() => {
    filterPosts(selectedOption);
    // eslint-disable-next-line
  }, [selectedOption]);

  const filterPosts = (option) => {
    setSelectedOption(option);
    if (option === "All") {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter((post) => post.option === selectedOption);
      setFilteredPosts(filtered);
    }
  };
  return (
    <>
      <Navbar options={options} selectedOption={selectedOption} onFilterChange={filterPosts} />

      {filteredPosts.length > 0 &&
        filteredPosts.map((post) => {
          return <Post key={post._id} {...post} />;
        })}
    </>
  );
}

import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";

export default function Post({
  title,
  summary,
  cover,
  _id,
  createdAt,
  author,
}) {

    // eslint-disable-next-line
  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`}>
          <img src={"http://localhost:5000/" + cover} alt="blog image"/>
        </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>

        <p className="info">
          <a href="" className="author">
            {author.username}
          </a>
          <time>{formatISO9075(new Date(createdAt))}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
}

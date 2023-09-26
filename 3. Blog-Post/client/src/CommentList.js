/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable react-hooks/exhaustive-deps */

/*export default ({ postId }) => {
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    const { data } = await axios.get(
      `http://localhost:4001/posts/${postId}/comments`
    );
    setComments(data);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const renderedComments = comments.map((comment) => {
    return <li key={comment.id}>{comment.comment}</li>;
  });

  return <div>{renderedComments}</div>;
}; */

export default ({ comments }) => {
  const renderedComments = comments.map((comment) => {
    let content;
    if (comment.status === "approved") {
      content = comment.comment;
    }
    if (comment.status === "pending") {
      content = "This comment is awaiting moderation";
    }
    if (comment.status === "rejected") {
      content = "This comment has been rejected";
    }

    return <li key={comment.id}>{content}</li>;
  });

  return <div>{renderedComments}</div>;
};

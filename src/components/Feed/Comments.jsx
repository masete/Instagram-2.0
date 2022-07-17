import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { EmojiHappyIcon } from "@heroicons/react/outline";
import { addComment, displayComment } from "../../services/firebase";
import useUser from "../../hooks/use-user";
import { getFirestore, onSnapshot } from "firebase/firestore";
import { firebaseApp } from "../../lib/firebase";
import ReactTimeAgo from "react-time-ago";
import Comment from "./Comment";
import { useRecoilState } from "recoil";
import { photoDisplayModalState } from "../../atoms/modalAtom";

function Comments({ id, postedAt, commentInput }) {
  const {
    user: { username, image, userId },
  } = useUser();
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const db = getFirestore(firebaseApp);
  const [isopen, setIsOpen] = useRecoilState(photoDisplayModalState);
  // realtime update the comments section
  useEffect(() => {
    async function showComments() {
      onSnapshot(displayComment(id), (snapshot) => {
        setComments(snapshot.docs);
      });
    }
    showComments();
  }, [db, id]);

  // push the comment into firestore
  const sendComment = async (event) => {
    event.preventDefault();
    const commentToSend = comment;
    setComment("");
    await addComment(id, commentToSend, username, image);
  };
  return (
    <div>
      {/* Display Comments */}
      {comments.length > 0 && (
        <div className={`max-h-[108px] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-500 ${isopen && ("md:max-h-80 md:-ml-6")}`}>
          {comments.map((comment) => (
            <div className="" key={comment.id}>
              <Comment
                photoId={id}
                commentId={comment.id}
                userId={userId}
                username={comment.data().username}
                image={comment.data().userImage}
                comment={comment.data().comment}
                postedAt={comment.data().timestamp}
                totalLikes={comment.data().likes?.length}
              />
            </div>
          ))}
        </div>
      )}
      {/* Comment Input */}
      <div>
        <form className="flex items-center border-y border-gray-200 px-4">
          <EmojiHappyIcon className="h-7 w-7 text-gray-700" />
          <input
            type="text"
            placeholder="Add a comment..."
            className="mx-4 flex-1 border-none p-4 outline-none focus:ring-0"
            value={comment}
            aria-label="Add a comment"
            autoComplete="off"
            onChange={({ target }) => setComment(target.value)}
            ref={commentInput}
          />
          <button
            className="font-semibold text-blue-400"
            type="submit"
            disabled={!comment.trim()}
            onClick={sendComment}
          >
            Post
          </button>
        </form>
      </div>
      <div className="p-4">
        <ReactTimeAgo
          date={postedAt.toDate()}
          locale="en-US"
          timeStyle="round"
          className="mt-2 text-xs capitalize text-gray-400"
        />
      </div>
    </div>
  );
}

export default Comments;

Comments.propTypes = {
  id: PropTypes.string.isRequired,
  postedAt: PropTypes.object.isRequired,
  commentInput: PropTypes.object,
};

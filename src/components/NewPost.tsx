import { useSession } from "next-auth/react";
import ProfileImage from "./ProfileImage";
import {
  FormEvent,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { api } from "~/utils/api";

function textAreaSize(textArea?: HTMLTextAreaElement) {
  if (textArea == null) return;
  textArea.style.height = "0";
  textArea.style.height = `${textArea.scrollHeight}px`;
}

export default function NewPost() {
  const session = useSession();
  if (session.status !== "authenticated") return null;

  return <Post />;
}

function Post() {
  const session = useSession();
  const [input, setInput] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>();
  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    textAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);

  const trpcUtils = api.useContext();

  useLayoutEffect(() => {
    textAreaSize(textAreaRef.current);
  }, [input]);

  const createPost = api.post.create.useMutation({
    onSuccess: (newPost) => {
      setInput("");

      if (session.status !== "authenticated") {
        return;
      }

      trpcUtils.post.feed.setInfiniteData({}, (oldData) => {
        if (oldData == null || oldData.pages[0] == null) return;

        const cacheNewPost = {
          ...newPost,
          likeCount: 0,
          likedByMe: false,
          user: {
            id: session.data.user.id,
            name: session.data.user.name || null,
            image: session.data.user.image || null,
          },
        };
        return {
          ...oldData,
          pages: [
            {
              ...oldData.pages[0],
              posts: [cacheNewPost, ...oldData.pages[0].posts],
            },
            ...oldData.pages.slice(1),
          ],
        };
      });
    },
  });

  if (session.status !== "authenticated") return null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    createPost.mutate({ content: input });
  }

  return (
    <form onSubmit={handleSubmit} className="newForm">
      <div className="form">
        <ProfileImage src={session.data.user.image} />
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="textArea"
          placeholder="What's on your mind?"
        />
      </div>
      <button className="button">Post</button>
    </form>
  );
}

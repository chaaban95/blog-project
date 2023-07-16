import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";
import ProfileImage from "./ProfileImage";
import { useSession } from "next-auth/react";
import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import { api } from "~/utils/api";

type Post = {
  id: string;
  content: string;
  createdAt: Date;
  likeCount: number;
  likedByMe: boolean;
  user: { id: string; image: string | null; name: string | null };
};
type PostsListProps = {
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean;
  fetchNewPosts: () => Promise<unknown>;
  posts?: Post[];
};

export default function PostsList({
  posts,
  isError,
  isLoading,
  fetchNewPosts,
  hasMore,
}: PostsListProps) {
  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>Error!</h1>;
  if (posts == null || posts.length === 0) {
    return <h2>No posts!</h2>;
  }

  return (
    <ul className="postCardContainer">
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchNewPosts}
        hasMore={hasMore}
        loader={"Loading..."}
      >
        {posts.map((post) => {
          return <PostCard key={post.id} {...post} />;
        })}
      </InfiniteScroll>
    </ul>
  );
}

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "short",
});

function PostCard({
  id,
  user,
  content,
  createdAt,
  likeCount,
  likedByMe,
}: Post) {
  const trpcUtils = api.useContext();
  const toggleLike = api.post.toggleLike.useMutation({
    onSuccess: ({ addedLike }) => {
      const updateData: Parameters<
        typeof trpcUtils.post.feed.setInfiniteData
      >[1] = (oldData) => {
        if (oldData == null) return;
        const countModifier = addedLike ? 1 : -1;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => {
            return {
              ...page,
              posts: page.posts.map((post) => {
                if (post.id === id) {
                  return {
                    ...post,
                    likeCount: post.likeCount + countModifier,
                    likedByMe: addedLike,
                  };
                }
                return post;
              }),
            };
          }),
        };
      };
      trpcUtils.post.feed.setInfiniteData({}, updateData);
    },
  });

  function handleToggleLike() {
    toggleLike.mutate({ id });
  }

  return (
    <li className="postsCard">
      <Link href={`/profiles/${user.id}`}>
        <ProfileImage src={user.image} />
      </Link>
      <section className="postCardContent">
        <div className="postCardTitlePlus">
          <Link className="userTitle" href={`/profiles/${user.id}`}>
            {user.name}
          </Link>
          <span className="postCardDash">-</span>
          <span className="postCardDate">
            {dateTimeFormatter.format(createdAt)}
          </span>
        </div>
        <p className="postCardText">{content}</p>
        <LikeButton
          onClick={handleToggleLike}
          isLoading={toggleLike.isLoading}
          likedByMe={likedByMe}
          likeCount={likeCount}
        />
      </section>
    </li>
  );
}

type LikeButtonProps = {
  onClick: () => void;
  isLoading: boolean;
  likedByMe: boolean;
  likeCount: number;
};

function LikeButton({
  isLoading,
  onClick,
  likedByMe,
  likeCount,
}: LikeButtonProps) {
  const session = useSession();
  const LikeIcon = likedByMe ? FaThumbsUp : FaRegThumbsUp;

  if (session.status !== "authenticated") {
    return (
      <div className="likeIcon">
        <LikeIcon />
        <span>{likeCount}</span>
      </div>
    );
  }
  return (
    <a disabled={isLoading} onClick={onClick} className="likeButton">
      <LikeIcon className={`${likedByMe ? FaThumbsUp : FaRegThumbsUp}`} />
      <span>{likeCount}</span>
    </a>
  );
}

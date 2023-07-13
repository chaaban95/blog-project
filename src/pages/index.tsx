import NewPost from "~/components/NewPost";
import PostsList from "~/components/PostsList";
import { api } from "~/utils/api";

export default function Home() {
  return (
    <>
      <header className="homeHeader">
        <h1 className="homeTitle">Home</h1>
      </header>
      <NewPost />
      <RecentPosts />
    </>
  );
}

function RecentPosts() {
  const posts = api.post.feed.useInfiniteQuery(
    {},
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );
  return (
    <PostsList
      posts={posts.data?.pages.flatMap((page) => page.posts)}
      isError={posts.isError}
      isLoading={posts.isLoading}
      hasMore={posts.hasNextPage}
      fetchNewPosts={posts.fetchNextPage}
    />
  );
}

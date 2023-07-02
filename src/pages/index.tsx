import NewPost from "~/components/NewPost";

export default function Home() {
  return (
    <>
      <header className="homeHeader">
        <h1 className="homeTitle">Home</h1>
      </header>
      <NewPost />
    </>
  );
}

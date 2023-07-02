import Button from "./Button";

export default function NewPost() {
  return (
    <form action="" className="newForm">
      <div className="form">
        {/* <ProfileImage src="#url" /> */}
        <textarea className="textArea" placeholder="What's on your mind?" />
      </div>
      <Button>Post</Button>
    </form>
  );
}

import Image from "next/image";

type ProfileImageProps = {
  src?: string | null;
  className?: string;
};

export default function ProfileImage({
  src,
  className = "",
}: ProfileImageProps) {
  return (
    <div className={`img ${className}`}>
      {src == null ? null : (
        <Image src={src} alt="Profile Image" quality={100} fill />
      )}
    </div>
  );
}

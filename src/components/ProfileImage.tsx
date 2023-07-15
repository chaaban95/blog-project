import Image from "next/image";
import { FaUser } from "react-icons/fa";

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
      {src == null ? (
        <FaUser className="userIcon" />
      ) : (
        <Image src={src} alt="Profile Image" quality={100} fill />
      )}
    </div>
  );
}

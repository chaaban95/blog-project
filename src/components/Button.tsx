import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

type ButtonProps = {
  small?: boolean;
  gray?: boolean;
  className?: string;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export default function Button({
  small = false,
  gray = false,
  className = "",
  ...props
}: ButtonProps) {
  const buttonSizes = small ? "smallButton" : "largeButton";
  const buttonColors = gray ? "grayButton" : "purpleButton";
  return (
    <button
      className={`button ${buttonSizes} ${buttonColors} ${className}`}
      {...props}
    ></button>
  );
}

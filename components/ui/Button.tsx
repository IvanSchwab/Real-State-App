import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "ghost" | "light" | "wa" | "y";

type Common = {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
};

type AsLink = Common & {
  href: string;
  /** Fuerza <a target=_blank>. Los http(s)/tel:/mailto: ya se tratan como externos. */
  external?: boolean;
  "aria-label"?: string;
  onClick?: () => void;
};
type AsButton = Common & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

export type ButtonProps = AsLink | AsButton;

const isExternal = (href: string) => /^(https?:|tel:|mailto:)/i.test(href);

export default function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const { variant = "primary", className = "", children, href, external, onClick } = props;
    const cls = `btn btn-${variant}${className ? ` ${className}` : ""}`;
    const ariaLabel = props["aria-label"];
    if (external || isExternal(href)) {
      const newTab = /^https?:/i.test(href);
      return (
        <a
          className={cls}
          href={href}
          aria-label={ariaLabel}
          onClick={onClick}
          {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    }
    return (
      <Link className={cls} href={href} aria-label={ariaLabel} onClick={onClick}>
        {children}
      </Link>
    );
  }

  const { variant = "primary", className = "", children, type = "button", ...rest } = props;
  return (
    <button className={`btn btn-${variant}${className ? ` ${className}` : ""}`} type={type} {...rest}>
      {children}
    </button>
  );
}

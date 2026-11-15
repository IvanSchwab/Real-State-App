"use client";
import { useEffect, useRef, useState } from "react";
import { FaFacebook, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link2, Share } from "lucide-react";
import Button from "@/components/ui/Button";

type Props = { title: string; price: string; address?: string; url: string };

/** Un solo botón "Compartir": en celular usa el menú nativo si existe; si no, abre este menú. */
export default function ShareMenu({ title, price, address, url }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrap = useRef<HTMLDivElement | null>(null);

  const message = `¡Mirá esta propiedad que encontré!\n${title}\nPrecio: ${price}${address ? `\nDirección: ${address}` : ""}\n${url}`;
  const short = `¡Mirá esta propiedad que encontré! ${title} - ${price} - ${url}`;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => wrap.current && !wrap.current.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const onToggle = async () => {
    const isMobile = window.matchMedia("(max-width: 900px)").matches;
    if (isMobile && typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text: `¡Mirá esta propiedad que encontré! ${title}`, url });
        return;
      } catch (e) {
        if ((e as Error).name === "AbortError") return; // el usuario canceló
      }
    }
    setOpen((o) => !o);
  };

  const links = [
    { key: "wa", label: "WhatsApp", icon: <FaWhatsapp size={20} aria-hidden="true" />, href: `https://wa.me/?text=${encodeURIComponent(message)}`, cls: "wa" },
    { key: "fb", label: "Facebook", icon: <FaFacebook size={20} aria-hidden="true" />, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(short)}` },
    { key: "x", label: "X", icon: <FaXTwitter size={20} aria-hidden="true" />, href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(short)}` },
    { key: "in", label: "LinkedIn", icon: <FaLinkedin size={20} aria-hidden="true" />, href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(short)}` },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setOpen(false);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="share" ref={wrap}>
      <Button variant="ghost" onClick={onToggle} aria-expanded={open} aria-haspopup="menu">
        <Share size={18} strokeWidth={1.7} aria-hidden="true" />
        Compartir
      </Button>
      {open && (
        <div className="menu" role="menu">
          {links.map((l) => (
            <a key={l.key} className={l.cls} href={l.href} target="_blank" rel="noopener noreferrer" role="menuitem" onClick={() => setOpen(false)}>
              {l.icon}
              {l.label}
            </a>
          ))}
          <button type="button" role="menuitem" onClick={copy}>
            <Link2 size={20} strokeWidth={1.7} aria-hidden="true" />
            Copiar link
          </button>
        </div>
      )}
      <span className="sr-only" role="status">
        {copied ? "Link copiado" : ""}
      </span>
      {copied && (
        <span className="copied" aria-hidden="true">
          ¡Link copiado!
        </span>
      )}
    </div>
  );
}

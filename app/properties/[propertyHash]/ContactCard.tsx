"use client";
import { useState, type FormEvent } from "react";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import { SITE } from "@/config/site";
import { formatPrice, isRent, whatsappLink } from "@/lib/format";
import { useRecaptcha } from "@/lib/useRecaptcha";
import Button from "@/components/ui/Button";

type Props = {
  title: string;
  hash: string;
  url: string;
  price?: number | null;
  currency?: string | null;
  operation?: string | null;
  address?: string | null;
  priceLabel: string;
};

type Status = { kind: "ok" | "bad"; text: string } | null;

/** Tarjeta sticky: precio, WhatsApp con mensaje precargado, formulario corto y datos de la oficina. */
export default function ContactCard({ title, url, price, currency, operation, address, priceLabel }: Props) {
  const { execute } = useRecaptcha();
  const p = formatPrice(price, currency, operation);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const [message, setMessage] = useState(`Hola, me interesa esta propiedad: ${title}. ¿Podemos coordinar una visita?`);

  const waText = `Hola, me interesa esta propiedad:\n${title}\nPrecio: ${priceLabel}${address ? `\nDirección: ${address}` : ""}\n${url}`;

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    setSending(true);
    setStatus(null);
    try {
      const captchaToken = await execute("submit");
      const body = `${message.trim()}\n\nPropiedad: ${title}\n${url}`.slice(0, 1000);
      const res = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, subject: `Consulta por propiedad: ${title}`.slice(0, 100), message: body, captchaToken }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        setStatus({ kind: "ok", text: "¡Listo! Recibimos tu consulta. Te respondemos a la brevedad." });
        form.reset();
        setMessage(`Hola, me interesa esta propiedad: ${title}. ¿Podemos coordinar una visita?`);
      } else {
        setStatus({ kind: "bad", text: json.message || "Hubo un problema al enviar la consulta. Probá de nuevo o escribinos por WhatsApp." });
      }
    } catch (err) {
      console.error("Error al enviar la consulta:", err);
      setStatus({ kind: "bad", text: "No pudimos enviar la consulta. Probá de nuevo o escribinos por WhatsApp." });
    } finally {
      setSending(false);
    }
  };

  return (
    <aside className="aside" aria-label="Contacto">
      <div className="acard">
        <span className="kicker">{isRent(operation) ? "En alquiler" : "En venta"}</span>
        <div className="price">
          {p ? (
            <>
              {p.currency && <small>{p.currency}</small>}
              {p.amount}
              {p.suffix && (
                <>
                  {" "}
                  <em>{p.suffix}</em>
                </>
              )}
            </>
          ) : (
            <span style={{ fontSize: 28 }}>Consultar precio</span>
          )}
        </div>
        <Button variant="wa" href={whatsappLink(waText)} className="" aria-label="Consultar por WhatsApp">
          <FaWhatsapp size={22} aria-hidden="true" />
          Consultar por WhatsApp
        </Button>
        <p className="hint">Se abre WhatsApp con el link de esta propiedad ya escrito.</p>

        <div className="or">o dejanos tus datos</div>
        <form onSubmit={submit} style={{ display: "contents" }}>
          <label className="fl">
            Nombre
            <input name="name" type="text" placeholder="Tu nombre" autoComplete="name" required maxLength={100} />
          </label>
          <label className="fl">
            Teléfono
            <input name="phone" type="tel" placeholder="11 2345-6789" autoComplete="tel" required maxLength={30} />
          </label>
          <label className="fl">
            Mensaje
            <textarea name="message" value={message} onChange={(e) => setMessage(e.target.value)} required maxLength={700} />
          </label>
          {status && (
            <p className={`form-msg${status.kind === "bad" ? " bad" : ""}`} role={status.kind === "bad" ? "alert" : "status"}>
              {status.text}
            </p>
          )}
          <Button type="submit" variant="ghost" disabled={sending}>
            {sending ? "Enviando…" : "Enviar consulta"}
          </Button>
        </form>
      </div>

      <div className="office">
        <Image src="/images/oficina.jpg" alt="" width={52} height={52} />
        <div>
          <b>{SITE.name}</b>
          <span>{SITE.address}</span>
          <a href={`tel:${SITE.phoneTel}`}>{SITE.phoneDisplay}</a>
        </div>
      </div>
    </aside>
  );
}

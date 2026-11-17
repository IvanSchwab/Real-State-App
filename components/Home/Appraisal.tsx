"use client";
import { useState, type FormEvent } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { whatsappLink } from "@/lib/format";
import { useCatalog } from "@/lib/useCatalog";
import { useRecaptcha } from "@/lib/useRecaptcha";
import Field from "@/components/ui/Field";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

const STEPS = ["Completás tus datos", "Coordinamos una visita", "Recibís el informe con el valor de mercado"];

type Status = { kind: "ok" | "bad"; text: string } | null;

export default function Appraisal() {
  const { types } = useCatalog();
  const { execute } = useRecaptcha();
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const address = String(data.get("address") ?? "").trim();
    const propertyType = String(data.get("propertyType") ?? "").trim();

    setSending(true);
    setStatus(null);
    try {
      const captchaToken = await execute("submit");
      const message =
        "Solicitud de tasación" + (propertyType ? ` de ${propertyType.toLowerCase()}` : "") + (address ? ` en ${address}` : "") + ".";

      const res = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, address, propertyType, subject: "Solicitud de tasación", message, captchaToken }),
      });
      const json = await res.json().catch(() => ({}));

      if (res.ok && json.success) {
        setStatus({ kind: "ok", text: "¡Listo! Recibimos tu pedido. Te contactamos para coordinar la visita." });
        form.reset();
      } else {
        setStatus({ kind: "bad", text: json.message || "Hubo un problema al enviar el pedido. Probá de nuevo o escribinos por WhatsApp." });
      }
    } catch (err) {
      console.error("Error al enviar la tasación:", err);
      setStatus({ kind: "bad", text: "No pudimos enviar el pedido. Probá de nuevo o escribinos por WhatsApp." });
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="sec" id="tasacion">
      <div className="wrap">
        <Reveal className="tas">
          <div style={{ position: "relative" }}>
            <span className="kicker">Tasaciones</span>
            <h2 className="h2 serif">¿Cuánto vale tu propiedad?</h2>
            <p className="sub">Pedí tu tasación. Te contactamos para coordinar la visita.</p>
            <div className="steps">
              {STEPS.map((s, i) => (
                <div key={s}>
                  <b>{i + 1}</b>
                  {s}
                </div>
              ))}
            </div>
          </div>

          <form className="form" onSubmit={submit}>
            <Field id="t-nom" label="Nombre" variant="panel">
              <input id="t-nom" name="name" type="text" placeholder="Tu nombre" autoComplete="name" required maxLength={100} />
            </Field>
            <Field id="t-tel" label="Teléfono" variant="panel">
              <input id="t-tel" name="phone" type="tel" placeholder="11 2345-6789" autoComplete="tel" required maxLength={30} />
            </Field>
            <Field id="t-dir" label="Dirección de la propiedad" variant="panel" full>
              <input id="t-dir" name="address" type="text" placeholder="Calle, altura y localidad" autoComplete="street-address" maxLength={200} />
            </Field>
            <Field id="t-tipo" label="Tipo de propiedad" variant="panel" full chevron>
              <select id="t-tipo" name="propertyType" defaultValue="">
                <option value="">Elegí un tipo</option>
                {types.map((t) => (
                  <option key={t.id} value={t.description}>
                    {t.description}
                  </option>
                ))}
              </select>
            </Field>

            {status && (
              <p className={`form-msg${status.kind === "bad" ? " bad" : ""}`} role={status.kind === "bad" ? "alert" : "status"}>
                {status.text}
              </p>
            )}

            <div className="form-actions">
              <Button type="submit" variant="light" disabled={sending}>
                {sending ? "Enviando…" : "Pedir tasación"}
              </Button>
              <Button variant="wa" href={whatsappLink("Hola, quiero pedir una tasación de mi propiedad.")}>
                <FaWhatsapp size={20} aria-hidden="true" />
                Por WhatsApp
              </Button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

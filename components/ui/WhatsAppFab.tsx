import { FaWhatsapp } from "react-icons/fa";
import { whatsappLink } from "@/lib/format";

type Props = {
  message?: string;
  /** En la ficha mobile lo reemplaza la barra inferior fija. */
  hideOnMobile?: boolean;
};

/** Botón flotante de WhatsApp. Pulso de anillo ×2 al cargar (CSS). */
export default function WhatsAppFab({ message, hideOnMobile }: Props) {
  return (
    <a
      className={`fab${hideOnMobile ? " fab--no-mobile" : ""}`}
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp"
    >
      <FaWhatsapp size={30} aria-hidden="true" />
    </a>
  );
}

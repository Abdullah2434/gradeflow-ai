export async function sendWhatsAppMessage(to: string, body: string) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_TOKEN;

  if (!phoneNumberId || !token) {
    throw new Error("WhatsApp credentials not configured");
  }

  const normalized = to.replace(/\D/g, "");

  const res = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: normalized,
      type: "text",
      text: { body },
    }),
  });

  if (!res.ok) {
    throw new Error(`WhatsApp send failed: ${await res.text()}`);
  }

  return res.json();
}

import nodemailer from "nodemailer";

export function createMailTransporter() {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_PASS;

  if (!gmailUser || !gmailPass) {
    throw new Error("Configurações de e-mail (GMAIL_USER ou GMAIL_PASS) ausentes no arquivo .env");
  }

  return {
    gmailUser,
    transporter: nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPass },
    }),
  };
}

export function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}
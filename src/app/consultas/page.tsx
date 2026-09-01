"use client";

import React, { useState } from "react";

const CONSULTA_PRICE = 200; // R$ 200

export default function ConsultasPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/consultas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, date, notes, price: CONSULTA_PRICE }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Falha ao agendar consulta");
      setSuccess(json.message || "Agendamento realizado com sucesso.");
      setName("");
      setEmail("");
      setPhone("");
      setDate("");
      setNotes("");
    } catch {
      setError("Não foi possível enviar o agendamento. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="museum-page">
      <section className="container page-section consultation-layout">
        <div className="section-intro"><p className="eyebrow">Atendimento com hora marcada</p><h1>Consulta de Búzios</h1><p>Envie seus dados para solicitar um horário. A equipe do museu retorna para confirmar disponibilidade e orientações.</p></div>
        <div className="consultation-card">
        <p className="price-tag">R$ {CONSULTA_PRICE},00 <span>por consulta</span></p>

        <form onSubmit={handleSubmit} aria-labelledby="agendar-form" className="space-y-4">
          <h2 id="agendar-form" className="sr-only">Formulário de solicitação de consulta</h2>
          <div>
            <label className="block text-sm font-semibold" htmlFor="name">Nome</label>
            <input id="name" name="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} className="mt-1 w-full rounded-md border px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-semibold" htmlFor="email">E-mail</label>
            <input id="email" name="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 w-full rounded-md border px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-semibold" htmlFor="phone">Telefone</label>
            <input 
              id="phone" 
              name="phone" 
              type="tel" 
              autoComplete="tel" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              required 
              placeholder="(79) 99999-9999" 
              className="mt-1 w-full rounded-md border px-3 py-2" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold" htmlFor="date">Data desejada</label>
            <input id="date" name="date" type="date" min={new Date().toISOString().split("T")[0]} value={date} onChange={(e) => setDate(e.target.value)} required className="mt-1 w-full rounded-md border px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-semibold" htmlFor="notes">Observações</label>
            <textarea id="notes" name="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" rows={4} />
          </div>

          <div>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? "Enviando..." : `Agendar (R$ ${CONSULTA_PRICE},00)`}
            </button>
          </div>

          {success && <p role="status" className="text-green-700">{success}</p>}
          {error && <p role="alert" className="text-red-700">{error.replace("Error: ", "")}</p>}
        </form>
        </div>
      </section>
    </main>
  );
}

"use client";

import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import { toast } from "react-toastify";
import "react-day-picker/style.css";

const CONSULTA_PRICE = 200; // R$ 200

function dateToInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function inputValueToDate(value: string) {
  if (!value) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export default function ConsultasPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
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
      setSelectedDate(undefined);
      toast.success("Consulta agendada com sucesso!", { autoClose: 6500 });
    } catch {
      const message = "Não foi possível enviar o agendamento. Tente novamente.";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="museum-page">
      <section className="container page-section consultation-layout">
        <div className="section-intro"><p className="eyebrow">Atendimento com hora marcada</p><h1>Consulta de Búzios</h1><p>Envie seus dados para solicitar um horário. A equipe do museu retorna para confirmar disponibilidade e orientações.</p></div>
        <div className="consultation-card consultation-modern-card">
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

          <div className="consultation-date-field">
            <label className="block text-sm font-semibold" htmlFor="date">Data desejada</label>
            <div className="visit-calendar consultation-calendar" aria-label="Calendário para escolher a data da consulta"><DayPicker mode="single" selected={selectedDate} onSelect={(nextDate) => { setSelectedDate(nextDate); setDate(nextDate ? dateToInputValue(nextDate) : ""); }} disabled={{ before: new Date() }} showOutsideDays fixedWeeks /></div>
            <input id="date" name="date" type="hidden" value={date} required aria-label="Data desejada" />
            {date && <p className="visit-selected-date">Data escolhida: <strong>{inputValueToDate(date)?.toLocaleDateString("pt-BR")}</strong></p>}
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

          {success && <p role="status" className="sr-only">{success}</p>}
          {error && <p role="alert" className="sr-only">{error.replace("Error: ", "")}</p>}
        </form>
        </div>
      </section>
    </main>
  );
}

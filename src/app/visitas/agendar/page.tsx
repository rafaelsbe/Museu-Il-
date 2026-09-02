"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { toast } from "react-toastify";
import "react-day-picker/style.css";

type VisitType = "school" | "other" | "personal_single" | "personal_group";

const initialForm = {
  name: "", email: "", phone: "", visit_type: "personal_single" as VisitType,
  other_description: "", institution_name: "", group_size: "", requested_date: "",
  requested_time: "", notes: "",
};

const visitTypeOptions: Array<{ value: VisitType; label: string }> = [
  { value: "school", label: "Escolar" },
  { value: "other", label: "Outro" },
  { value: "personal_single", label: "Pessoal / Sozinho" },
  { value: "personal_group", label: "Pessoal / Em grupo" },
];

const timeOptions = ["", ...Array.from({ length: 48 }, (_, index) => {
  const hour = String(Math.floor(index / 2)).padStart(2, "0");
  const minute = index % 2 === 0 ? "00" : "30";
  return `${hour}:${minute}`;
})];

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

export default function AgendarVisitaPage() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [openMenu, setOpenMenu] = useState<"visit_type" | "requested_time" | null>(null);
  const today = new Date();

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleTypeChange(value: VisitType) {
    setForm((current) => ({
      ...current,
      visit_type: value,
      other_description: value === "other" ? current.other_description : "",
      institution_name: value === "school" ? current.institution_name : "",
      group_size: value === "personal_group" ? current.group_size : "",
    }));
  }

  function handleDateChange(date: Date | undefined) {
    setSelectedDate(date);
    updateField("requested_date", date ? dateToInputValue(date) : "");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch("/api/visitas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Falha ao enviar agendamento.");
      toast.success("Visita agendada com sucesso!", { autoClose: 6500 });
      setForm(initialForm);
      setSelectedDate(undefined);
      setOpenMenu(null);
    } catch (submitError) {
      toast.error(submitError instanceof Error ? submitError.message : "Não foi possível enviar o agendamento.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="museum-page">
      <section className="container page-section visit-booking-layout">
        <div className="section-intro">
          <p className="eyebrow">Planeje sua chegada</p>
          <h1>Agendar visita</h1>
          <p>Escolha a melhor data e conte um pouco sobre a sua visita. A equipe do museu retornará para confirmar a disponibilidade.</p>
        </div>
        <div className="visit-booking-card">
          <form onSubmit={handleSubmit} className="visit-form">
            <div className="visit-form-section">
              <div className="visit-form-heading"><span>01</span><div><h2>Seus dados</h2><p>Como podemos entrar em contato?</p></div></div>
              <div className="visit-form-grid">
                <div className="visit-field visit-field-wide"><label htmlFor="name">Nome completo</label><input id="name" name="name" autoComplete="name" value={form.name} onChange={(e) => updateField("name", e.target.value)} required minLength={2} maxLength={120} /></div>
                <div className="visit-field"><label htmlFor="email">E-mail</label><input id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} required /></div>
                <div className="visit-field"><label htmlFor="phone">Telefone</label><input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="(79) 99999-9999" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} required /></div>
              </div>
            </div>
            <div className="visit-form-section">
              <div className="visit-form-heading"><span>02</span><div><h2>Sobre a visita</h2><p>Ajude-nos a preparar sua chegada.</p></div></div>
              <div className="visit-form-grid">
                <div className="visit-field visit-field-wide"><label id="visit_type_label">Tipo da visita</label><div className="visit-menu"><button type="button" className="visit-menu-trigger" aria-labelledby="visit_type_label" aria-haspopup="listbox" aria-expanded={openMenu === "visit_type"} onClick={() => setOpenMenu(openMenu === "visit_type" ? null : "visit_type")}>{visitTypeOptions.find((option) => option.value === form.visit_type)?.label}<span aria-hidden="true">⌄</span></button>{openMenu === "visit_type" && <div className="visit-menu-list" role="listbox" aria-label="Tipo da visita">{visitTypeOptions.map((option) => <button type="button" role="option" aria-selected={form.visit_type === option.value} className={`visit-menu-option${form.visit_type === option.value ? " is-selected" : ""}`} key={option.value} onClick={() => { handleTypeChange(option.value); setOpenMenu(null); }}>{option.label}<span aria-hidden="true">{form.visit_type === option.value ? "✓" : ""}</span></button>)}</div>}</div><input name="visit_type" type="hidden" value={form.visit_type} required /></div>
                {form.visit_type === "school" && <div className="visit-field visit-field-wide"><label htmlFor="institution_name">Nome da instituição</label><input id="institution_name" name="institution_name" value={form.institution_name} onChange={(e) => updateField("institution_name", e.target.value)} required maxLength={200} /></div>}
                {form.visit_type === "other" && <div className="visit-field visit-field-wide"><label htmlFor="other_description">Explique o tipo de visita</label><input id="other_description" name="other_description" value={form.other_description} onChange={(e) => updateField("other_description", e.target.value)} required maxLength={1000} /></div>}
                {form.visit_type === "personal_group" && <div className="visit-field visit-field-wide"><label htmlFor="group_size">Quantidade de pessoas</label><input id="group_size" name="group_size" type="number" min={2} max={1000} value={form.group_size} onChange={(e) => updateField("group_size", e.target.value)} required /></div>}
              </div>
            </div>
            <div className="visit-form-section">
              <div className="visit-form-heading"><span>03</span><div><h2>Data e horário</h2><p>Datas anteriores a hoje não estão disponíveis.</p></div></div>
              <div className="visit-date-grid">
                <div className="visit-calendar-wrap"><label>Data desejada</label><div className="visit-calendar" aria-label="Calendário para escolher a data da visita"><DayPicker mode="single" selected={selectedDate} onSelect={handleDateChange} disabled={{ before: today }} showOutsideDays fixedWeeks /></div><input name="requested_date" type="hidden" value={form.requested_date} required aria-label="Data desejada" />{form.requested_date && <p className="visit-selected-date">Data escolhida: <strong>{inputValueToDate(form.requested_date)?.toLocaleDateString("pt-BR")}</strong></p>}</div>
                <div className="visit-field visit-time-field"><label id="requested_time_label">Horário desejado <span>(opcional)</span></label><div className="visit-menu"><button type="button" className="visit-menu-trigger" aria-labelledby="requested_time_label" aria-haspopup="listbox" aria-expanded={openMenu === "requested_time"} onClick={() => setOpenMenu(openMenu === "requested_time" ? null : "requested_time")}>{form.requested_time || "Selecione um horário"}<span aria-hidden="true">⌄</span></button>{openMenu === "requested_time" && <div className="visit-menu-list visit-time-list" role="listbox" aria-label="Horário desejado"><button type="button" role="option" aria-selected={!form.requested_time} className={`visit-menu-option${!form.requested_time ? " is-selected" : ""}`} onClick={() => { updateField("requested_time", ""); setOpenMenu(null); }}>Sem preferência<span aria-hidden="true">{!form.requested_time ? "✓" : ""}</span></button>{timeOptions.slice(1).map((time) => <button type="button" role="option" aria-selected={form.requested_time === time} className={`visit-menu-option${form.requested_time === time ? " is-selected" : ""}`} key={time} onClick={() => { updateField("requested_time", time); setOpenMenu(null); }}>{time}<span aria-hidden="true">{form.requested_time === time ? "✓" : ""}</span></button>)}</div>}</div><input id="requested_time" name="requested_time" type="hidden" value={form.requested_time} /></div>
              </div>
            </div>
            <div className="visit-form-section"><div className="visit-form-heading"><span>04</span><div><h2>Observações</h2><p>Há algo que a equipe deve saber?</p></div></div><div className="visit-field"><label htmlFor="notes">Mensagem <span>(opcional)</span></label><textarea id="notes" name="notes" rows={4} maxLength={3000} value={form.notes} onChange={(e) => updateField("notes", e.target.value)} /></div></div>
            <button type="submit" disabled={submitting} className="visit-submit">{submitting ? "Enviando solicitação..." : "Enviar solicitação"}<span aria-hidden="true">→</span></button>
          </form>
        </div>
      </section>
    </main>
  );
}

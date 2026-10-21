"use client";

import { useId, useState, type FormEvent } from "react";
import { blogCopy, partnership } from "@/content/skyfall";
import { container, gutter, monoLabel } from "@/lib/skyfall/classes";
import { inputClass, isEmail, submitLead } from "@/lib/skyfall/forms";
import { Honeypot } from "@/components/skyfall/chrome/dialogs";
import { FadeUp, SplitReveal } from "@/components/skyfall/motion/reveal";
import { GridField } from "@/components/skyfall/ui/layout";

type Status = "idle" | "sending" | "sent" | "failed";

function NewsletterForm() {
  const copy = blogCopy.newsletter;
  const id = `${useId()}-email`;
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [honeypot, setHoneypot] = useState("");
  const error = email.trim() ? (isEmail(email) ? undefined : partnership.errors.email) : partnership.errors.required;
  const visibleError = attempted || touched ? error : undefined;

  if (status === "sent") {
    return (
      <p role="status" className="flex items-start gap-3 border border-brand bg-tint px-4 py-4 text-[17px] leading-[1.4] tracking-[-0.02em]">
        <span aria-hidden="true" className="mt-2 block size-2 shrink-0 bg-brand" />
        {copy.success}
      </p>
    );
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;
    setAttempted(true);
    if (error) {
      event.currentTarget.querySelector<HTMLInputElement>('[name="email"]')?.focus();
      return;
    }
    setStatus("sending");
    try {
      await submitLead("newsletter", { email: email.trim() }, honeypot);
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  };

  return (
    <form noValidate onSubmit={submit} className="relative flex flex-col gap-3">
      <label htmlFor={id} className={`${monoLabel} text-body`}>
        {copy.email}
      </label>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <input
          id={id}
          name="email"
          type="email"
          autoComplete="email"
          placeholder={copy.placeholder}
          required
          aria-required="true"
          aria-invalid={!!visibleError}
          aria-describedby={visibleError ? `${id}-err` : `${id}-note`}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status === "failed") setStatus("idle");
          }}
          onBlur={() => setTouched(true)}
          className={`${inputClass(!!visibleError)} mt-0! h-[52px] flex-1`}
        />
        <button
          type="submit"
          disabled={status === "sending"}
          aria-busy={status === "sending"}
          className="group relative inline-flex h-[52px] cursor-pointer items-center justify-between gap-8 overflow-hidden bg-ink px-5 font-mono text-[15px] font-semibold tracking-[-0.02em] text-white uppercase transition-[scale] duration-300 active:scale-[0.99] disabled:cursor-wait sm:min-w-[180px]"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 -translate-x-full bg-brand transition-transform duration-300 ease-out-expo group-hover:translate-x-0 group-disabled:translate-x-0"
          />
          {status === "sending" ? (
            <span aria-hidden="true" className="relative block size-3 animate-spin border-2 border-white border-t-transparent" />
          ) : (
            <span aria-hidden="true" className="relative block size-2 bg-white transition-[rotate] duration-300 group-hover:-rotate-180" />
          )}
          <span className="relative">{status === "sending" ? copy.sending : copy.submit}</span>
        </button>
      </div>
      {visibleError && (
        <p id={`${id}-err`} className="text-[13px] tracking-[-0.01em] text-[#C2362F]">
          {visibleError}
        </p>
      )}
      {status === "failed" && (
        <p role="alert" className="border border-[#C2362F] bg-[#C2362F]/5 px-3.5 py-3 text-[14px] tracking-[-0.01em] text-[#C2362F]">
          {partnership.errors.failed}
        </p>
      )}
      <p id={`${id}-note`} className="text-xs text-muted">
        {copy.note}
      </p>
      <Honeypot value={honeypot} onChange={setHoneypot} />
    </form>
  );
}

export function NewsletterSection() {
  const copy = blogCopy.newsletter;
  return (
    <section className={`relative bg-paper ${gutter} py-16 md:py-24`}>
      <GridField mask="radial-gradient(ellipse at 50% 50%, #000 20%, transparent 75%)" />
      <FadeUp className={`relative ${container} grid border border-line bg-paper lg:grid-cols-2`}>
        <div className="flex flex-col gap-4 border-b border-line p-6 md:p-10 lg:border-r lg:border-b-0">
          <span className={`${monoLabel} text-brand`}>/ {copy.label}</span>
          <SplitReveal as="h2" className="max-w-[14ch] text-[34px] leading-[0.98] font-medium tracking-[-0.045em] md:text-[56px]">
            {copy.title}
          </SplitReveal>
          <p className="max-w-[44ch] text-[17px] leading-[1.45] text-body">{copy.body}</p>
        </div>
        <div className="flex flex-col justify-center p-6 md:p-10">
          <NewsletterForm />
        </div>
      </FadeUp>
    </section>
  );
}

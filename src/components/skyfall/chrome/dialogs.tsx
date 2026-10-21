"use client";

import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode, type RefObject } from "react";
import { launchVideo, partnership, routes, waitlist } from "@/content/skyfall";
import { monoLabel } from "@/lib/skyfall/classes";
import {
  clampWords,
  countWords,
  emptyLead,
  errorText,
  inputClass,
  maxWords,
  submitLead,
  validateLead,
  type LeadField,
  type LeadFields,
} from "@/lib/skyfall/forms";
import { launchVideoMedia } from "@/lib/skyfall/media";
import { useLenis } from "@/components/skyfall/motion/smooth-scroll";
import { DitherHeader, type DitherScene } from "./dither-header";

export interface HashDialog {
  ref: RefObject<HTMLDialogElement | null>;
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export function useHashDialog(hash: string, onOpen?: () => void): HashDialog {
  const ref = useRef<HTMLDialogElement>(null);
  const lenis = useLenis();
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    const dialog = ref.current;
    if (!dialog || dialog.open) return;
    onOpen?.();
    dialog.showModal();
    setIsOpen(true);
    lenis?.stop();
  };
  const close = () => ref.current?.close();

  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  });

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.(`a[href="${hash}"]`);
      if (!link || event.button !== 0 || event.metaKey || event.ctrlKey) return;
      event.preventDefault();
      openRef.current();
    };
    const onHash = () => {
      if (window.location.hash === hash) openRef.current();
    };
    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", onHash);
    onHash();
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHash);
    };
  }, [hash]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const onClose = () => {
      lenis?.start();
      setIsOpen(false);
    };
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, [lenis]);

  return { ref, isOpen, open, close };
}

const dialogWidths = {
  form: "sm:w-[min(calc(100vw-3rem),560px)]",
  video: "sm:w-[min(calc(100vw-3rem),1040px)]",
};

interface DialogProps {
  dialogRef: RefObject<HTMLDialogElement | null>;
  onClose: () => void;
  title: ReactNode;
  titleId: string;
  size?: keyof typeof dialogWidths;
  tone?: "light" | "dark";
  children?: ReactNode;
}

export function Dialog({ dialogRef, onClose, title, titleId, size = "form", tone = "light", children }: DialogProps) {
  const dark = tone === "dark";
  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      data-lenis-prevent=""
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className={`m-0 h-dvh max-h-none w-full max-w-none p-0 backdrop:bg-ink/40 backdrop:backdrop-blur-[2px] sm:m-auto sm:h-fit sm:max-h-[min(90dvh,860px)] sm:border ${dialogWidths[size]} ${dark ? "bg-ink text-white sm:border-night-mid" : "bg-paper text-ink sm:border-ink"}`}
    >
      <div className="flex min-h-full flex-col sm:min-h-0">
        <header
          className={`sticky top-0 z-10 flex h-16 items-center justify-between border-b pr-3 pl-6 sm:pl-8 ${dark ? "border-night-mid bg-ink" : "border-line bg-paper"}`}
        >
          <h2 id={titleId} className={`${monoLabel} ${dark ? "text-brand-lift" : "text-brand"}`}>
            [ {title} ]
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={`grid size-11 cursor-pointer place-items-center ${dark ? "text-white hover:text-brand-lift" : "text-ink hover:text-brand"}`}
          >
            <span aria-hidden="true" className="relative block size-5">
              <span className="absolute top-1/2 left-0 block h-0.5 w-5 -translate-y-1/2 rotate-45 bg-current" />
              <span className="absolute top-1/2 left-0 block h-0.5 w-5 -translate-y-1/2 -rotate-45 bg-current" />
            </span>
          </button>
        </header>
        {children}
      </div>
    </dialog>
  );
}

export function SuccessPanel({ title, body, closeLabel, onClose }: { title: string; body: string; closeLabel: string; onClose: () => void }) {
  return (
    <div role="status" className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-8">
      <span aria-hidden="true" className="grid size-12 place-items-center bg-brand text-white">
        <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </span>
      <p className="mt-6 text-[32px] leading-none font-medium tracking-[-0.045em]">{title}</p>
      <p className="mt-4 max-w-[36ch] text-[17px] leading-normal tracking-[-0.02em] text-body">{body}</p>
      <button
        type="button"
        onClick={onClose}
        className="mt-8 inline-flex h-[52px] w-fit cursor-pointer items-center gap-8 bg-ink px-5 font-mono text-[15px] font-semibold tracking-[-0.02em] text-white uppercase transition-colors hover:bg-brand"
      >
        <span aria-hidden="true" className="block size-2 bg-white" />
        {closeLabel}
      </button>
    </div>
  );
}

function SubmitBar({ sending, label, sendingLabel }: { sending: boolean; label: string; sendingLabel: string }) {
  return (
    <div className="sticky bottom-0 z-10 -mx-6 mt-auto border-t border-line bg-paper px-6 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:-mx-8 sm:mt-0 sm:px-8">
      <button
        type="submit"
        disabled={sending}
        aria-busy={sending}
        className="group relative inline-flex h-[52px] w-full cursor-pointer items-center justify-between gap-8 overflow-hidden bg-ink px-5 font-mono text-[15px] font-semibold tracking-[-0.02em] text-white uppercase transition-[scale] duration-300 active:scale-[0.99] disabled:cursor-wait sm:w-auto sm:min-w-[220px]"
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 -translate-x-full bg-brand transition-transform duration-300 ease-out-expo group-hover:translate-x-0 group-disabled:translate-x-0"
        />
        {sending ? (
          <span aria-hidden="true" className="relative block size-3 animate-spin border-2 border-white border-t-transparent" />
        ) : (
          <span aria-hidden="true" className="relative block size-2 bg-white transition-[rotate] duration-300 group-hover:-rotate-180" />
        )}
        <span className="relative">{sending ? sendingLabel : label}</span>
      </button>
    </div>
  );
}

export function Honeypot({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Company fax
        <input tabIndex={-1} autoComplete="off" name="company_fax" value={value} onChange={(event) => onChange(event.target.value)} />
      </label>
    </div>
  );
}

type FormStatus = "idle" | "sending" | "sent" | "failed";

interface LeadCopy {
  title: string;
  submit: string;
  sending: string;
  success: { title: string; body: string; close: string };
}

function LeadFormDialog({ hash, form, copy, scene }: { hash: string; form: string; copy: LeadCopy; scene?: DitherScene }) {
  const id = useId();
  const [values, setValues] = useState<LeadFields>(emptyLead);
  const [touched, setTouched] = useState<Partial<Record<LeadField, boolean>>>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [honeypot, setHoneypot] = useState("");
  const dialog = useHashDialog(hash, () => {
    if (status !== "sent") return;
    setValues(emptyLead);
    setTouched({});
    setAttempted(false);
    setStatus("idle");
  });

  const errors = validateLead(values);
  const visibleError = (field: LeadField) => (attempted || touched[field] ? errors[field] : undefined);
  const words = countWords(values.message);

  const change = (field: LeadField) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = field === "message" ? clampWords(event.target.value, maxWords) : event.target.value;
    setValues((current) => ({ ...current, [field]: next }));
    if (status === "failed") setStatus("idle");
  };
  const blur = (field: LeadField) => () => setTouched((current) => ({ ...current, [field]: true }));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;
    setAttempted(true);
    const firstInvalid = (Object.keys(emptyLead) as LeadField[]).find((field) => errors[field]);
    if (firstInvalid) {
      event.currentTarget.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      await submitLead(form, { ...values, website: values.website.trim() }, honeypot);
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  };

  const fieldLabel = (field: LeadField, htmlFor: string) => (
    <label htmlFor={htmlFor} className="flex items-baseline justify-between gap-3 text-[15px] font-medium tracking-[-0.02em]">
      <span>
        {partnership.fields[field].label}
        <span aria-hidden="true" className="text-brand">
          {" "}*
        </span>
      </span>
      <span className={`${monoLabel} text-faint`}>{partnership.required}</span>
    </label>
  );

  const input = (field: Exclude<LeadField, "message">, type: string, autoComplete: string) => {
    const inputId = `${id}-${field}`;
    const error = visibleError(field);
    return (
      <div>
        {fieldLabel(field, inputId)}
        <input
          id={inputId}
          name={field}
          type={type}
          inputMode={field === "website" ? "url" : undefined}
          autoComplete={autoComplete}
          required
          aria-required="true"
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-err` : undefined}
          value={values[field]}
          onChange={change(field)}
          onBlur={blur(field)}
          className={`${inputClass(!!error)} h-12`}
        />
        {error && (
          <p id={`${inputId}-err`} className="mt-1.5 text-[13px] tracking-[-0.01em] text-[#C2362F]">
            {error}
          </p>
        )}
      </div>
    );
  };

  const messageId = `${id}-message`;
  const messageError = visibleError("message");

  return (
    <Dialog dialogRef={dialog.ref} onClose={dialog.close} title={copy.title} titleId={`${id}-title`}>
      <DitherHeader active={dialog.isOpen} scene={scene} />
      {status === "sent" ? (
        <SuccessPanel title={copy.success.title} body={copy.success.body} closeLabel={copy.success.close} onClose={() => dialog.close()} />
      ) : (
        <form noValidate onSubmit={submit} className="flex flex-1 flex-col gap-6 px-6 pt-8 sm:px-8">
          {input("name", "text", "name")}
          {input("email", "email", "email")}
          {input("website", "text", "url")}
          <div>
            {fieldLabel("message", messageId)}
            <textarea
              id={messageId}
              name="message"
              rows={7}
              required
              aria-required="true"
              aria-invalid={!!messageError}
              aria-describedby={`${messageId}-count${messageError ? ` ${messageId}-err` : ""}`}
              placeholder={partnership.fields.message.placeholder}
              value={values.message}
              onChange={change("message")}
              onBlur={blur("message")}
              className={`${inputClass(!!messageError)} resize-y py-3 leading-normal`}
            />
            <div className="mt-1.5 flex items-start justify-between gap-4">
              {messageError ? (
                <p id={`${messageId}-err`} className={errorText}>
                  {messageError}
                </p>
              ) : (
                <span />
              )}
              <p id={`${messageId}-count`} aria-live="polite" className={`${monoLabel} shrink-0 ${words >= maxWords ? "text-brand" : "text-faint"}`}>
                {words} / {maxWords} words
              </p>
            </div>
          </div>
          <Honeypot value={honeypot} onChange={setHoneypot} />
          {status === "failed" && (
            <p role="alert" className="border border-[#C2362F] bg-[#C2362F]/5 px-3.5 py-3 text-[14px] tracking-[-0.01em] text-[#C2362F]">
              {partnership.errors.failed}
            </p>
          )}
          <SubmitBar sending={status === "sending"} label={copy.submit} sendingLabel={copy.sending} />
        </form>
      )}
    </Dialog>
  );
}

function LaunchVideoDialog() {
  const id = useId();
  const video = useRef<HTMLVideoElement>(null);
  const dialog = useHashDialog(routes.launchVideo);
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    if (dialog.isOpen) el.play().catch(() => {});
    else {
      el.pause();
      el.currentTime = 0;
    }
  }, [dialog.isOpen]);
  return (
    <Dialog dialogRef={dialog.ref} onClose={dialog.close} title={launchVideo.title} titleId={`${id}-title`} size="video" tone="dark">
      <div className="flex flex-1 flex-col justify-center bg-black">
        <video
          ref={video}
          src={launchVideoMedia.src}
          poster={launchVideoMedia.poster}
          controls
          playsInline
          preload="none"
          aria-label={launchVideo.title}
          className="aspect-video w-full bg-black"
        />
      </div>
    </Dialog>
  );
}

export function SiteDialogs() {
  return (
    <>
      <LeadFormDialog hash={routes.partnership} form="partnership" copy={partnership} />
      <LeadFormDialog hash={routes.waitlist} form="waitlist" copy={waitlist} scene="queue" />
      <LaunchVideoDialog />
    </>
  );
}

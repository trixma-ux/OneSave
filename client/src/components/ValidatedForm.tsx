import React, { createContext, useContext, useRef, useState } from 'react';

/**
 * Formulaire avec validation en français (remplace les infobulles natives du navigateur).
 * Les contraintes restent déclarées en HTML (required, type="email", minLength, min, max) ;
 * le formulaire est en noValidate et chaque erreur s'affiche sous le champ via <FieldError>.
 * `extraValidate` permet des règles métier (confirmation du mot de passe, dates...).
 */
type Errors = Record<string, string>;
type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const ErrorsContext = createContext<Errors>({});

export function frenchMessage(el: Field): string | null {
  const v = el.validity;
  const value = typeof el.value === 'string' ? el.value : '';
  if (v.valueMissing || (el.required && value.trim() === '')) return 'Champ requis';
  if (v.badInput) return 'Valeur invalide';
  if (el instanceof HTMLInputElement) {
    if (el.type === 'email' && (v.typeMismatch || (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)))) {
      return 'Adresse email invalide';
    }
    if (v.typeMismatch) return 'Format invalide';
    if (el.minLength > 0 && value.length > 0 && value.length < el.minLength) {
      return `${el.minLength} caractères minimum`;
    }
    if (v.rangeUnderflow) return `La valeur doit être supérieure ou égale à ${el.min}`;
    if (v.rangeOverflow) return `La valeur doit être inférieure ou égale à ${el.max}`;
    if (v.stepMismatch) return 'Valeur non autorisée';
    if (v.patternMismatch) return el.title || 'Format invalide';
  }
  if (v.tooLong) return 'Texte trop long';
  return null;
}

type Props = Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> & {
  onValidSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  extraValidate?: () => Record<string, string | undefined>;
};

const INVALID_CLASSES = ['border-red-500', 'ring-1', 'ring-red-500'];

function mark(el: Field, invalid: boolean) {
  INVALID_CLASSES.forEach((c) => el.classList.toggle(c, invalid));
  el.setAttribute('aria-invalid', invalid ? 'true' : 'false');
}

export function ValidatedForm({ onValidSubmit, extraValidate, children, ...props }: Props) {
  const ref = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});

  const fields = () =>
    Array.from(ref.current?.elements ?? []).filter(
      (el): el is Field => 'name' in el && Boolean((el as Field).name) && (el as Field).willValidate,
    );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found: Errors = {};
    for (const el of fields()) {
      const msg = frenchMessage(el);
      if (msg && !found[el.name]) found[el.name] = msg;
    }
    if (extraValidate) {
      for (const [name, msg] of Object.entries(extraValidate())) {
        if (msg && !found[name]) found[name] = msg;
      }
    }
    fields().forEach((el) => mark(el, Boolean(found[el.name])));
    setErrors(found);
    if (Object.keys(found).length === 0) onValidSubmit(e);
    else (ref.current?.querySelector('[aria-invalid="true"]') as HTMLElement | null)?.focus();
  };

  // Efface l'erreur d'un champ dès qu'il redevient valide.
  const recheck = (e: React.FormEvent<HTMLFormElement>) => {
    const el = e.target as Field;
    if (!el.name || !errors[el.name] || frenchMessage(el)) return;
    if (extraValidate && extraValidate()[el.name]) return;
    mark(el, false);
    setErrors(({ [el.name]: _removed, ...rest }) => rest);
  };

  return (
    <ErrorsContext.Provider value={errors}>
      <form ref={ref} noValidate onSubmit={handleSubmit} onInput={recheck} onChange={recheck} {...props}>
        {children}
      </form>
    </ErrorsContext.Provider>
  );
}

export function FieldError({ name }: { name: string }) {
  const msg = useContext(ErrorsContext)[name];
  return msg ? (
    <p className="mt-1 text-xs text-red-600" role="alert">
      {msg}
    </p>
  ) : null;
}

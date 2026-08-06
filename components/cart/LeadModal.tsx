'use client';

import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { createLead } from '@/lib/services/leads';
import type { LeadCreatePayload, LeadItemRequest } from '@/lib/api-types';
import { useCart } from './CartContext';

const formatPrice = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const onlyDigits = (value: string) => value.replace(/\D/g, '');

const formatPhone = (value: string) => {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length === 0) return '+55 ';

  const ddd = digits.slice(0, 2);
  if (digits.length <= 2) return `+55 (${ddd}`;

  const hasNine = digits.length > 10;
  const firstPart = digits.slice(2, hasNine ? 7 : 6);
  const lastPart = digits.slice(hasNine ? 7 : 6, hasNine ? 11 : 10);

  if (!lastPart) return `+55 (${ddd}) ${firstPart}`;

  return `+55 (${ddd}) ${firstPart}-${lastPart}`;
};

type IbgeState = {
  id: number;
  sigla: string;
  nome: string;
};

type IbgeCity = {
  id: number;
  nome: string;
};

type FieldErrors = Partial<{
  name: string;
  email: string;
  phone: string;
  state: string;
  city: string;
  message: string;
}>;

export default function LeadModal() {
  const {
    items,
    leadMode,
    isLeadModalOpen,
    closeLeadModal,
    clearCart,
  } = useCart();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    message: '',
  });
  const [states, setStates] = useState<IbgeState[]>([]);
  const [cities, setCities] = useState<IbgeCity[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (!isLeadModalOpen) return;
    setForm({
      name: '',
      email: '',
      phone: '',
      city: '',
      state: '',
      message: '',
    });
    setStatus('');
    setError('');
    setFieldErrors({});
  }, [isLeadModalOpen, leadMode]);

  useEffect(() => {
    if (!isLeadModalOpen || states.length > 0) return;

    let active = true;

    const loadStates = async () => {
      setLoadingStates(true);
      try {
        const response = await fetch(
          'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome'
        );
        const data: IbgeState[] = await response.json();
        if (active) setStates(data);
      } catch (fetchError) {
        if (active) setStates([]);
      } finally {
        if (active) setLoadingStates(false);
      }
    };

    loadStates();

    return () => {
      active = false;
    };
  }, [isLeadModalOpen, states.length]);

  useEffect(() => {
    if (!form.state) {
      setCities([]);
      setLoadingCities(false);
      return;
    }

    let active = true;

    const loadCities = async () => {
      setLoadingCities(true);
      try {
        const response = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${form.state}/municipios`
        );
        const data: IbgeCity[] = await response.json();
        if (active) setCities(data);
      } catch (fetchError) {
        if (active) setCities([]);
      } finally {
        if (active) setLoadingCities(false);
      }
    };

    loadCities();

    return () => {
      active = false;
    };
  }, [form.state]);

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const setFieldError = (field: keyof typeof form, message?: string) => {
    setFieldErrors((prev) => {
      if (!message && !prev[field]) return prev;
      const next = { ...prev };
      if (message) {
        next[field] = message;
      } else {
        delete next[field];
      }
      return next;
    });
  };

  const validateField = (field: keyof typeof form, value: string) => {
    const trimmed = value.trim();

    switch (field) {
      case 'name':
        return trimmed.length >= 3 ? undefined : 'Nome muito curto.';
      case 'email':
        return EMAIL_REGEX.test(trimmed) ? undefined : 'E-mail invalido.';
      case 'phone':
        return onlyDigits(value).length >= 10 ? undefined : 'Telefone incompleto.';
      case 'state':
      case 'city':
        return trimmed ? undefined : 'Selecione uma opcao.';
      case 'message':
        return trimmed.length >= 10 ? undefined : 'Escreva um pouco mais.';
      default:
        return undefined;
    }
  };

  const handleBlur = (field: keyof typeof form) => {
    const message = validateField(field, form[field]);
    setFieldError(field, message);
  };

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldError(key, undefined);
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleChange('phone', formatPhone(event.target.value));
  };

  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;
    setForm((prev) => ({ ...prev, state: selected, city: '' }));
    setCities([]);
    setFieldError('state', undefined);
    setFieldError('city', undefined);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('');
    setError('');
    setFieldErrors({});

    const nextErrors: FieldErrors = {};
    const fieldsToValidate: (keyof typeof form)[] = [
      'name',
      'email',
      'phone',
      'state',
      'city',
      'message',
    ];

    fieldsToValidate.forEach((field) => {
      const message = validateField(field, form[field]);
      if (message) nextErrors[field] = message;
    });

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    const emailValue = form.email.trim();

    setSubmitting(true);

    try {
      
      const leadItems: LeadItemRequest[] = leadMode === 'QUOTE' && items.length > 0
        ? items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          }))
        : [];

      // Montamos o Payload exato que a API espera
      const payload: LeadCreatePayload = {
        name: form.name,
        email: emailValue,
        phone: form.phone,
        city: form.city,
        state: form.state,
        message: form.message,
        type: leadMode,
        items: leadItems, 
      };

      await createLead(payload);

      setStatus(
        leadMode === 'QUOTE'
          ? 'Orçamento enviado com sucesso.'
          : 'Contato enviado com sucesso.'
      );

      if (leadMode === 'QUOTE') {
        clearCart();
      }
      
      // Opcional: fechar o modal automaticamente após alguns segundos
      setTimeout(() => {
          closeLeadModal();
      }, 2000);

    } catch (submitError) {
      console.error(submitError);
      setError('Não foi possível enviar sua solicitação agora.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isLeadModalOpen} onOpenChange={(open) => !open && closeLeadModal()}>
      <DialogContent className="bg-black/95 text-white border border-white/10 max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-black">
            {leadMode === 'QUOTE' ? 'Solicitar Orcamento' : 'Fale com a Vitally'}
          </DialogTitle>
          <p className="text-white/50 text-sm">
            {leadMode === 'QUOTE'
              ? 'Preencha os dados para receber um orcamento personalizado.'
              : 'Envie sua mensagem e responderemos em breve.'}
          </p>
        </DialogHeader>

        {leadMode === 'QUOTE' && items.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-black/60 p-4 space-y-3">
            <div className="text-white/60 text-xs uppercase tracking-widest">
              Resumo do carrinho
            </div>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-white/70">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="text-white/50">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-sm font-semibold">
              <span className="text-white/60">Total</span>
              <span className="text-white">{formatPrice(totalPrice)}</span>
            </div>
          </div>
        )}

        {leadMode === 'QUOTE' && items.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-black/60 p-4 text-white/60 text-sm">
            Seu carrinho esta vazio. Adicione produtos para solicitar um orcamento.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-white/60 text-xs font-semibold uppercase tracking-widest">
                Nome
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(event) => handleChange('name', event.target.value)}
                onBlur={() => handleBlur('name')}
                className={`w-full h-11 px-4 rounded-xl bg-black/70 border ${
                  fieldErrors.name
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-white/10 focus:border-[#39FF14]/60'
                } text-white placeholder-white/30 outline-none transition-colors`}
                placeholder="Seu nome"
                required
              />
              {fieldErrors.name && (
                <p className="text-rose-400 text-xs font-semibold">{fieldErrors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-white/60 text-xs font-semibold uppercase tracking-widest">
                E-mail
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(event) => handleChange('email', event.target.value)}
                onBlur={() => handleBlur('email')}
                className={`w-full h-11 px-4 rounded-xl bg-black/70 border ${
                  fieldErrors.email
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-white/10 focus:border-[#39FF14]/60'
                } text-white placeholder-white/30 outline-none transition-colors`}
                placeholder="voce@email.com"
                required
              />
              {fieldErrors.email && (
                <p className="text-rose-400 text-xs font-semibold">{fieldErrors.email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-white/60 text-xs font-semibold uppercase tracking-widest">
                Telefone
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={handlePhoneChange}
                onBlur={() => handleBlur('phone')}
                inputMode="tel"
                className={`w-full h-11 px-4 rounded-xl bg-black/70 border ${
                  fieldErrors.phone
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-white/10 focus:border-[#39FF14]/60'
                } text-white placeholder-white/30 outline-none transition-colors`}
                placeholder="+55 (11) 99999-9999"
                required
              />
              {fieldErrors.phone && (
                <p className="text-rose-400 text-xs font-semibold">{fieldErrors.phone}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-white/60 text-xs font-semibold uppercase tracking-widest">
                Estado
              </label>
              <select
                value={form.state}
                onChange={handleStateChange}
                onBlur={() => handleBlur('state')}
                className={`w-full h-11 px-4 rounded-xl bg-black/70 border ${
                  fieldErrors.state
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-white/10 focus:border-[#39FF14]/60'
                } text-white outline-none transition-colors`}
                disabled={loadingStates}
                required
              >
                <option value="">
                  {loadingStates ? 'Carregando estados...' : 'Selecione o estado'}
                </option>
                {states.map((state) => (
                  <option key={state.id} value={state.sigla}>
                    {state.nome}
                  </option>
                ))}
              </select>
              {fieldErrors.state && (
                <p className="text-rose-400 text-xs font-semibold">{fieldErrors.state}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-white/60 text-xs font-semibold uppercase tracking-widest">
              Cidade
            </label>
            <select
              value={form.city}
              onChange={(event) => handleChange('city', event.target.value)}
              onBlur={() => handleBlur('city')}
              className={`w-full h-11 px-4 rounded-xl bg-black/70 border ${
                fieldErrors.city
                  ? 'border-rose-500 focus:border-rose-500'
                  : 'border-white/10 focus:border-[#39FF14]/60'
              } text-white outline-none transition-colors`}
              disabled={!form.state || loadingCities}
              required
            >
              <option value="">
                {!form.state
                  ? 'Selecione um estado primeiro'
                  : loadingCities
                    ? 'Carregando cidades...'
                    : 'Selecione a cidade'}
              </option>
              {cities.map((city) => (
                <option key={city.id} value={city.nome}>
                  {city.nome}
                </option>
              ))}
            </select>
            {fieldErrors.city && (
              <p className="text-rose-400 text-xs font-semibold">{fieldErrors.city}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-white/60 text-xs font-semibold uppercase tracking-widest">
              Mensagem
            </label>
            <textarea
              value={form.message}
              onChange={(event) => handleChange('message', event.target.value)}
              onBlur={() => handleBlur('message')}
              className={`w-full min-h-[110px] rounded-xl px-4 py-3 bg-black/70 border ${
                fieldErrors.message
                  ? 'border-rose-500 focus:border-rose-500'
                  : 'border-white/10 focus:border-[#39FF14]/60'
              } text-white placeholder-white/30 outline-none transition-colors`}
              placeholder="Descreva sua necessidade"
              required
            />
            {fieldErrors.message && (
              <p className="text-rose-400 text-xs font-semibold">{fieldErrors.message}</p>
            )}
          </div>

          {error && <div className="text-rose-400 text-xs font-semibold">{error}</div>}
          {status && <div className="text-[#39FF14] text-xs font-semibold">{status}</div>}

          <button
            type="submit"
            disabled={submitting || (leadMode === 'QUOTE' && items.length === 0)}
            className="w-full h-11 rounded-xl bg-[#39FF14] text-black text-sm font-bold uppercase tracking-wider hover:bg-[#53FF2E] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting
              ? 'Enviando...'
              : leadMode === 'QUOTE'
                ? 'Enviar Orcamento'
                : 'Enviar Contato'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
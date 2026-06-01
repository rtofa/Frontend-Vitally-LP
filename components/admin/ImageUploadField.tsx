'use client';

import { useRef } from 'react';

type Props = {
  /** Current image URL stored in the form state (set after a successful upload) */
  imageUrl: string;
  /** Whether an upload is currently in progress */
  uploading: boolean;
  /** Upload error message, if any */
  error?: string | null;
  /** Triggered when the user picks a file */
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** If true, the field is required for form submission */
  required?: boolean;
  /** Label text override */
  label?: string;
};

const inputClass =
  'w-full h-11 px-4 rounded-xl bg-black/60 border border-white/10 text-white placeholder-white/20 focus:border-[#39FF14]/60 outline-none transition-colors text-sm';
const labelClass =
  'text-white/60 text-xs font-semibold uppercase tracking-widest';

export default function ImageUploadField({
  imageUrl,
  uploading,
  error,
  onFileChange,
  required = false,
  label = 'Imagem *',
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <label className={labelClass}>{label}</label>

      {/* Hidden file input — single instance, always in the DOM */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="hidden"
      />

      {/* ── Upload state: show the upload zone ─────────────────────── */}
      {!imageUrl && (
        <>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className={`${inputClass} flex items-center gap-3 cursor-pointer text-left disabled:cursor-wait`}
          >
            {uploading ? (
              <>
                {/* spinner */}
                <svg
                  className="h-4 w-4 animate-spin text-[#39FF14]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                <span className="text-[#39FF14]/80 text-sm">
                  Enviando para a nuvem...
                </span>
              </>
            ) : (
              <>
                {/* upload icon */}
                <svg
                  className="h-5 w-5 text-white/30"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
                <span className="text-white/30 text-sm">
                  Clique para selecionar uma imagem
                </span>
              </>
            )}
          </button>

          {/* Invisible input that enforces `required` validation when no URL is set */}
          {required && (
            <input
              tabIndex={-1}
              className="sr-only"
              required
              value=""
              onChange={() => {}}
              aria-hidden="true"
            />
          )}
        </>
      )}

      {/* ── Success state: show preview + option to change ─────────── */}
      {imageUrl && (
        <div className="relative group rounded-xl overflow-hidden border border-white/10 bg-black/40">
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-40 object-cover"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <span className="text-white text-xs font-bold uppercase tracking-wider bg-white/10 backdrop-blur px-4 py-2 rounded-lg border border-white/20">
              Trocar imagem
            </span>
          </button>
        </div>
      )}

      {/* ── Error feedback ─────────────────────────────────────────── */}
      {error && (
        <p className="text-red-400 text-xs mt-1">⚠ {error}</p>
      )}
    </div>
  );
}

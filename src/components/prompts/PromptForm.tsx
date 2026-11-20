import { useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { CircleAlert, History } from 'lucide-react';
import type { SavedPrompt } from '../../types';
import { formatDateTime } from '../../utils/format';
import { MAX_PROMPT_CONTENT, MAX_PROMPT_NAME, validatePromptForm } from '../../utils/validation';
import { Button } from '../common/Button';
import { useSingleSubmit } from '../common/useSingleSubmit';

interface PromptFormProps {
  prompt: SavedPrompt;
  /** Mengembalikan true bila tersimpan (atau tidak ada perubahan), false bila penyimpanan gagal. */
  onSave: (name: string, content: string) => boolean;
  onCancel: () => void;
}

const numberFormat = new Intl.NumberFormat('id-ID');

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="field-error">
      <CircleAlert size={16} aria-hidden="true" />
      {message}
    </p>
  );
}

export function PromptForm({ prompt, onSave, onCancel }: PromptFormProps) {
  const [name, setName] = useState(prompt.name);
  const [content, setContent] = useState(prompt.content);
  // Validasi berjalan saat Simpan ditekan, lalu diperbarui setiap kali field berubah (INTERACTION-SPEC 5.3).
  const [submitted, setSubmitted] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const errors = submitted ? validatePromptForm(name, content) : {};
  const { busy, run } = useSingleSubmit(() => onSave(name, content));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const found = validatePromptForm(name, content);
    if (found.name) return nameRef.current?.focus();
    if (found.content) return contentRef.current?.focus();
    run();
  };

  const describedBy = (...ids: (string | false)[]) => ids.filter(Boolean).join(' ') || undefined;

  return (
    <form className="card form-card" onSubmit={submit} noValidate>
      <div className="field">
        <span className="field-label">ID prompt</span>
        <span className="readonly-value">{prompt.id}</span>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="prompt-name">
          Nama prompt
        </label>
        <input
          id="prompt-name"
          ref={nameRef}
          className={`input ${errors.name ? 'has-error' : ''}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={!!errors.name}
          aria-describedby={describedBy(!!errors.name && 'prompt-name-error', name.length > 100 && 'prompt-name-count')}
        />
        <div className="field-meta">
          <FieldError id="prompt-name-error" message={errors.name} />
          {name.length > 100 && (
            <span id="prompt-name-count" className="char-count">
              {name.length}/{MAX_PROMPT_NAME}
            </span>
          )}
        </div>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="prompt-content">
          Isi prompt
        </label>
        <textarea
          id="prompt-content"
          ref={contentRef}
          className={`textarea ${errors.content ? 'has-error' : ''}`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          aria-invalid={!!errors.content}
          aria-describedby={describedBy(!!errors.content && 'prompt-content-error', 'prompt-content-count')}
        />
        <div className="field-meta">
          <FieldError id="prompt-content-error" message={errors.content} />
          <span id="prompt-content-count" className="char-count">
            {numberFormat.format(content.length)}/{numberFormat.format(MAX_PROMPT_CONTENT)}
          </span>
        </div>
      </div>

      <p className="text-small">
        Terakhir diubah {formatDateTime(prompt.updatedAt)} oleh {prompt.updatedBy}
      </p>

      <div className="button-row">
        <Button variant="primary" type="submit" disabled={busy}>
          Simpan Perubahan
        </Button>
        <Button onClick={onCancel}>Batal</Button>
        <Link className="btn btn-ghost" to={`/riwayat/prompt/${prompt.id}`}>
          <History size={16} aria-hidden="true" />
          Lihat Riwayat
        </Link>
      </div>
    </form>
  );
}

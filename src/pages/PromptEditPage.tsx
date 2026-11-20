import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store/StoreContext';
import { auditsForPrompt } from '../store/selectors';
import { savePrompt } from '../store/actions';
import { useToast } from '../components/common/Toast';
import { PageHeader } from '../components/layout/PageHeader';
import { PromptForm } from '../components/prompts/PromptForm';
import { UsagePanel } from '../components/prompts/UsagePanel';
import { NO_CHANGE_MESSAGE, promptSavedMessage } from '../utils/messages';
import { NotFound } from './NotFound';

/** PAGE-04 Ubah Saved Prompt. */
export function PromptEditPage() {
  const { promptId } = useParams();
  const { data, commit } = useStore();
  const toast = useToast();
  const navigate = useNavigate();

  const prompt = data.prompts.find((p) => p.id === promptId);
  if (!prompt) return <NotFound section="Saved Prompt" listPath="/prompts" />;
  const audits = auditsForPrompt(data, prompt.id);

  const save = (name: string, content: string): boolean => {
    const next = savePrompt(data, prompt.id, { name, content }, new Date().toISOString());
    if (!next) {
      toast('info', NO_CHANGE_MESSAGE);
      return true;
    }
    if (!commit(next)) return false;
    toast('success', promptSavedMessage(audits));
    return true;
  };

  return (
    <>
      <PageHeader title="Ubah Saved Prompt" crumbs={[{ label: 'Saved Prompt', to: '/prompts' }, { label: `${prompt.id} ${prompt.name}` }]} />
      <div className="grid-edit">
        {/* key: form diisi ulang dari data tersimpan setelah simpan atau pengembalian berhasil */}
        <PromptForm key={`${prompt.id}-${prompt.updatedAt}`} prompt={prompt} onSave={save} onCancel={() => navigate('/prompts')} />
        <UsagePanel audits={audits} />
      </div>
    </>
  );
}

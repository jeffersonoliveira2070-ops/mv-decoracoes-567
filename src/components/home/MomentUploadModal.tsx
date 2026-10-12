import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Camera,
  Film,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileVideo,
  FileImage,
} from "lucide-react";
import { supabase, isSupabaseConfigured, uploadMediaToStorage } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { readFileAsDataUrl } from "@/lib/contentStore";

interface MomentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const MAX_FILE_SIZE_MB = 15;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

export function MomentUploadModal({ isOpen, onClose, onSuccess }: MomentUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nome, setNome] = useState("");
  const [legenda, setLegenda] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"imagem" | "video">("imagem");
  const [consentAuthorization, setConsentAuthorization] = useState(false);
  const [consentPersons, setConsentPersons] = useState(false);

  const [enviando, setEnviando] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setNome("");
    setLegenda("");
    setFile(null);
    setPreviewUrl(null);
    setMediaType("imagem");
    setConsentAuthorization(false);
    setConsentPersons(false);
    setEnviando(false);
    setUploadProgress(0);
    setSucesso(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !enviando) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, enviando]);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validação de tamanho
    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      toast.error(
        `O arquivo selecionado tem ${(selectedFile.size / (1024 * 1024)).toFixed(1)}MB. O limite máximo permitido é de ${MAX_FILE_SIZE_MB}MB.`,
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Validação de tipo
    const isImage = ACCEPTED_IMAGE_TYPES.includes(selectedFile.type);
    const isVideo = ACCEPTED_VIDEO_TYPES.includes(selectedFile.type);

    if (!isImage && !isVideo) {
      toast.error(
        "Formato não suportado. Por favor, envie uma imagem (JPG, PNG, WEBP) ou vídeo (MP4, MOV, WebM).",
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setFile(selectedFile);
    setMediaType(isVideo ? "video" : "imagem");

    // Gerar pré-visualização local
    try {
      const dataUrl = await readFileAsDataUrl(selectedFile);
      setPreviewUrl(dataUrl);
    } catch {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome.trim()) {
      toast.error("Por favor, informe seu nome.");
      return;
    }
    if (!file) {
      toast.error("Por favor, selecione uma foto ou vídeo da festa.");
      return;
    }
    if (!consentAuthorization || !consentPersons) {
      toast.error("É necessário confirmar os termos de autorização e consentimento de imagem.");
      return;
    }

    setEnviando(true);
    setUploadProgress(20);

    try {
      let finalMediaUrl = "";

      // 1. Upload para o Supabase Storage
      if (isSupabaseConfigured()) {
        setUploadProgress(40);
        const storageResult = await uploadMediaToStorage(file, "momentos");
        setUploadProgress(70);

        if (storageResult.url) {
          finalMediaUrl = storageResult.url;
        } else {
          // Fallback para Data URL se o bucket não estiver respondendo
          finalMediaUrl = previewUrl || (await readFileAsDataUrl(file));
        }
      } else {
        // Modo local/fallback
        setUploadProgress(60);
        finalMediaUrl = previewUrl || (await readFileAsDataUrl(file));
      }

      setUploadProgress(85);

      // 2. Registro no banco de dados com aprovado = false (moderação obrigatória)
      if (isSupabaseConfigured()) {
        const { error } = await supabase.from("momentos").insert([
          {
            nome: nome.trim(),
            legenda: legenda.trim() || null,
            media_url: finalMediaUrl,
            media_type: mediaType,
            aprovado: false, // Inicia obrigatoriamente pendente de moderação
          },
        ]);

        if (error) {
          toast.error(`Erro ao registrar momento: ${error.message}`);
          setEnviando(false);
          return;
        }
      }

      setUploadProgress(100);
      setSucesso(true);
      toast.success("Momento enviado com sucesso!");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(`Falha no envio: ${err?.message || "Tente novamente."}`);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => !enviando && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="moment-modal-title"
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          type="button"
          disabled={enviando}
          aria-label="Fechar janela"
          className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 transition disabled:opacity-50"
        >
          <X className="h-5 w-5" />
        </button>

        {sucesso ? (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
              Momento enviado com sucesso!
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              Muito obrigado por compartilhar sua celebração conosco! Seu envio passará pela aprovação da nossa equipe antes de ser exibido na galeria oficial da MV Decorações.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white shadow-soft transition hover:opacity-95"
              >
                Concluir
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="flex items-center gap-2 text-gold">
                <Camera className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Momentos dos Clientes
                </span>
              </div>
              <h2
                id="moment-modal-title"
                className="mt-1 text-2xl font-bold font-display text-slate-900 dark:text-white"
              >
                Compartilhe Sua Festa
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Envie uma foto ou vídeo da sua celebração com a MV Decorações.
              </p>
            </div>

            {/* Seu Nome */}
            <div>
              <label
                htmlFor="moment-nome"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Seu Nome *
              </label>
              <input
                id="moment-nome"
                type="text"
                required
                disabled={enviando}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Mariana Silva"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 dark:border-slate-800 dark:bg-slate-800/80 dark:focus:border-primary"
              />
            </div>

            {/* Upload de Mídia */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Foto ou Vídeo da Festa *
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
                onChange={handleFileChange}
                disabled={enviando}
                className="hidden"
              />

              {!file ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={enviando}
                  className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 p-6 text-center hover:border-primary hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50 transition"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
                    <Upload className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Toque para selecionar foto ou vídeo
                  </span>
                  <span className="text-xs text-slate-400 mt-1">
                    Formatos aceitos: JPG, PNG, WEBP, MP4, MOV (máx. {MAX_FILE_SIZE_MB}MB)
                  </span>
                </button>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60 p-3">
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black/90">
                    {mediaType === "video" && previewUrl ? (
                      <video src={previewUrl} controls className="h-full w-full object-contain" />
                    ) : previewUrl ? (
                      <img src={previewUrl} alt="Pré-visualização" className="h-full w-full object-contain" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400 text-xs">
                        {mediaType === "video" ? <FileVideo className="h-8 w-8" /> : <FileImage className="h-8 w-8" />}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {file.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB • {mediaType}
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={enviando}
                      onClick={() => {
                        setFile(null);
                        setPreviewUrl(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="rounded-lg px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                    >
                      Trocar arquivo
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Legenda Opcional */}
            <div>
              <label
                htmlFor="moment-legenda"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Legenda da Foto / Vídeo (opcional)
              </label>
              <textarea
                id="moment-legenda"
                rows={2}
                disabled={enviando}
                value={legenda}
                onChange={(e) => setLegenda(e.target.value)}
                placeholder="Ex: Aniversário de 1 ano do Lucas! A decoração ficou impecável."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 dark:border-slate-800 dark:bg-slate-800/80 dark:focus:border-primary"
              />
            </div>

            {/* Checkboxes de consentimento obrigatórios */}
            <div className="space-y-2.5 rounded-2xl bg-amber-50/50 p-4 border border-amber-200/50 dark:bg-amber-950/20 dark:border-amber-900/30">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  required
                  disabled={enviando}
                  checked={consentAuthorization}
                  onChange={(e) => setConsentAuthorization(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <span>
                  Confirmo que possuo autorização para enviar e compartilhar esta foto/vídeo no site da MV Decorações. *
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  required
                  disabled={enviando}
                  checked={consentPersons}
                  onChange={(e) => setConsentPersons(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <span>
                  Confirmo que possuo os direitos e consentimentos necessários de todas as pessoas que aparecem nas imagens. *
                </span>
              </label>
            </div>

            {/* Barra de Progresso */}
            {enviando && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Enviando mídia com segurança...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={enviando}
                className="rounded-full px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={enviando || !file || !nome.trim() || !consentAuthorization || !consentPersons}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-xs font-bold text-white shadow-soft transition hover:opacity-95 disabled:opacity-50"
              >
                {enviando ? "Enviando arquivo..." : "Enviar para Aprovação"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

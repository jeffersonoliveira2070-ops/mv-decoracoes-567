CREATE TABLE public.avaliacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  nota INTEGER NOT NULL CHECK (nota BETWEEN 1 AND 5),
  comentario TEXT NOT NULL,
  aprovado BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.avaliacoes TO anon;
GRANT SELECT, INSERT ON public.avaliacoes TO authenticated;
GRANT ALL ON public.avaliacoes TO service_role;
ALTER TABLE public.avaliacoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Qualquer um pode enviar avaliacao" ON public.avaliacoes FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Leitura publica de avaliacoes aprovadas" ON public.avaliacoes FOR SELECT TO anon, authenticated USING (aprovado = true);

CREATE TABLE public.momentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  legenda TEXT,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  aprovado BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.momentos TO anon;
GRANT SELECT, INSERT ON public.momentos TO authenticated;
GRANT ALL ON public.momentos TO service_role;
ALTER TABLE public.momentos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Qualquer um pode enviar momento" ON public.momentos FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Leitura publica de momentos aprovados" ON public.momentos FOR SELECT TO anon, authenticated USING (aprovado = true);

CREATE POLICY "Upload publico de momentos" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'momentos');
CREATE POLICY "Leitura publica de momentos storage" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'momentos');
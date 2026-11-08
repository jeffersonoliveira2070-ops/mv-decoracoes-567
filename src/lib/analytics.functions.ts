import { createServerFn } from "@tanstack/react-start";

// O ID de métrica do Google Analytics (G-...) é público por natureza
// (fica visível no código da página), mas está guardado como segredo do
// projeto. Esta função o expõe ao navegador de forma controlada.
export const getGaMeasurementId = createServerFn({ method: "GET" }).handler(
  () => {
    return process.env["GOOGLE_ANALYTICS_MEASUREMENT_ID"] ?? null;
  },
);

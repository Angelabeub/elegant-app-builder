import { motion } from "framer-motion";
import { Box, ArrowLeftRight } from "lucide-react";

const casiersData = [
  { fournisseur: "SOLIBRA", type: "33cl (24 trous)", recus: 120, retournes: 95, disponibles: 25, pleins: 18, vides: 7 },
  { fournisseur: "SOLIBRA", type: "50cl (12 trous)", recus: 80, retournes: 65, disponibles: 15, pleins: 10, vides: 5 },
  { fournisseur: "SOLIBRA", type: "50cl (20 trous)", recus: 50, retournes: 42, disponibles: 8, pleins: 5, vides: 3 },
  { fournisseur: "SOLIBRA", type: "100cl (12 trous)", recus: 30, retournes: 28, disponibles: 2, pleins: 1, vides: 1 },
  { fournisseur: "BRASSIVOIRE", type: "33cl (24 trous)", recus: 60, retournes: 50, disponibles: 10, pleins: 6, vides: 4 },
  { fournisseur: "BRASSIVOIRE", type: "50cl (20 trous)", recus: 40, retournes: 35, disponibles: 5, pleins: 3, vides: 2 },
  { fournisseur: "COCACOLA", type: "33cl (24 trous)", recus: 45, retournes: 40, disponibles: 5, pleins: 3, vides: 2 },
];

const totalNonRetournes = casiersData.reduce((acc, c) => acc + (c.recus - c.retournes), 0);

const Casiers = () => (
  <div className="page-container">
    <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="page-title">Gestion des Casiers</h1>
        <p className="page-subtitle">Suivi des casiers par fournisseur et par type</p>
      </div>
      <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
        <ArrowLeftRight size={14} />
        Mouvement Casiers
      </button>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {[
        { label: "Total Casiers Disponibles", value: casiersData.reduce((a, c) => a + c.disponibles, 0) },
        { label: "Casiers Pleins", value: casiersData.reduce((a, c) => a + c.pleins, 0) },
        { label: "Casiers Non Retournés", value: totalNonRetournes },
      ].map((s, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="stat-card">
          <p className="stat-label">{s.label}</p>
          <p className="stat-value mt-2">{s.value}</p>
        </motion.div>
      ))}
    </div>

    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="stat-card overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th>Fournisseur</th>
            <th>Type Casier</th>
            <th className="text-right">Reçus</th>
            <th className="text-right">Retournés</th>
            <th className="text-right">Disponibles</th>
            <th className="text-right">Pleins</th>
            <th className="text-right">Vides</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {casiersData.map((c, i) => (
            <tr key={i}>
              <td className="font-medium">{c.fournisseur}</td>
              <td>{c.type}</td>
              <td className="text-right">{c.recus}</td>
              <td className="text-right">{c.retournes}</td>
              <td className="text-right font-medium">{c.disponibles}</td>
              <td className="text-right">{c.pleins}</td>
              <td className="text-right">{c.vides}</td>
              <td>
                {c.recus - c.retournes > 10 ? (
                  <span className="module-badge bg-destructive/10 text-destructive">À retourner</span>
                ) : (
                  <span className="module-badge bg-success/10 text-success">OK</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  </div>
);

export default Casiers;

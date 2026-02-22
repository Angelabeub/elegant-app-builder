import { motion } from "framer-motion";
import { Building2, Plus, Calendar, CheckCircle, Clock } from "lucide-react";

const partenairesData = [
  { id: 1, nom: "Direction Générale des Impôts", type: "Impôts", montant: 350000, echeance: "2026-03-15", statut: "À payer" },
  { id: 2, nom: "CNPS (Cotisations)", type: "Taxes Sociales", montant: 180000, echeance: "2026-02-28", statut: "À payer" },
  { id: 3, nom: "Mairie - Patente", type: "Patente", montant: 250000, echeance: "2026-01-31", statut: "Payé" },
  { id: 4, nom: "TVA Mensuelle", type: "TVA", montant: 420000, echeance: "2026-03-10", statut: "À payer" },
  { id: 5, nom: "Taxe Communale", type: "Taxes Locales", montant: 75000, echeance: "2026-02-15", statut: "Payé" },
];

const totalAPayer = partenairesData.filter((p) => p.statut === "À payer").reduce((a, p) => a + p.montant, 0);

const Partenaires = () => (
  <div className="page-container">
    <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="page-title">Partenaires & Taxes</h1>
        <p className="page-subtitle">Suivi des obligations fiscales et partenariats</p>
      </div>
      <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
        <Plus size={14} />
        Nouveau Partenaire
      </button>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {[
        { label: "Total À Payer", value: `${totalAPayer.toLocaleString("fr-FR")} F` },
        { label: "Échéances Proches", value: partenairesData.filter((p) => p.statut === "À payer").length },
        { label: "Paiements Effectués", value: partenairesData.filter((p) => p.statut === "Payé").length },
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
            <th>Partenaire / Organisme</th>
            <th>Type</th>
            <th className="text-right">Montant</th>
            <th>Échéance</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {partenairesData.map((p) => (
            <tr key={p.id}>
              <td className="font-medium">{p.nom}</td>
              <td><span className="module-badge">{p.type}</span></td>
              <td className="text-right">{p.montant.toLocaleString("fr-FR")} F</td>
              <td>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Calendar size={10} />
                  {new Date(p.echeance).toLocaleDateString("fr-FR")}
                </span>
              </td>
              <td>
                <span className={`module-badge ${p.statut === "Payé" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                  {p.statut === "Payé" ? <CheckCircle size={10} /> : <Clock size={10} />}
                  {p.statut}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  </div>
);

export default Partenaires;

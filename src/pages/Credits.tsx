import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Search, Phone, AlertCircle, CheckCircle } from "lucide-react";

const creditsData = [
  { id: 1, client: "Koné Amadou", telephone: "07 12 34 56", montant: 150000, date: "2026-02-20", rembourse: 50000, statut: "En cours" },
  { id: 2, client: "Touré Fatou", telephone: "05 98 76 54", montant: 80000, date: "2026-02-19", rembourse: 80000, statut: "Soldé" },
  { id: 3, client: "Diallo Ibrahim", telephone: "01 23 45 67", montant: 320000, date: "2026-02-18", rembourse: 100000, statut: "En cours" },
  { id: 4, client: "Bamba Sékou", telephone: "07 65 43 21", montant: 45000, date: "2026-02-17", rembourse: 0, statut: "En retard" },
  { id: 5, client: "Ouattara Marie", telephone: "05 11 22 33", montant: 200000, date: "2026-02-15", rembourse: 200000, statut: "Soldé" },
  { id: 6, client: "Coulibaly Drissa", telephone: "07 44 55 66", montant: 175000, date: "2026-02-14", rembourse: 75000, statut: "En cours" },
  { id: 7, client: "Yao Jean", telephone: "01 77 88 99", montant: 280000, date: "2026-02-10", rembourse: 0, statut: "En retard" },
];

const totalCreances = creditsData.reduce((acc, c) => acc + (c.montant - c.rembourse), 0);
const enCours = creditsData.filter((c) => c.statut === "En cours").length;
const enRetard = creditsData.filter((c) => c.statut === "En retard").length;

const Credits = () => {
  const [search, setSearch] = useState("");
  const filtered = creditsData.filter(
    (c) => c.client.toLowerCase().includes(search.toLowerCase()) || c.telephone.includes(search)
  );

  return (
    <div className="page-container">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Crédits Clients</h1>
          <p className="page-subtitle">Suivi des ventes à crédit et des remboursements</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <CreditCard size={14} />
          Nouveau Crédit
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Créances", value: `${totalCreances.toLocaleString("fr-FR")} F`, icon: CreditCard },
          { label: "Crédits En Cours", value: enCours, icon: AlertCircle },
          { label: "Crédits En Retard", value: enRetard, icon: AlertCircle },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="stat-card">
            <p className="stat-label">{s.label}</p>
            <p className="stat-value mt-2">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-md">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Rechercher par nom ou téléphone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border border-input bg-background pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="stat-card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Téléphone</th>
              <th className="text-right">Montant</th>
              <th className="text-right">Remboursé</th>
              <th className="text-right">Solde</th>
              <th>Date</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td className="font-medium">{c.client}</td>
                <td><span className="flex items-center gap-1"><Phone size={10} className="text-muted-foreground" />{c.telephone}</span></td>
                <td className="text-right">{c.montant.toLocaleString("fr-FR")} F</td>
                <td className="text-right">{c.rembourse.toLocaleString("fr-FR")} F</td>
                <td className="text-right font-medium">{(c.montant - c.rembourse).toLocaleString("fr-FR")} F</td>
                <td className="text-muted-foreground">{new Date(c.date).toLocaleDateString("fr-FR")}</td>
                <td>
                  <span className={`module-badge ${
                    c.statut === "Soldé" ? "bg-success/10 text-success" :
                    c.statut === "En retard" ? "bg-destructive/10 text-destructive" :
                    "bg-warning/10 text-warning"
                  }`}>
                    {c.statut === "Soldé" && <CheckCircle size={10} />}
                    {c.statut === "En retard" && <AlertCircle size={10} />}
                    {c.statut}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default Credits;

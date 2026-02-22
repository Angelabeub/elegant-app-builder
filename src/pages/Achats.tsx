import { motion } from "framer-motion";
import { ShoppingCart, Plus, FileCheck, Clock } from "lucide-react";

const achatsData = [
  { id: "ACH-2026-00012", fournisseur: "SOLIBRA", depot: "SOMODIS", produits: "Bock 66 x48, Castel 33 x96", montant: 345600, date: "2026-02-22", statut: "Réceptionné" },
  { id: "ACH-2026-00011", fournisseur: "BRASSIVOIRE", depot: "PIEUVRE", produits: "Ivoire Black x24, Despe x24", montant: 168000, date: "2026-02-21", statut: "Réceptionné" },
  { id: "ACH-2026-00010", fournisseur: "COCACOLA", depot: "COCACOLA", produits: "Coca 33 x48, Coca 50 x24", montant: 120000, date: "2026-02-21", statut: "En attente" },
  { id: "ACH-2026-00009", fournisseur: "SOLIBRA", depot: "CTOP", produits: "Beaufort 50 x24, Vin 50 x12", montant: 105600, date: "2026-02-20", statut: "Réceptionné" },
  { id: "ACH-2026-00008", fournisseur: "Autres", depot: "LOOKNAN", produits: "Guiness 33 x24, Budweiser x12", montant: 96000, date: "2026-02-19", statut: "Réceptionné" },
];

const totalAchats = achatsData.reduce((acc, a) => acc + a.montant, 0);

const Achats = () => (
  <div className="page-container">
    <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="page-title">Gestion des Achats</h1>
        <p className="page-subtitle">Bons de commande et réception de marchandises</p>
      </div>
      <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
        <Plus size={14} />
        Nouveau Bon de Commande
      </button>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {[
        { label: "Total Achats (mois)", value: `${totalAchats.toLocaleString("fr-FR")} F`, icon: ShoppingCart },
        { label: "Commandes Réceptionnées", value: achatsData.filter((a) => a.statut === "Réceptionné").length, icon: FileCheck },
        { label: "En Attente", value: achatsData.filter((a) => a.statut === "En attente").length, icon: Clock },
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
            <th>N° Commande</th>
            <th>Fournisseur</th>
            <th>Dépôt</th>
            <th>Produits</th>
            <th className="text-right">Montant</th>
            <th>Date</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {achatsData.map((a) => (
            <tr key={a.id}>
              <td className="font-mono text-xs font-medium">{a.id}</td>
              <td className="font-medium">{a.fournisseur}</td>
              <td>{a.depot}</td>
              <td className="text-sm max-w-[200px] truncate">{a.produits}</td>
              <td className="text-right">{a.montant.toLocaleString("fr-FR")} F</td>
              <td className="text-muted-foreground">{new Date(a.date).toLocaleDateString("fr-FR")}</td>
              <td>
                <span className={`module-badge ${a.statut === "Réceptionné" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                  {a.statut === "Réceptionné" ? <FileCheck size={10} /> : <Clock size={10} />}
                  {a.statut}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  </div>
);

export default Achats;

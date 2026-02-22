import { motion } from "framer-motion";
import { Users, Plus, UserCheck, Banknote } from "lucide-react";

const personnelData = [
  { id: 1, nom: "Konan Yao", poste: "Caissier", telephone: "07 11 22 33", salaire: 120000, avance: 30000, statut: "Actif" },
  { id: 2, nom: "Traoré Issa", poste: "Livreur", telephone: "05 44 55 66", salaire: 100000, avance: 0, statut: "Actif" },
  { id: 3, nom: "N'Guessan Aya", poste: "Vendeuse", telephone: "01 77 88 99", salaire: 95000, avance: 15000, statut: "Actif" },
  { id: 4, nom: "Kouamé Serge", poste: "Magasinier", telephone: "07 22 33 44", salaire: 110000, avance: 0, statut: "Actif" },
  { id: 5, nom: "Diomandé Ali", poste: "Aide", telephone: "05 66 77 88", salaire: 75000, avance: 20000, statut: "Congé" },
];

const totalSalaires = personnelData.reduce((a, p) => a + p.salaire, 0);
const totalAvances = personnelData.reduce((a, p) => a + p.avance, 0);

const Personnel = () => (
  <div className="page-container">
    <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="page-title">Gestion du Personnel</h1>
        <p className="page-subtitle">Fiches employés, paie et avances sur salaire</p>
      </div>
      <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
        <Plus size={14} />
        Nouvel Employé
      </button>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
      {[
        { label: "Effectif Total", value: personnelData.length, icon: Users },
        { label: "Actifs", value: personnelData.filter((p) => p.statut === "Actif").length, icon: UserCheck },
        { label: "Masse Salariale", value: `${totalSalaires.toLocaleString("fr-FR")} F`, icon: Banknote },
        { label: "Avances en Cours", value: `${totalAvances.toLocaleString("fr-FR")} F`, icon: Banknote },
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
            <th>Nom</th>
            <th>Poste</th>
            <th>Téléphone</th>
            <th className="text-right">Salaire</th>
            <th className="text-right">Avance</th>
            <th className="text-right">Net à Payer</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {personnelData.map((p) => (
            <tr key={p.id}>
              <td className="font-medium">{p.nom}</td>
              <td><span className="module-badge">{p.poste}</span></td>
              <td>{p.telephone}</td>
              <td className="text-right">{p.salaire.toLocaleString("fr-FR")} F</td>
              <td className="text-right">{p.avance > 0 ? `${p.avance.toLocaleString("fr-FR")} F` : "—"}</td>
              <td className="text-right font-medium">{(p.salaire - p.avance).toLocaleString("fr-FR")} F</td>
              <td>
                <span className={`module-badge ${p.statut === "Actif" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
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

export default Personnel;

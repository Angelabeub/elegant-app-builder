import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, Plus, Calendar } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const depensesData = [
  { id: 1, description: "Transport marchandises SOMODIS", categorie: "Transport", montant: 35000, date: "2026-02-22" },
  { id: 2, description: "Réparation réfrigérateur", categorie: "Maintenance", montant: 75000, date: "2026-02-22" },
  { id: 3, description: "Frais de déchargement", categorie: "Transport", montant: 15000, date: "2026-02-22" },
  { id: 4, description: "Achat sacs plastiques", categorie: "Divers", montant: 5000, date: "2026-02-21" },
  { id: 5, description: "Électricité bureau", categorie: "Charges", montant: 45000, date: "2026-02-21" },
  { id: 6, description: "Salaire journalier aide", categorie: "Salaires", montant: 10000, date: "2026-02-21" },
  { id: 7, description: "Entretien local", categorie: "Maintenance", montant: 25000, date: "2026-02-20" },
  { id: 8, description: "Carburant livraison", categorie: "Transport", montant: 20000, date: "2026-02-20" },
];

const categories = [...new Set(depensesData.map((d) => d.categorie))];
const pieData = categories.map((cat) => ({
  name: cat,
  value: depensesData.filter((d) => d.categorie === cat).reduce((acc, d) => acc + d.montant, 0),
}));
const COLORS = ["hsl(0 0% 10%)", "hsl(0 0% 35%)", "hsl(0 0% 55%)", "hsl(0 0% 75%)", "hsl(0 0% 85%)"];

const totalDepenses = depensesData.reduce((acc, d) => acc + d.montant, 0);

const Depenses = () => {
  const [filterCat, setFilterCat] = useState("Tous");
  const filtered = filterCat === "Tous" ? depensesData : depensesData.filter((d) => d.categorie === filterCat);

  return (
    <div className="page-container">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Gestion des Dépenses</h1>
          <p className="page-subtitle">Enregistrement et suivi des dépenses quotidiennes</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus size={14} />
          Nouvelle Dépense
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="stat-card lg:col-span-1">
          <p className="stat-label">Total Dépenses</p>
          <p className="stat-value mt-2">{totalDepenses.toLocaleString("fr-FR")} F</p>
          <div className="h-48 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={2}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `${v.toLocaleString("fr-FR")} F`} contentStyle={{ fontSize: 12, borderRadius: 4 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1 mt-2">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  {d.name}
                </span>
                <span>{d.value.toLocaleString("fr-FR")} F</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="stat-card lg:col-span-2 overflow-x-auto">
          <div className="flex items-center gap-3 mb-4">
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="Tous">Toutes catégories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Catégorie</th>
                <th className="text-right">Montant</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id}>
                  <td className="font-medium">{d.description}</td>
                  <td><span className="module-badge">{d.categorie}</span></td>
                  <td className="text-right">{d.montant.toLocaleString("fr-FR")} F</td>
                  <td className="text-muted-foreground">{new Date(d.date).toLocaleDateString("fr-FR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  );
};

export default Depenses;

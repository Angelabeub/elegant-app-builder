import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Printer, Download, Calendar } from "lucide-react";

const ficheData = [
  { produit: "Bock 66", stockDepart: 120, entree: 48, sortieVente: 65, prixUnit: 3000 },
  { produit: "Castel 33", stockDepart: 200, entree: 0, sortieVente: 85, prixUnit: 2500 },
  { produit: "Beaufort 50", stockDepart: 80, entree: 24, sortieVente: 42, prixUnit: 3500 },
  { produit: "Heineken 33", stockDepart: 24, entree: 0, sortieVente: 12, prixUnit: 4000 },
  { produit: "Coca 33", stockDepart: 96, entree: 48, sortieVente: 60, prixUnit: 1500 },
  { produit: "Orangina 33", stockDepart: 48, entree: 24, sortieVente: 30, prixUnit: 1800 },
  { produit: "Vin 50", stockDepart: 36, entree: 12, sortieVente: 20, prixUnit: 2500 },
  { produit: "Ivoire Black", stockDepart: 60, entree: 0, sortieVente: 25, prixUnit: 3000 },
  { produit: "Pack d'eau", stockDepart: 50, entree: 20, sortieVente: 35, prixUnit: 2500 },
];

const Ventes = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const totalVentes = ficheData.reduce((acc, r) => acc + r.sortieVente * r.prixUnit, 0);
  const totalAchats = 1850000;
  const credits = 250000;
  const depenses = 85000;
  const epargne = 200000;

  return (
    <div className="page-container">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Fiche Journalière de Vente</h1>
          <p className="page-subtitle">Saisie et suivi des opérations quotidiennes</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-md border border-input bg-background pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <button className="inline-flex items-center gap-2 rounded-md bg-secondary px-3 py-2.5 text-sm font-medium text-secondary-foreground hover:bg-accent transition-colors">
            <Printer size={14} />
            Imprimer
          </button>
          <button className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            <Download size={14} />
            PDF
          </button>
        </div>
      </div>

      {/* Fiche header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="stat-card mb-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText size={16} />
          <h2 className="text-sm font-medium">FICHE DE DÉPÔT ORIENTAL — {new Date(date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Désignation</th>
                <th className="text-right">Stock Départ</th>
                <th className="text-right">Entrée</th>
                <th className="text-right">Total</th>
                <th className="text-right">Sortie Vente</th>
                <th className="text-right">Prix Unit.</th>
                <th className="text-right">Total Vente</th>
                <th className="text-right">Stock Final</th>
              </tr>
            </thead>
            <tbody>
              {ficheData.map((r, i) => {
                const total = r.stockDepart + r.entree;
                const stockFinal = total - r.sortieVente;
                const totalVente = r.sortieVente * r.prixUnit;
                return (
                  <tr key={i}>
                    <td className="font-medium">{r.produit}</td>
                    <td className="text-right">{r.stockDepart}</td>
                    <td className="text-right">{r.entree || "—"}</td>
                    <td className="text-right font-medium">{total}</td>
                    <td className="text-right">{r.sortieVente}</td>
                    <td className="text-right">{r.prixUnit.toLocaleString("fr-FR")}</td>
                    <td className="text-right font-medium">{totalVente.toLocaleString("fr-FR")}</td>
                    <td className="text-right">{stockFinal}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-foreground/20">
                <td colSpan={6} className="font-medium text-right py-3 px-4">TOTAL VENTES</td>
                <td className="text-right font-bold py-3 px-4">{totalVentes.toLocaleString("fr-FR")} F</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </motion.div>

      {/* Récapitulatif financier */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="stat-card">
        <h3 className="text-sm font-medium text-foreground mb-4">Récapitulatif Financier du Jour</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: "Total Achats", value: totalAchats },
            { label: "Crédits Accordés", value: credits },
            { label: "Dépenses", value: depenses },
            { label: "Épargne", value: epargne },
            { label: "Solde Net", value: totalVentes - totalAchats - depenses - credits },
          ].map((item) => (
            <div key={item.label} className="text-center p-3 rounded-md bg-secondary">
              <p className="stat-label">{item.label}</p>
              <p className="text-lg font-bold mt-1">{item.value.toLocaleString("fr-FR")} F</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Ventes;

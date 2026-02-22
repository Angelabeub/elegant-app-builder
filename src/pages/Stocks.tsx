import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Search, Filter, AlertTriangle, ArrowUpDown } from "lucide-react";

const produits = [
  { id: 1, nom: "Bock 66", fournisseur: "SOLIBRA", categorie: "Bières", stockDepart: 120, entrees: 48, sorties: 65, prixUnit: 3000, seuil: 30 },
  { id: 2, nom: "Castel 33", fournisseur: "SOLIBRA", categorie: "Bières", stockDepart: 200, entrees: 0, sorties: 85, prixUnit: 2500, seuil: 50 },
  { id: 3, nom: "Beaufort 50", fournisseur: "SOLIBRA", categorie: "Bières", stockDepart: 80, entrees: 24, sorties: 42, prixUnit: 3500, seuil: 20 },
  { id: 4, nom: "Heineken 33", fournisseur: "BRASSIVOIRE", categorie: "Bières", stockDepart: 24, entrees: 0, sorties: 12, prixUnit: 4000, seuil: 24 },
  { id: 5, nom: "Coca 33", fournisseur: "COCACOLA", categorie: "Soft Drinks", stockDepart: 96, entrees: 48, sorties: 60, prixUnit: 1500, seuil: 30 },
  { id: 6, nom: "Coca 50", fournisseur: "COCACOLA", categorie: "Soft Drinks", stockDepart: 20, entrees: 0, sorties: 12, prixUnit: 2000, seuil: 20 },
  { id: 7, nom: "Orangina 33", fournisseur: "SOLIBRA", categorie: "Sucreries", stockDepart: 48, entrees: 24, sorties: 30, prixUnit: 1800, seuil: 15 },
  { id: 8, nom: "Vin 50", fournisseur: "SOLIBRA", categorie: "Vins", stockDepart: 36, entrees: 12, sorties: 20, prixUnit: 2500, seuil: 10 },
  { id: 9, nom: "Ivoire Black", fournisseur: "BRASSIVOIRE", categorie: "Bières", stockDepart: 60, entrees: 0, sorties: 25, prixUnit: 3000, seuil: 20 },
  { id: 10, nom: "Pack d'eau", fournisseur: "Autres", categorie: "Divers", stockDepart: 50, entrees: 20, sorties: 35, prixUnit: 2500, seuil: 15 },
];

const Stocks = () => {
  const [search, setSearch] = useState("");
  const [filterFournisseur, setFilterFournisseur] = useState("Tous");

  const fournisseurs = ["Tous", ...new Set(produits.map((p) => p.fournisseur))];

  const filtered = produits.filter((p) => {
    const matchSearch = p.nom.toLowerCase().includes(search.toLowerCase());
    const matchFournisseur = filterFournisseur === "Tous" || p.fournisseur === filterFournisseur;
    return matchSearch && matchFournisseur;
  });

  return (
    <div className="page-container">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Gestion des Stocks</h1>
          <p className="page-subtitle">Suivi des stocks en temps réel par produit et fournisseur</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Package size={14} />
          Mouvement de stock
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-input bg-background pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-muted-foreground" />
          <select
            value={filterFournisseur}
            onChange={(e) => setFilterFournisseur(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {fournisseurs.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="stat-card overflow-x-auto"
      >
        <table className="data-table">
          <thead>
            <tr>
              <th><span className="flex items-center gap-1">Produit <ArrowUpDown size={10} /></span></th>
              <th>Fournisseur</th>
              <th>Catégorie</th>
              <th className="text-right">Stock Départ</th>
              <th className="text-right">Entrées</th>
              <th className="text-right">Sorties</th>
              <th className="text-right">Stock Final</th>
              <th className="text-right">Valeur Stock</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const total = p.stockDepart + p.entrees;
              const stockFinal = total - p.sorties;
              const isBas = stockFinal <= p.seuil;
              return (
                <tr key={p.id}>
                  <td className="font-medium">{p.nom}</td>
                  <td>{p.fournisseur}</td>
                  <td><span className="module-badge">{p.categorie}</span></td>
                  <td className="text-right">{p.stockDepart}</td>
                  <td className="text-right text-success">+{p.entrees}</td>
                  <td className="text-right text-destructive">-{p.sorties}</td>
                  <td className="text-right font-medium">{stockFinal}</td>
                  <td className="text-right">{(stockFinal * p.prixUnit).toLocaleString("fr-FR")} F</td>
                  <td>
                    {isBas ? (
                      <span className="module-badge bg-destructive/10 text-destructive">
                        <AlertTriangle size={10} /> Bas
                      </span>
                    ) : (
                      <span className="module-badge bg-success/10 text-success">OK</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default Stocks;

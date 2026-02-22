import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Package,
  CreditCard,
  Wallet,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const salesData = [
  { jour: "Lun", ventes: 450000, achats: 320000 },
  { jour: "Mar", ventes: 520000, achats: 380000 },
  { jour: "Mer", ventes: 380000, achats: 250000 },
  { jour: "Jeu", ventes: 610000, achats: 420000 },
  { jour: "Ven", ventes: 720000, achats: 480000 },
  { jour: "Sam", ventes: 890000, achats: 550000 },
  { jour: "Dim", ventes: 340000, achats: 180000 },
];

const marginData = [
  { mois: "Jan", marge: 1200000 },
  { mois: "Fév", marge: 1450000 },
  { mois: "Mar", marge: 980000 },
  { mois: "Avr", marge: 1680000 },
  { mois: "Mai", marge: 1520000 },
  { mois: "Jun", marge: 1890000 },
];

const Dashboard = () => {
  const { items: stocks } = useLocalStorage<any>("depot-stocks", []);
  const { items: credits } = useLocalStorage<any>("depot-credits", []);
  const { items: depenses } = useLocalStorage<any>("depot-depenses", []);
  const { items: ventes } = useLocalStorage<any>("depot-ventes", []);

  const totalVentes = ventes.reduce((acc: number, v: any) => acc + (v.sortieVente || 0) * (v.prixUnit || 0), 0);
  const stocksCritiques = stocks.filter((s: any) => (s.stockDepart + s.entrees - s.sorties) <= s.seuil).length;
  const totalCreances = credits.reduce((acc: number, c: any) => acc + ((c.montant || 0) - (c.rembourse || 0)), 0);
  const totalDepenses = depenses.reduce((acc: number, d: any) => acc + (d.montant || 0), 0);

  const stats = [
    {
      label: "Chiffre d'Affaires",
      value: totalVentes > 0 ? totalVentes.toLocaleString("fr-FR") : "3 910 000",
      unit: "FCFA",
      change: "+12.5%",
      trend: "up" as const,
      icon: TrendingUp,
    },
    {
      label: "Stock Critique",
      value: stocksCritiques > 0 ? String(stocksCritiques) : "7",
      unit: "produits",
      change: "-2",
      trend: "down" as const,
      icon: Package,
    },
    {
      label: "Crédits en Cours",
      value: totalCreances > 0 ? totalCreances.toLocaleString("fr-FR") : "1 250 000",
      unit: "FCFA",
      change: "+180 000",
      trend: "up" as const,
      icon: CreditCard,
    },
    {
      label: "Dépenses du Jour",
      value: totalDepenses > 0 ? totalDepenses.toLocaleString("fr-FR") : "285 000",
      unit: "FCFA",
      change: "-5.2%",
      trend: "down" as const,
      icon: Wallet,
    },
  ];

  const recentSales = [
    { client: "Client Direct", produit: "Bock 66 x24", montant: "72 000", heure: "14:32" },
    { client: "Bar Le Soleil", produit: "Castel 33 x48", montant: "144 000", heure: "13:15" },
    { client: "Maquis Chez Jo", produit: "Beaufort 50 x12", montant: "42 000", heure: "11:45" },
    { client: "Restaurant LUX", produit: "Coca 33 x24", montant: "36 000", heure: "10:20" },
    { client: "Client Direct", produit: "Pack d'eau x10", montant: "25 000", heure: "09:50" },
  ];

  const stockCritique = stocks.length > 0
    ? stocks.filter((s: any) => (s.stockDepart + s.entrees - s.sorties) <= s.seuil).slice(0, 4).map((s: any) => ({
        produit: s.nom, stock: s.stockDepart + s.entrees - s.sorties, seuil: s.seuil,
      }))
    : [
        { produit: "Heineken 33", stock: 12, seuil: 24 },
        { produit: "Coca 50", stock: 8, seuil: 20 },
        { produit: "Doppel Energie", stock: 5, seuil: 15 },
        { produit: "Vin importé", stock: 3, seuil: 10 },
      ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Tableau de Bord</h1>
        <p className="page-subtitle">Vue d'ensemble de l'activité du dépôt</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="stat-label">{stat.label}</p>
                <p className="stat-value mt-2">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.unit}</p>
              </div>
              <div className="p-2 rounded-md bg-secondary">
                <stat.icon size={16} className="text-foreground" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs">
              {stat.trend === "up" ? <ArrowUpRight size={12} className="text-success" /> : <ArrowDownRight size={12} className="text-destructive" />}
              <span className={stat.trend === "up" ? "text-success" : "text-destructive"}>{stat.change}</span>
              <span className="text-muted-foreground ml-1">vs hier</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="stat-card">
          <h3 className="text-sm font-medium text-foreground mb-4">Ventes vs Achats — Semaine</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 90%)" />
                <XAxis dataKey="jour" tick={{ fontSize: 12 }} stroke="hsl(0 0% 60%)" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(0 0% 60%)" tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip formatter={(value: number) => `${value.toLocaleString("fr-FR")} FCFA`} contentStyle={{ fontSize: 12, borderRadius: 4, border: "1px solid hsl(0 0% 88%)" }} />
                <Bar dataKey="ventes" fill="hsl(0 0% 15%)" radius={[2, 2, 0, 0]} name="Ventes" />
                <Bar dataKey="achats" fill="hsl(0 0% 75%)" radius={[2, 2, 0, 0]} name="Achats" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="stat-card">
          <h3 className="text-sm font-medium text-foreground mb-4">Évolution des Marges — 6 mois</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={marginData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 90%)" />
                <XAxis dataKey="mois" tick={{ fontSize: 12 }} stroke="hsl(0 0% 60%)" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(0 0% 60%)" tickFormatter={(v) => `${v / 1000000}M`} />
                <Tooltip formatter={(value: number) => `${value.toLocaleString("fr-FR")} FCFA`} contentStyle={{ fontSize: 12, borderRadius: 4, border: "1px solid hsl(0 0% 88%)" }} />
                <Line type="monotone" dataKey="marge" stroke="hsl(0 0% 10%)" strokeWidth={2} dot={{ r: 3 }} name="Marge" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="stat-card">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={14} />
            <h3 className="text-sm font-medium text-foreground">Dernières Ventes</h3>
          </div>
          <table className="data-table">
            <thead><tr><th>Client</th><th>Produit</th><th>Montant</th><th>Heure</th></tr></thead>
            <tbody>
              {recentSales.map((s, i) => (
                <tr key={i}>
                  <td className="font-medium">{s.client}</td>
                  <td>{s.produit}</td>
                  <td>{s.montant} F</td>
                  <td className="text-muted-foreground">{s.heure}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="stat-card">
          <div className="flex items-center gap-2 mb-4">
            <Package size={14} />
            <h3 className="text-sm font-medium text-foreground">Stock Critique</h3>
          </div>
          <table className="data-table">
            <thead><tr><th>Produit</th><th>Stock Actuel</th><th>Seuil</th><th>Statut</th></tr></thead>
            <tbody>
              {stockCritique.map((s: any, i: number) => (
                <tr key={i}>
                  <td className="font-medium">{s.produit}</td>
                  <td>{s.stock}</td>
                  <td>{s.seuil}</td>
                  <td><span className="module-badge bg-destructive/10 text-destructive">Bas</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

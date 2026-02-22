import { motion } from "framer-motion";
import { TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const margesParProduit = [
  { produit: "Bock 66", prixAchat: 2200, prixVente: 3000, qteVendue: 65, marge: 800 * 65 },
  { produit: "Castel 33", prixAchat: 1800, prixVente: 2500, qteVendue: 85, marge: 700 * 85 },
  { produit: "Beaufort 50", prixAchat: 2500, prixVente: 3500, qteVendue: 42, marge: 1000 * 42 },
  { produit: "Heineken 33", prixAchat: 3200, prixVente: 4000, qteVendue: 12, marge: 800 * 12 },
  { produit: "Coca 33", prixAchat: 1000, prixVente: 1500, qteVendue: 60, marge: 500 * 60 },
  { produit: "Orangina 33", prixAchat: 1200, prixVente: 1800, qteVendue: 30, marge: 600 * 30 },
  { produit: "Vin 50", prixAchat: 1800, prixVente: 2500, qteVendue: 20, marge: 700 * 20 },
  { produit: "Ivoire Black", prixAchat: 2200, prixVente: 3000, qteVendue: 25, marge: 800 * 25 },
];

const chartData = margesParProduit.map((p) => ({
  name: p.produit,
  marge: p.marge,
}));

const totalMarge = margesParProduit.reduce((acc, p) => acc + p.marge, 0);

const Marges = () => (
  <div className="page-container">
    <div className="page-header">
      <h1 className="page-title">Gestion des Marges</h1>
      <p className="page-subtitle">Analyse de rentabilité par produit et par période</p>
    </div>

    {/* KPIs */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {[
        { label: "Marge Brute du Jour", value: totalMarge, change: "+8.3%" },
        { label: "Marge Moyenne / Produit", value: Math.round(totalMarge / margesParProduit.length), change: "+2.1%" },
        { label: "Produit le Plus Rentable", value: "Castel 33", isText: true },
      ].map((stat, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="stat-card">
          <p className="stat-label">{stat.label}</p>
          <p className="stat-value mt-2">
            {stat.isText ? stat.value : `${(stat.value as number).toLocaleString("fr-FR")} F`}
          </p>
          {stat.change && (
            <div className="flex items-center gap-1 mt-2 text-xs text-success">
              <ArrowUpRight size={12} />
              {stat.change}
            </div>
          )}
        </motion.div>
      ))}
    </div>

    {/* Chart */}
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="stat-card mb-6">
      <h3 className="text-sm font-medium mb-4">Marge par Produit</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 90%)" />
            <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(0 0% 60%)" tickFormatter={(v) => `${v / 1000}k`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(0 0% 60%)" width={90} />
            <Tooltip formatter={(v: number) => `${v.toLocaleString("fr-FR")} FCFA`} contentStyle={{ fontSize: 12, borderRadius: 4, border: "1px solid hsl(0 0% 88%)" }} />
            <Bar dataKey="marge" fill="hsl(0 0% 15%)" radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>

    {/* Table */}
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="stat-card overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th>Produit</th>
            <th className="text-right">Prix Achat</th>
            <th className="text-right">Prix Vente</th>
            <th className="text-right">Marge Unit.</th>
            <th className="text-right">Qté Vendue</th>
            <th className="text-right">Marge Totale</th>
            <th className="text-right">%</th>
          </tr>
        </thead>
        <tbody>
          {margesParProduit.map((p, i) => (
            <tr key={i}>
              <td className="font-medium">{p.produit}</td>
              <td className="text-right">{p.prixAchat.toLocaleString("fr-FR")}</td>
              <td className="text-right">{p.prixVente.toLocaleString("fr-FR")}</td>
              <td className="text-right">{(p.prixVente - p.prixAchat).toLocaleString("fr-FR")}</td>
              <td className="text-right">{p.qteVendue}</td>
              <td className="text-right font-medium">{p.marge.toLocaleString("fr-FR")} F</td>
              <td className="text-right">{((p.marge / totalMarge) * 100).toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-foreground/20">
            <td colSpan={5} className="text-right font-medium py-3 px-4">TOTAL</td>
            <td className="text-right font-bold py-3 px-4">{totalMarge.toLocaleString("fr-FR")} F</td>
            <td className="text-right font-bold py-3 px-4">100%</td>
          </tr>
        </tfoot>
      </table>
    </motion.div>
  </div>
);

export default Marges;

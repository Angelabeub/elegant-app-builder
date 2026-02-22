import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ArrowUpRight, Plus, Pencil, Trash2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import FormModal, { FormField, FormInput, FormActions, DeleteConfirm } from "@/components/FormModal";
import { toast } from "sonner";

interface Marge {
  id: number;
  produit: string;
  prixAchat: number;
  prixVente: number;
  qteVendue: number;
}

const defaultMarges: Marge[] = [
  { id: 1, produit: "Bock 66", prixAchat: 2200, prixVente: 3000, qteVendue: 65 },
  { id: 2, produit: "Castel 33", prixAchat: 1800, prixVente: 2500, qteVendue: 85 },
  { id: 3, produit: "Beaufort 50", prixAchat: 2500, prixVente: 3500, qteVendue: 42 },
  { id: 4, produit: "Heineken 33", prixAchat: 3200, prixVente: 4000, qteVendue: 12 },
  { id: 5, produit: "Coca 33", prixAchat: 1000, prixVente: 1500, qteVendue: 60 },
  { id: 6, produit: "Orangina 33", prixAchat: 1200, prixVente: 1800, qteVendue: 30 },
  { id: 7, produit: "Vin 50", prixAchat: 1800, prixVente: 2500, qteVendue: 20 },
  { id: 8, produit: "Ivoire Black", prixAchat: 2200, prixVente: 3000, qteVendue: 25 },
];

const emptyMarge = (): Marge => ({
  id: Date.now(), produit: "", prixAchat: 0, prixVente: 0, qteVendue: 0,
});

const Marges = () => {
  const { items: marges, add, update, remove } = useLocalStorage<Marge>("depot-marges", defaultMarges);
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form, setForm] = useState<Marge>(emptyMarge());
  const [deleteTarget, setDeleteTarget] = useState<{ index: number; name: string } | null>(null);

  const margesCalc = marges.map((m) => ({ ...m, marge: (m.prixVente - m.prixAchat) * m.qteVendue }));
  const totalMarge = margesCalc.reduce((acc, m) => acc + m.marge, 0);
  const chartData = margesCalc.map((m) => ({ name: m.produit, marge: m.marge }));
  const bestProduct = margesCalc.length > 0 ? margesCalc.reduce((a, b) => (a.marge > b.marge ? a : b)).produit : "—";

  const openAdd = () => { setForm(emptyMarge()); setEditIndex(null); setModalOpen(true); };
  const openEdit = (i: number) => { setForm({ ...marges[i] }); setEditIndex(i); setModalOpen(true); };

  const handleSave = () => {
    if (!form.produit.trim()) { toast.error("Le produit est requis"); return; }
    if (editIndex !== null) { update(editIndex, form); toast.success("Marge modifiée"); }
    else { add(form); toast.success("Marge ajoutée"); }
    setModalOpen(false);
  };

  return (
    <div className="page-container">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Gestion des Marges</h1>
          <p className="page-subtitle">Analyse de rentabilité par produit et par période</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus size={14} /> Nouveau Produit
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Marge Brute du Jour", value: `${totalMarge.toLocaleString("fr-FR")} F`, change: "+8.3%" },
          { label: "Marge Moyenne / Produit", value: `${marges.length > 0 ? Math.round(totalMarge / marges.length).toLocaleString("fr-FR") : 0} F`, change: "+2.1%" },
          { label: "Produit le Plus Rentable", value: bestProduct, isText: true },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="stat-card">
            <p className="stat-label">{stat.label}</p>
            <p className="stat-value mt-2">{stat.value}</p>
            {stat.change && (
              <div className="flex items-center gap-1 mt-2 text-xs text-success">
                <ArrowUpRight size={12} />{stat.change}
              </div>
            )}
          </motion.div>
        ))}
      </div>

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
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {margesCalc.map((p, i) => (
              <tr key={p.id}>
                <td className="font-medium">{p.produit}</td>
                <td className="text-right">{p.prixAchat.toLocaleString("fr-FR")}</td>
                <td className="text-right">{p.prixVente.toLocaleString("fr-FR")}</td>
                <td className="text-right">{(p.prixVente - p.prixAchat).toLocaleString("fr-FR")}</td>
                <td className="text-right">{p.qteVendue}</td>
                <td className="text-right font-medium">{p.marge.toLocaleString("fr-FR")} F</td>
                <td className="text-right">{totalMarge > 0 ? ((p.marge / totalMarge) * 100).toFixed(1) : 0}%</td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(i)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"><Pencil size={13} /></button>
                    <button onClick={() => setDeleteTarget({ index: i, name: p.produit })} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-foreground/20">
              <td colSpan={5} className="text-right font-medium py-3 px-4">TOTAL</td>
              <td className="text-right font-bold py-3 px-4">{totalMarge.toLocaleString("fr-FR")} F</td>
              <td className="text-right font-bold py-3 px-4">100%</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </motion.div>

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={editIndex !== null ? "Modifier le Produit" : "Nouveau Produit"}>
        <FormField label="Produit"><FormInput value={form.produit} onChange={(v) => setForm({ ...form, produit: v })} placeholder="Ex: Bock 66" /></FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Prix Achat (FCFA)"><FormInput type="number" value={form.prixAchat} onChange={(v) => setForm({ ...form, prixAchat: +v })} /></FormField>
          <FormField label="Prix Vente (FCFA)"><FormInput type="number" value={form.prixVente} onChange={(v) => setForm({ ...form, prixVente: +v })} /></FormField>
        </div>
        <FormField label="Quantité Vendue"><FormInput type="number" value={form.qteVendue} onChange={(v) => setForm({ ...form, qteVendue: +v })} /></FormField>
        <FormActions onCancel={() => setModalOpen(false)} onSubmit={handleSave} />
      </FormModal>

      <DeleteConfirm open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => { if (deleteTarget) { remove(deleteTarget.index); toast.success("Produit supprimé"); } }} itemName={deleteTarget?.name || ""} />
    </div>
  );
};

export default Marges;

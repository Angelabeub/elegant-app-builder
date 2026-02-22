import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Plus, FileCheck, Clock, Pencil, Trash2 } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import FormModal, { FormField, FormInput, FormSelect, FormActions, DeleteConfirm } from "@/components/FormModal";
import { toast } from "sonner";

interface Achat {
  id: string;
  fournisseur: string;
  depot: string;
  produits: string;
  montant: number;
  date: string;
  statut: string;
}

const defaultAchats: Achat[] = [
  { id: "ACH-2026-00012", fournisseur: "SOLIBRA", depot: "SOMODIS", produits: "Bock 66 x48, Castel 33 x96", montant: 345600, date: "2026-02-22", statut: "Réceptionné" },
  { id: "ACH-2026-00011", fournisseur: "BRASSIVOIRE", depot: "PIEUVRE", produits: "Ivoire Black x24, Despe x24", montant: 168000, date: "2026-02-21", statut: "Réceptionné" },
  { id: "ACH-2026-00010", fournisseur: "COCACOLA", depot: "COCACOLA", produits: "Coca 33 x48, Coca 50 x24", montant: 120000, date: "2026-02-21", statut: "En attente" },
  { id: "ACH-2026-00009", fournisseur: "SOLIBRA", depot: "CTOP", produits: "Beaufort 50 x24, Vin 50 x12", montant: 105600, date: "2026-02-20", statut: "Réceptionné" },
  { id: "ACH-2026-00008", fournisseur: "Autres", depot: "LOOKNAN", produits: "Guiness 33 x24, Budweiser x12", montant: 96000, date: "2026-02-19", statut: "Réceptionné" },
];

const FOURNISSEURS = ["SOLIBRA", "BRASSIVOIRE", "COCACOLA", "Autres"];
const DEPOTS = ["SOMODIS", "PIEUVRE", "COCACOLA", "CTOP", "LOOKNAN"];
const STATUTS = ["En attente", "Réceptionné"];

const emptyAchat = (): Achat => ({
  id: `ACH-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`, fournisseur: FOURNISSEURS[0], depot: DEPOTS[0],
  produits: "", montant: 0, date: new Date().toISOString().split("T")[0], statut: "En attente",
});

const Achats = () => {
  const { items: achats, add, update, remove } = useLocalStorage<Achat>("depot-achats", defaultAchats);
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form, setForm] = useState<Achat>(emptyAchat());
  const [deleteTarget, setDeleteTarget] = useState<{ index: number; name: string } | null>(null);

  const totalAchats = achats.reduce((acc, a) => acc + a.montant, 0);

  const openAdd = () => { setForm(emptyAchat()); setEditIndex(null); setModalOpen(true); };
  const openEdit = (i: number) => { setForm({ ...achats[i] }); setEditIndex(i); setModalOpen(true); };

  const handleSave = () => {
    if (!form.produits.trim()) { toast.error("Les produits sont requis"); return; }
    if (editIndex !== null) { update(editIndex, form); toast.success("Achat modifié"); }
    else { add(form); toast.success("Achat ajouté"); }
    setModalOpen(false);
  };

  return (
    <div className="page-container">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Gestion des Achats</h1>
          <p className="page-subtitle">Bons de commande et réception de marchandises</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus size={14} /> Nouveau Bon de Commande
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Achats (mois)", value: `${totalAchats.toLocaleString("fr-FR")} F`, icon: ShoppingCart },
          { label: "Commandes Réceptionnées", value: achats.filter((a) => a.statut === "Réceptionné").length, icon: FileCheck },
          { label: "En Attente", value: achats.filter((a) => a.statut === "En attente").length, icon: Clock },
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
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {achats.map((a, i) => (
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
                <td className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(i)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"><Pencil size={13} /></button>
                    <button onClick={() => setDeleteTarget({ index: i, name: a.id })} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={editIndex !== null ? "Modifier l'Achat" : "Nouveau Bon de Commande"}>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Fournisseur"><FormSelect value={form.fournisseur} onChange={(v) => setForm({ ...form, fournisseur: v })} options={FOURNISSEURS} /></FormField>
          <FormField label="Dépôt"><FormSelect value={form.depot} onChange={(v) => setForm({ ...form, depot: v })} options={DEPOTS} /></FormField>
        </div>
        <FormField label="Produits"><FormInput value={form.produits} onChange={(v) => setForm({ ...form, produits: v })} placeholder="Ex: Bock 66 x48, Castel 33 x96" /></FormField>
        <div className="grid grid-cols-3 gap-4">
          <FormField label="Montant (FCFA)"><FormInput type="number" value={form.montant} onChange={(v) => setForm({ ...form, montant: +v })} /></FormField>
          <FormField label="Date"><FormInput type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} /></FormField>
          <FormField label="Statut"><FormSelect value={form.statut} onChange={(v) => setForm({ ...form, statut: v })} options={STATUTS} /></FormField>
        </div>
        <FormActions onCancel={() => setModalOpen(false)} onSubmit={handleSave} />
      </FormModal>

      <DeleteConfirm open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => { if (deleteTarget) { remove(deleteTarget.index); toast.success("Achat supprimé"); } }} itemName={deleteTarget?.name || ""} />
    </div>
  );
};

export default Achats;

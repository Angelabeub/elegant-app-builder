import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Plus, Calendar, CheckCircle, Clock, Pencil, Trash2 } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import FormModal, { FormField, FormInput, FormSelect, FormActions, DeleteConfirm } from "@/components/FormModal";
import { toast } from "sonner";

interface Partenaire {
  id: number;
  nom: string;
  type: string;
  montant: number;
  echeance: string;
  statut: string;
}

const defaultPartenaires: Partenaire[] = [
  { id: 1, nom: "Direction Générale des Impôts", type: "Impôts", montant: 350000, echeance: "2026-03-15", statut: "À payer" },
  { id: 2, nom: "CNPS (Cotisations)", type: "Taxes Sociales", montant: 180000, echeance: "2026-02-28", statut: "À payer" },
  { id: 3, nom: "Mairie - Patente", type: "Patente", montant: 250000, echeance: "2026-01-31", statut: "Payé" },
  { id: 4, nom: "TVA Mensuelle", type: "TVA", montant: 420000, echeance: "2026-03-10", statut: "À payer" },
  { id: 5, nom: "Taxe Communale", type: "Taxes Locales", montant: 75000, echeance: "2026-02-15", statut: "Payé" },
];

const TYPES = ["Impôts", "Taxes Sociales", "Patente", "TVA", "Taxes Locales"];
const STATUTS = ["À payer", "Payé"];

const emptyPartenaire = (): Partenaire => ({
  id: Date.now(), nom: "", type: TYPES[0], montant: 0, echeance: new Date().toISOString().split("T")[0], statut: "À payer",
});

const Partenaires = () => {
  const { items: partenaires, add, update, remove } = useLocalStorage<Partenaire>("depot-partenaires", defaultPartenaires);
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form, setForm] = useState<Partenaire>(emptyPartenaire());
  const [deleteTarget, setDeleteTarget] = useState<{ index: number; name: string } | null>(null);

  const totalAPayer = partenaires.filter((p) => p.statut === "À payer").reduce((a, p) => a + p.montant, 0);

  const openAdd = () => { setForm(emptyPartenaire()); setEditIndex(null); setModalOpen(true); };
  const openEdit = (i: number) => { setForm({ ...partenaires[i] }); setEditIndex(i); setModalOpen(true); };

  const handleSave = () => {
    if (!form.nom.trim()) { toast.error("Le nom est requis"); return; }
    if (editIndex !== null) { update(editIndex, form); toast.success("Partenaire modifié"); }
    else { add(form); toast.success("Partenaire ajouté"); }
    setModalOpen(false);
  };

  return (
    <div className="page-container">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Partenaires & Taxes</h1>
          <p className="page-subtitle">Suivi des obligations fiscales et partenariats</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus size={14} /> Nouveau Partenaire
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total À Payer", value: `${totalAPayer.toLocaleString("fr-FR")} F` },
          { label: "Échéances Proches", value: partenaires.filter((p) => p.statut === "À payer").length },
          { label: "Paiements Effectués", value: partenaires.filter((p) => p.statut === "Payé").length },
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
              <th>Partenaire / Organisme</th>
              <th>Type</th>
              <th className="text-right">Montant</th>
              <th>Échéance</th>
              <th>Statut</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {partenaires.map((p, i) => (
              <tr key={p.id}>
                <td className="font-medium">{p.nom}</td>
                <td><span className="module-badge">{p.type}</span></td>
                <td className="text-right">{p.montant.toLocaleString("fr-FR")} F</td>
                <td>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Calendar size={10} />
                    {new Date(p.echeance).toLocaleDateString("fr-FR")}
                  </span>
                </td>
                <td>
                  <span className={`module-badge ${p.statut === "Payé" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                    {p.statut === "Payé" ? <CheckCircle size={10} /> : <Clock size={10} />}
                    {p.statut}
                  </span>
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(i)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"><Pencil size={13} /></button>
                    <button onClick={() => setDeleteTarget({ index: i, name: p.nom })} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={editIndex !== null ? "Modifier le Partenaire" : "Nouveau Partenaire"}>
        <FormField label="Nom / Organisme"><FormInput value={form.nom} onChange={(v) => setForm({ ...form, nom: v })} placeholder="Ex: Direction Générale des Impôts" /></FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Type"><FormSelect value={form.type} onChange={(v) => setForm({ ...form, type: v })} options={TYPES} /></FormField>
          <FormField label="Statut"><FormSelect value={form.statut} onChange={(v) => setForm({ ...form, statut: v })} options={STATUTS} /></FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Montant (FCFA)"><FormInput type="number" value={form.montant} onChange={(v) => setForm({ ...form, montant: +v })} /></FormField>
          <FormField label="Échéance"><FormInput type="date" value={form.echeance} onChange={(v) => setForm({ ...form, echeance: v })} /></FormField>
        </div>
        <FormActions onCancel={() => setModalOpen(false)} onSubmit={handleSave} />
      </FormModal>

      <DeleteConfirm open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => { if (deleteTarget) { remove(deleteTarget.index); toast.success("Partenaire supprimé"); } }} itemName={deleteTarget?.name || ""} />
    </div>
  );
};

export default Partenaires;

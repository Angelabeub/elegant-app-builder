import { useState } from "react";
import { motion } from "framer-motion";
import { Box, ArrowLeftRight, Plus, Pencil, Trash2 } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import FormModal, { FormField, FormInput, FormSelect, FormActions, DeleteConfirm } from "@/components/FormModal";
import { toast } from "sonner";

interface Casier {
  id: number;
  fournisseur: string;
  type: string;
  recus: number;
  retournes: number;
  disponibles: number;
  pleins: number;
  vides: number;
}

const defaultCasiers: Casier[] = [
  { id: 1, fournisseur: "SOLIBRA", type: "33cl (24 trous)", recus: 120, retournes: 95, disponibles: 25, pleins: 18, vides: 7 },
  { id: 2, fournisseur: "SOLIBRA", type: "50cl (12 trous)", recus: 80, retournes: 65, disponibles: 15, pleins: 10, vides: 5 },
  { id: 3, fournisseur: "SOLIBRA", type: "50cl (20 trous)", recus: 50, retournes: 42, disponibles: 8, pleins: 5, vides: 3 },
  { id: 4, fournisseur: "SOLIBRA", type: "100cl (12 trous)", recus: 30, retournes: 28, disponibles: 2, pleins: 1, vides: 1 },
  { id: 5, fournisseur: "BRASSIVOIRE", type: "33cl (24 trous)", recus: 60, retournes: 50, disponibles: 10, pleins: 6, vides: 4 },
  { id: 6, fournisseur: "BRASSIVOIRE", type: "50cl (20 trous)", recus: 40, retournes: 35, disponibles: 5, pleins: 3, vides: 2 },
  { id: 7, fournisseur: "COCACOLA", type: "33cl (24 trous)", recus: 45, retournes: 40, disponibles: 5, pleins: 3, vides: 2 },
];

const FOURNISSEURS = ["SOLIBRA", "BRASSIVOIRE", "COCACOLA"];
const TYPES = ["33cl (24 trous)", "50cl (12 trous)", "50cl (20 trous)", "100cl (12 trous)"];

const emptyCasier = (): Casier => ({
  id: Date.now(), fournisseur: FOURNISSEURS[0], type: TYPES[0], recus: 0, retournes: 0, disponibles: 0, pleins: 0, vides: 0,
});

const Casiers = () => {
  const { items: casiers, add, update, remove } = useLocalStorage<Casier>("depot-casiers", defaultCasiers);
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form, setForm] = useState<Casier>(emptyCasier());
  const [deleteTarget, setDeleteTarget] = useState<{ index: number; name: string } | null>(null);

  const openAdd = () => { setForm(emptyCasier()); setEditIndex(null); setModalOpen(true); };
  const openEdit = (i: number) => { setForm({ ...casiers[i] }); setEditIndex(i); setModalOpen(true); };

  const handleSave = () => {
    if (editIndex !== null) { update(editIndex, form); toast.success("Casier modifié"); }
    else { add(form); toast.success("Casier ajouté"); }
    setModalOpen(false);
  };

  return (
    <div className="page-container">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Gestion des Casiers</h1>
          <p className="page-subtitle">Suivi des casiers par fournisseur et par type</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus size={14} /> Nouveau Casier
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Casiers Disponibles", value: casiers.reduce((a, c) => a + c.disponibles, 0) },
          { label: "Casiers Pleins", value: casiers.reduce((a, c) => a + c.pleins, 0) },
          { label: "Casiers Non Retournés", value: casiers.reduce((a, c) => a + (c.recus - c.retournes), 0) },
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
              <th>Fournisseur</th>
              <th>Type Casier</th>
              <th className="text-right">Reçus</th>
              <th className="text-right">Retournés</th>
              <th className="text-right">Disponibles</th>
              <th className="text-right">Pleins</th>
              <th className="text-right">Vides</th>
              <th>Statut</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {casiers.map((c, i) => (
              <tr key={c.id}>
                <td className="font-medium">{c.fournisseur}</td>
                <td>{c.type}</td>
                <td className="text-right">{c.recus}</td>
                <td className="text-right">{c.retournes}</td>
                <td className="text-right font-medium">{c.disponibles}</td>
                <td className="text-right">{c.pleins}</td>
                <td className="text-right">{c.vides}</td>
                <td>
                  {c.recus - c.retournes > 10 ? (
                    <span className="module-badge bg-destructive/10 text-destructive">À retourner</span>
                  ) : (
                    <span className="module-badge bg-success/10 text-success">OK</span>
                  )}
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(i)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"><Pencil size={13} /></button>
                    <button onClick={() => setDeleteTarget({ index: i, name: `${c.fournisseur} - ${c.type}` })} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={editIndex !== null ? "Modifier le Casier" : "Nouveau Casier"}>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Fournisseur"><FormSelect value={form.fournisseur} onChange={(v) => setForm({ ...form, fournisseur: v })} options={FOURNISSEURS} /></FormField>
          <FormField label="Type"><FormSelect value={form.type} onChange={(v) => setForm({ ...form, type: v })} options={TYPES} /></FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Reçus"><FormInput type="number" value={form.recus} onChange={(v) => setForm({ ...form, recus: +v })} /></FormField>
          <FormField label="Retournés"><FormInput type="number" value={form.retournes} onChange={(v) => setForm({ ...form, retournes: +v })} /></FormField>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormField label="Disponibles"><FormInput type="number" value={form.disponibles} onChange={(v) => setForm({ ...form, disponibles: +v })} /></FormField>
          <FormField label="Pleins"><FormInput type="number" value={form.pleins} onChange={(v) => setForm({ ...form, pleins: +v })} /></FormField>
          <FormField label="Vides"><FormInput type="number" value={form.vides} onChange={(v) => setForm({ ...form, vides: +v })} /></FormField>
        </div>
        <FormActions onCancel={() => setModalOpen(false)} onSubmit={handleSave} />
      </FormModal>

      <DeleteConfirm open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => { if (deleteTarget) { remove(deleteTarget.index); toast.success("Casier supprimé"); } }} itemName={deleteTarget?.name || ""} />
    </div>
  );
};

export default Casiers;

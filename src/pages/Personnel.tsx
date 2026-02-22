import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Plus, UserCheck, Banknote, Pencil, Trash2 } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import FormModal, { FormField, FormInput, FormSelect, FormActions, DeleteConfirm } from "@/components/FormModal";
import { toast } from "sonner";

interface Employe {
  id: number;
  nom: string;
  poste: string;
  telephone: string;
  salaire: number;
  avance: number;
  statut: string;
}

const defaultPersonnel: Employe[] = [
  { id: 1, nom: "Konan Yao", poste: "Caissier", telephone: "07 11 22 33", salaire: 120000, avance: 30000, statut: "Actif" },
  { id: 2, nom: "Traoré Issa", poste: "Livreur", telephone: "05 44 55 66", salaire: 100000, avance: 0, statut: "Actif" },
  { id: 3, nom: "N'Guessan Aya", poste: "Vendeuse", telephone: "01 77 88 99", salaire: 95000, avance: 15000, statut: "Actif" },
  { id: 4, nom: "Kouamé Serge", poste: "Magasinier", telephone: "07 22 33 44", salaire: 110000, avance: 0, statut: "Actif" },
  { id: 5, nom: "Diomandé Ali", poste: "Aide", telephone: "05 66 77 88", salaire: 75000, avance: 20000, statut: "Congé" },
];

const POSTES = ["Caissier", "Livreur", "Vendeuse", "Magasinier", "Aide"];
const STATUTS = ["Actif", "Congé", "Suspendu"];

const emptyEmploye = (): Employe => ({
  id: Date.now(), nom: "", poste: POSTES[0], telephone: "", salaire: 0, avance: 0, statut: "Actif",
});

const Personnel = () => {
  const { items: personnel, add, update, remove } = useLocalStorage<Employe>("depot-personnel", defaultPersonnel);
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form, setForm] = useState<Employe>(emptyEmploye());
  const [deleteTarget, setDeleteTarget] = useState<{ index: number; name: string } | null>(null);

  const totalSalaires = personnel.reduce((a, p) => a + p.salaire, 0);
  const totalAvances = personnel.reduce((a, p) => a + p.avance, 0);

  const openAdd = () => { setForm(emptyEmploye()); setEditIndex(null); setModalOpen(true); };
  const openEdit = (i: number) => { setForm({ ...personnel[i] }); setEditIndex(i); setModalOpen(true); };

  const handleSave = () => {
    if (!form.nom.trim()) { toast.error("Le nom est requis"); return; }
    if (editIndex !== null) { update(editIndex, form); toast.success("Employé modifié"); }
    else { add(form); toast.success("Employé ajouté"); }
    setModalOpen(false);
  };

  return (
    <div className="page-container">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Gestion du Personnel</h1>
          <p className="page-subtitle">Fiches employés, paie et avances sur salaire</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus size={14} /> Nouvel Employé
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Effectif Total", value: personnel.length },
          { label: "Actifs", value: personnel.filter((p) => p.statut === "Actif").length },
          { label: "Masse Salariale", value: `${totalSalaires.toLocaleString("fr-FR")} F` },
          { label: "Avances en Cours", value: `${totalAvances.toLocaleString("fr-FR")} F` },
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
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {personnel.map((p, i) => (
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

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={editIndex !== null ? "Modifier l'Employé" : "Nouvel Employé"}>
        <FormField label="Nom complet"><FormInput value={form.nom} onChange={(v) => setForm({ ...form, nom: v })} placeholder="Ex: Konan Yao" /></FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Poste"><FormSelect value={form.poste} onChange={(v) => setForm({ ...form, poste: v })} options={POSTES} /></FormField>
          <FormField label="Statut"><FormSelect value={form.statut} onChange={(v) => setForm({ ...form, statut: v })} options={STATUTS} /></FormField>
        </div>
        <FormField label="Téléphone"><FormInput value={form.telephone} onChange={(v) => setForm({ ...form, telephone: v })} placeholder="07 XX XX XX" /></FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Salaire (FCFA)"><FormInput type="number" value={form.salaire} onChange={(v) => setForm({ ...form, salaire: +v })} /></FormField>
          <FormField label="Avance (FCFA)"><FormInput type="number" value={form.avance} onChange={(v) => setForm({ ...form, avance: +v })} /></FormField>
        </div>
        <FormActions onCancel={() => setModalOpen(false)} onSubmit={handleSave} />
      </FormModal>

      <DeleteConfirm open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => { if (deleteTarget) { remove(deleteTarget.index); toast.success("Employé supprimé"); } }} itemName={deleteTarget?.name || ""} />
    </div>
  );
};

export default Personnel;

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Search, Phone, AlertCircle, CheckCircle, Plus, Pencil, Trash2 } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import FormModal, { FormField, FormInput, FormSelect, FormActions, DeleteConfirm } from "@/components/FormModal";
import { toast } from "sonner";

interface Credit {
  id: number;
  client: string;
  telephone: string;
  montant: number;
  date: string;
  rembourse: number;
  statut: string;
}

const defaultCredits: Credit[] = [
  { id: 1, client: "Koné Amadou", telephone: "07 12 34 56", montant: 150000, date: "2026-02-20", rembourse: 50000, statut: "En cours" },
  { id: 2, client: "Touré Fatou", telephone: "05 98 76 54", montant: 80000, date: "2026-02-19", rembourse: 80000, statut: "Soldé" },
  { id: 3, client: "Diallo Ibrahim", telephone: "01 23 45 67", montant: 320000, date: "2026-02-18", rembourse: 100000, statut: "En cours" },
  { id: 4, client: "Bamba Sékou", telephone: "07 65 43 21", montant: 45000, date: "2026-02-17", rembourse: 0, statut: "En retard" },
  { id: 5, client: "Ouattara Marie", telephone: "05 11 22 33", montant: 200000, date: "2026-02-15", rembourse: 200000, statut: "Soldé" },
  { id: 6, client: "Coulibaly Drissa", telephone: "07 44 55 66", montant: 175000, date: "2026-02-14", rembourse: 75000, statut: "En cours" },
  { id: 7, client: "Yao Jean", telephone: "01 77 88 99", montant: 280000, date: "2026-02-10", rembourse: 0, statut: "En retard" },
];

const STATUTS = ["En cours", "Soldé", "En retard"];

const emptyCredit = (): Credit => ({
  id: Date.now(), client: "", telephone: "", montant: 0, date: new Date().toISOString().split("T")[0], rembourse: 0, statut: "En cours",
});

const Credits = () => {
  const { items: credits, add, update, remove } = useLocalStorage<Credit>("depot-credits", defaultCredits);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form, setForm] = useState<Credit>(emptyCredit());
  const [deleteTarget, setDeleteTarget] = useState<{ index: number; name: string } | null>(null);

  const totalCreances = credits.reduce((acc, c) => acc + (c.montant - c.rembourse), 0);
  const enCours = credits.filter((c) => c.statut === "En cours").length;
  const enRetard = credits.filter((c) => c.statut === "En retard").length;

  const filtered = credits.filter(
    (c) => c.client.toLowerCase().includes(search.toLowerCase()) || c.telephone.includes(search)
  );

  const openAdd = () => { setForm(emptyCredit()); setEditIndex(null); setModalOpen(true); };
  const openEdit = (i: number) => { setForm({ ...credits[i] }); setEditIndex(i); setModalOpen(true); };

  const handleSave = () => {
    if (!form.client.trim()) { toast.error("Le nom du client est requis"); return; }
    if (editIndex !== null) { update(editIndex, form); toast.success("Crédit modifié"); }
    else { add(form); toast.success("Crédit ajouté"); }
    setModalOpen(false);
  };

  return (
    <div className="page-container">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Crédits Clients</h1>
          <p className="page-subtitle">Suivi des ventes à crédit et des remboursements</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus size={14} /> Nouveau Crédit
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Créances", value: `${totalCreances.toLocaleString("fr-FR")} F` },
          { label: "Crédits En Cours", value: enCours },
          { label: "Crédits En Retard", value: enRetard },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="stat-card">
            <p className="stat-label">{s.label}</p>
            <p className="stat-value mt-2">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="relative mb-4 max-w-md">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input type="text" placeholder="Rechercher par nom ou téléphone..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border border-input bg-background pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="stat-card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Téléphone</th>
              <th className="text-right">Montant</th>
              <th className="text-right">Remboursé</th>
              <th className="text-right">Solde</th>
              <th>Date</th>
              <th>Statut</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const realIndex = credits.indexOf(c);
              return (
                <tr key={c.id}>
                  <td className="font-medium">{c.client}</td>
                  <td><span className="flex items-center gap-1"><Phone size={10} className="text-muted-foreground" />{c.telephone}</span></td>
                  <td className="text-right">{c.montant.toLocaleString("fr-FR")} F</td>
                  <td className="text-right">{c.rembourse.toLocaleString("fr-FR")} F</td>
                  <td className="text-right font-medium">{(c.montant - c.rembourse).toLocaleString("fr-FR")} F</td>
                  <td className="text-muted-foreground">{new Date(c.date).toLocaleDateString("fr-FR")}</td>
                  <td>
                    <span className={`module-badge ${c.statut === "Soldé" ? "bg-success/10 text-success" : c.statut === "En retard" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}`}>
                      {c.statut === "Soldé" && <CheckCircle size={10} />}
                      {c.statut === "En retard" && <AlertCircle size={10} />}
                      {c.statut}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(realIndex)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"><Pencil size={13} /></button>
                      <button onClick={() => setDeleteTarget({ index: realIndex, name: c.client })} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={editIndex !== null ? "Modifier le Crédit" : "Nouveau Crédit"}>
        <FormField label="Client"><FormInput value={form.client} onChange={(v) => setForm({ ...form, client: v })} placeholder="Nom du client" /></FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Téléphone"><FormInput value={form.telephone} onChange={(v) => setForm({ ...form, telephone: v })} placeholder="07 XX XX XX" /></FormField>
          <FormField label="Date"><FormInput type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} /></FormField>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormField label="Montant (FCFA)"><FormInput type="number" value={form.montant} onChange={(v) => setForm({ ...form, montant: +v })} /></FormField>
          <FormField label="Remboursé"><FormInput type="number" value={form.rembourse} onChange={(v) => setForm({ ...form, rembourse: +v })} /></FormField>
          <FormField label="Statut"><FormSelect value={form.statut} onChange={(v) => setForm({ ...form, statut: v })} options={STATUTS} /></FormField>
        </div>
        <FormActions onCancel={() => setModalOpen(false)} onSubmit={handleSave} />
      </FormModal>

      <DeleteConfirm open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => { if (deleteTarget) { remove(deleteTarget.index); toast.success("Crédit supprimé"); } }} itemName={deleteTarget?.name || ""} />
    </div>
  );
};

export default Credits;

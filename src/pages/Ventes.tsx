import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Printer, Download, Calendar, Plus, Pencil, Trash2 } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import FormModal, { FormField, FormInput, FormActions, DeleteConfirm } from "@/components/FormModal";
import { toast } from "sonner";

interface LigneVente {
  id: number;
  produit: string;
  stockDepart: number;
  entree: number;
  sortieVente: number;
  prixUnit: number;
}

const defaultFiche: LigneVente[] = [
  { id: 1, produit: "Bock 66", stockDepart: 120, entree: 48, sortieVente: 65, prixUnit: 3000 },
  { id: 2, produit: "Castel 33", stockDepart: 200, entree: 0, sortieVente: 85, prixUnit: 2500 },
  { id: 3, produit: "Beaufort 50", stockDepart: 80, entree: 24, sortieVente: 42, prixUnit: 3500 },
  { id: 4, produit: "Heineken 33", stockDepart: 24, entree: 0, sortieVente: 12, prixUnit: 4000 },
  { id: 5, produit: "Coca 33", stockDepart: 96, entree: 48, sortieVente: 60, prixUnit: 1500 },
  { id: 6, produit: "Orangina 33", stockDepart: 48, entree: 24, sortieVente: 30, prixUnit: 1800 },
  { id: 7, produit: "Vin 50", stockDepart: 36, entree: 12, sortieVente: 20, prixUnit: 2500 },
  { id: 8, produit: "Ivoire Black", stockDepart: 60, entree: 0, sortieVente: 25, prixUnit: 3000 },
  { id: 9, produit: "Pack d'eau", stockDepart: 50, entree: 20, sortieVente: 35, prixUnit: 2500 },
];

const emptyLigne = (): LigneVente => ({
  id: Date.now(), produit: "", stockDepart: 0, entree: 0, sortieVente: 0, prixUnit: 0,
});

const Ventes = () => {
  const { items: ficheData, add, update, remove } = useLocalStorage<LigneVente>("depot-ventes", defaultFiche);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form, setForm] = useState<LigneVente>(emptyLigne());
  const [deleteTarget, setDeleteTarget] = useState<{ index: number; name: string } | null>(null);

  const totalVentes = ficheData.reduce((acc, r) => acc + r.sortieVente * r.prixUnit, 0);
  const totalAchats = 1850000;
  const credits = 250000;
  const depenses = 85000;
  const epargne = 200000;

  const openAdd = () => { setForm(emptyLigne()); setEditIndex(null); setModalOpen(true); };
  const openEdit = (i: number) => { setForm({ ...ficheData[i] }); setEditIndex(i); setModalOpen(true); };

  const handleSave = () => {
    if (!form.produit.trim()) { toast.error("Le produit est requis"); return; }
    if (editIndex !== null) { update(editIndex, form); toast.success("Ligne modifiée"); }
    else { add(form); toast.success("Ligne ajoutée"); }
    setModalOpen(false);
  };

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
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="rounded-md border border-input bg-background pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
          <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            <Plus size={14} /> Ajouter
          </button>
        </div>
      </div>

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
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ficheData.map((r, i) => {
                const total = r.stockDepart + r.entree;
                const stockFinal = total - r.sortieVente;
                const totalVente = r.sortieVente * r.prixUnit;
                return (
                  <tr key={r.id}>
                    <td className="font-medium">{r.produit}</td>
                    <td className="text-right">{r.stockDepart}</td>
                    <td className="text-right">{r.entree || "—"}</td>
                    <td className="text-right font-medium">{total}</td>
                    <td className="text-right">{r.sortieVente}</td>
                    <td className="text-right">{r.prixUnit.toLocaleString("fr-FR")}</td>
                    <td className="text-right font-medium">{totalVente.toLocaleString("fr-FR")}</td>
                    <td className="text-right">{stockFinal}</td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(i)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"><Pencil size={13} /></button>
                        <button onClick={() => setDeleteTarget({ index: i, name: r.produit })} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-foreground/20">
                <td colSpan={6} className="font-medium text-right py-3 px-4">TOTAL VENTES</td>
                <td className="text-right font-bold py-3 px-4">{totalVentes.toLocaleString("fr-FR")} F</td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </motion.div>

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

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={editIndex !== null ? "Modifier la Ligne" : "Nouvelle Ligne de Vente"}>
        <FormField label="Produit"><FormInput value={form.produit} onChange={(v) => setForm({ ...form, produit: v })} placeholder="Ex: Bock 66" /></FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Stock Départ"><FormInput type="number" value={form.stockDepart} onChange={(v) => setForm({ ...form, stockDepart: +v })} /></FormField>
          <FormField label="Entrée"><FormInput type="number" value={form.entree} onChange={(v) => setForm({ ...form, entree: +v })} /></FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Sortie Vente"><FormInput type="number" value={form.sortieVente} onChange={(v) => setForm({ ...form, sortieVente: +v })} /></FormField>
          <FormField label="Prix Unitaire (FCFA)"><FormInput type="number" value={form.prixUnit} onChange={(v) => setForm({ ...form, prixUnit: +v })} /></FormField>
        </div>
        <FormActions onCancel={() => setModalOpen(false)} onSubmit={handleSave} />
      </FormModal>

      <DeleteConfirm open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => { if (deleteTarget) { remove(deleteTarget.index); toast.success("Ligne supprimée"); } }} itemName={deleteTarget?.name || ""} />
    </div>
  );
};

export default Ventes;

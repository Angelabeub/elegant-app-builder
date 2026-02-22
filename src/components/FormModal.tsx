import { ReactNode } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FormModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const FormModal = ({ open, onClose, title, children }: FormModalProps) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-foreground/30"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="fixed inset-x-4 top-[10%] z-50 mx-auto max-w-lg rounded-md border border-border bg-card p-6 shadow-xl max-h-[80vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold font-heading text-foreground">{title}</h2>
            <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground">
              <X size={18} />
            </button>
          </div>
          {children}
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default FormModal;

export const FormField = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="mb-4">
    <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
      {label}
    </label>
    {children}
  </div>
);

export const FormInput = ({
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
  />
);

export const FormSelect = ({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
  >
    {options.map((o) => (
      <option key={o} value={o}>
        {o}
      </option>
    ))}
  </select>
);

export const FormActions = ({
  onCancel,
  onSubmit,
  submitLabel = "Enregistrer",
}: {
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel?: string;
}) => (
  <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border">
    <button
      onClick={onCancel}
      className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors"
    >
      Annuler
    </button>
    <button
      onClick={onSubmit}
      className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
    >
      {submitLabel}
    </button>
  </div>
);

export const DeleteConfirm = ({
  open,
  onClose,
  onConfirm,
  itemName,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-foreground/30"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-x-4 top-[30%] z-50 mx-auto max-w-sm rounded-md border border-border bg-card p-6 shadow-xl"
        >
          <h3 className="text-sm font-bold text-foreground mb-2">Confirmer la suppression</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Voulez-vous vraiment supprimer <strong>{itemName}</strong> ?
          </p>
          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="rounded-md border border-border px-3 py-2 text-sm hover:bg-accent transition-colors">
              Annuler
            </button>
            <button
              onClick={() => { onConfirm(); onClose(); }}
              className="rounded-md bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors"
            >
              Supprimer
            </button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

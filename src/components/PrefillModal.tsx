interface PrefillModalProps {
    isOpen: boolean;
    fieldName: string | null;
    dataSources: { label: string; value: string }[];
    onClose: () => void
    onSelect: (source: string) => void
}

export default function PrefillModal({ isOpen, fieldName, dataSources, onClose, onSelect }: PrefillModalProps) {
    if(!isOpen || !fieldName) return null;

    return (
        <div>
            <h4> Select P=prefill source for field "{fieldName}"</h4>
            <ul>
                {dataSources.map(ds => (
                    <li key={ds.value}>
                        <button
                        onClick={() => {
                            onSelect(ds.value);
                            onClose();
                        }}>
                            {ds.label}
                        </button>
                    </li>
                ))}
            </ul>
            <button onClick={onClose} style={{ marginTop: 10 }}>Cancel</button>
        </div>
    );
}

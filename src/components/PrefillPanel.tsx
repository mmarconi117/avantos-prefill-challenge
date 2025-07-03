interface PrefillMapping{
    [fieldName: string]: string | null;
}


interface PrefillPanelProps {
    formName: string;
    formId: string;
    prefillMapping: PrefillMapping;
    onFieldClick: (fieldName: string) => void;
    onClear: (fieldName: string) => void;
}

export default function PrefillPanel({ formName, formId, prefillMapping, onFieldClick, onClear }: PrefillPanelProps) {
    return (
        <div>
            <h3>Prefill Configuration for {formName} ({formId})</h3>
            <ul>
                {Object.entries(prefillMapping).map(([field, source]) => (
                    <li key={field}>
                        <span onClick={() => onFieldClick(field)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                            {field}:
                        </span>{' '}
                        {source || 'No prefill'}
                        {source && (
                            <button onClick={() => onClear(field)} style={{ marginLeft: 10 }}>
                                X
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
};

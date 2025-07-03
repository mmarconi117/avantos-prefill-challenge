import type { Form } from '../api';

interface FormListProps {
    forms: Form[],
    selectedFormId: string | null;
    onSelect: (formId: string) => void;
}

export default function FormList({ forms, selectedFormId, onSelect }: FormListProps) {
    return (
        <div>
            <h2>Forms</h2>
            <ul>
                {forms.map(form => (
                    <li key={form.id}>
                        <button
                        onClick={() => onSelect(form.id)}
                        style={{ fontWeight: form.id === selectedFormId ? 'bold' : 'normal'}}
                        >
                            {form.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

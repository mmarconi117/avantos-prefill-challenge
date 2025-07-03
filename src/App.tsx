import React, { useEffect, useState } from 'react';
import { fetchForms } from './api';
import type { Form } from './api';
import { getDirectDependencies, getTransitiveDependencies } from './dag';
import FormList from './components/FormList';
import PrefillModal from './components/PrefillModal';
import PrefillPanel from './components/PrefillPanel';

type PrefillMapping = Record<string, string | null>;

function App() {
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [prefillMapping, setPrefillMapping] = useState<PrefillMapping>({});
  const [modalField, setModalField] = useState<string | null>(null);

  useEffect(() => {
    fetchForms()
      .then(data => {
        const normalizedForms = data.forms.map(( form: Form) => {
          const fields = Array.isArray(form.fields) && form.fields.length > 0
            ? form.fields
            : [
              { id: 'dummy1', name: 'First Name', type: 'string' },
              { id: 'dummy2', name: 'Email', type: 'string' },
              { id: 'dummy3', name: 'Phone', type: 'string' },
            ];
            return {
              ...form,
              fields,
              dependsOn: Array.isArray(form.dependsOn) ? form.dependsOn : [],
            };
        });
        setForms(normalizedForms)
      })
      .catch(console.error)
  }, []);

  const selectedForm = forms.find(f => f.id === selectedFormId)

  useEffect(() => {
    if (!selectedForm || !Array.isArray(selectedForm.fields)) {
      setPrefillMapping({});
      return;
    }
    const initialMapping: PrefillMapping = {};
    selectedForm.fields.forEach(f => {
      initialMapping[f.name] = null;
    });
    setPrefillMapping(initialMapping);
  }, [selectedForm]);

  const dataSource = React.useMemo(() => {
    if (!selectedForm) return[];

    const directDeps = getDirectDependencies(forms, selectedForm.id);
    const transitiveDeps = getTransitiveDependencies(forms, selectedForm.id);

    const globalData = [
      { label: "Dummy: First Name", value: 'dummy.firstName' },
      { label: "Dummy: Email", value: 'dummy.email' },
      { label: "Dummy: Phone", value: 'dummy.phone' },
     ];
     const fromForms = [...directDeps, ...transitiveDeps]
  .flatMap(form => {
    return Array.isArray(form.fields)
      ? form.fields.map(field => ({
          label: `${form.name} (${form.id}): ${field.name}`,
          value: `${form.id}.${field.name}`,
        }))
      : [];
  });

      return [...globalData, ...fromForms];
  }, [forms, selectedForm])


  function handleClearField(fieldName: string) {
    setPrefillMapping( prev => ({ ...prev, [fieldName]: null}))
  }

  function handleFieldClick(fieldName: string) {
    setModalField(fieldName);
  }

  function handleSelectSource(source: string) {
    if (!modalField) return;
    setPrefillMapping(prev => ({ ...prev, [modalField]: source }));
    setModalField(null)
  }

  return (
    <div style={{ display: 'flex', gap: 20, padding: 20 }}>
      <FormList forms={forms} selectedFormId={selectedFormId} onSelect={setSelectedFormId} />
      {selectedForm && (
        <PrefillPanel
          formName={selectedForm.name}
          formId={selectedForm.id}
          prefillMapping={prefillMapping}
          onClear={handleClearField}
          onFieldClick={handleFieldClick}
        />
      )}

        <PrefillModal
  isOpen={!!modalField}
  fieldName={modalField}
  dataSources={dataSource} // ✅ Correct name
  onClose={() => setModalField(null)}
  onSelect={handleSelectSource}
/>


    </div>
  )

}

export default App;

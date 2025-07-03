const API_BASE_URL = 'http://localhost:3000';


export interface FormField {
    id: string;
    name: string;
    type: string;
}

export interface Form {
    id: string;
    name: string;
    fields: FormField[];
    dependsOn: string[];
}

export const fetchForms = async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/mock/actions/blueprints/test/graph`);
    if(!response.ok) throw new Error('Failed to fetch forms');
    const data = await response.json();
    return data;
}

import type { Form } from './api'

export function getDirectDependencies(forms: Form[], formId: string): Form[] {
    const form = forms.find(f  => f.id === formId);
    if (!form || !Array.isArray(form.dependsOn)) return [];
    return forms.filter(f => form.dependsOn.includes(f.id));
}



export function getTransitiveDependencies(forms: Form[], formId: string): Form[] {
    const visited = new Set<string>();
    function dfs(id: string) {
        const form = forms.find(f => f.id === id);
        if (!form || !Array.isArray(form.dependsOn)) return;
        form.dependsOn.forEach(depId => {
            if (!visited.has(depId)) {
                visited.add(depId);
                dfs(depId);
            }
        })
    }
    dfs(formId);
    return forms.filter(f => visited.has(f.id));
}

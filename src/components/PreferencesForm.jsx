import React, { useState } from 'react';
import { updatePreferences } from '../api/users';
import LoadingSpinner from './LoadingSpinner';


export default function PreferencesForm({ user, tokens, setView, setUser, setMessage }) {
const [form, setForm] = useState({
frequency: user.preferences?.frequency || 'daily',
categories: (user.preferences?.categories || []).join(', '),
is_active: user.preferences?.is_active ?? true,
});
const [loading, setLoading] = useState(false);


const change = (e) => {
const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
setForm(prev => ({ ...prev, [e.target.name]: val }));
};


const submit = async (e) => {
e.preventDefault();
setLoading(true);
setMessage(null);


const payload = {
frequency: form.frequency,
is_active: form.is_active,
categories: form.categories.split(',').map(s => s.trim()).filter(Boolean),
};


try {
const res = await updatePreferences(tokens, payload);
if (res.ok) {
const updated = await res.json();
setUser(prev => ({ ...prev, preferences: updated }));
setMessage({ type: 'success', content: 'Preferences updated' });
setView('dashboard');
} else {
const err = await res.json().catch(() => ({ detail: 'Update failed' }));
setMessage({ type: 'error', content: err.detail || JSON.stringify(err) });
}
} catch (err) {
setMessage({ type: 'error', content: `Network error: ${err.message}` });
} finally {
setLoading(false);
}
};


return (
<div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
<h2 className="text-3xl font-bold mb-4">Digest Preferences</h2>
<form onSubmit={submit} className="space-y-4">
<label className="block text-sm">Frequency</label>
<select name="frequency" value={form.frequency} onChange={change} className="w-full px-4 py-2 border rounded-lg">
<option value="daily">Daily</option>
<option value="weekly">Weekly</option>
<option value="monthly">Monthly</option>
<option value="none">None</option>
</select>


<label className="block text-sm">Categories (comma separated)</label>
<input name="categories" value={form.categories} onChange={change} className="w-full px-4 py-2 border rounded-lg" />


<div className="flex items-center">
<input id="is_active" name="is_active" type="checkbox" checked={form.is_active} onChange={change} />
<label htmlFor="is_active" className="ml-2">Receive Email Digest</label>
</div>


<div className="flex space-x-4">
<button type="button" onClick={() => setView('dashboard')} className="w-full py-3 border rounded-lg">Cancel</button>
<button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-lg">{loading ? <LoadingSpinner /> : 'Save Changes'}</button>
</div>
</form>
</div>
);
}
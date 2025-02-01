// src/pages/Settings.js
import React, { useState } from 'react';
import { Container } from '../components/Layout';

function Settings() {
  const [preferences, setPreferences] = useState('');
  
  const handleSave = () => {
    // Handle save logic here
  };

  return (
    <Container>
      <h1>Settings</h1>
      <form onSubmit={handleSave}>
        <label>
          Summary Preferences:
          <textarea
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
          />
        </label>
        <button type="submit">Save</button>
      </form>
    </Container>
  );
}

export default Settings;

import React, { useState } from 'react';
import { signUpWithEmailAndPassword, createUser } from '../../api/firebaseAuth';
import './SignupFamily.css';

function SignupFamily() {
  const [familyId, setFamilyId] = useState('');
  const [parents, setParents] = useState([{ email: '', password: '', name: '' }]);
  const [children, setChildren] = useState([{ email: '', password: '', name: '' }]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleAdd = (type) => {
    const update = type === 'parent' ? [...parents, { email: '', password: '', name: '' }] : [...children, { email: '', password: '', name: '' }];
    type === 'parent' ? setParents(update) : setChildren(update);
  };

  const handleChange = (type, index, field, value) => {
    const update = type === 'parent' ? [...parents] : [...children];
    update[index][field] = value;
    type === 'parent' ? setParents(update) : setChildren(update);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const allUsers = [
        ...parents.map(u => ({ ...u, role: 'parent' })),
        ...children.map(u => ({ ...u, role: 'child' })),
      ];

      for (let user of allUsers) {
        const authData = await signUpWithEmailAndPassword(user.email, user.password);
        await createUser({
          idToken: authData.idToken,
          role: user.role,
          familyName: familyId,
          name: user.name
        });

      }

      setMessage('Family signed up successfully!');
    } catch (err) {
      
      const firebaseError = err?.response?.data?.error?.message;
      console.error('Signup error:', firebaseError);
      setError(firebaseError || 'Signup failed. Please try again.');
      
    }
  };

  return (
    <div className="signup-family-container">
      <h2 className="signup-family-title">Sign Up a Family</h2>

      {message && <div className="signup-family-alert signup-family-alert-success">{message}</div>}
      {error && <div className="signup-family-alert signup-family-alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="signup-family-form">
        <div className="signup-family-group">
          <label htmlFor="familyId" className="signup-family-label">
            Family ID (can be anything like "smith123")
          </label>
          <input
            id="familyId"
            type="text"
            className="signup-family-input"
            value={familyId}
            onChange={(e) => setFamilyId(e.target.value)}
            required
          />
        </div>

        <h5 className="signup-family-section-title">Parents</h5>
        {parents.map((parent, idx) => (
          <div key={`parent-${idx}`} className="signup-family-user-row">
            <div className="signup-family-user-field">
              <input
                type="text"
                placeholder="Parent Name"
                className="signup-family-input"
                value={parent.name}
                onChange={(e) => handleChange('parent', idx, 'name', e.target.value)}
                required
              />
            </div>
            <div className="signup-family-user-field">
              <input
                type="email"
                placeholder="Parent Email"
                className="signup-family-input"
                value={parent.email}
                onChange={(e) => handleChange('parent', idx, 'email', e.target.value)}
                required
              />
            </div>
            <div className="signup-family-user-field">
              <input
                type="password"
                placeholder="Password"
                className="signup-family-input"
                value={parent.password}
                onChange={(e) => handleChange('parent', idx, 'password', e.target.value)}
                required
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleAdd('parent')}
          className="signup-family-button signup-family-button-secondary"
        >
          + Add Parent
        </button>

        <h5 className="signup-family-section-title">Children</h5>
        {children.map((child, idx) => (
          <div key={`child-${idx}`} className="signup-family-user-row">
            <div className="signup-family-user-field">
              <input
                type="text"
                placeholder="Child Name"
                className="signup-family-input"
                value={child.name}
                onChange={(e) => handleChange('child', idx, 'name', e.target.value)}
                required
              />
            </div>
            <div className="signup-family-user-field">
              <input
                type="email"
                placeholder="Child Email"
                className="signup-family-input"
                value={child.email}
                onChange={(e) => handleChange('child', idx, 'email', e.target.value)}
                required
              />
            </div>
            <div className="signup-family-user-field">
              <input
                type="password"
                placeholder="Password"
                className="signup-family-input"
                value={child.password}
                onChange={(e) => handleChange('child', idx, 'password', e.target.value)}
                required
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleAdd('child')}
          className="signup-family-button signup-family-button-secondary"
        >
          + Add Child
        </button>

        <button type="submit" className="signup-family-button signup-family-button-primary signup-family-submit">
          Sign Up Family
        </button>
      </form>
    </div>
  );
}

export default SignupFamily;
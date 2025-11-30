import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuthHook';
import { useNavigate, Link } from 'react-router-dom';
import { validate, VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_SPECIAL_CHAR, VALIDATOR_NO_SPECIAL_CHAR, VALIDATOR_NUMBER } from '../utils/validators';
import InputCriteria from '../components/InputCriteria';
import FormControl from '../components/FormControl';

export default function RegisterPage() {

  const { register, user, loading, error } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState(null);

  // Initialize validatorError with all keys set to an empty string
  const [validatorError, setvalidatorError] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Password Criteria
  const [passwordCriteria, setPasswordCriteria] = useState({
    minLength: false,
    specialChar: false
  });

  const mapPasswordCriteria = [
    { id: 1, name: 'Minimum 8 characters', checked: passwordCriteria.minLength },
    { id: 2, name: 'Special character', checked: passwordCriteria.specialChar },
  ];

  // Email Validation
  const isValidEmail = validate(email, [
    VALIDATOR_EMAIL()
  ]);

  const mapEmailError = [
    { id: 1, name: 'Invalid email address', checked: isValidEmail },
  ];

  // Name Validation Criteria
  const [nameCriteria, setNameCriteria] = useState({
    noSpecialChar: false,
    notEmpty: false,
    noNumber: false
  });

  const mapNameError = [
    { id: 1, name: 'Name should not contain special characters.', checked: nameCriteria.noSpecialChar },
    { id: 2, name: 'Name should not be empty.', checked: nameCriteria.notEmpty },
    { id: 3, name: 'Name should not contain numbers', checked: nameCriteria.noNumber }
  ];

  // Redirect 
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Name Validation Effect
  useEffect(() => {
    setNameCriteria({
      noSpecialChar: validate(name, [VALIDATOR_NO_SPECIAL_CHAR()]),
      notEmpty: name.trim().length > 0,
      noNumber: validate(name, [VALIDATOR_NUMBER()])
    });
  }, [name]);

  // Password Validation Effect
  useEffect(() => {
    setPasswordCriteria({
      minLength: validate(password, [VALIDATOR_MINLENGTH(8)]),
      specialChar: validate(password, [VALIDATOR_SPECIAL_CHAR()])
    });
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    // Check if there are any active validation errors before submitting
    // We can check the criteria states directly
    if (!isValidEmail) {
      setLocalError("Invalid email address.");
      return;
    }

    if (!nameCriteria.noSpecialChar || !nameCriteria.notEmpty || !nameCriteria.noNumber) {
      setLocalError("Name requirements not met.");
      return;
    }

    // Client-side validation: Check if passwords match
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    // Password criteria check
    if (!passwordCriteria.minLength || !passwordCriteria.specialChar) {
      setLocalError("Password does not meet requirements.");
      return;
    }

    // validation field check
    if (!name || !email || !password) {
      setLocalError("Please fill in all fields.");
      return;
    }

    // register from AuthContext
    await register(name, email, password);
  };

  return (
    <div className="flex justify-center items-center pt-20">
      <div className="card w-96 bg-base-100 shadow-xl border border-gray-200">
        <div className="card-body">
          <h2 className="card-title text-3xl mb-1">Create Your Account</h2>
          <p className="text-gray-500 mb-6">Start your secure digital banking experience.</p>

          <form onSubmit={handleSubmit} className="space-y-4">

            <FormControl
              label="Name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* Name Error */}
            {name.length > 0 && (
              <InputCriteria mapCriteria={mapNameError} />
            )}

            <FormControl
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Use validatorError.email to display the specific error */}
            {email.length > 0 && (
              <InputCriteria mapCriteria={mapEmailError} />
            )}


            <FormControl
              label="Password"
              type="password"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {password.length > 0 && (
              <InputCriteria mapCriteria={mapPasswordCriteria} />
            )}


            <FormControl
              label="Confirm Password"
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {/* Confirm Password Error */}
            {confirmPassword.length > 0 && password !== confirmPassword && (
              <div className="alert alert-warning text-sm">Passwords do not match.</div>
            )}

            {(localError || error) && (
              <div className="alert alert-error text-sm mt-3">
                {localError || error}
              </div>
            )}

            <div className="card-actions justify-end pt-2">
              <button
                type="submit"
                className={`btn btn-primary w-full ${loading ? 'btn-disabled' : ''}`}
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>

          <div className="text-center text-sm pt-4">
            Already have an account?{' '}
            <Link to="/login" className="link link-primary font-semibold">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
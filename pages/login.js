import { useState } from 'react';
import { firebase, auth } from '@/middlewares/firebase';

function PhoneNumberAuth() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const onSubmitPhoneNumber = async (e) => {
    e.preventDefault();

    const appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      size: 'invisible'
    });

    try {
      const result = await auth.signInWithPhoneNumber(phoneNumber, appVerifier);
      setConfirmationResult(result);
    } catch (error) {
      setError(error.message);
    }
  };

  const onSubmitVerificationCode = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await confirmationResult.confirm(verificationCode);
      setUser(userCredential.user);
    } catch (error) {
      setError(error.message);
    }
  };

  if (user) {
    return <div>User signed in: {user.phoneNumber}</div>;
  }

  if (confirmationResult) {
    return (
      <div>
        <form onSubmit={onSubmitVerificationCode}>
          <input
            type="text"
            placeholder="Verification code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
        {error && <div>Error: {error}</div>}
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={onSubmitPhoneNumber}>
        <input
          type="text"
          placeholder="Phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <button type="submit">Send verification code</button>
      </form>
      <div id="recaptcha-container"></div>
      {error && <div>Error: {error}</div>}
    </div>
  );
}

export default PhoneNumberAuth;

import { useState } from 'react';
import Link from 'next/link';
import { Store } from 'react-notifications-component';
import styles from '@/styles/Contact.module.css';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const Contact = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('Feature Request');
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState();
  const [isFormVisible, setIsFormVisible] = useState(true);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!executeRecaptcha) {
      return;
    }

    try {
      const token = await executeRecaptcha();

      if (!token) {
        Store.addNotification({
          title: 'Error sending message',
          message: `An error occurred while sending your message. Please try again later.`,
          type: 'danger',
          insert: 'top',
          isMobile: true,
          breakpoint: 768,
          container: 'top-center',
          animationIn: ['animate__animated', 'animate__slideInDown'],
          animationOut: ['animate__animated', 'animate__slideUp'],
          dismiss: {
            duration: 3000
          }
        });
        return;
      }

      const response = await fetch('/api/send_email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          reason,
          url,
          message,
          token
        })
      });

      const data = await response.json();

      if (data.success) {
        console.log('Email sent successfully');

        setSuccessMessage('Your message has been sent!');
        setName('');
        setEmail('');
        setReason('Feature Request');
        setUrl('');
        setMessage('');
        setIsFormVisible(false);
      } else {
        Store.addNotification({
          title: 'Error sending message',
          message: `An error occurred while sending your message. Please try again later.`,
          type: 'danger',
          insert: 'top',
          isMobile: true,
          breakpoint: 768,
          container: 'top-center',
          animationIn: ['animate__animated', 'animate__slideInDown'],
          animationOut: ['animate__animated', 'animate__slideUp'],
          dismiss: {
            duration: 3000
          }
        });
      }
    } catch (error) {
      console.error(error);
      Store.addNotification({
        title: 'Error sending message',
        message: `An error occurred while sending your message. Please try again later.`,
        type: 'danger',
        insert: 'top',
        isMobile: true,
        breakpoint: 768,
        container: 'top-center',
        animationIn: ['animate__animated', 'animate__slideInDown'],
        animationOut: ['animate__animated', 'animate__slideUp'],
        dismiss: {
          duration: 3000
        }
      });
    }
  };

  return (
    <div style={{ textAlign: 'left', margin: '30px' }}>
      <h1>Contact</h1>
      <div className={styles.contact}>
        {isFormVisible ? (
          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.label}>
              Name:
              <input className={styles.input} type="text" value={name} onChange={handleNameChange} required />
            </label>
            <br />
            <label className={styles.label}>
              Email Address:
              <input className={styles.input} type="email" value={email} onChange={handleEmailChange} required />
            </label>
            <br />
            <label className={styles.label}>
              Reason:
              <select className={styles.select} value={reason} onChange={handleReasonChange}>
                <option value="Feature Request">Feature Request</option>
                <option value="Edit or Remove List">Edit or Remove List</option>
                <option value="Report a Bug">Report a Bug</option>
                <option value="Other">Other</option>
              </select>
            </label>
            {reason === 'Edit or Remove List' && (
              <div className={styles.subfield}>
                <label className={styles.label}>
                  URL:
                  <input className={styles.input} type="url" value={url} onChange={handleUrlChange} required />
                </label>
                <br />
              </div>
            )}
            <label className={styles.label}>
              Message:
              <textarea className={styles.textarea} value={message} onChange={handleMessageChange} />
            </label>
            <p id="recaptcha">
              This site is protected by reCAPTCHA and the Google
              <Link href="https://policies.google.com/privacy" target="_blank">
                {' '}
                Privacy Policy{' '}
              </Link>
              and
              <Link href="https://policies.google.com/terms" target="_blank">
                {' '}
                Terms of Service
              </Link>{' '}
              apply.
            </p>
            <button className={styles.button} type="submit">
              Submit
            </button>
          </form>
        ) : (
          <div style={{ height: '100%' }}>
            <p>{successMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;

import { useState } from 'react';
import Head from 'next/head';
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
  const [isSending, setIsSending] = useState(false);

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
    setIsSending(true);

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
        setIsSending(false);
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
        setSuccessMessage('Your message has been sent!');
        setName('');
        setEmail('');
        setReason('Feature Request');
        setUrl('');
        setMessage('');
        setIsFormVisible(false);
        setIsSending(false);
      } else {
        setIsSending(false);
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
      setIsSending(false);
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
    <>
      <Head>
        <title>Contact Us | Truth Tally</title>
        <meta property="og:title" content="Contact Us" />
        <meta name="twitter:title" content="Contact Us" />
        <meta name="description" content="Truth Tally Ranker" />
        <meta property="og:image" key="og:image" content="/images/og-image.png" />
        <meta charSet="utf-8" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png" />
        <link rel="icon" href="/images/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <div style={{ textAlign: 'left', margin: '30px' }}>
        <h1>Contact</h1>
        <div className={styles.contact}>
          {!isSending ? (
            isFormVisible ? (
              <form className={styles.form} onSubmit={handleSubmit}>
                <label className={styles.label}>
                  Name:
                  <input
                    className={styles.input}
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    pattern="[A-Za-z ]+"
                    required
                    maxLength="50"
                  />
                </label>
                <br />
                <label className={styles.label}>
                  Email Address:
                  <input
                    className={styles.input}
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                    maxLength="255"
                  />
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
                      <input
                        className={styles.input}
                        type="url"
                        value={url}
                        onChange={handleUrlChange}
                        required
                        pattern="https?://.+"
                        maxLength="50"
                      />
                    </label>
                    <br />
                  </div>
                )}
                <label className={styles.label}>
                  Message:
                  <textarea
                    className={styles.textarea}
                    value={message}
                    onChange={handleMessageChange}
                    maxLength="1000"
                    required
                  />
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
              <div style={{ height: '100%', textAlign: 'center' }}>
                <p>{successMessage}</p>
                <p>
                  <Link href="/">Return home</Link>
                </p>
              </div>
            )
          ) : (
            <div className={styles['loading']}></div>
          )}
        </div>
      </div>
    </>
  );
};

export default Contact;

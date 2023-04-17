import { useState } from 'react';
import styles from '@/styles/Contact.module.css';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('Feature Request');
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(name, email, reason, message);
  };

  return (
    <>
      <h1>Contact</h1>
      <div className={styles.contact}>
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
          <br />
          <button className={styles.button} type="submit">
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default Contact;

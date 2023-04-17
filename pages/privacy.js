import Link from 'next/link';

const Privacy = () => {
  return (
    <>
      <div style={{ textAlign: 'left', margin: '30px' }}>
        <h1>Privacy Policy</h1>
        <p>
          At Truth Tally, we take your privacy seriously. We understand the importance of protecting your personal
          information and we are committed to keeping it safe and secure. This Privacy Policy explains how we collect,
          use, and protect your personal information when you use our website or mobile app.
        </p>
        <h3>Data Collection and Use</h3>
        <p>
          We do not collect any personal information from you when you use our site. However, when you share a list with
          your friends, that list is stored in our database. This list may include personal information that you have
          entered, such your name when sharing a list. While we do not monitor the content of the lists that are shared,
          we encourage users to refrain from entering any personal information that they do not want to be shared with
          others.
        </p>

        <p>
          Please note that while unlisted lists will not be displayed on the Ranked and Unranked list pages, they are
          still accessible by anyone who has the URL. Additionally, if a user shares an unlisted list with someone and
          that person ranks the list, and shares or makes it listed, the original unranked list will become accessible
          through that shared ranked list. Please be mindful of this when sharing lists.
        </p>
        <h3>Data Protection</h3>
        <p>
          We take reasonable measures to protect your personal information from unauthorized access or disclosure. Your
          shared lists are stored in a secure database that is only accessible by our authorized personnel. We also
          regularly review our security procedures to ensure that your information remains safe.
        </p>
        <h3>Data Removal</h3>
        <p>
          If you have shared a list that contains personal information that you would like to remove, please{' '}
          <Link href="/contact">contact us</Link>. We will promptly remove the list from our database and take any other
          necessary steps to ensure that the information is no longer accessible.
        </p>
        <h3>Changes to the Privacy Policy</h3>
        <p>
          We reserve the right to update or modify this Privacy Policy at any time. Any changes will be reflected on
          this page, and your continued use of our site after such changes have been made will constitute your
          acceptance of the revised policy.
        </p>
        <h3>Contact Us</h3>
        <p>
          If you have any questions or concerns about our Privacy Policy, please <Link href="/contact">contact us</Link>
          .
        </p>
      </div>
    </>
  );
};

export default Privacy;

import Link from 'next/link';
import Image from 'next/image';

const NotFoundPage = () => {
  // document.title = "Error 404 - Not Found";
  return (
    <>
      <div className="error404-div">
        <h1>Error 404</h1>
        <Image src="/images/logo192.png" alt="Truth Tally logo" width={100} height={100} />
        <h2>Not Found</h2>
        <Link href="/list">CREATE A NEW LIST</Link>
      </div>
    </>
  );
};

export default NotFoundPage;

import Link from 'next/link';

const About = () => {
  return (
    <>
      <div style={{ textAlign: 'left', margin: '10px 30px 10px 30px' }}>
        <h1>About Truth Tally</h1>
        <p>
          Truth Tally is the ultimate list ranking app that allows you to create custom lists of your favorite things
          and rank them in order of preference. Whether it&rsquo;s music, movies, books, art, or science, Truth Tally
          makes it easy to discover your own truth and share it with your friends.
        </p>
        <p>
          The app began as a create-react-app and has evolved into a Next.js app, thanks to my journey into learning
          React. As a fledgling developer, I wanted to create an app that helped take my interest in building modern,
          responsive web applications to the next level. Truth Tally is the result of that effort, and I am proud to say
          that it has come further than I had expected when I started.
        </p>
        <p>
          I believe in the power of open source software. That&rsquo;s why my app is available on{' '}
          <Link href="https://github.com/villanovachile/truthtally" target="_blank">
            GitHub
          </Link>
          , where users can report bugs, request features, or even contribute to the codebase themselves. I believe that
          collaboration is the key to creating great software, and am excited to see where the community takes Truth
          Tally in the future.
        </p>
        <p>Thank you for using Truth Tally, and happy list-making!</p>
      </div>
    </>
  );
};

export default About;

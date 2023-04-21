import Lists from '@/components/Lists/Lists';
import { useRouter } from 'next/router';
import Head from 'next/head';

const ListsIndex = (lists) => {
  const router = useRouter();
  if (lists.error === 'invalid_type') {
    if (typeof window !== 'undefined') {
      router.push('/lists/');
    }
    return null;
  }
  const listType = lists.type.replace(/\b\w+/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });

  const titlePrefix = lists.searchQuery ? `Searching "${lists.searchQuery}" in ${listType} Lists` : `${listType} Lists`;
  const title = `${titlePrefix} | Truth Tally`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={titlePrefix} />
        <meta name="twitter:title" content={titlePrefix} />
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
      <Lists
        lists={lists.lists}
        totalCount={lists.totalCount}
        type={lists.type}
        totalPages={lists.totalPages}
        currentPage={lists.currentPage}
      />
    </>
  );
};

export async function getServerSideProps(context) {
  const pageNumber = !context.query.page || context.query.page < 1 ? 1 : context.query.page;
  const { type } = context.params;
  const { title, tags, items, all, sort } = context.query;

  if (type !== 'ranked' && type !== 'unranked') {
    return {
      props: {
        error: 'invalid_type'
      }
    };
  }

  try {
    let apiUrl = `${process.env.API_URL}/api/get_lists?type=${type}`;
    if (title) {
      apiUrl += `&title=${title}`;
    }
    if (tags) {
      apiUrl += `&tags=${tags}`;
    }
    if (items) {
      apiUrl += `&items=${items}`;
    }
    if (all) {
      apiUrl += `&all=${all}`;
    }
    if (pageNumber) {
      apiUrl += `&page=${pageNumber}`;
    }
    if (sort) {
      apiUrl += `&sort=${sort}`;
    }

    const response = await fetch(apiUrl);
    const lists = await response.json();

    return {
      props: lists
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        error: 'Failed to fetch data'
      }
    };
  }
}

export default ListsIndex;

import Lists from '@/components/Lists/Lists';
import { useRouter } from 'next/router';

const ListsIndex = (lists) => {
  const router = useRouter();
  if (lists.error === 'invalid_type') {
    if (typeof window !== 'undefined') {
      router.push('/lists/');
    }
    return null;
  }

  return (
    <Lists
      lists={lists.lists}
      totalCount={lists.totalCount}
      type={lists.type}
      totalPages={lists.totalPages}
      currentPage={lists.currentPage}
    />
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

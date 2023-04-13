import Lists from '@/components/Lists/Lists';

const ListsIndex = (lists) => {
  // console.log(lists.totalCount);
  // console.log(lists.lists);
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
  const { type } = context.params;
  const { page } = context.query;

  try {
    const response = await fetch(`${process.env.API_URL}/api/get_lists?type=${type}&page=${page}`);
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

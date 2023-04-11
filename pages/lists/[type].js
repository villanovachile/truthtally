import Lists from '@/components/Lists/Lists';

const ListsIndex = (lists) => {
  console.log(lists.totalCount);
  return <Lists />;
};

export async function getServerSideProps(context) {
  const { type } = context.params;

  try {
    const response = await fetch(`${process.env.API_URL}/api/get_lists?type=${type}&page=1`);
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

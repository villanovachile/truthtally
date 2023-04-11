import Lists from '@/components/Lists/Lists';

const ListsIndex = (lists) => {
  console.log(lists.totalCount);
  return <Lists />;
};

export async function getServerSideProps(context) {
  try {
    const response = await fetch(`${process.env.API_URL}/api/get_lists`);
    const lists = await response.json();

    // if (listData === 'not_found') {
    //   return {
    //     notFound: true
    //   };
    // }

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

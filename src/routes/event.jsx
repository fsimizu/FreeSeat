import { Layout } from "../layout/Layout.jsx";
import { MyEvent } from "../components/MyEvent/index.jsx";
import { useParams } from 'react-router-dom';

export function Event() {
  const { eventId } = useParams();

  return (
    <>
      <Layout>
        <MyEvent eventId={eventId}/>
      </Layout>
    </>
  );
}
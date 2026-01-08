import { Layout } from "../layout/Layout.jsx";
import { AuthLogin } from "../components/AuthLogin/index.jsx";


export function Login() {

  return (
    <>
      <Layout>
        <AuthLogin/>
      </Layout>
    </>
  );
}
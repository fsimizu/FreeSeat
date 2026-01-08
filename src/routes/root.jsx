import { Layout } from "../layout/Layout.jsx";
import { Hero } from "../components/Hero";
import { Page } from "../components/Page";


export function Root() {

  return (
    <>
      <Layout>

        <Hero />

        {/* <Page onGetStarted={() => (window.location.href = "/signup")} /> */}
      
      </Layout>
    </>
  );
}
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Head from "next/head";
import SideBar from "~/components/SideBar";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>My Blog</title>
        <meta
          name="description"
          content="This is a blog done by Omar Chaaban"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container">
        <aside className="sidebar">
          <SideBar />
        </aside>
        <main className="main">
          <Component {...pageProps} />
        </main>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

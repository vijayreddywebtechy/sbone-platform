import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { Welcome } from "@/components/Welcome/Welcome";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <Welcome />
      </main>
      <Footer />
    </div>
  );
}

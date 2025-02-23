// import Image from "next/image";
// import styles from "./page.module.css";
import NavBar from "@/components/navbar";
import { ThemeToggle } from "@/components/theme-context";

export default async function Home() {

  return (
    <>
      <NavBar />
      <ThemeToggle />
    </>
  );
}

import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <div className="bg-[#0F0F0F] min-w-full min-h-screen max-h-full">
        <Sidebar />
      </div>
    </>
  );
}
